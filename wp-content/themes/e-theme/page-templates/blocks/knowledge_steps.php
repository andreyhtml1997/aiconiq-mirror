<?php
/**
 * Block: knowledge_steps — stack of "knowledge" cards.
 * Mirrors `assets/src/components/sections/knowledge/index.tsx` + KnowledgeCard.
 *
 * Each step alternates left/right layout. The Next.js version draws 4
 * different framer-motion illustrations (card1..card4) per step; since
 * animations are dropped, we render the step's optional video where
 * provided, otherwise an enlarged icon as a placeholder visual.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$steps = is_array($data['steps'] ?? null) ? $data['steps'] : [];
$button = $data['button'] ?? null;
$btn_label = is_array($button) && !empty($button['label']) ? $button['label'] : '';
$btn_href = (is_array($button) && ($button['mode'] ?? '') === 'url' && !empty($button['url']['url'])) ? $button['url']['url'] : '';
$btn_target = (is_array($button) && ($button['mode'] ?? '') === 'url') ? ($button['url']['target'] ?? '_self') : '_self';

$fallback_icons = [
    aiconiq_public_asset('assets/knowledge-img/icon1.svg'),
    aiconiq_public_asset('assets/knowledge-img/icon2.svg'),
    aiconiq_public_asset('assets/knowledge-img/icon3.svg'),
    aiconiq_public_asset('assets/knowledge-img/icon4.svg'),
];
?>
<section id="knowledge-steps" class="pt-10 sm:pt-12 md:pt-14 lg:pt-[58px] pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-[110px]">
    <div class="max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12">

        <?php
        // Static illustrations for each animation_type, mirroring the React
        // card1..card4 components but without their hover/scroll animations.
        // We just render the same artwork composition in its at-rest state.
        $card_assets = [
            'card1' => [
                'top' => aiconiq_public_asset('assets/knowledge-img/charts/top.svg'),
                'middle' => aiconiq_public_asset('assets/knowledge-img/charts/middle.svg'),
                'bottom' => aiconiq_public_asset('assets/knowledge-img/charts/bottom.svg'),
            ],
            'card2' => [
                'highlight' => aiconiq_public_asset('assets/knowledge-img/charts/hightlight.webp'),
                'highlight2' => aiconiq_public_asset('assets/knowledge-img/charts/hightlight2.webp'),
            ],
            'card3' => [
                'avatars' => aiconiq_public_asset('assets/knowledge-img/avatars.webp'),
            ],
            'card4' => [
                'first' => aiconiq_public_asset('assets/knowledge-img/charts/card-4-first.webp'),
                'review' => aiconiq_public_asset('assets/knowledge-img/review-graph.webp'),
                'second' => aiconiq_public_asset('assets/knowledge-img/charts/card-4-second.webp'),
            ],
        ];

        $render_card_visual = function (string $type, string $icon) use ($card_assets) {
            switch ($type) {
                case 'card1':
                    $a = $card_assets['card1']; ?>
                    <div class="kn-card1 relative overflow-hidden w-full min-h-[260px] sm:min-h-[391px]" style="background-color:#271B22;">
                        <div class="flex flex-col gap-[18px] absolute left-1/2 -translate-x-1/2" style="top:-93.5px;">
                            <div class="kn-row kn-row-top    flex items-center justify-center" style="width:923px;height:187px;"><img src="<?php echo esc_url($a['top']); ?>" alt="" /></div>
                            <div class="kn-row kn-row-mid    flex items-center justify-center" style="width:923px;height:187px;"><img src="<?php echo esc_url($a['middle']); ?>" alt="" /></div>
                            <div class="kn-row kn-row-bottom flex items-center justify-center" style="width:923px;height:187px;"><img src="<?php echo esc_url($a['bottom']); ?>" alt="" /></div>
                        </div>
                    </div>
                    <?php break;
                case 'card2':
                    $a = $card_assets['card2'];
                    // Three labelled "Trigger" cards arranged in a Z (top-right,
                    // middle-left, bottom-right) connected by pink lines.
                    $card2_rows = [
                        ['label' => 'Check connections',     'icon' => 'search',    'pos' => 'top-[26px] right-[40px]'],
                        ['label' => 'Identify contradictions','icon' => 'activity','pos' => 'top-1/2 -translate-y-1/2 left-[40px]'],
                        ['label' => 'Validate knowledge',    'icon' => 'check',     'pos' => 'bottom-[26px] right-[40px]'],
                    ];
                    ?>
                    <div class="kn-card2 relative overflow-hidden w-full min-h-[260px] sm:min-h-[391px]" style="background-color:#271B22;">
                        <img src="<?php echo esc_url($a['highlight']); ?>" alt="" class="absolute top-0 left-0 pointer-events-none" />
                        <img src="<?php echo esc_url($a['highlight2']); ?>" alt="" class="absolute top-0 right-0 pointer-events-none" />

                        <!-- Connecting pink lines between the three trigger rows -->
                        <svg class="absolute inset-0 w-full h-full pointer-events-none z-[3]" viewBox="0 0 525 391" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" fill="none">
                            <path class="kn-card2-line" d="M 360 60 L 360 130 L 200 130 L 200 200" stroke="url(#kn-card2-grad)" stroke-width="1.2" stroke-linecap="round" />
                            <path class="kn-card2-line" d="M 200 220 L 200 280 L 360 280 L 360 340" stroke="url(#kn-card2-grad)" stroke-width="1.2" stroke-linecap="round" />
                            <defs>
                                <linearGradient id="kn-card2-grad" x1="0" y1="0" x2="0" y2="391" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#FF21B2" stop-opacity="0.16"/>
                                    <stop offset="0.5" stop-color="#FF21B2" stop-opacity="0.7"/>
                                    <stop offset="1" stop-color="#FF21B2" stop-opacity="0.16"/>
                                </linearGradient>
                            </defs>
                        </svg>

                        <!-- "Empty cards" slide in from four edges on hover. -->
                        <?php
                        $empty_card_html = '<div class="flex gap-2 items-center w-full">
                            <div class="bg-[#FF21B214] rounded-sm flex-shrink-0" style="width:35.565px;height:35.565px;"></div>
                            <div class="bg-[#2B1F27] flex-shrink-0" style="width:0.961px;height:35.565px;"></div>
                            <div class="flex flex-col justify-between flex-1" style="height:35.565px;">
                                <p class="text-white font-medium opacity-[0.56]" style="font-size:9.612px;">Trigger</p>
                                <div class="bg-[#2B1F27] rounded-sm" style="height:13.457px;width:100%;"></div>
                            </div>
                        </div>';
                        ?>
                        <div class="kn-empty kn-empty-top absolute top-[-35px] right-0 z-[2]" aria-hidden="true"><?php echo $empty_card_html; ?></div>
                        <div class="kn-empty kn-empty-bottom absolute bottom-[-35px] right-5 z-[2]" aria-hidden="true"><?php echo $empty_card_html; ?></div>
                        <div class="kn-empty kn-empty-left absolute top-1/2 -translate-y-1/2 left-[-15%] z-[2]" aria-hidden="true"><?php echo $empty_card_html; ?></div>
                        <div class="kn-empty kn-empty-right absolute bottom-[20%] right-[-15%] z-[2]" aria-hidden="true"><?php echo $empty_card_html; ?></div>

                        <!-- Three real "Trigger" rows with icon + label -->
                        <?php foreach ($card2_rows as $row):
                            $icon_svg = '';
                            switch ($row['icon']) {
                                case 'search':
                                    $icon_svg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
                                    break;
                                case 'activity':
                                    $icon_svg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>';
                                    break;
                                case 'check':
                                    $icon_svg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                                    break;
                            }
                        ?>
                            <div class="kn-row-card absolute <?php echo esc_attr($row['pos']); ?> flex items-center gap-3 px-3 py-2 z-[5]" style="width:210px;">
                                <div class="kn-row-thumb flex items-center justify-center text-white/50 rounded-sm flex-shrink-0" style="width:35.565px;height:35.565px;"><?php echo $icon_svg; ?></div>
                                <div class="bg-[#2B1F27] flex-shrink-0" style="width:0.961px;height:35.565px;"></div>
                                <div class="flex flex-col justify-between flex-1 min-w-0" style="height:35.565px;">
                                    <p class="text-white font-medium opacity-[0.56] truncate" style="font-size:9.612px;">Trigger</p>
                                    <p class="text-white font-medium truncate" style="font-size:11px;line-height:13px;"><?php echo esc_html($row['label']); ?></p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <?php break;
                case 'card3':
                    $a = $card_assets['card3']; ?>
                    <div class="kn-card3 relative overflow-hidden flex items-center w-full min-h-[260px] sm:min-h-[391px]" style="background-color:#271B22;">
                        <div class="kn-avatars-wrap rounded-xl p-[14px] flex items-center overflow-hidden absolute"
                             style="background:#161014; border:1px solid; border-image:linear-gradient(270deg, rgba(255,33,178,0) 0%, #FF21B2 50%, rgba(255,33,178,0) 100%) 1; left:50px;">
                            <img src="<?php echo esc_url($a['avatars']); ?>" alt="" class="kn-avatars" style="min-width:1105px;max-width:1105px;" />
                        </div>
                    </div>
                    <?php break;
                case 'card4':
                    $a = $card_assets['card4']; ?>
                    <div class="kn-card4 relative overflow-hidden flex items-center w-full min-h-[260px] sm:min-h-[391px]" style="background-color:#271B22;">
                        <img src="<?php echo esc_url($a['first']); ?>" alt="" class="kn-img-first" />
                        <img src="<?php echo esc_url($a['second']); ?>" alt="" class="kn-img-second absolute inset-0" />
                        <div class="absolute bottom-0 right-0 max-w-[305px]">
                            <img src="<?php echo esc_url($a['review']); ?>" alt="" class="kn-review w-full" style="filter:blur(4px);" />
                        </div>
                    </div>
                    <?php break;
                default: ?>
                    <div class="flex items-center justify-center w-full min-h-[260px] sm:min-h-[391px] bg-black/30">
                        <img src="<?php echo esc_url($icon); ?>" alt="" class="max-w-[200px] w-2/3 opacity-60" />
                    </div>
                    <?php
            }
        };
        ?>

        <?php foreach ($steps as $index => $step):
            $icon = !empty($step['icon']['url']) ? $step['icon']['url'] : ($fallback_icons[$index] ?? $fallback_icons[0]);
            $title = $step['title'] ?? '';
            $description = $step['description'] ?? '';
            $animation_type = $step['animation_type'] ?? 'card1';
            $video_url = !empty($step['video']['url']) ? $step['video']['url'] : '';
            $reverse = ($index % 2) !== 0;
            $is_video = $animation_type === 'video' && $video_url;
            $direction = $reverse ? 'lg:flex-row-reverse' : 'lg:flex-row';
        ?>
            <div class="bg-[#141112] border border-[#FF21B214] rounded-xl sm:rounded-2xl flex flex-col <?php echo esc_attr($direction); ?> gap-0 lg:gap-4 overflow-hidden">
                <div class="flex flex-col gap-4 justify-between w-full p-4 sm:p-5 md:p-6 lg:p-8">
                    <?php if ($is_video): ?>
                        <img src="<?php echo esc_url($icon); ?>" alt="" class="h-[75px] w-auto object-contain" />
                    <?php else:
                        $bi_icon = $icon;
                        include get_template_directory() . '/template-parts/badge-icon.php';
                        unset($bi_icon);
                    endif; ?>
                    <div class="flex flex-col gap-3 sm:gap-4">
                        <h3 class="text-[#FFFFFF] font-semibold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] leading-[110%] sm:leading-[100%]"><?php echo esc_html($title); ?></h3>
                        <p class="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($description); ?></p>
                    </div>
                </div>
                <div class="w-full lg:max-w-[547px] min-h-[200px] sm:min-h-[391px]">
                    <?php if ($video_url): ?>
                        <video src="<?php echo esc_url($video_url); ?>" class="w-full h-full object-cover" data-aiconiq-autoplay autoplay muted playsinline controls></video>
                    <?php else:
                        $render_card_visual($animation_type, $icon);
                    endif; ?>
                </div>
            </div>
        <?php endforeach; ?>

        <?php if ($btn_label): ?>
            <div class="mt-4 self-center">
                <?php
                $cb_label = $btn_label;
                $cb_href = $btn_href;
                $cb_target = $btn_target;
                include get_template_directory() . '/template-parts/chat-button.php';
                unset($cb_label, $cb_href, $cb_target);
                ?>
            </div>
        <?php endif; ?>
    </div>
</section>
