<?php
/**
 * Block: text — eyebrow + heading + WYSIWYG body.
 * Mirrors the inline `case 'text'` branch of BlockRenderer.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$eyebrow = $data['eyebrow'] ?? '';
$title = $data['title'] ?? '';
$body = $data['body'] ?? '';
?>
<section class="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14">
    <div class="flex flex-col gap-4 max-w-[860px]">
        <?php if ($eyebrow): ?>
            <span class="gradient-text text-sm sm:text-base leading-[160%]"><?php echo esc_html($eyebrow); ?></span>
        <?php endif; ?>
        <?php if ($title): ?>
            <h2 class="text-white font-semibold leading-[110%]" style="font-size: clamp(24px, 5vw, 40px);"><?php echo esc_html($title); ?></h2>
        <?php endif; ?>
        <?php if ($body): ?>
            <div class="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] leading-[170%]"><?php echo $body; /* WYSIWYG, allowed HTML */ ?></div>
        <?php endif; ?>
    </div>
</section>
