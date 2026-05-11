<?php
/**
 * Badge icon partial — small circular icon container used by Positioning
 * left/right blocks and SectionBadge variants.
 *
 * Variables:
 *   $bi_icon       (string)  icon URL
 *   $bi_class      (string)  extra wrapper classes
 *   $bi_hide_glow  (bool)    set true to suppress the pink glow box-shadow
 */
if (!defined('ABSPATH')) exit;

$icon = $bi_icon ?? '';
$class = $bi_class ?? '';
$hide_glow = !empty($bi_hide_glow);
$shadow = $hide_glow ? 'none' : '0px 4px 117px 0px #FF21B2E0';
?>
<div class="size-[75px] z-10 flex items-center justify-center rounded-full <?php echo esc_attr($class); ?>"
     style="background: linear-gradient(0deg, rgba(109,7,74,0.08), rgba(109,7,74,0.08)), radial-gradient(36.67% 36.67% at 50% 50%, rgba(94,21,69,0.16) 0%, rgba(255,33,178,0) 100%); border: 1px solid #FFFFFF0F; backdrop-filter: blur(112.4px); box-shadow: <?php echo esc_attr($shadow); ?>;">
    <img src="<?php echo esc_url($icon); ?>" alt="" />
</div>
