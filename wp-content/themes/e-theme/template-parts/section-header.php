<?php
/**
 * Section header partial — eyebrow badge + centered heading.
 * Mirrors `assets/src/components/ui/SectionHeader.tsx` + `SectionBadge.tsx`,
 * with framer-motion hover effects intentionally dropped per spec.
 *
 * Pass variables before include:
 *   $sh_badge       (string)         optional eyebrow pill
 *   $sh_title       (string)         heading text. "AICONIQ" segments are bolded.
 *   $sh_middle_word (string|null)    splits badge into "WORD <small> WORD"
 *   $sh_max_width   (string)         CSS max-width for the heading (default 820px)
 *   $sh_text_class  (string)         extra classes on the <h2>
 */
if (!defined('ABSPATH')) exit;

$badge       = $sh_badge       ?? '';
$title       = $sh_title       ?? '';
$middle_word = $sh_middle_word ?? null;
$max_width   = $sh_max_width   ?? '820px';
$text_class  = $sh_text_class  ?? '';

$left_grad = aiconiq_public_asset('assets/button-ellipses/left-gradient.svg');
?>
<div class="flex flex-col gap-[26px] items-center justify-center">
    <?php if ($badge): ?>
        <div class="aiconiq-section-badge p-[1px] max-w-fit flex items-center justify-center w-full rounded-full relative">
            <div class="px-6 z-10 py-2 overflow-hidden gradient-border-mask-badge relative w-full text-center rounded-full !flex items-center justify-center gap-1">
                <img src="<?php echo esc_url($left_grad); ?>" alt="" class="absolute left-[-1px] h-full w-auto" />
                <?php if ($middle_word):
                    $parts = explode(' ', $badge, 2);
                    $first = $parts[0] ?? '';
                    $last  = $parts[1] ?? '';
                ?>
                    <span class="uppercase text-[#FFFFFF] font-medium text-[12px] leading-[20px] relative z-10"><?php echo esc_html($first); ?></span>
                    <span class="uppercase font-medium relative z-10" style="font-size:8px;line-height:20px;letter-spacing:0.08em;color:#FFFFFF7A;"><?php echo esc_html($middle_word); ?></span>
                    <span class="uppercase text-[#FFFFFF] font-medium text-[12px] leading-[20px] relative z-10"><?php echo esc_html($last); ?></span>
                <?php else: ?>
                    <span class="uppercase text-[#FFFFFF] font-medium text-[12px] leading-[20px] relative z-10"><?php echo esc_html($badge); ?></span>
                <?php endif; ?>
            </div>
        </div>
    <?php endif; ?>

    <?php if ($title):
        // Bold every "AICONIQ" occurrence.
        $parts = explode('AICONIQ', $title);
        $rendered = '';
        foreach ($parts as $i => $part) {
            $rendered .= esc_html($part);
            if ($i < count($parts) - 1) {
                $rendered .= '<span class="font-bold">AICONIQ</span>';
            }
        }
    ?>
        <h2
            class="gradient-text font-medium text-[48px] leading-[120%] text-center w-full mx-auto <?php echo esc_attr($text_class); ?>"
            style="max-width: <?php echo esc_attr($max_width); ?>; font-size: clamp(28px, 4vw, 48px);"
        ><?php echo $rendered; ?></h2>
    <?php endif; ?>
</div>
