<?php
/**
 * Template Name: Blocks (Next.js)
 *
 * Used for pages whose body is an ACF Flexible Content "body_blocks" field
 * rendered by the Next.js front-end. The page's body_blocks data is exposed
 * via /wp-json/wp/v2/pages?slug=...&_embed&lang=en|de — Next.js fetches it
 * and renders the actual UI.
 *
 * The ACF field group `group_aiconiq_body_blocks` is restricted to this
 * template, so editors only see "Blocks" UI on pages that opted in. Other
 * Pages and Articles keep their default WP/ACF setup untouched.
 *
 * This server-side template is intentionally a thin fallback for direct WP
 * URL hits (e.g. preview, admin). The public site is served by Next.js.
 */

if (!defined('ABSPATH')) exit;

get_header();
?>
<main id="primary" class="site-main aiconiq-blocks-fallback">
    <?php while (have_posts()) : the_post(); ?>
        <article <?php post_class(); ?>>
            <header class="entry-header">
                <h1 class="entry-title"><?php the_title(); ?></h1>
            </header>
            <div class="entry-content">
                <p>
                    This page is composed of front-end blocks rendered by the Next.js application.
                    Edit blocks via <strong>Pages → <?php echo esc_html(get_the_title()); ?> → Blocks</strong>.
                </p>
            </div>
        </article>
    <?php endwhile; ?>
</main>
<?php
get_footer();
