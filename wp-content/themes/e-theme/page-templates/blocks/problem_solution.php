<?php
/**
 * Block: problem_solution — ChatGPT/RAG/AICONIQ comparison cards + CTA.
 * Mirrors `assets/src/components/sections/problem-and-solution/index.tsx` + AiConiqCard.
 * Count-up percentages dropped — values shown as-is from ACF.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$badge = $data['badge'] ?? '';
$middle_word = $data['middle_word'] ?? '';
$title = $data['title'] ?? '';
$description1 = $data['description1'] ?? '';
$description2 = $data['description2'] ?? '';
$accuracy_text = $data['accuracy_text'] ?? '';
$cta = $data['cta'] ?? null;
$cta_label = is_array($cta) && !empty($cta['label']) ? $cta['label'] : ($lang === 'de' ? 'Mehr erfahren' : 'Learn more');
$cta_href = (is_array($cta) && ($cta['mode'] ?? '') === 'url' && !empty($cta['url']['url'])) ? $cta['url']['url'] : '';
$cta_target = (is_array($cta) && ($cta['mode'] ?? '') === 'url') ? ($cta['url']['target'] ?? '_self') : '_self';
$how_it_works = $data['how_it_works'] ?? '';

$cards = is_array($data['cards'] ?? null) ? $data['cards'] : [];
$card1 = $cards[0] ?? [];
$card2 = $cards[1] ?? [];
$card3 = $cards[2] ?? [];

$check = aiconiq_public_asset('assets/problem/check.svg');
$lines = aiconiq_public_asset('assets/problem/lines.svg');
$fallback_img1 = aiconiq_public_asset('assets/problem/1.webp');
$fallback_img2 = aiconiq_public_asset('assets/problem/2.webp');
$fallback_img3 = aiconiq_public_asset('assets/problem/3.webp');
$fallback_chatgpt = aiconiq_public_asset('assets/problem/chatgpt.svg');
$fallback_rag = aiconiq_public_asset('assets/problem/rag.svg');
$fallback_aiconiq = aiconiq_public_asset('assets/problem/aicoin1.webp');
$ellipse_bottom = aiconiq_public_asset('assets/problem/ellisepbottom.webp');

// Render a single (chatgpt-like / rag-like) comparison card.
$render_card = function (array $card, string $fallback_icon, string $fallback_image, $fallback_features) use ($check, $lines) {
    $clabel = $card['label'] ?? '';
    $cicon = !empty($card['icon']['url']) ? $card['icon']['url'] : $fallback_icon;
    $cimage = !empty($card['image']['url']) ? $card['image']['url'] : $fallback_image;
    $cfeatures = !empty($card['features']) ? $card['features'] : $fallback_features;
    $cql = $card['quality_label'] ?? '';
    $cqv = $card['quality_value'] ?? '';
    ?>
    <div class="border border-[#313131] bg-[#141112] rounded-2xl relative z-10">
        <div class="absolute -top-[20px] sm:-top-[26px] left-1/2 -translate-x-1/2 bg-[#1A1919] border border-[#3A3A3AA3] rounded-full py-2 sm:py-3 px-6 sm:px-8 flex items-center justify-center gap-2">
            <img src="<?php echo esc_url($cicon); ?>" alt="" class="max-w-3 sm:max-w-4" />
            <span class="text-[#F5F1EE] text-[13px] sm:text-[14px] leading-[120%]"><?php echo esc_html($clabel); ?></span>
        </div>
        <img src="<?php echo esc_url($cimage); ?>" alt="" class="w-full" />
        <div class="flex flex-col">
            <?php foreach ($cfeatures as $fi => $feature): ?>
                <div>
                    <div class="bg-[#1D1B1C] items-center pl-4 sm:pl-6 md:pl-8 py-2 sm:py-3 flex gap-2 sm:gap-3">
                        <img src="<?php echo esc_url($check); ?>" alt="" class="w-[20px] sm:w-[24px] flex-shrink-0" />
                        <span class="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[120%]"><?php echo esc_html($feature); ?></span>
                    </div>
                    <?php if ($fi < count($cfeatures) - 1): ?>
                        <div class="w-full h-[0.5px]" style="background: linear-gradient(90deg, rgba(150,150,150,0.16) 0%, rgba(150,150,150,0.5) 100%);"></div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
        <div class="min-h-[120px] sm:min-h-[140px] md:min-h-[151px] relative overflow-hidden w-full p-4 sm:p-5 md:p-6 flex gap-2 sm:gap-3 md:gap-4 items-end justify-between"
             style="background: linear-gradient(87.47deg, rgba(65,65,65,0.24) 31.41%, rgba(32,26,30,0.24) 87.36%, rgba(21,11,17,0.24) 101.12%);">
            <span class="max-w-[100px] sm:max-w-[120px] md:max-w-[131px] w-full uppercase font-medium text-[12px] sm:text-[13px] md:text-[14px] leading-[120%] text-white"><?php echo esc_html($cql); ?></span>
            <span data-aiconiq-countup data-duration="1400" class="text-white font-semibold text-[48px] sm:text-[56px] md:text-[64px] leading-[120%]"><?php echo esc_html($cqv); ?></span>
            <img src="<?php echo esc_url($lines); ?>" class="absolute bottom-0 right-0 max-w-[80px] sm:max-w-[100px] md:max-w-full" alt="" />
        </div>
    </div>
    <?php
};
?>
<section id="solutions" class="flex items-center justify-center px-4 sm:px-6 md:px-8">
    <div class="flex bg-[#141112] relative py-12 overflow-hidden sm:py-16 md:py-20 lg:py-[124px] rounded-[8px] w-full flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[124px] items-center justify-center">

        <div class="flex flex-col gap-6 sm:gap-8 items-center justify-center text-center px-4">
            <?php
            $sh_badge = $badge;
            $sh_middle_word = $middle_word;
            $sh_title = $title;
            $sh_max_width = '1200px';
            include get_template_directory() . '/template-parts/section-header.php';
            unset($sh_badge, $sh_middle_word, $sh_title, $sh_max_width);
            ?>
            <div class="flex flex-col gap-3 sm:gap-4 items-center justify-center text-center max-w-[1044px] w-full">
                <p class="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]"><?php echo esc_html($description1); ?></p>
                <p class="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]"><?php echo esc_html($description2); ?></p>
            </div>
        </div>

        <div class="flex flex-col max-w-[1200px] w-full mx-auto gap-8 sm:gap-10 md:gap-[42px] items-center justify-center px-4">
            <div class="flex flex-col items-center justify-center gap-8 sm:gap-10 md:gap-[53px] w-full">
                <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-4 relative">
                    <?php $render_card($card1, $fallback_chatgpt, $fallback_img1, []); ?>
                    <?php $render_card($card2, $fallback_rag, $fallback_img2, []); ?>

                    <!-- AICONIQ accent card -->
                    <?php
                    $ai_label = $card3['label'] ?? 'AICONIQ';
                    $ai_icon = !empty($card3['icon']['url']) ? $card3['icon']['url'] : $fallback_aiconiq;
                    $ai_image = !empty($card3['image']['url']) ? $card3['image']['url'] : $fallback_img3;
                    $ai_features = !empty($card3['features']) ? $card3['features'] : [];
                    $ai_ql = $card3['quality_label'] ?? '';
                    $ai_qv = $card3['quality_value'] ?? '';
                    ?>
                    <div class="border bg-[#200616] border-[#D8008D] rounded-2xl relative z-10">
                        <div class="absolute -top-[20px] sm:-top-[26px] left-1/2 -translate-x-1/2 bg-[#692351] border border-[#FF21B254] rounded-full py-2 sm:py-3 px-6 sm:px-8 flex items-center justify-center gap-2">
                            <img src="<?php echo esc_url($ai_icon); ?>" alt="" class="max-w-3 sm:max-w-4 rounded-full"
                                 style="backdrop-filter: blur(25.47px); box-shadow: 0px 0.91px 26.1px 7px #FF21B2E0;" />
                            <span class="text-[#F5F1EE] text-[13px] sm:text-[14px] leading-[120%]"><?php echo esc_html($ai_label); ?></span>
                        </div>
                        <img src="<?php echo esc_url($ai_image); ?>" class="rounded-[20px] w-full" alt="" />
                        <div class="flex flex-col">
                            <?php foreach ($ai_features as $fi => $feature): ?>
                                <div>
                                    <div class="bg-[#1D1B1C] items-center px-4 sm:pl-6 md:pl-8 py-2 sm:py-3 flex gap-2 sm:gap-3"
                                         style="background: linear-gradient(89.58deg, rgba(118,22,85,0.06) 32.55%, rgba(230,54,169,0.06) 86.39%, rgba(254,109,203,0.06) 99.63%);">
                                        <img src="<?php echo esc_url($check); ?>" alt="" class="w-[20px] sm:w-[24px] flex-shrink-0" />
                                        <span class="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[120%] flex-1"><?php echo esc_html($feature); ?></span>
                                    </div>
                                    <?php if ($fi < count($ai_features) - 1): ?>
                                        <div class="w-full h-[0.5px]" style="background: linear-gradient(90deg, rgba(150,150,150,0.16) 0%, rgba(150,150,150,0.5) 100%);"></div>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <div class="min-h-[120px] sm:min-h-[140px] md:min-h-[151px] relative overflow-hidden w-full p-4 sm:p-5 md:p-6 flex gap-2 sm:gap-3 md:gap-4 items-end justify-between"
                             style="background: linear-gradient(87.47deg, rgba(94,21,69,0.24) 31.41%, rgba(102,44,82,0.24) 87.36%, rgba(70,34,57,0.24) 101.12%);">
                            <span class="max-w-[100px] sm:max-w-[120px] md:max-w-[131px] w-full uppercase font-medium text-[12px] sm:text-[13px] md:text-[14px] leading-[120%] text-white"><?php echo esc_html($ai_ql); ?></span>
                            <span data-aiconiq-countup data-duration="1800" class="text-gradient font-semibold text-[60px] sm:text-[72px] md:text-[85px] leading-[120%]"><?php echo esc_html($ai_qv); ?></span>
                            <img src="<?php echo esc_url($lines); ?>" class="absolute bottom-0 right-0 max-w-[80px] sm:max-w-[100px] md:max-w-full" alt="" />
                        </div>
                    </div>

                    <img src="<?php echo esc_url($ellipse_bottom); ?>" class="hidden lg:block absolute bottom-[-69%] right-[-31%]" alt="" />
                </div>

                <p class="max-w-[414px] w-full text-white font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%] text-center px-4"><?php echo esc_html($accuracy_text); ?></p>
            </div>

            <div class="flex flex-col gap-8 sm:gap-10 md:gap-[57px] items-center justify-center">
                <?php
                $cb_label = $cta_label;
                $cb_href = $cta_href;
                $cb_target = $cta_target;
                include get_template_directory() . '/template-parts/chat-button.php';
                unset($cb_label, $cb_href, $cb_target);
                ?>
                <span class="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($how_it_works); ?></span>
            </div>
        </div>

        <div class="hidden lg:block absolute top-0 right-[5%] max-w-[700px] w-[678px] h-[1400px]">
            <div style="position:absolute; width:54px; height:799px; left:300px; top:300px; background:#FF21B2; opacity:0.88; filter:blur(150px); border-radius:50%; transform:rotate(-1deg);"></div>
        </div>
    </div>
</section>
