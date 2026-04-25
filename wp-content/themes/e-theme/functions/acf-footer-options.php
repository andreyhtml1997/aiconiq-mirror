<?php
/**
 * Footer settings stored on dedicated ACF Options Pages — one per language.
 * Frontend reads them via /wp-json/aiconiq/v1/footer?lang=en|de.
 *
 * Two pages instead of one because Polylang Pro doesn't natively translate
 * Options Page values; this gives editor a clean, separate UI per language.
 */

if (!defined('ABSPATH')) exit;

if (!function_exists('acf_add_options_page')) return;

add_action('acf/init', function () {
    // Top-level "Footer" menu in WP admin sidebar — easy to find.
    acf_add_options_page([
        'page_title' => 'Footer settings',
        'menu_title' => 'Footer',
        'menu_slug' => 'aiconiq-footer',
        'capability' => 'edit_posts',
        'icon_url' => 'dashicons-align-center',
        'position' => 30,
        'redirect' => true,
    ]);
    acf_add_options_sub_page([
        'page_title' => 'Footer (EN)',
        'menu_title' => 'Footer (EN)',
        'menu_slug' => 'aiconiq-footer-en',
        'capability' => 'edit_posts',
        'parent_slug' => 'aiconiq-footer',
        'post_id' => 'aiconiq_footer_en',
    ]);
    acf_add_options_sub_page([
        'page_title' => 'Footer (DE)',
        'menu_title' => 'Footer (DE)',
        'menu_slug' => 'aiconiq-footer-de',
        'capability' => 'edit_posts',
        'parent_slug' => 'aiconiq-footer',
        'post_id' => 'aiconiq_footer_de',
    ]);

    acf_add_local_field_group([
        'key' => 'group_aiconiq_footer',
        'title' => 'Footer settings',
        'fields' => [
            ['key' => 'f_fopt_logo', 'label' => 'Top logo', 'name' => 'logo', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
            ['key' => 'f_fopt_big_logo', 'label' => 'Big bottom logo', 'name' => 'big_logo', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
            ['key' => 'f_fopt_desc', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 3],
            ['key' => 'f_fopt_email', 'label' => 'Contact email', 'name' => 'email', 'type' => 'email'],
            ['key' => 'f_fopt_social_label', 'label' => 'Social label', 'name' => 'social_label', 'type' => 'text', 'wrapper' => ['width' => '50']],
            ['key' => 'f_fopt_links_label', 'label' => 'Links label', 'name' => 'links_label', 'type' => 'text', 'wrapper' => ['width' => '50']],
            ['key' => 'f_fopt_socials', 'label' => 'Social links', 'name' => 'socials', 'type' => 'repeater', 'min' => 0, 'button_label' => 'Add social', 'sub_fields' => [
                ['key' => 'f_fopt_s_name', 'label' => 'Name', 'name' => 'name', 'type' => 'text', 'wrapper' => ['width' => '40']],
                ['key' => 'f_fopt_s_url', 'label' => 'URL', 'name' => 'url', 'type' => 'url', 'wrapper' => ['width' => '60']],
            ]],
            ['key' => 'f_fopt_links', 'label' => 'Footer links', 'name' => 'links', 'type' => 'repeater', 'min' => 0, 'button_label' => 'Add link', 'sub_fields' => [
                ['key' => 'f_fopt_l_name', 'label' => 'Name', 'name' => 'name', 'type' => 'text', 'wrapper' => ['width' => '40']],
                ['key' => 'f_fopt_l_url', 'label' => 'URL (path or full URL)', 'name' => 'url', 'type' => 'text', 'wrapper' => ['width' => '60']],
            ]],
        ],
        'location' => [
            [['param' => 'options_page', 'operator' => '==', 'value' => 'aiconiq-footer-en']],
            [['param' => 'options_page', 'operator' => '==', 'value' => 'aiconiq-footer-de']],
        ],
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'active' => true,
    ]);
});

/**
 * REST: GET /wp-json/aiconiq/v1/footer?lang=en|de
 */
add_action('rest_api_init', function () {
    register_rest_route('aiconiq/v1', '/footer', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function (WP_REST_Request $req) {
            $lang = $req->get_param('lang') === 'de' ? 'de' : 'en';
            $opt = $lang === 'de' ? 'aiconiq_footer_de' : 'aiconiq_footer_en';

            if (!function_exists('get_field')) return rest_ensure_response(null);

            $socials = [];
            foreach ((array) get_field('socials', $opt) as $s) {
                if (!empty($s['name']) || !empty($s['url'])) {
                    $socials[] = ['name' => $s['name'] ?? '', 'url' => $s['url'] ?? ''];
                }
            }
            $links = [];
            foreach ((array) get_field('links', $opt) as $l) {
                if (!empty($l['name']) || !empty($l['url'])) {
                    $links[] = ['name' => $l['name'] ?? '', 'url' => $l['url'] ?? ''];
                }
            }

            return rest_ensure_response([
                'logo' => aiconiq_norm_image(get_field('logo', $opt)),
                'big_logo' => aiconiq_norm_image(get_field('big_logo', $opt)),
                'description' => (string) get_field('description', $opt),
                'email' => (string) get_field('email', $opt),
                'social_label' => (string) get_field('social_label', $opt),
                'links_label' => (string) get_field('links_label', $opt),
                'socials' => $socials,
                'links' => $links,
            ]);
        },
    ]);
});
