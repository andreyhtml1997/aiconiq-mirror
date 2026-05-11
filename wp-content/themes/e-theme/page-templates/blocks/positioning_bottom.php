<?php
/**
 * Block: positioning_bottom — result card with gradient background.
 * Mirrors `assets/src/components/sections/positioning-bottom/index.tsx` + BottomBlock.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$title = $data['title'] ?? '';
$badge = $data['badge'] ?? '';
$description = $data['description'] ?? '';
$result_label = $data['result_label'] ?? '';
$result_title = $data['result_title'] ?? '';
$result_description = $data['result_description'] ?? '';

$lines = aiconiq_public_asset('assets/lines.svg');
$bottom_ellipse = aiconiq_public_asset('assets/bottom-ellipse.webp');
?>
<section class="pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-[126px] px-4 sm:px-6 md:px-8">
    <div class="max-w-[1284px] w-full mx-auto">
        <div class="bg-[#160B12] rounded-[12px] p-2 flex flex-col gap-3 sm:gap-4">
            <div class="p-3 sm:p-4 md:p-5 lg:p-4 flex flex-col gap-3 sm:gap-4">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <h3 class="text-[#FFFFFF] font-semibold text-[20px] sm:text-[24px] lg:text-[28px] leading-[100%]"><?php echo esc_html($title); ?></h3>
                    <?php if ($badge): ?>
                        <div class="py-1 !flex px-3 sm:px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
                            <span class="gradient-text text-[13px] sm:text-[14px] lg:text-[16px] leading-[160%] whitespace-nowrap"><?php echo esc_html($badge); ?></span>
                        </div>
                    <?php endif; ?>
                </div>
                <p class="text-[#FFFFFF8F] font-medium text-[13px] sm:text-[14px] md:text-[15px] lg:text-[15.5px] leading-[160%]"><?php echo esc_html($description); ?></p>
            </div>

            <div class="p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 overflow-hidden rounded-[8px] relative"
                 style="background: linear-gradient(87.47deg, rgba(94,21,69,0.24) 31.41%, rgba(130,31,95,0.24) 87.36%, rgba(118,14,82,0.24) 101.12%);">
                <img src="<?php echo esc_url($lines); ?>" alt="" class="absolute top-[-31px] right-10 z-[2] w-auto max-w-[40%] sm:max-w-[50%] lg:max-w-full opacity-50 sm:opacity-100" />
                <img src="<?php echo esc_url($bottom_ellipse); ?>" alt="" class="absolute top-0 right-10 z-[1] w-auto max-w-[40%] sm:max-w-[50%] lg:max-w-full opacity-50 sm:opacity-100" />
                <span class="text-white font-medium text-[12px] sm:text-[13px] lg:text-[14px] leading-[120%] relative z-10"><?php echo esc_html($result_label); ?></span>
                <h3 class="text-[#320F25] font-semibold text-[24px] sm:text-[36px] lg:text-[48px] leading-[120%] relative z-10"
                    style="background-image: linear-gradient(243.84deg, #BD1482 44.69%, #5D1142 75.78%, #320F25 97.92%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;"><?php echo esc_html($result_title); ?></h3>
                <p class="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[16px] lg:text-[18px] leading-[160%] relative z-10"><?php echo esc_html($result_description); ?></p>
            </div>
        </div>
    </div>
</section>
