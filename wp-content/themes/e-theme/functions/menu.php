<?php
/**
 * Menu locations + REST exposure.
 *
 * NextJS reads `/wp-json/aiconiq/v1/menu/primary?lang=de` to render the
 * sticky header. Menu items in WP admin can be Pages, Custom Links
 * (paste `#anchor-id` for in-page jumps), Articles, or any other CPT —
 * Polylang Pro handles per-language menus automatically.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('after_setup_theme', function () {
    register_nav_menus([
        'primary' => 'Primary (sticky header)',
        'footer' => 'Footer',
    ]);
});

function aiconiq_menu_items(string $location): array
{
    $locations = get_nav_menu_locations();
    if (empty($locations[$location])) {
        return [];
    }

    $menu = wp_get_nav_menu_object($locations[$location]);
    if (!$menu) {
        return [];
    }

    $items = wp_get_nav_menu_items($menu->term_id);
    if (!$items) {
        return [];
    }

    // Defensive dedupe: Polylang's `pll_save_nav_menu_item` filter, repeated
    // seeder runs and orphaned term_relationships rows can all leave the same
    // post linked to the menu more than once, which would render every link
    // twice. Collapse by post ID first, then by (url|label) signature so any
    // duplicates with different IDs (post copies) also get removed.
    $seen_ids = [];
    $seen_sig = [];
    $unique = [];
    foreach ($items as $item) {
        $id = (int) $item->ID;
        if (isset($seen_ids[$id])) continue;
        $sig = ($item->url ?? '') . '|' . ($item->title ?? '') . '|' . ((int) $item->menu_item_parent);
        if (isset($seen_sig[$sig])) continue;
        $seen_ids[$id] = true;
        $seen_sig[$sig] = true;
        $unique[] = $item;
    }
    $items = $unique;

    // Build parent → children index for one level of nesting.
    $by_parent = [];
    foreach ($items as $item) {
        $parent = (int) $item->menu_item_parent;
        $by_parent[$parent] = $by_parent[$parent] ?? [];
        $by_parent[$parent][] = $item;
    }

    $build = function (array $nodes) use (&$build, $by_parent) {
        $out = [];
        foreach ($nodes as $node) {
            $url = $node->url;

            // Rewrite WP page URLs to Next.js routes so clicks on the
            // headless front-end navigate inside the Next.js app instead of
            // hitting the WP host (which would render only the PHP fallback).
            //   slug 'home' -> /{lang}/
            //   any other slug -> /{lang}/page/{slug}/
            // Custom links and articles are left untouched.
            if ($node->object === 'page') {
                $page = get_post((int) $node->object_id);
                if ($page) {
                    $page_lang = function_exists('pll_get_post_language')
                        ? pll_get_post_language($page->ID, 'slug')
                        : 'en';
                    $page_lang = $page_lang ?: 'en';
                    $slug = $page->post_name;
                    $url = ($slug === 'home')
                        ? '/' . $page_lang . '/'
                        : '/' . $page_lang . '/page/' . $slug . '/';
                }
            }

            $is_anchor = strpos($url, '#') !== false && (strpos($url, 'http') !== 0 || strpos($url, $_SERVER['HTTP_HOST'] ?? '') !== false);

            $out[] = [
                'id' => (int) $node->ID,
                'label' => $node->title,
                'url' => $url,
                'target' => $node->target ?: '_self',
                'kind' => $is_anchor ? 'anchor' : 'link',
                'object' => $node->object,
                'object_id' => (int) $node->object_id,
                'children' => isset($by_parent[(int) $node->ID]) ? $build($by_parent[(int) $node->ID]) : [],
            ];
        }
        return $out;
    };

    return $build($by_parent[0] ?? []);
}

add_action('rest_api_init', function () {
    register_rest_route('aiconiq/v1', '/menu/(?P<location>[a-z0-9_-]+)', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function (WP_REST_Request $req) {
            // Polylang sets the language via the `lang` query var.
            return rest_ensure_response(aiconiq_menu_items($req['location']));
        },
    ]);
});
