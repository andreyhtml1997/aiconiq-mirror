<?php
/**
 * Block: auto_vs_cards — Automation vs Collaboration comparison.
 * Mirrors `assets/src/components/sections/autovsteamwork/index.tsx`.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$badge = $data['badge'] ?? '';
$middle_word = $data['middle_word'] ?? '';
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$a = is_array($data['automation'] ?? null) ? $data['automation'] : [];
$c = is_array($data['collaboration'] ?? null) ? $data['collaboration'] : [];

$check_icon = aiconiq_public_asset('assets/problem/check.svg');
$lines_icon = aiconiq_public_asset('assets/lines.svg');
$auto_icon = !empty($a['result_icon']['url']) ? $a['result_icon']['url'] : aiconiq_public_asset('assets/auto/icon1.webp');

// Title split: first word bold, rest regular.
$title_words = preg_split('/\s+/', trim($title), 2);
$title_first = $title_words[0] ?? '';
$title_rest = $title_words[1] ?? '';

$cc_cta = is_array($c['cta'] ?? null) ? $c['cta'] : null;
$cc_label = is_array($cc_cta) && !empty($cc_cta['label']) ? $cc_cta['label'] : ($lang === 'de' ? 'Mehr erfahren' : 'Learn more');
$cc_href = (is_array($cc_cta) && ($cc_cta['mode'] ?? '') === 'url' && !empty($cc_cta['url']['url'])) ? $cc_cta['url']['url'] : '';
$cc_target = (is_array($cc_cta) && ($cc_cta['mode'] ?? '') === 'url') ? ($cc_cta['url']['target'] ?? '_self') : '_self';
?>
<section class="py-12 sm:py-16 md:py-20 lg:py-24 flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[100px]">
    <div class="flex flex-col gap-6 sm:gap-8 items-center justify-center text-center max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8">
        <?php
        $sh_badge = $badge;
        $sh_middle_word = $middle_word;
        $sh_title = '';
        include get_template_directory() . '/template-parts/section-header.php';
        unset($sh_badge, $sh_middle_word, $sh_title);
        ?>
        <h2 class="gradient-text font-medium text-[48px] leading-[120%] text-center w-full mx-auto" style="font-size: clamp(28px, 4vw, 48px);">
            <span class="font-bold"><?php echo esc_html($title_first); ?></span>
            <?php if ($title_rest): ?> <span><?php echo esc_html($title_rest); ?></span><?php endif; ?>
        </h2>
        <?php if ($description): ?>
            <p class="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%] max-w-[1063px]"><?php echo esc_html($description); ?></p>
        <?php endif; ?>
    </div>

    <div class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 justify-center flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12">

        <!-- Automation -->
        <div class="aiconiq-card-lift bg-[#141112] max-w-full lg:max-w-[545px] w-full items-start rounded-[16px] border border-[#FF21B214] p-2 flex flex-col gap-4">
            <div class="p-2 flex flex-col gap-6 sm:gap-8 h-full items-start">
                <?php if (!empty($a['badge'])): ?>
                    <div class="py-1 !flex px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
                        <span class="gradient-text text-[16px] leading-[160%]"><?php echo esc_html($a['badge']); ?></span>
                    </div>
                <?php endif; ?>
                <h2 class="text-white font-semibold text-[22px] sm:text-[24px] md:text-[28px] leading-[120%]"><?php echo esc_html($a['heading'] ?? ''); ?></h2>
                <p class="text-[#FFFFFF8F] text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($a['description'] ?? ''); ?></p>
                <div class="w-full border-t border-[#281A23]"></div>
                <div class="p-2 flex flex-col gap-3 sm:gap-4">
                    <h3 class="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]"><?php echo esc_html($a['use_cases_title'] ?? ''); ?></h3>
                    <div class="flex flex-col gap-3 sm:gap-4">
                        <?php foreach (($a['use_cases'] ?? []) as $uc): ?>
                            <div class="pl-2 flex gap-3 items-start">
                                <img src="<?php echo esc_url($check_icon); ?>" alt="" class="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5" />
                                <span class="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1"><?php echo esc_html($uc); ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="bg-[#FF21B20A] mt-auto rounded-[8px] border border-[#FF21B20A] p-2 flex flex-col w-full">
                    <div class="rounded-[4px] py-2 sm:py-3 flex items-center justify-center w-full gap-4"
                         style="background: linear-gradient(89.58deg, rgba(118,22,85,0.06) 32.55%, rgba(230,54,169,0.06) 86.39%, rgba(254,109,203,0.06) 99.63%);">
                        <span class="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]"><?php echo esc_html($a['example_title'] ?? ''); ?></span>
                    </div>
                    <div class="py-6 sm:py-8 px-3 sm:px-4">
                        <p class="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]"><?php echo esc_html($a['example_p1'] ?? ''); ?> </p>
                        <br />
                        <p class="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]"><?php echo esc_html($a['example_p2'] ?? ''); ?></p>
                    </div>
                    <div class="rounded-[4px] relative overflow-hidden p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
                         style="border: 0.5px solid transparent; background: linear-gradient(#FF21B20A, #FF21B20A) padding-box, linear-gradient(90deg, rgba(179,77,143,0) 0%, rgba(179,77,143,0.16) 100%) border-box;">
                        <img src="<?php echo esc_url($lines_icon); ?>" class="absolute top-0 right-0 hidden sm:block" alt="" />
                        <div class="flex flex-col gap-3 sm:gap-4">
                            <img src="<?php echo esc_url($auto_icon); ?>" alt="" class="max-w-[60px] sm:max-w-[75px] w-full" />
                            <span class="text-[#FFFFFF] font-medium text-[13px] sm:text-[14px] leading-[120%]"><?php echo esc_html($a['result_label'] ?? ''); ?></span>
                        </div>
                        <div class="w-full flex flex-col sm:flex-row gap-3 sm:gap-0">
                            <span class="text-[#FFFFFF] flex font-semibold text-[60px] sm:text-[80px] md:text-[100.24px] leading-[120%]">
                                <span data-aiconiq-countup data-duration="800"><?php echo esc_html($a['result_value'] ?? ''); ?></span>
                                <span class="text-gradient">%</span>
                            </span>
                            <div class="sm:p-3">
                                <p class="text-[#FFFFFF8F] font-medium text-[15px] sm:text-[16px] md:text-[18px] leading-[160%]"><?php echo esc_html($a['result_description'] ?? ''); ?></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Collaboration -->
        <div class="aiconiq-card-lift bg-[#141112] max-w-full lg:max-w-[545px] w-full items-start rounded-[16px] border border-[#FF21B214] p-2 flex flex-col gap-4">
            <div class="p-2 flex flex-col gap-6 sm:gap-8 items-start h-full">
                <?php if (!empty($c['badge'])): ?>
                    <div class="py-1 !flex px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
                        <span class="gradient-text text-[16px] leading-[160%]"><?php echo esc_html($c['badge']); ?></span>
                    </div>
                <?php endif; ?>
                <h2 class="text-white font-semibold text-[22px] sm:text-[24px] md:text-[28px] leading-[120%]"><?php echo esc_html($c['heading'] ?? ''); ?></h2>
                <p class="text-[#FFFFFF8F] text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($c['description'] ?? ''); ?></p>
                <div class="w-full border-t border-[#281A23]"></div>
                <div class="p-2 flex flex-col gap-3 sm:gap-4">
                    <h3 class="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]"><?php echo esc_html($c['use_cases_title'] ?? ''); ?></h3>
                    <div class="flex flex-col gap-3 sm:gap-4">
                        <?php foreach (($c['use_cases'] ?? []) as $uc): ?>
                            <div class="pl-2 flex gap-3 items-start">
                                <img src="<?php echo esc_url($check_icon); ?>" alt="" class="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5" />
                                <span class="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1"><?php echo esc_html($uc); ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="bg-[#FF21B20A] mt-auto rounded-[8px] border border-[#FF21B20A] p-2 flex flex-col">
                    <div class="rounded-[4px] py-2 sm:py-3 flex items-center justify-center w-full gap-4"
                         style="background: linear-gradient(89.58deg, rgba(118,22,85,0.06) 32.55%, rgba(230,54,169,0.06) 86.39%, rgba(254,109,203,0.06) 99.63%);">
                        <span class="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]"><?php echo esc_html($c['example_title'] ?? ''); ?></span>
                    </div>
                    <div class="py-6 sm:py-8 px-3 sm:px-4">
                        <p class="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]"><?php echo esc_html($c['example_paragraph'] ?? ''); ?></p>
                    </div>
                    <div class="rounded-[4px] relative items-start overflow-hidden p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
                         style="border: 0.5px solid transparent; background: linear-gradient(#FF21B20A, #FF21B20A) padding-box, linear-gradient(90deg, rgba(179,77,143,0) 0%, rgba(179,77,143,0.16) 100%) border-box;">
                        <img src="<?php echo esc_url($lines_icon); ?>" class="absolute top-0 right-0 hidden sm:block" alt="" />
                        <div class="flex flex-col gap-2 sm:gap-3">
                            <span class="text-[#FFFFFF] font-medium text-[13px] sm:text-[14px] leading-[120%]"><?php echo esc_html($c['conclusion_title'] ?? ''); ?></span>
                        </div>
                        <p class="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($c['conclusion_text'] ?? ''); ?></p>
                        <?php
                        $cb_label = $cc_label;
                        $cb_href = $cc_href;
                        $cb_target = $cc_target;
                        include get_template_directory() . '/template-parts/chat-button.php';
                        unset($cb_label, $cb_href, $cb_target);
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
