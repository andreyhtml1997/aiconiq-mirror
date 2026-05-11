<?php
/**
 * Helpers for the PHP-rendered side (pages using page-templates/blocks.php).
 *
 * Mirrors the data shapes the Next.js components consume so block PHP
 * templates can stay close to their TSX counterparts visually + structurally.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Current language slug ('en' or 'de'). Falls back to 'en' when Polylang is
 * inactive (e.g. local dev without the plugin).
 */
function aiconiq_current_lang(): string
{
    if (function_exists('pll_current_language')) {
        $lang = pll_current_language('slug');
        if ($lang === 'de') return 'de';
        return 'en';
    }
    $locale = get_locale();
    return strpos($locale, 'de') === 0 ? 'de' : 'en';
}

/**
 * URL to a file inside assets/public/assets/. The Next.js app references
 * these as `/assets/...`; on the WP side they live under the theme dir.
 */
function aiconiq_public_asset(string $path): string
{
    $path = ltrim($path, '/');
    return get_template_directory_uri() . '/assets/public/' . $path;
}

/**
 * Read the ACF Options-page footer settings for the current language.
 * Returns the same shape as /wp-json/aiconiq/v1/footer.
 */
function aiconiq_get_footer_data(?string $lang = null): array
{
    $lang = $lang ?: aiconiq_current_lang();
    $opt = $lang === 'de' ? 'aiconiq_footer_de' : 'aiconiq_footer_en';

    $defaults = [
        'logo' => null,
        'big_logo' => null,
        'description' => '',
        'email' => 'contact@aiconiq.io',
        'social_label' => 'Social',
        'links_label' => 'Links',
        'socials' => [],
        'links' => [],
    ];

    if (!function_exists('get_field')) {
        return $defaults;
    }

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

    return [
        'logo' => aiconiq_norm_image(get_field('logo', $opt)),
        'big_logo' => aiconiq_norm_image(get_field('big_logo', $opt)),
        'description' => (string) get_field('description', $opt),
        'email' => (string) get_field('email', $opt) ?: 'contact@aiconiq.io',
        'social_label' => (string) get_field('social_label', $opt) ?: 'Social',
        'links_label' => (string) get_field('links_label', $opt) ?: 'Links',
        'socials' => $socials,
        'links' => $links,
    ];
}

/**
 * Render a normalized "button" array (from aiconiq_norm_button) as an <a>
 * element. Falls back to a no-op span when the button is empty or has no URL.
 *
 * @param array|null $btn  Shape: ['label' => '', 'mode' => 'url|action', 'url' => ['url' => '', ...]]
 * @param string $classes  Tailwind classes to apply.
 * @param string $extra    Extra HTML attributes (e.g. `data-aiconiq-calendly="..."`).
 */
function aiconiq_render_button($btn, string $classes = '', string $extra = ''): string
{
    if (!is_array($btn) || empty($btn['label'])) return '';
    $label = $btn['label'];
    $mode = $btn['mode'] ?? 'action';
    $href = '#';
    $target = '';
    if ($mode === 'url' && is_array($btn['url'] ?? null) && !empty($btn['url']['url'])) {
        $href = $btn['url']['url'];
        if (!empty($btn['url']['target']) && $btn['url']['target'] === '_blank') {
            $target = ' target="_blank" rel="noopener noreferrer"';
        }
    }
    return sprintf(
        '<a href="%s" class="%s"%s%s>%s</a>',
        esc_url($href),
        esc_attr($classes),
        $target,
        $extra ? ' ' . $extra : '',
        esc_html($label)
    );
}

/**
 * Dispatch a single normalized block to its PHP template.
 *
 * Templates live in page-templates/blocks/<type>.php. Each template receives
 * a `$block` variable that contains keys `type`, `anchor`, `divider_below`,
 * and `data` (the per-block payload, mirroring the Next-side data shape).
 */
function aiconiq_render_block(array $block): void
{
    $type = $block['type'] ?? '';
    if (!$type) return;
    $tpl = get_template_directory() . '/page-templates/blocks/' . $type . '.php';
    if (!file_exists($tpl)) {
        if (current_user_can('edit_pages')) {
            echo '<div class="bg-red-900/30 text-red-200 p-4 my-2 text-sm font-mono">';
            echo 'Missing PHP template for block: ' . esc_html($type);
            echo '</div>';
        }
        return;
    }
    // Variables exposed to the included template:
    $data = $block['data'] ?? [];
    $anchor = $block['anchor'] ?? '';
    include $tpl;
}
