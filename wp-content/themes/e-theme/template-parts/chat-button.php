<?php
/**
 * Chat button partial — the pill-shaped "Let's talk" CTA used across blocks.
 * Mirrors `assets/src/components/ui/ChatButton.tsx`, hover gradients dropped
 * (animations disabled per spec). Renders as <a> if $cb_href is provided,
 * otherwise as <button> opening Calendly via theme.js.
 *
 * Variables to set before include:
 *   $cb_label        (string)  button text
 *   $cb_href         (string)  optional URL; when set renders <a>
 *   $cb_target       (string)  '_self' or '_blank'
 *   $cb_calendly_url (string)  Calendly popup URL (default: env or pg-aiconiq link)
 */
if (!defined('ABSPATH')) exit;

$label = $cb_label ?? '';
$href = $cb_href ?? '';
$target = $cb_target ?? '_self';
$calendly_url = $cb_calendly_url ?? 'https://calendly.com/pg-aiconiq/30min';

$inner_classes = 'aiconiq-chat-btn bg-[rgba(247,247,249,0.06)] border border-[rgba(255,255,255,0.04)] rounded-[30px] p-[10px] overflow-hidden flex items-center transition-all duration-200 min-w-fit';

ob_start();
?>
<div class="relative w-full">
    <span class="glow" aria-hidden="true"></span>
    <div class="pill bg-gradient-to-b border-[0.5px] border-[#000000] w-full overflow-hidden from-[#28292e] to-[#201f1b] rounded-[70px] px-8 py-[12px] relative">
        <div class="flex items-center justify-center gap-[11px] relative z-10">
            <span class="text-[#f5f1ee] text-[14px] font-medium whitespace-nowrap leading-[1.2]"><?php echo esc_html($label); ?></span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="4" r="3.5" fill="url(#cb-grad-1)" stroke="url(#cb-grad-2)" />
                <defs>
                    <linearGradient id="cb-grad-1" x1="4" y1="0" x2="4" y2="8" gradientUnits="userSpaceOnUse"><stop stop-color="#CC5DB8"/><stop offset="1" stop-color="#C250B7"/></linearGradient>
                    <linearGradient id="cb-grad-2" x1="4" y1="0" x2="4" y2="8" gradientUnits="userSpaceOnUse"><stop stop-color="#F1EBE0"/><stop offset="0.324089" stop-color="#C547AE"/><stop offset="0.772485" stop-color="#AB318D"/><stop offset="1" stop-color="#CF8AB8"/></linearGradient>
                </defs>
            </svg>
        </div>
    </div>
</div>
<?php
$inner = ob_get_clean();

if ($href) {
    printf(
        '<a href="%s" class="%s"%s aria-label="%s">%s</a>',
        esc_url($href),
        esc_attr($inner_classes),
        $target === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : '',
        esc_attr($label),
        $inner
    );
} else {
    printf(
        '<button type="button" class="%s" aria-label="%s" data-aiconiq-calendly="%s">%s</button>',
        esc_attr($inner_classes),
        esc_attr($label),
        esc_url($calendly_url),
        $inner
    );
}
