<?php
/**
 * Block: testimonials — heading + customer testimonial card(s) with video.
 * Mirrors `assets/src/components/sections/testimonials/index.tsx`, which
 * just reuses KnowledgeCard with animationType='video'. Since this is
 * usually a single item, no slider is needed; multiple items stack.
 */
if (!defined('ABSPATH')) exit;

/** @var array $data */
$lang = aiconiq_current_lang();
$badge = $data['badge'] ?? 'Testimonials';
$title = $data['title'] ?? 'Testimonials';
$items = is_array($data['items'] ?? null) ? $data['items'] : [];

$gradient_line = aiconiq_public_asset('assets/gradient-line.webp');
?>
<section id="testimonials" class="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[110px]">
    <img src="<?php echo esc_url($gradient_line); ?>" alt="" class="mx-auto" />

    <div class="max-w-[1280px] mt-20 w-full mx-auto flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 px-4 sm:px-6 md:px-8">
        <div class="max-w-full lg:max-w-[1036px] w-full flex flex-col gap-6 sm:gap-7 md:gap-8">
            <?php
            $sh_badge = $badge;
            $sh_title = $title;
            $sh_max_width = '100%';
            $sh_text_class = '!mx-0 !text-left';
            ob_start();
            include get_template_directory() . '/template-parts/section-header.php';
            $hdr = ob_get_clean();
            echo str_replace('items-center justify-center', 'items-start justify-start text-left', $hdr);
            unset($sh_badge, $sh_title, $sh_max_width, $sh_text_class);
            ?>

            <?php foreach ($items as $i => $item):
                $name = $item['name'] ?? '';
                $description = $item['description'] ?? '';
                $icon_url = !empty($item['icon']['url']) ? $item['icon']['url'] : '';
                $video_url = !empty($item['video']['url']) ? $item['video']['url'] : '';
                $reverse = !empty($item['reverse']);
                $direction = $reverse ? 'lg:flex-row-reverse' : 'lg:flex-row';
            ?>
                <div class="bg-[#141112] border border-[#FF21B214] rounded-xl sm:rounded-2xl flex flex-col <?php echo esc_attr($direction); ?> gap-0 lg:gap-4 overflow-hidden">
                    <div class="flex flex-col gap-4 justify-between w-full p-4 sm:p-5 md:p-6 lg:p-8">
                        <?php if ($icon_url): ?>
                            <img src="<?php echo esc_url($icon_url); ?>" alt="" class="h-[75px] w-auto object-contain" />
                        <?php endif; ?>
                        <div class="flex flex-col gap-3 sm:gap-4">
                            <h3 class="text-[#FFFFFF] font-semibold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] leading-[110%] sm:leading-[100%]"><?php echo esc_html($name); ?></h3>
                            <p class="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]"><?php echo esc_html($description); ?></p>
                        </div>
                    </div>
                    <div class="w-full lg:max-w-[547px] min-h-[200px] sm:min-h-[391px] flex items-center justify-center bg-black/30">
                        <?php if ($video_url): ?>
                            <video src="<?php echo esc_url($video_url); ?>" class="w-full h-full object-cover" data-aiconiq-autoplay autoplay muted playsinline controls></video>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
