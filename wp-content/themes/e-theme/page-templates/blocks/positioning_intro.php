<?php
/**
 * Block: positioning_intro — two-column positioning intro.
 * Mirrors `assets/src/components/sections/positioning/index.tsx` + LeftBlock + RightBlock.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$badge = $data['badge'] ?? '';
$left = $data['left_block'] ?? [];
$right = $data['right_block'] ?? [];

// Asset URLs (Next public/ → theme dir).
$gradient_line = aiconiq_public_asset('assets/gradientline.svg');
$blured_bg = aiconiq_public_asset('assets/blured-bg-pink.webp');
$lines = aiconiq_public_asset('assets/lines.svg');
$ai_blured = aiconiq_public_asset('assets/ai-blured.webp');
$stars = aiconiq_public_asset('assets/icons/stars.svg');
$user_icon = aiconiq_public_asset('assets/icons/user.svg');

$left_badge = $left['badge'] ?? '';
$left_title = $left['title'] ?? '';
$left_description = $left['description'] ?? '';
$left_icon = !empty($left['icon']['url']) ? $left['icon']['url'] : $user_icon;

$right_overlay = $right['overlay_text'] ?? '';
$right_description = $right['description'] ?? '';
$right_image = !empty($right['image']['url']) ? $right['image']['url'] : aiconiq_public_asset('assets/positioning-img/avatar.webp');

// Bold "AICONIQ" inside title.
$title_parts = explode('AICONIQ', $title);
$title_html = '';
foreach ($title_parts as $i => $p) {
    $title_html .= esc_html($p);
    if ($i < count($title_parts) - 1) $title_html .= '<span class="font-bold">AICONIQ</span>';
}
?>
<section class="pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-[126px] pb-12 sm:pb-16 md:pb-20 lg:pb-[104px] w-full flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-[50px] items-center justify-center px-4 sm:px-6 md:px-8">
    <div class="min-h-[250px] relative mt-[-100px]">
        <img src="<?php echo esc_url($gradient_line); ?>" alt="" />
        <img src="<?php echo esc_url($blured_bg); ?>" alt="" class="absolute top-0 left-0" />
    </div>

    <div class="max-w-[1284px] w-full flex relative flex-col mt-[-200px] lg:flex-row items-start gap-6 sm:gap-8">
        <div class="flex flex-col gap-3 sm:gap-4 max-w-full lg:max-w-[1114px] w-full order-2 lg:order-1">
            <h2 class="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[120%] gradient-text"><?php echo $title_html; ?></h2>
            <p class="text-[#FFFFFF8F] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[160%] sm:leading-[170%] lg:leading-[180%]"><?php echo esc_html($description); ?></p>
        </div>
        <div class="order-1 lg:order-2">
            <?php
            $sh_badge = $badge;
            $sh_title = '';
            include get_template_directory() . '/template-parts/section-header.php';
            ?>
        </div>
    </div>

    <div class="flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[104px] relative max-w-[1284px] w-full mx-auto">
        <div class="flex flex-col lg:flex-row lg:justify-end lg:items-end gap-6 sm:gap-8">

            <!-- LeftBlock -->
            <div class="flex relative lg:absolute lg:top-[-31px] lg:left-[0] flex-col z-[20] bg-[#141112] max-w-full lg:max-w-[618px] rounded-[12px] min-h-[350px] sm:min-h-[400px] lg:h-[458px] justify-between w-full p-4 sm:p-5 md:p-6 lg:p-8">
                <?php
                $bi_icon = $left_icon;
                $bi_class = '';
                include get_template_directory() . '/template-parts/badge-icon.php';
                unset($bi_icon, $bi_class);
                ?>
                <img src="<?php echo esc_url($lines); ?>" alt="" class="absolute top-0 right-0 w-auto max-w-[50%] opacity-25 sm:max-w-[60%] lg:max-w-full" />
                <div class="flex flex-col gap-3 sm:gap-4 items-start">
                    <?php if ($left_badge): ?>
                        <div class="py-1 !flex px-3 sm:px-4 rounded-full gradient-border-mask22 mb-3 sm:mb-4 bg-[#EB3CAE52]">
                            <span class="gradient-text text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] leading-[160%]"><?php echo esc_html($left_badge); ?></span>
                        </div>
                    <?php endif; ?>
                    <h3 class="text-[#FFFFFF] font-semibold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] leading-[110%] sm:leading-[100%]"><?php echo esc_html($left_title); ?></h3>
                    <p class="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($left_description); ?></p>
                </div>
            </div>

            <!-- RightBlock -->
            <div class="rounded-[12px] relative w-full lg:w-[699px] flex-col gap-3 sm:gap-4 flex p-2 min-h-[400px] sm:min-h-[450px] lg:h-[458px]"
                 style="background: linear-gradient(94.67deg, rgba(74,30,58,0.24) -4.88%, rgba(177,62,137,0.24) 74.86%, rgba(162,70,130,0.24) 94.48%);">
                <?php
                $bi_icon = $stars;
                $bi_class = 'absolute top-[-15px] right-[-15px] sm:top-[-20px] sm:right-[-20px] lg:top-[-25px] lg:right-[-25px] scale-75 sm:scale-90 lg:scale-100';
                include get_template_directory() . '/template-parts/badge-icon.php';
                unset($bi_icon, $bi_class);
                ?>
                <img src="<?php echo esc_url($lines); ?>" alt="" class="absolute top-0 right-0 w-auto max-w-[50%] sm:max-w-[60%] lg:max-w-full" />
                <div class="relative">
                    <div class="absolute top-1/2 left-4 sm:left-8 lg:left-12 transform -translate-y-1/2 z-10">
                        <p class="max-w-[180px] sm:max-w-[200px] lg:max-w-[228px] w-full text-white font-bold text-[20px] sm:text-[26px] lg:text-[32px] leading-[120%]"><?php echo esc_html($right_overlay); ?></p>
                    </div>
                    <img src="<?php echo esc_url($ai_blured); ?>" alt="" />
                </div>
                <div class="p-1 sm:p-2 absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 z-10">
                    <div class="pl-0 sm:pl-10 lg:pl-14 p-2 sm:p-3 rounded-[8px] overflow-hidden relative backdrop-blur-[50px] self-end"
                         style="background: linear-gradient(85.67deg, rgba(22,11,18,0) 1.16%, rgba(27,0,17,0.24) 17.13%);">
                        <p class="text-white font-medium text-[12px] sm:text-[14px] lg:text-[16px] leading-[160%]"><?php echo esc_html($right_description); ?></p>
                    </div>
                </div>
                <img src="<?php echo esc_url($right_image); ?>" class="w-[80%] sm:w-[55%] lg:w-[474px] h-auto lg:h-[482px] absolute bottom-0 right-0 object-contain" alt="" />
            </div>
        </div>
    </div>
</section>
