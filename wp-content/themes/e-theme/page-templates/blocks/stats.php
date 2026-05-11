<?php
/**
 * Block: stats — two rows of numbered KPIs.
 * Mirrors `assets/src/components/sections/stats/index.tsx`. Count-up animation
 * intentionally dropped — values are rendered as-is from ACF.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$top_stats = is_array($data['top_stats'] ?? null) ? $data['top_stats'] : [];
$bottom_stats = is_array($data['bottom_stats'] ?? null) ? $data['bottom_stats'] : [];
$gradient_bg = aiconiq_public_asset('assets/stats/gradientbg.webp');

$bottom_grid = count($bottom_stats) >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3';
?>
<section class="w-full relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
    <div class="absolute top-1/2 w-full h-full left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img src="<?php echo esc_url($gradient_bg); ?>" class="w-full h-full object-fill" alt="" />
    </div>
    <div class="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <div class="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-[56px] items-center">

            <?php if (!empty($top_stats)): ?>
                <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-0 lg:divide-x divide-black/30">
                    <?php foreach ($top_stats as $stat): $value = $stat['value'] ?? ''; $desc = $stat['description'] ?? ''; ?>
                        <div class="flex flex-col max-w-full lg:max-w-[304px] w-full gap-2 sm:gap-3 items-center justify-center text-center px-4 sm:px-3 md:px-4">
                            <div data-aiconiq-countup data-duration="1900" class="font-medium text-[#E8C5DD] text-[36px] sm:text-[44px] md:text-[52px] lg:text-[64px] leading-[120%]"><?php echo esc_html($value); ?></div>
                            <p class="text-[13px] gradient-text sm:text-[14px] md:text-[15px] lg:text-[16px] leading-[160%] opacity-[72%]"><?php echo esc_html($desc); ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($bottom_stats)): ?>
                <div class="w-full grid grid-cols-1 <?php echo esc_attr($bottom_grid); ?> gap-8 sm:gap-6 md:gap-8 lg:gap-6">
                    <?php foreach ($bottom_stats as $stat): $value = $stat['value'] ?? ''; $desc = $stat['description'] ?? ''; ?>
                        <div class="flex flex-col gap-2 sm:gap-3 items-center justify-center text-center px-4 sm:px-3 md:px-4">
                            <h3 data-aiconiq-countup data-duration="1600" class="font-medium text-[#E8C5DD] text-[36px] sm:text-[44px] md:text-[52px] lg:text-[64px] leading-[120%]"><?php echo esc_html($value); ?></h3>
                            <p class="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] leading-[160%] opacity-70"
                               style="background: linear-gradient(181deg, #FFFFFF 61.8%, #F4DCEC 96.62%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;"><?php echo esc_html($desc); ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <div class="hidden sm:grid sm:grid-cols-3 gap-6 md:gap-8 lg:gap-6 w-full absolute bottom-0 pointer-events-none">
                <div class="h-20 border-r border-black/30"></div>
                <div class="h-20 border-r border-black/30"></div>
                <div class="h-20"></div>
            </div>

        </div>
    </div>
</section>
