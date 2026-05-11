<?php
/**
 * Block: lead_capture_bottom — title + CTA + image background.
 * Mirrors `assets/src/components/sections/lead-capture-bottom/index.tsx`.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$title = $data['title'] ?? '';
$button = $data['button'] ?? null;
$btn_label = is_array($button) && !empty($button['label']) ? $button['label'] : ($lang === 'de' ? 'Buchen Sie einen Termin' : 'Book a call');
$btn_href = (is_array($button) && ($button['mode'] ?? '') === 'url' && !empty($button['url']['url'])) ? $button['url']['url'] : '';
$btn_target = (is_array($button) && ($button['mode'] ?? '') === 'url') ? ($button['url']['target'] ?? '_self') : '_self';
$image = !empty($data['image']['url']) ? $data['image']['url'] : aiconiq_public_asset('assets/lead-img/avatar.webp');
$background = !empty($data['background']['url']) ? $data['background']['url'] : aiconiq_public_asset('assets/lead-img/bg.webp');
?>
<section id="contact" class="flex flex-col max-w-[1920px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-4 lg:pb-4 mt-4 sm:mt-3 md:mt-2">
    <div
        class="w-full relative bg-[#1A1317] overflow-hidden rounded-[8px] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[739px]"
        style="background: radial-gradient(70.67% 55.33% at 31.67% 57.87%, rgba(216, 0, 141, 0.24) 0%, rgba(216, 0, 141, 0.00) 100%), #1A1317;"
    >
        <img src="<?php echo esc_url($background); ?>" alt="" class="absolute top-0 left-0 w-full h-full object-cover opacity-40 sm:opacity-60 md:opacity-100" />
        <div class="relative max-w-[1250px] w-full mx-auto flex flex-col lg:flex-row justify-between py-0 sm:py-10 md:py-12 lg:py-16 px-0 sm:px-6 md:px-8 lg:px-0">
            <div class="max-w-full lg:max-w-[800px] w-full relative order-2 lg:order-1 mt-6 lg:mt-0">
                <img src="<?php echo esc_url($image); ?>" alt="" class="w-full max-w-[600px] sm:max-w-[700px] lg:max-w-[800px] mx-auto lg:mx-0 relative lg:absolute lg:top-5 lg:left-0" />
            </div>
            <div class="max-w-full lg:max-w-[537px] relative p-4 items-start lg:top-[184px] w-full lg:pl-10 flex flex-col gap-6 sm:gap-8 md:gap-10 lg:border-l border-[#D8008D] order-1 lg:order-2 pb-6 lg:pb-0">
                <h2 class="gradient-text font-medium text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[120%]"><?php echo esc_html($title); ?></h2>
                <?php
                $cb_label = $btn_label;
                $cb_href = $btn_href;
                $cb_target = $btn_target;
                include get_template_directory() . '/template-parts/chat-button.php';
                unset($cb_label, $cb_href, $cb_target);
                ?>
            </div>
        </div>
    </div>
</section>
