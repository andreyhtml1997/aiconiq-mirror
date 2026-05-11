<?php
/**
 * Theme header — opens the document and emits wp_head().
 *
 * Used by the PHP-rendered side (pages using page-templates/blocks.php) and
 * by legacy non-headless templates. The Next.js side renders its own <html>
 * via app/[lang]/layout.tsx and never includes this file.
 */
$lang_attr = function_exists('pll_current_language')
    ? (pll_current_language('slug') ?: 'en')
    : substr(get_locale(), 0, 2);
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> lang="<?php echo esc_attr($lang_attr); ?>" style="margin-top:0!important;">

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
