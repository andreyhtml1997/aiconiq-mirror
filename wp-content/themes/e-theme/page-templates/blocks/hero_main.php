<?php
/**
 * Block: hero_main — full-bleed hero with video background, headline, stats.
 * Mirrors `assets/src/components/sections/hero/index.tsx` + HeroHeadline.
 *
 * On the PHP-rendered side this block is meant to render only when explicitly
 * placed into a page's body_blocks. The page-templates/blocks.php dispatcher
 * already renders the inline nav row outside this block, so the embedded
 * logo + Navigation are NOT duplicated here.
 *
 * Animations (count-up stats, sticky-trigger burger lift) dropped per spec.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$main_heading = $data['main_heading'] ?? '';
$we_deliver = $data['we_deliver'] ?? ($lang === 'de' ? 'Wir liefern' : 'We deliver');
$digital_employees = $data['digital_employees'] ?? ($lang === 'de' ? 'digitale Mitarbeiter' : 'digital employees');
$description = $data['description'] ?? '';
$video_url = !empty($data['video']['url']) ? $data['video']['url'] : aiconiq_public_asset('assets/hero/f570a274-optimized.mp4');

$cta = $data['cta'] ?? null;
$cta_label = is_array($cta) && !empty($cta['label'])
    ? $cta['label']
    : ($lang === 'de' ? 'Sprich mit mir' : 'Talk to me');
$cta_href = (is_array($cta) && ($cta['mode'] ?? '') === 'url' && !empty($cta['url']['url'])) ? $cta['url']['url'] : '';
$cta_target = (is_array($cta) && ($cta['mode'] ?? '') === 'url') ? ($cta['url']['target'] ?? '_self') : '_self';

$stats = is_array($data['stats'] ?? null) ? array_slice($data['stats'], 0, 3) : [];

$avatars_src = [];
if (!empty($data['avatars'])) {
    foreach (array_slice($data['avatars'], 0, 3) as $a) {
        if (!empty($a['url'])) $avatars_src[] = $a['url'];
    }
}
if (count($avatars_src) < 3) {
    $avatars_src = [
        aiconiq_public_asset('assets/hero/avatar/avatar1.webp'),
        aiconiq_public_asset('assets/hero/avatar/avatar2.webp'),
        aiconiq_public_asset('assets/hero/avatar/avatar3.webp'),
    ];
}
?>
<section id="home" class="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 pt-3 xs:pt-4 sm:pt-6 justify-center w-full flex" style="min-height: clamp(500px, 80vh, 917px);">
    <div class="bg-color-black p-[1px] rounded-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px] flex w-full">
        <div class="w-full rounded-[20px] xs:rounded-t-[30px] sm:rounded-b-none sm:rounded-t-[35px] bg-black md:rounded-t-[40px] lg:rounded-t-[47px] !flex flex-col justify-between relative overflow-hidden">

            <video
                class="absolute inset-0 w-full h-full object-cover rounded-t-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px]"
                data-aiconiq-autoplay
                loop muted autoplay playsinline
            >
                <source src="<?php echo esc_url($video_url); ?>" type="video/mp4" />
            </video>

            <div class="absolute inset-0 rounded-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px] pointer-events-none z-[1]"
                 style="background: radial-gradient(102.08% 102.07% at 50.73% 0%, rgba(0,0,0,0) 41.02%, #000 95.66%), radial-gradient(80.27% 340.83% at 78.8% 44.85%, rgba(0,0,0,0) 47.54%, #000 100%), linear-gradient(174.81deg, rgba(0,0,0,0.4) 6.08%, rgba(0,0,0,0) 35.58%);"></div>

            <!-- Embed the inline nav row INSIDE the hero so it overlays
                 the video, matching the React Hero behavior. The shared
                 partial protects against duplicate inclusion via a global
                 flag. -->
            <?php get_template_part('template-parts/inline-nav-row'); ?>

            <div class="flex flex-col relative z-10 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 pb-4 xs:pb-6 sm:pb-8 md:pb-10 lg:pb-12" style="gap: clamp(2rem, 8vw, 83px);">
                <div class="flex flex-col xl:flex-row items-start lg:items-end justify-between gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
                    <div class="flex flex-col gap-2 xs:gap-3 sm:gap-4 w-full">
                        <h1 class="leading-[120%] font-medium"
                            style="background: linear-gradient(184.14deg, #FFFFFF 61.8%, #F4DCEC 96.62%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; font-size: clamp(28px, 5vw, 64px);"><?php echo esc_html($main_heading); ?></h1>

                        <!-- Hero headline strip: 3 avatars + "We deliver digital employees" pill -->
                        <div class="flex flex-row items-center gap-2 xs:gap-3 sm:gap-1 w-full">
                            <div class="flex gap-1 xs:gap-2 sm:gap-[12px] md:gap-[16px]">
                                <div class="w-[50px] h-[50px] xs:w-[60px] xs:h-[60px] sm:w-[65px] sm:h-[65px] md:w-[75px] md:h-[75px] lg:w-[83px] lg:h-[83px] rounded-full border-[2px] xs:border-[3px] sm:border-[3px] md:border-[4px] lg:border-[5px] border-[#000] overflow-hidden">
                                    <img src="<?php echo esc_url($avatars_src[0]); ?>" alt="" class="w-full h-full object-cover" />
                                </div>
                                <div class="w-[50px] h-[50px] xs:w-[60px] xs:h-[60px] sm:w-[65px] sm:h-[65px] md:w-[75px] md:h-[75px] lg:w-[83px] lg:h-[83px] rounded-full ml-[-25px] xs:ml-[-30px] sm:ml-[-32px] md:ml-[-38px] lg:ml-[-45px] border-[2px] xs:border-[3px] sm:border-[3px] md:border-[4px] lg:border-[5px] border-[#000] overflow-hidden">
                                    <img src="<?php echo esc_url($avatars_src[1]); ?>" alt="" class="w-full h-full object-cover" />
                                </div>
                                <div class="w-[50px] h-[50px] xs:w-[60px] xs:h-[60px] sm:w-[65px] sm:h-[65px] md:w-[75px] md:h-[75px] lg:w-[83px] lg:h-[83px] rounded-full ml-[-25px] xs:ml-[-30px] sm:ml-[-32px] md:ml-[-38px] lg:ml-[-45px] bg-[#000] p-[2px] xs:p-1 avatar3-shadow overflow-hidden">
                                    <img src="<?php echo esc_url($avatars_src[2]); ?>" alt="" class="avatar-border w-full h-full object-cover" />
                                </div>
                            </div>

                            <div class="gradient-border-mask pr-2 sm:pr-3 max-w-[1105px] w-full !flex items-center gap-2 sm:gap-3 md:gap-4 justify-between py-1 relative rounded-r-full !overflow-hidden flex-1 min-w-0">
                                <div class="overflow-hidden absolute bottom-0 right-0 btn-gradeint-back" style="width: clamp(80px, 15vw, 151px); height: clamp(35px, 8vw, 50px);"></div>
                                <div class="flex items-center gap-[6px] md:gap-[10px] relative whitespace-nowrap flex-shrink min-w-0">
                                    <span class="text-[#FFFFFF] font-medium leading-[120%] truncate" style="font-size: clamp(14px, 3vw, 64px);"><?php echo esc_html($we_deliver); ?></span>
                                    <span class="gradient-text leading-[120%] font-bold truncate" style="font-size: clamp(14px, 3vw, 64px);"><?php echo esc_html($digital_employees); ?></span>
                                </div>
                                <button type="button" class="flex relative items-center btn-shadow justify-center rounded-full bg-[rgba(255,17,172,0.64)] border-[0.5px] border-[#d8008d] flex-shrink-0"
                                        aria-label="Learn more"
                                        data-aiconiq-calendly="https://calendly.com/pg-aiconiq/30min"
                                        style="width: clamp(40px, 7vw, 56px); height: clamp(40px, 7vw, 56px);">
                                    <svg viewBox="0 0 32 32" class="w-[60%] h-[60%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.66669 16H25.3334M25.3334 16L18.6667 9.33334M25.3334 16L18.6667 22.6667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <?php if ($description): ?>
                        <p class="max-w-full lg:max-w-[416px] w-full text-left lg:text-right text-[#FFFFFF8F] leading-[160%]" style="font-size: clamp(13px, 1.2vw, 16px);"><?php echo esc_html($description); ?></p>
                    <?php endif; ?>
                </div>

                <div class="flex flex-col gap-[30px]">
                    <div class="w-full overflow-hidden">
                        <svg width="100%" height="1" viewBox="0 0 1776 1" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="w-full">
                            <path d="M0 0.500122L1776 0.499967" stroke="url(#hero-line-grad)" vector-effect="non-scaling-stroke" />
                            <defs>
                                <linearGradient id="hero-line-grad" x1="0" y1="0.500122" x2="1405" y2="0.500122" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#26272C"/>
                                    <stop offset="1" stop-color="white" stop-opacity="0.16"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 xs:gap-6 sm:gap-7 lg:gap-8">
                        <div class="flex gap-2 xs:gap-3 sm:gap-4">
                            <?php
                            $cb_label = $cta_label;
                            $cb_href = $cta_href;
                            $cb_target = $cta_target;
                            include get_template_directory() . '/template-parts/chat-button.php';
                            unset($cb_label, $cb_href, $cb_target);
                            ?>
                        </div>

                        <?php if (!empty($stats)): ?>
                            <div class="w-full lg:max-w-[806px] flex flex-wrap justify-start lg:justify-end" style="gap: clamp(1.5rem, 5vw, 61px);">
                                <?php foreach ($stats as $s):
                                    $pre = $s['pre_value'] ?? '';
                                    $val = $s['value'] ?? '';
                                    $lbl = $s['label'] ?? '';
                                ?>
                                    <div class="flex flex-col">
                                        <span class="text-[#FFFFFFD9] font-medium leading-[120%]" style="font-size: clamp(18px, 2vw, 28px);">
                                            <?php if ($pre): ?><span><?php echo esc_html($pre); ?> </span><?php endif; ?>
                                            <span data-aiconiq-countup data-duration="2000"><?php echo esc_html($val); ?></span>
                                        </span>
                                        <p class="text-[#FFFFFF8F] leading-[160%]" style="font-size: clamp(11px, 1vw, 14px);"><?php echo esc_html($lbl); ?></p>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
