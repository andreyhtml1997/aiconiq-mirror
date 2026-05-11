<?php
/**
 * Block: security — heading + card list with sticky image that swaps as you scroll.
 * Mirrors `assets/src/components/sections/security/index.tsx` and SecurityCard.
 * Sticky image swap implemented in theme.js via IntersectionObserver
 * (`initSecurityScroll`).
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$badge = $data['badge'] ?? '';
$title = $data['title'] ?? '';
$description1 = $data['description1'] ?? '';
$description2 = $data['description2'] ?? '';
$cards = is_array($data['cards'] ?? null) ? $data['cards'] : [];

$gradient_line = aiconiq_public_asset('assets/gradient-line.webp');
$fallback_imgs = [
    aiconiq_public_asset('assets/security/card1.webp'),
    aiconiq_public_asset('assets/security/card2.webp'),
    aiconiq_public_asset('assets/security/card3.webp'),
    aiconiq_public_asset('assets/security/card4.webp'),
    aiconiq_public_asset('assets/security/card5.webp'),
];

$first_image = '';
if (!empty($cards)) {
    $first_image = !empty($cards[0]['image']['url']) ? $cards[0]['image']['url'] : $fallback_imgs[0];
}
?>
<section data-aiconiq-security class="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[80px]">
    <img src="<?php echo esc_url($gradient_line); ?>" alt="" class="mx-auto" />

    <div class="max-w-[1280px] mt-20 w-full mx-auto flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 px-4 sm:px-6 md:px-8">
        <div class="max-w-full lg:max-w-[1036px] w-full flex flex-col gap-6 sm:gap-7 md:gap-8">
            <div class="flex flex-col gap-[26px] items-start justify-start text-left w-full">
                <?php if ($badge): ?>
                    <div class="p-[1px] max-w-fit flex items-center justify-center rounded-full relative">
                        <div class="px-6 z-10 py-2 overflow-hidden gradient-border-mask-badge relative w-full text-center rounded-full !flex items-center justify-center gap-1">
                            <img src="<?php echo esc_url(aiconiq_public_asset('assets/button-ellipses/left-gradient.svg')); ?>" alt="" class="absolute left-[-1px] h-full w-auto" />
                            <span class="uppercase text-[#FFFFFF] font-medium text-[12px] leading-[20px] relative z-10"><?php echo esc_html($badge); ?></span>
                        </div>
                    </div>
                <?php endif; ?>
                <?php if ($title):
                    $title_parts = explode('AICONIQ', $title);
                    $title_html = '';
                    foreach ($title_parts as $i => $p) {
                        $title_html .= esc_html($p);
                        if ($i < count($title_parts) - 1) $title_html .= '<span class="font-bold">AICONIQ</span>';
                    }
                ?>
                    <h2 class="gradient-text font-medium leading-[120%] text-left mx-0" style="font-size: clamp(28px, 4vw, 48px);"><?php echo $title_html; ?></h2>
                <?php endif; ?>
            </div>

            <div class="flex flex-col gap-2 sm:gap-3">
                <?php if ($description1): ?>
                    <p class="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]"><?php echo esc_html($description1); ?></p>
                <?php endif; ?>
                <?php if ($description2): ?>
                    <p class="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]"><?php echo esc_html($description2); ?></p>
                <?php endif; ?>
            </div>
        </div>

        <!-- Desktop layout: cards on left, sticky image on right -->
        <div class="hidden lg:flex w-full items-start justify-between gap-12 relative">
            <div data-security-cards class="flex flex-col w-auto">
                <?php foreach ($cards as $i => $card):
                    $ctitle = $card['title'] ?? '';
                    $cdesc = $card['description'] ?? '';
                    $cbadge = $card['badge'] ?? '';
                    $chigh = $card['highlight'] ?? '';
                    $cimg = !empty($card['image']['url']) ? $card['image']['url'] : ($fallback_imgs[$i] ?? $fallback_imgs[0]);
                ?>
                    <article
                        data-security-card
                        data-image="<?php echo esc_url($cimg); ?>"
                        class="max-w-[519px] w-full flex flex-col gap-5 sm:gap-6 md:gap-8 min-h-[680px] py-0 justify-center"
                    >
                        <h3 class="gradient-text font-semibold text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-[120%]"><?php echo esc_html($ctitle); ?></h3>
                        <p class="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($cdesc); ?></p>
                        <?php if ($cbadge && $chigh): ?>
                            <div class="bg-[#1A1317] rounded-[8px] p-4 sm:p-5 md:p-6 items-start flex flex-col gap-3 sm:gap-4">
                                <div class="py-1 !flex px-3 sm:px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
                                    <span class="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($cbadge); ?></span>
                                </div>
                                <p class="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($chigh); ?></p>
                            </div>
                        <?php endif; ?>
                    </article>
                <?php endforeach; ?>
            </div>
            <div class="max-w-[519px] !sticky top-10 w-full p-2 self-start">
                <div class="w-full rounded-[16px] p-[1px]" style="background: linear-gradient(180deg, #D8008D 0%, rgba(216, 0, 141, 0) 100%);">
                    <div class="w-full h-full rounded-[16px] overflow-hidden bg-black">
                        <img data-security-active src="<?php echo esc_url($first_image); ?>" alt="" class="w-full h-auto" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile layout: image stacked below each card -->
        <div class="flex lg:hidden flex-col w-full gap-10 sm:gap-12">
            <?php foreach ($cards as $i => $card):
                $ctitle = $card['title'] ?? '';
                $cdesc = $card['description'] ?? '';
                $cbadge = $card['badge'] ?? '';
                $chigh = $card['highlight'] ?? '';
                $cimg = !empty($card['image']['url']) ? $card['image']['url'] : ($fallback_imgs[$i] ?? $fallback_imgs[0]);
            ?>
                <div class="flex flex-col gap-6 sm:gap-8 w-full">
                    <div class="flex flex-col gap-5 sm:gap-6 md:gap-8">
                        <h3 class="gradient-text font-semibold text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-[120%]"><?php echo esc_html($ctitle); ?></h3>
                        <p class="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($cdesc); ?></p>
                        <?php if ($cbadge && $chigh): ?>
                            <div class="bg-[#1A1317] rounded-[8px] p-4 sm:p-5 md:p-6 items-start flex flex-col gap-3 sm:gap-4">
                                <div class="py-1 !flex px-3 sm:px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
                                    <span class="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($cbadge); ?></span>
                                </div>
                                <p class="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($chigh); ?></p>
                            </div>
                        <?php endif; ?>
                    </div>
                    <div class="max-w-full sm:max-w-[600px] mx-auto w-full border border-[#D8008D] rounded-[12px] sm:rounded-[16px] overflow-hidden">
                        <img src="<?php echo esc_url($cimg); ?>" alt="" class="w-full h-auto" />
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
