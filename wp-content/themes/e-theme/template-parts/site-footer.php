<?php
/**
 * Site footer for PHP-rendered pages — mirrors `components/layout/footer.tsx`.
 */

if (!defined('ABSPATH')) {
    exit;
}

$lang = aiconiq_current_lang();
$data = aiconiq_get_footer_data($lang);
$nav_items = function_exists('aiconiq_menu_items') ? aiconiq_menu_items('footer') : [];
if (empty($nav_items)) {
    $nav_items = function_exists('aiconiq_menu_items') ? aiconiq_menu_items('primary') : [];
}

$current_path = rtrim((string) ($_SERVER['REQUEST_URI'] ?? ''), '/');
$current_page_id = (int) (get_queried_object_id() ?: 0);
$path_no_lang = preg_replace('#^/(en|de)#', '', $current_path) ?: '/';
$en_url = '/en' . $path_no_lang;
$de_url = '/de' . $path_no_lang;

$is_active_footer = function (array $item) use ($current_path, $current_page_id, $lang) {
    if (!empty($item['object']) && $item['object'] === 'page' && $current_page_id) {
        if ((int) ($item['object_id'] ?? 0) === $current_page_id) return true;
    }
    $url = $item['url'] ?? '';
    $path = preg_replace('#\?.*$#', '', $url);
    $path = rtrim((string) explode('#', $path)[0], '/');
    if ($path) {
        if ($path === $current_path) return true;
        $stripped = preg_replace('#^/(en|de)/page/#', '/$1/', $path);
        if ($stripped === $current_path) return true;
    }
    $is_root = $current_path === '' || $current_path === "/$lang" || $current_path === '/';
    $is_home_anchor = ($url === '#home' || (substr($url, -5) === '#home'));
    $is_root_link = !$path && strpos($url, '#') === false;
    return $is_root && ($is_home_anchor || $is_root_link);
};

$logo_src = !empty($data['logo']['url']) ? $data['logo']['url'] : aiconiq_public_asset('assets/footer/aiconiq-logo-purple.svg');
$big_logo_src = !empty($data['big_logo']['url']) ? $data['big_logo']['url'] : aiconiq_public_asset('assets/footer/AICONIQ.svg');
$description = $data['description'] ?: ($lang === 'de'
    ? 'AICONIQ entwickelt KI-Lösungen für mittelständische Unternehmen — um die Wettbewerbsfähigkeit unseres Industriestandorts zu erhalten.'
    : 'AICONIQ develops AI solutions for medium-sized businesses - to maintain the competitiveness of our industrial location.');
$email = $data['email'] ?: 'contact@aiconiq.io';
$social_label = $data['social_label'] ?: ($lang === 'de' ? 'Soziales' : 'Social');
$links_label = $data['links_label'] ?: ($lang === 'de' ? 'Links' : 'Links');

$socials = !empty($data['socials']) ? $data['socials'] : [
    ['name' => 'Linkedin', 'url' => 'https://www.linkedin.com/company/aiconiq-group/posts/'],
];
$footer_links = !empty($data['links']) ? $data['links'] : [
    ['name' => ($lang === 'de' ? 'Impressum' : 'Impressum'), 'url' => "/$lang/imprint"],
    ['name' => 'Terms of Use', 'url' => 'https://aiconiq.io/ds.pdf'],
];
?>

<footer class="w-full pt-12 sm:pt-16 md:pt-20 lg:pt-[96px] px-4 sm:px-6 md:px-8 pb-8 sm:pb-10 md:pb-12">
    <div class="max-w-[1280px] w-full mx-auto flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[103px]">
        <div class="flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[163px] w-full">

            <!-- Top row: logo + nav -->
            <div class="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
                <img src="<?php echo esc_url($logo_src); ?>" class="w-full" style="max-width: clamp(180px, 30vw, 263px);" alt="" />
                <div class="flex w-full md:w-auto items-center gap-2 md:gap-4 flex-wrap">
                    <?php if (!empty($nav_items)): ?>
                        <nav class="flex items-center overflow-x-auto md:overflow-visible">
                            <?php foreach ($nav_items as $item): $active = $is_active_footer($item); ?>
                                <a
                                    href="<?php echo esc_url($item['url']); ?>"
                                    <?php if (!empty($item['target']) && $item['target'] === '_blank') echo 'target="_blank" rel="noopener noreferrer"'; ?>
                                    class="flex items-center justify-center px-2 py-1.5 md:px-4 md:py-1.5 transition-all border-b <?php echo $active ? 'border-[#d8008d]' : 'border-transparent hover:border-white/20'; ?>"
                                ><p class="font-medium text-white whitespace-nowrap leading-normal text-[14px] md:text-base"><?php echo esc_html($item['label']); ?></p></a>
                            <?php endforeach; ?>
                        </nav>
                    <?php endif; ?>
                    <!-- Lang switcher EN|DE in footer -->
                    <div class="flex items-center px-2 py-1.5 md:px-4 md:py-1.5 text-white">
                        <?php if ($lang === 'en'): ?>
                            <span class="font-semibold opacity-100">EN</span>
                        <?php else: ?>
                            <a href="<?php echo esc_url($en_url); ?>" class="opacity-60 hover:opacity-100 transition-opacity">EN</a>
                        <?php endif; ?>
                        <span class="opacity-50 mx-0.5"> | </span>
                        <?php if ($lang === 'de'): ?>
                            <span class="font-semibold opacity-100">DE</span>
                        <?php else: ?>
                            <a href="<?php echo esc_url($de_url); ?>" class="opacity-60 hover:opacity-100 transition-opacity">DE</a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Middle row: scroll-to-top button + contact column -->
            <div class="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-0">
                <a
                    href="#top"
                    onclick="event.preventDefault();window.scrollTo({top:0,behavior:'smooth'});"
                    class="rounded-full border border-[#272725] flex items-center justify-center relative overflow-hidden group transition-all duration-300 hover:bg-[#D8008D] hover:border-[#D8008D] mx-auto lg:mx-0"
                    style="width: clamp(200px, 40vw, 302px); height: clamp(200px, 40vw, 302px);"
                    aria-label="Back to top"
                >
                    <div class="relative" style="width: clamp(80px, 15vw, 108px); height: clamp(90px, 18vw, 121px);">
                        <div class="absolute inset-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-[200%]">
                            <svg width="108" height="121" viewBox="0 0 108 121" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path fill-rule="evenodd" clip-rule="evenodd" d="M54 0L108 53.4077L100.394 60.9302L59.3783 20.3644V121H48.6218V20.3644L7.60599 60.9302L0 53.4077L54 0Z" fill="#CAC9C4"/></svg>
                        </div>
                        <div class="absolute inset-0 translate-y-[200%] transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                            <svg width="108" height="121" viewBox="0 0 108 121" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path fill-rule="evenodd" clip-rule="evenodd" d="M54 0L108 53.4077L100.394 60.9302L59.3783 20.3644V121H48.6218V20.3644L7.60599 60.9302L0 53.4077L54 0Z" fill="#CAC9C4"/></svg>
                        </div>
                    </div>
                </a>

                <div class="max-w-full lg:max-w-[628px] w-full flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-[75px]">
                    <div class="w-full flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 md:gap-8">
                        <a href="mailto:<?php echo esc_attr($email); ?>" class="text-[#FFFFFF8F] leading-[160%] transition-colors duration-300 hover:text-[#D8008D]" style="font-size: clamp(14px, 1.5vw, 16px);"><?php echo esc_html($email); ?></a>
                        <p class="max-w-full sm:max-w-[328px] w-full text-[#FFFFFF8F] leading-[160%]" style="font-size: clamp(14px, 1.5vw, 16px);"><?php echo esc_html($description); ?></p>
                    </div>

                    <div class="w-full flex flex-col gap-2">
                        <span class="text-[#D8008D] leading-[160%]" style="font-size: clamp(14px, 1.5vw, 16px);"><?php echo esc_html($social_label); ?></span>
                        <div class="flex flex-wrap gap-3 sm:gap-4 md:gap-[28px]">
                            <?php foreach ($socials as $i => $link): ?>
                                <a href="<?php echo esc_url($link['url']); ?>" target="_blank" rel="noopener noreferrer" class="text-[#FFFFFF8F] leading-[150%] transition-colors duration-300 hover:text-[#D8008D]" style="font-size: clamp(14px, 1.5vw, 16px);"><?php echo esc_html($link['name']); ?></a>
                                <?php if ($i < count($socials) - 1): ?>
                                    <span class="text-[#72716D] leading-[150%]" style="font-size: clamp(14px, 1.5vw, 16px);">/</span>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <div class="w-full flex flex-col gap-2">
                        <span class="text-[#D8008D] leading-[160%]" style="font-size: clamp(14px, 1.5vw, 16px);"><?php echo esc_html($links_label); ?></span>
                        <div class="flex flex-wrap gap-3 sm:gap-4 md:gap-[28px]">
                            <?php foreach ($footer_links as $i => $link): $is_external = strpos($link['url'], 'http') === 0; ?>
                                <a href="<?php echo esc_url($link['url']); ?>" <?php if ($is_external) echo 'target="_blank" rel="noopener noreferrer"'; ?> class="text-[#FFFFFF8F] leading-[150%] transition-colors duration-300 hover:text-[#D8008D]" style="font-size: clamp(14px, 1.5vw, 16px);"><?php echo esc_html($link['name']); ?></a>
                                <?php if ($i < count($footer_links) - 1): ?>
                                    <span class="text-[#72716D] leading-[150%]" style="font-size: clamp(14px, 1.5vw, 16px);">/</span>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <img src="<?php echo esc_url($big_logo_src); ?>" class="w-full" alt="" />
    </div>
</footer>
