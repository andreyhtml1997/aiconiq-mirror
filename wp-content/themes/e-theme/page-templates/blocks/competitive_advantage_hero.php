<?php
/**
 * Block: competitive_advantage_hero — banner + logo + heading + CTA.
 * Mirrors `assets/src/components/sections/competitive-advantage-hero/index.tsx`.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$button = $data['button'] ?? null;
$btn_label = is_array($button) && !empty($button['label']) ? $button['label'] : ($lang === 'de' ? 'Buchen Sie einen Termin' : 'Book a call');
$btn_href = (is_array($button) && ($button['mode'] ?? '') === 'url' && !empty($button['url']['url'])) ? $button['url']['url'] : '';
$btn_target = (is_array($button) && ($button['mode'] ?? '') === 'url') ? ($button['url']['target'] ?? '_self') : '_self';
$logo = !empty($data['logo']['url']) ? $data['logo']['url'] : aiconiq_public_asset('assets/logo-con.webp');
$banner = !empty($data['banner']['url']) ? $data['banner']['url'] : aiconiq_public_asset('assets/banner-con.webp');
?>
<section class="py-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-[80px] px-4">
    <div class="max-w-[1280px] w-full mx-auto rounded-[12px] sm:rounded-[14px] md:rounded-[16px] competitive-advantage-hero py-8 sm:py-10 md:py-12 lg:py-[58px] px-6 sm:px-8 md:px-12 lg:px-16 xl:pl-[104px] relative overflow-hidden">
        <img src="<?php echo esc_url($banner); ?>" class="absolute top-0 left-0 w-full h-full object-cover opacity-70 sm:opacity-80 md:opacity-100" alt="" />
        <img src="<?php echo esc_url($logo); ?>" class="max-w-[60px] sm:max-w-[65px] md:max-w-[75px] w-full relative mb-6 sm:mb-7 md:mb-8" alt="" />
        <div class="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8 items-start relative">
            <h2 class="gradient-text font-medium max-w-[800px] w-full text-[28px] sm:text-[34px] md:text-[40px] lg:text-[48px] leading-[120%]"><?php echo esc_html($title); ?></h2>
            <p class="max-w-full sm:max-w-[480px] md:max-w-[549px] w-full text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]"><?php echo esc_html($description); ?></p>
            <?php
            $cb_label = $btn_label;
            $cb_href = $btn_href;
            $cb_target = $btn_target;
            include get_template_directory() . '/template-parts/chat-button.php';
            unset($cb_label, $cb_href, $cb_target);
            ?>
        </div>
    </div>
</section>
