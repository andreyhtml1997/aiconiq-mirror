<?php
/**
 * Block: knowledge_intro — heading + autoplaying video.
 * Mirrors `assets/src/components/sections/knowledge-intro/index.tsx`.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$badge = $data['badge'] ?? ($lang === 'de' ? 'WISSEN' : 'KNOWLEDGE');
$title = $data['title'] ?? '';
$video_url = !empty($data['video']['url']) ? $data['video']['url'] : aiconiq_public_asset('assets/main_video_new.mp4');
?>
<section id="about" class="pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-[110px]">
    <div class="max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-[58px] items-center justify-center">
        <?php
        $sh_badge = $badge;
        $sh_title = $title;
        include get_template_directory() . '/template-parts/section-header.php';
        ?>
        <video
            src="<?php echo esc_url($video_url); ?>"
            class="w-full relative z-10"
            style="max-width:100%; height:auto;"
            data-aiconiq-autoplay
            autoplay muted playsinline controls
        ></video>
    </div>
</section>
