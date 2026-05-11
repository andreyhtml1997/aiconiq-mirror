<?php
/**
 * Block: solutions_overview — title + 4 solution cards.
 * Mirrors `assets/src/components/sections/solutions-overview/index.tsx`.
 * Hover glow dropped per spec.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$title = $data['title'] ?? '';
$button = $data['button'] ?? null;
$btn_label = is_array($button) && !empty($button['label']) ? $button['label'] : ($lang === 'de' ? 'Mehr erfahren' : 'Learn more');
$btn_href = (is_array($button) && ($button['mode'] ?? '') === 'url' && !empty($button['url']['url'])) ? $button['url']['url'] : '';
$btn_target = (is_array($button) && ($button['mode'] ?? '') === 'url') ? ($button['url']['target'] ?? '_self') : '_self';

$fallback_icons = [
    aiconiq_public_asset('assets/solutions-icons/1.svg'),
    aiconiq_public_asset('assets/solutions-icons/2.svg'),
    aiconiq_public_asset('assets/solutions-icons/3.svg'),
    aiconiq_public_asset('assets/solutions-icons/4.svg'),
];
$solutions = is_array($data['solutions'] ?? null) ? $data['solutions'] : [];
?>
<section class="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[130px]">
    <div class="max-w-[1280px] w-full mx-auto flex flex-col gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-8">
        <div class="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 sm:gap-8 lg:gap-12">
            <h2 class="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] gradient-text leading-[120%] max-w-full lg:max-w-[1036px] w-full"><?php echo esc_html($title); ?></h2>
            <?php
            $cb_label = $btn_label;
            $cb_href = $btn_href;
            $cb_target = $btn_target;
            include get_template_directory() . '/template-parts/chat-button.php';
            unset($cb_label, $cb_href, $cb_target);
            ?>
        </div>
        <div class="w-full border-t border-[#D9D9D9]/[24%]"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            <?php foreach ($solutions as $i => $solution):
                $icon = !empty($solution['icon']['url']) ? $solution['icon']['url'] : ($fallback_icons[$i] ?? $fallback_icons[0]);
                $stitle = $solution['title'] ?? '';
                $sdesc = $solution['description'] ?? '';
            ?>
                <div class="aiconiq-solutions-card overflow-hidden bg-[#1A1317] rounded-[12px] sm:rounded-[14px] md:rounded-[16px] min-h-[180px] sm:min-h-[190px] md:min-h-[204px] p-5 sm:p-6 md:p-8 flex items-center justify-center gap-3 sm:gap-4 flex-col text-center relative">
                    <img src="<?php echo esc_url($icon); ?>" alt="" class="max-w-7 sm:max-w-8 relative z-10" />
                    <span class="text-white font-extrabold text-[18px] sm:text-[19px] md:text-[20px] leading-[120%] relative z-10"><?php echo esc_html($stitle); ?></span>
                    <p class="text-white/[72%] text-[14px] sm:text-[15px] md:text-[16px] leading-[160%] relative z-10"><?php echo esc_html($sdesc); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
