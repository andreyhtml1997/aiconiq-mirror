<?php
/**
 * Block: auto_vs_intro_video — autoplaying intro video with bottom hr.
 * Mirrors `assets/src/components/sections/auto-vs-intro-video/index.tsx`.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$video_url = !empty($data['video']['url']) ? $data['video']['url'] : aiconiq_public_asset('assets/INVENTIVE_AICONIQ_Hero-Video_20260127_16x9_1080p_FINAL_x264.mp4');
?>
<section class="pt-12 sm:pt-16 md:pt-20 lg:pt-24 px-4 sm:px-6 md:px-8">
    <div class="flex items-center justify-center flex-col relative w-full" style="min-height: clamp(120px, 20vw, 250px);">
        <video
            src="<?php echo esc_url($video_url); ?>"
            class="w-full relative z-10"
            style="max-width:100%; height:auto;"
            data-aiconiq-autoplay autoplay muted playsinline controls
        ></video>
        <svg class="absolute bottom-0" width="1776" height="1" viewBox="0 0 1776 1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.64" d="M0 0.500122L1776 0.499967" stroke="url(#paint0_linear_avs_iv)"/>
            <defs>
                <linearGradient id="paint0_linear_avs_iv" x1="353.5" y1="0.500122" x2="1405" y2="0.500122" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0.16"/>
                    <stop offset="0.519231" stop-color="#FF21B2"/>
                    <stop offset="1" stop-color="white" stop-opacity="0.16"/>
                </linearGradient>
            </defs>
        </svg>
    </div>
</section>
