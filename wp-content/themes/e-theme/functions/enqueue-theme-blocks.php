<?php
/**
 * Enqueue Tailwind-compiled CSS + vanilla JS for the PHP-rendered side.
 *
 * Loaded only on pages that opt into the "Blocks (PHP)" page template so we
 * don't pollute Next.js-rendered pages or the WP admin with theme assets that
 * are otherwise served by the React app.
 *
 * Build CSS once locally with:
 *   cd wp-content/themes/e-theme/assets
 *   npm run build:theme-css
 *
 * The output sits at /assets/dist-php/theme.css and is enqueued below.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('wp_enqueue_scripts', function () {
    if (is_admin()) {
        return;
    }

    // Only on pages whose template is page-templates/blocks.php.
    if (!is_page()) {
        return;
    }
    $template = get_page_template_slug(get_queried_object_id());
    if ($template !== 'page-templates/blocks.php') {
        return;
    }

    $theme_uri = get_template_directory_uri();
    $theme_dir = get_template_directory();

    $css_rel = '/assets/dist-php/theme.css';
    $js_rel  = '/assets/dist-php/theme.js';

    $css_path = $theme_dir . $css_rel;
    $js_path  = $theme_dir . $js_rel;

    if (file_exists($css_path)) {
        wp_enqueue_style(
            'aiconiq-theme-blocks',
            $theme_uri . $css_rel,
            [],
            filemtime($css_path)
        );
    }

    if (file_exists($js_path)) {
        wp_enqueue_script(
            'aiconiq-theme-blocks',
            $theme_uri . $js_rel,
            [],
            filemtime($js_path),
            true // in footer
        );
    }

    // Calendly external script — needed if any block uses a "Book a call"
    // CTA. Enqueued unconditionally for now; tiny + cached by Calendly CDN.
    wp_enqueue_script(
        'calendly-widget',
        'https://assets.calendly.com/assets/external/widget.js',
        [],
        null,
        true
    );
    wp_enqueue_style(
        'calendly-widget',
        'https://assets.calendly.com/assets/external/widget.css',
        [],
        null
    );
});
