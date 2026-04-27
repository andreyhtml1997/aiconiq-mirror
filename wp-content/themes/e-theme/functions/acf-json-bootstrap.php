<?php
/**
 * Bootstrap ACF Local JSON.
 *
 * Once any field group is in `acf-json/<key>.json`, ACF Pro auto-loads it
 * and treats it as an editable admin field group (it shows up in
 * Custom Fields → Field Groups, edits are auto-saved back to the JSON
 * file). Pure PHP-registered groups are read-only and hidden from admin —
 * which is why the editor "couldn't see" anything.
 *
 * On first boot, this file dumps the PHP-defined arrays from
 * `aiconiq_body_blocks_field_group_definition()` and
 * `aiconiq_footer_field_group_definition()` into JSON, then ACF takes
 * over.
 *
 * Subsequent code changes in those PHP definitions are NOT picked up
 * (JSON wins). For schema evolution, edit in admin (auto-syncs to JSON)
 * or delete the JSON file to re-bootstrap from PHP.
 */

if (!defined('ABSPATH')) exit;

/**
 * Pin ACF's Local JSON path to our theme folder so admin edits land
 * inside the repo, not somewhere else.
 */
add_filter('acf/settings/save_json', function () {
    return get_template_directory() . '/acf-json';
});

add_filter('acf/settings/load_json', function ($paths) {
    unset($paths[0]);
    $paths[] = get_template_directory() . '/acf-json';
    return $paths;
});

/**
 * Bootstrap on every admin/REST request — cheap if files exist, idempotent.
 *
 * Runs early (priority 5) so the JSON dump happens before ACF's own
 * auto-loader fires (priority 10 inside ACF Pro), giving ACF a JSON file
 * to load on the same request.
 */
add_action('acf/init', function () {
    if (!function_exists('acf_add_local_field_group')) return;

    $dir = get_template_directory() . '/acf-json';
    if (!is_dir($dir) && !wp_mkdir_p($dir)) return;

    $groups = [];
    if (function_exists('aiconiq_body_blocks_field_group_definition')) {
        $groups[] = aiconiq_body_blocks_field_group_definition();
    }
    if (function_exists('aiconiq_footer_field_group_definition')) {
        $groups[] = aiconiq_footer_field_group_definition();
    }

    foreach ($groups as $group) {
        $key = $group['key'] ?? '';
        if (!$key) continue;

        $path = $dir . '/' . $key . '.json';
        if (file_exists($path)) continue;

        $export = $group;
        $export['modified'] = time();

        @file_put_contents(
            $path,
            wp_json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        );
    }
}, 5);
