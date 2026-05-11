<?php
/**
 * Block: divider — line or glow gradient.
 * Mirrors the inline `case 'divider'` branch of BlockRenderer.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$style = $data['style'] ?? 'line';
?>
<div class="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
    <?php if ($style === 'glow'): ?>
        <div class="h-[2px] w-full bg-gradient-to-r from-transparent via-[#EB3CAE] to-transparent opacity-70"></div>
    <?php else: ?>
        <div class="h-px w-full bg-white/10"></div>
    <?php endif; ?>
</div>
