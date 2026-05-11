<?php
/**
 * Block: consultant_section — avatars + heading + Calendly CTA.
 * Mirrors `assets/src/components/sections/consultant-section.tsx`.
 * framer-motion rotation/glow on hover dropped per spec.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$title = $data['title'] ?? '';
if (!$title) {
    $title = $lang === 'de'
        ? 'Vereinbaren Sie eine kostenlose Beratung'
        : 'Book your free consultation';
}
$button = $data['button'] ?? null;
$btn_label = is_array($button) && !empty($button['label'])
    ? $button['label']
    : ($lang === 'de' ? 'Buchen Sie einen Termin' : 'Book a call');
$btn_href = (is_array($button) && ($button['mode'] ?? '') === 'url' && !empty($button['url']['url'])) ? $button['url']['url'] : '';
$btn_target = (is_array($button) && ($button['mode'] ?? '') === 'url') ? ($button['url']['target'] ?? '_self') : '_self';

$consult_logo = !empty($data['consult_logo']['url']) ? $data['consult_logo']['url'] : aiconiq_public_asset('assets/consultant/consult-logo.webp');
$back_logo = !empty($data['back_logo']['url']) ? $data['back_logo']['url'] : aiconiq_public_asset('assets/consultant/back-logo.svg');

$fallback_avas = [
    aiconiq_public_asset('assets/consultant/ava1.webp'),
    aiconiq_public_asset('assets/consultant/ava2.webp'),
    aiconiq_public_asset('assets/consultant/ava3.webp'),
];
$avatars_src = [];
if (!empty($data['avatars']) && is_array($data['avatars'])) {
    foreach (array_slice($data['avatars'], 0, 3) as $a) {
        if (!empty($a['url'])) $avatars_src[] = $a['url'];
    }
}
if (count($avatars_src) < 3) $avatars_src = $fallback_avas;

$pos_classes = [
    'aiconiq-consultant-ava aiconiq-consultant-ava-1 absolute top-5 left-0 z-10',
    'aiconiq-consultant-ava aiconiq-consultant-ava-2 relative top-3 z-20',
    'aiconiq-consultant-ava aiconiq-consultant-ava-3 absolute top-5 right-0 z-10',
];
?>
<section class="py-10 sm:py-12 md:py-14 lg:py-16 xl:py-[140px]">
    <div class="max-w-[1279px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-[100px] px-4 sm:px-6 md:px-8">
        <div class="max-w-full sm:max-w-[500px] lg:max-w-[548px] w-full relative order-2 lg:order-1">
            <div class="aiconiq-consultant-stack max-w-[508px] items-center justify-center w-full flex relative">
                <span class="aiconiq-consultant-glow" aria-hidden="true"></span>
                <img src="<?php echo esc_url($back_logo); ?>" class="max-w-[250px] md:max-w-[424px] w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" alt="" />
                <?php foreach ($avatars_src as $i => $src): ?>
                    <img src="<?php echo esc_url($src); ?>" class="max-w-[170px] sm:max-w-[220px] w-full <?php echo esc_attr($pos_classes[$i] ?? ''); ?>" alt="" />
                <?php endforeach; ?>
            </div>
        </div>
        <div class="max-w-full lg:max-w-[624px] w-full flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8 items-start order-1 lg:order-2">
            <div class="flex flex-col gap-3 sm:gap-4">
                <img src="<?php echo esc_url($consult_logo); ?>" class="max-w-7 sm:max-w-8 w-full" alt="" />
                <h2 class="font-medium text-[28px] sm:text-[34px] md:text-[40px] lg:text-[48px] leading-[120%] gradient-text"><?php echo esc_html($title); ?></h2>
            </div>
            <?php
            $cb_label = $btn_label;
            $cb_href = $btn_href;
            $cb_target = $btn_target;
            include get_template_directory() . '/template-parts/chat-button.php';
            unset($cb_label, $cb_href, $cb_target);
            ?>
        </div>
    </div>
</section>
