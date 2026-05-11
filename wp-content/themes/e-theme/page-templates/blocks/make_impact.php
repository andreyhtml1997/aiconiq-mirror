<?php
/**
 * Block: make_impact — team callout with blurred pink background.
 * Mirrors `assets/src/components/sections/make-impact/index.tsx`.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$badge = $data['badge'] ?? ($lang === 'de' ? 'Team' : 'Team');
$title = $data['title'] ?? '';
$team_url = !empty($data['team_image']['url']) ? $data['team_image']['url'] : aiconiq_public_asset('assets/team-image.png');
$view_behind = aiconiq_public_asset('assets/make-impact-img/view-behind.webp');
$gradient_line = aiconiq_public_asset('assets/gradientline.svg');
$blured_bg = aiconiq_public_asset('assets/blured-bg-pink.webp');
?>
<section id="team" class="pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-[114px] pb-3 sm:pb-4 md:pb-5">
    <div class="max-w-[1280px] w-full relative mx-auto flex flex-col gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center justify-center px-4 sm:px-6 md:px-8">
        <?php
        $sh_badge = $badge;
        $sh_title = $title;
        include get_template_directory() . '/template-parts/section-header.php';
        ?>
        <img src="<?php echo esc_url($blured_bg); ?>" alt="" class="absolute top-[-21%] left-0 scale-y-[-1] z-0 h-[500px] w-full" />
        <div class="max-w-[1280px] w-full relative">
            <div class="relative w-full flex items-center justify-center">
                <img src="<?php echo esc_url($gradient_line); ?>" alt="" class="relative left-[20px] bottom-[-30px]" />
            </div>
            <img src="<?php echo esc_url($team_url); ?>" alt="" style="max-width:800px; margin:0 auto;" class="relative z-10 w-full h-auto" />
            <img src="<?php echo esc_url($view_behind); ?>" alt="" class="hidden lg:block absolute left-[-120px] top-[60%] transform -translate-y-1/2 max-w-[300px] xl:max-w-full" />
        </div>
    </div>
</section>
