<?php
/**
 * Template Name: Blocks (PHP-rendered)
 *
 * Renders pages whose body is an ACF Flexible Content "body_blocks" field
 * directly on the server, dispatching each block to its PHP partial in
 * page-templates/blocks/<type>.php.
 *
 * Mirrors the Next.js BlockRenderer (`assets/src/components/blocks/block-renderer.tsx`)
 * one-to-one in terms of supported block types, so the same admin content
 * renders identically on both fronts. Animations intentionally omitted per
 * client request (2026-05-11).
 *
 * Template selection in admin: Pages → <some page> → Page Attributes →
 * Template → "Blocks (PHP-rendered)".
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

// Sticky floating header — always present.
get_template_part('template-parts/sticky-header');

$post_id_for_template = get_queried_object_id();
$blocks_pre = function_exists('aiconiq_get_body_blocks') ? aiconiq_get_body_blocks($post_id_for_template) : [];
$first_type_pre = $blocks_pre[0]['type'] ?? '';

// Inline nav row: render at top of page UNLESS the first block is a hero,
// in which case hero_main.php includes it inside the section so it overlays
// the video (matches the React Hero behavior).
if ($first_type_pre !== 'hero_main') {
    get_template_part('template-parts/inline-nav-row');
}
?>

<main id="primary" class="site-main aiconiq-php-blocks">
    <?php
    $post_id = get_queried_object_id();
    $title = get_the_title($post_id);
    $blocks = function_exists('aiconiq_get_body_blocks') ? aiconiq_get_body_blocks($post_id) : [];
    ?>

    <?php
    // Render the page title only when the first block isn't already a hero.
    // Hero blocks contain their own H1, so showing a separate title duplicates it.
    $first_type = $blocks[0]['type'] ?? '';
    $hide_title = in_array($first_type, ['hero_main'], true);
    ?>
    <?php if ($title && !$hide_title): ?>
        <section class="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 md:pt-16">
            <h1 class="text-white font-semibold leading-[110%]" style="font-size: clamp(32px, 7vw, 56px);"><?php echo esc_html($title); ?></h1>
        </section>
    <?php endif; ?>

    <?php foreach ($blocks as $block): $anchor = $block['anchor'] ?? ''; ?>
        <div<?php if ($anchor): ?> id="<?php echo esc_attr($anchor); ?>"<?php endif; ?> data-block="<?php echo esc_attr($block['type'] ?? ''); ?>">
            <?php aiconiq_render_block($block); ?>
            <?php if (!empty($block['divider_below'])): ?>
                <div class="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8">
                    <div class="h-px w-full bg-white/10"></div>
                </div>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>

    <?php
    /**
     * Page footer CTA — only auto-append the ConsultantSection if the page's
     * own body_blocks don't already include one. Pages composed from the
     * home template carry their own consultant_section block; appending a
     * second one duplicates the section.
     */
    $has_consultant = false;
    foreach ($blocks as $b) {
        if (($b['type'] ?? '') === 'consultant_section') { $has_consultant = true; break; }
    }
    if (!$has_consultant) {
        aiconiq_render_block([
            'type' => 'consultant_section',
            'data' => [
                'title' => '',
                'button' => null,
                'avatars' => [],
                'consult_logo' => null,
                'back_logo' => null,
            ],
        ]);
    }
    ?>
</main>

<?php
get_template_part('template-parts/site-footer');
get_footer();
