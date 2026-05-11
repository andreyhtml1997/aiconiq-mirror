<?php
/**
 * Sticky floating header — slides in when the inline nav row scrolls off.
 * Always rendered once near the top of the body. theme.js binds it to
 * the inline-row trigger element via [data-aiconiq-sticky-trigger].
 */
if (!defined('ABSPATH')) {
    exit;
}

$lang = aiconiq_current_lang();
$items = function_exists('aiconiq_menu_items') ? aiconiq_menu_items('primary') : [];
$logo_url = aiconiq_public_asset('assets/logo.svg');
$current_path = rtrim((string) ($_SERVER['REQUEST_URI'] ?? ''), '/');
$current_page_id = (int) (get_queried_object_id() ?: 0);
$path_no_lang = preg_replace('#^/(en|de)#', '', $current_path) ?: '/';
$en_url = '/en' . $path_no_lang;
$de_url = '/de' . $path_no_lang;

$is_active = function (array $item) use ($current_path, $current_page_id, $lang) {
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
?>
<header
    data-aiconiq-sticky
    data-name="SiteHeader"
    aria-hidden="true"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0F0E0E]/85 backdrop-blur-md border-b border-white/5 -translate-y-full opacity-0 pointer-events-none data-[visible='1']:translate-y-0 data-[visible='1']:opacity-100 data-[visible='1']:pointer-events-auto"
>
    <div class="px-3 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 flex items-center justify-between gap-4">
        <a href="/<?php echo esc_attr($lang); ?>/" class="flex-shrink-0">
            <img src="<?php echo esc_url($logo_url); ?>" alt="aiconiq" class="h-7 sm:h-8 w-auto" />
        </a>
        <div class="flex items-center gap-2 lg:gap-4">
            <?php if (!empty($items)): ?>
                <nav class="hidden md:flex items-center gap-1 lg:gap-2 overflow-x-auto">
                    <?php foreach ($items as $item): $active = $is_active($item); ?>
                        <a
                            href="<?php echo esc_url($item['url']); ?>"
                            <?php if (!empty($item['target']) && $item['target'] === '_blank') echo 'target="_blank" rel="noopener noreferrer"'; ?>
                            class="px-2 lg:px-4 py-1.5 text-[14px] lg:text-base font-medium text-white whitespace-nowrap border-b transition-colors <?php echo $active ? 'border-[#d8008d]' : 'border-transparent hover:border-white/30'; ?>"
                        ><?php echo esc_html($item['label']); ?></a>
                    <?php endforeach; ?>
                </nav>
            <?php endif; ?>
            <div class="hidden md:flex items-center px-2 py-1.5 md:px-4 md:py-1.5 text-white">
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
</header>
