<?php
/**
 * Block: lead_capture_top — title + description + CTA + video + banner.
 * Mirrors `assets/src/components/sections/lead-capture-top/index.tsx`.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$part1 = $data['title_part1'] ?? '';
$highlight = $data['title_highlight'] ?? '';
$part2 = $data['title_part2'] ?? '';
$description = $data['description'] ?? '';
$banner = !empty($data['banner']['url']) ? $data['banner']['url'] : aiconiq_public_asset('assets/ctabanner.webp');
$video = !empty($data['video']['url']) ? $data['video']['url'] : aiconiq_public_asset('assets/interview-101.mp4');
$button = $data['button'] ?? null;
$btn_label = is_array($button) ? ($button['label'] ?? '') : '';
$btn_href = (is_array($button) && ($button['mode'] ?? '') === 'url' && !empty($button['url']['url'])) ? $button['url']['url'] : '';
$btn_target = (is_array($button) && ($button['mode'] ?? '') === 'url') ? ($button['url']['target'] ?? '_self') : '_self';
?>
<section class="flex flex-col max-w-[1920px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-4 lg:pt-4">
    <div class="w-full relative bg-[#1A1317] rounded-[8px] overflow-hidden">
        <div class="relative max-w-[1250px] w-full mx-auto py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-0">
            <img src="<?php echo esc_url($banner); ?>" alt="" class="absolute top-[-10px] mix-blend-lighten right-0 max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] opacity-50 sm:opacity-70 md:opacity-100" />
            <video
                src="<?php echo esc_url($video); ?>"
                class="relative lg:absolute lg:right-0 lg:top-16 w-full lg:max-w-[50%] h-auto z-10 mb-6 lg:mb-0"
                data-aiconiq-autoplay autoplay muted playsinline controls
            ></video>
            <div class="flex flex-col gap-4 sm:gap-5 md:gap-6 relative lg:max-w-[50%]">
                <h2 class="font-semibold w-full gradient-text text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px] leading-[120%]">
                    <?php echo esc_html($part1); ?>
                    <?php if ($highlight): ?> <span class="text-gradient"><?php echo esc_html($highlight); ?></span><?php endif; ?>
                    <?php if ($part2): ?> <?php echo esc_html($part2); ?><?php endif; ?>
                </h2>
                <?php if ($description): ?>
                    <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-4">
                        <p class="w-full text-[#FFFFFF8F] font-bold text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($description); ?></p>
                    </div>
                <?php endif; ?>
                <?php if ($btn_label): ?>
                    <div class="self-start">
                        <?php
                        $cb_label = $btn_label;
                        $cb_href = $btn_href;
                        $cb_target = $btn_target;
                        include get_template_directory() . '/template-parts/chat-button.php';
                        unset($cb_label, $cb_href, $cb_target);
                        ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
