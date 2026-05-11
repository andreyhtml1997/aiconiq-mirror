<?php
/**
 * Inline navigation row + mobile drawer for the PHP-rendered side.
 *
 * Mirrors `assets/src/components/layout/inline-nav-bar.tsx` and its `Navigation`
 * dependency. The sticky variant slides in as the user scrolls (theme.js
 * binds it via `[data-aiconiq-sticky]` + `[data-aiconiq-sticky-trigger]`).
 *
 * Reads the WP "primary" menu via aiconiq_menu_items('primary') so editors
 * keep using the same admin UI Polylang already presents per-language.
 */

if (!defined('ABSPATH')) {
    exit;
}

$lang = aiconiq_current_lang();
$items = function_exists('aiconiq_menu_items') ? aiconiq_menu_items('primary') : [];
$logo_url = aiconiq_public_asset('assets/logo.svg');
$current_path = rtrim((string) ($_SERVER['REQUEST_URI'] ?? ''), '/');
$current_page_id = (int) (get_queried_object_id() ?: 0);

// EN|DE switcher target paths (strip lang prefix, then prepend the other lang).
$path_no_lang = preg_replace('#^/(en|de)#', '', $current_path) ?: '/';
$en_url = '/en' . $path_no_lang;
$de_url = '/de' . $path_no_lang;

$is_active = function (array $item) use ($current_path, $current_page_id, $lang) {
    // 1. Direct page-id match — most reliable. The menu builder leaves
    //    `object` === 'page' and `object_id` === the page ID even after
    //    URL rewrites for Next.js routing.
    if (!empty($item['object']) && $item['object'] === 'page' && $current_page_id) {
        if ((int) ($item['object_id'] ?? 0) === $current_page_id) return true;
    }
    // 2. URL path match (with and without /page/ prefix — the menu builder
    //    rewrites WP page URLs to /lang/page/slug/ for Next.js, but on the
    //    WP-rendered side current_path is /lang/slug/).
    $url = $item['url'] ?? '';
    $path = preg_replace('#\?.*$#', '', $url);
    $path = rtrim((string) explode('#', $path)[0], '/');
    if ($path) {
        if ($path === $current_path) return true;
        $stripped = preg_replace('#^/(en|de)/page/#', '/$1/', $path);
        if ($stripped === $current_path) return true;
    }
    // 3. Home anchors highlight on root.
    $is_root = $current_path === '' || $current_path === "/$lang" || $current_path === '/';
    $is_home_anchor = ($url === '#home' || (substr($url, -5) === '#home'));
    $is_root_link = !$path && strpos($url, '#') === false;
    return $is_root && ($is_home_anchor || $is_root_link);
};
?>

<!-- Sticky floating header — slides in on scroll past the inline row. -->
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
            <!-- Lang switcher EN|DE -->
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

<!-- Top-of-page inline row — logo on the left, nav on the right. -->
<div
    data-aiconiq-sticky-trigger
    class="flex flex-row p-3 xs:p-4 sm:p-5 md:p-6 lg:p-[28px] items-start sm:items-center w-full justify-between relative z-10 gap-3 xs:gap-4 sm:gap-0 max-w-[1920px] mx-auto"
>
    <a href="/<?php echo esc_attr($lang); ?>/" class="flex-shrink-0">
        <img
            src="<?php echo esc_url($logo_url); ?>"
            class="w-full"
            style="max-width: clamp(120px, 20vw, 193px);"
            alt=""
        />
    </a>
    <div class="flex items-center gap-2 lg:gap-4">
        <?php if (!empty($items)): ?>
            <nav class="hidden md:flex items-center w-auto">
                <?php foreach ($items as $item): $active = $is_active($item); ?>
                    <a
                        href="<?php echo esc_url($item['url']); ?>"
                        <?php if (!empty($item['target']) && $item['target'] === '_blank') echo 'target="_blank" rel="noopener noreferrer"'; ?>
                        class="flex items-center justify-center px-2 py-1.5 md:px-4 md:py-1.5 transition-all duration-200 border-b <?php echo $active ? 'border-[#d8008d]' : 'border-transparent hover:border-white/20'; ?>"
                    >
                        <p class="font-medium text-white whitespace-nowrap leading-normal text-[14px] md:text-base"><?php echo esc_html($item['label']); ?></p>
                    </a>
                <?php endforeach; ?>
            </nav>
        <?php endif; ?>
        <!-- Inline lang switcher EN|DE -->
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

    <!-- Mobile burger -->
    <button
        data-aiconiq-burger
        aria-controls="aiconiq-mobile-menu"
        aria-expanded="false"
        aria-label="Open menu"
        class="md:hidden fixed top-[16px] right-[16px] p-2 text-white z-[60] bg-black/50 rounded-full backdrop-blur-sm"
    >
        <!-- Menu icon (visible when closed) -->
        <svg class="aiconiq-burger-open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
</div>

<!-- Mobile drawer -->
<div
    id="aiconiq-mobile-menu"
    data-aiconiq-mobile-menu
    data-open="0"
    class="hidden data-[open='1']:flex fixed inset-0 z-40 md:hidden flex-col"
>
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" data-close-menu></div>
    <div class="absolute top-0 right-0 w-full h-full bg-black/95 backdrop-blur-md border-l border-white/10 shadow-2xl overflow-y-auto">
        <button class="absolute top-[20px] right-[20px] p-2 text-white z-50" aria-label="Close menu" data-close-menu>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="flex flex-col h-full pt-20 pb-6 px-4">
            <nav class="flex flex-col items-start gap-2 w-full">
                <?php foreach ($items as $item): ?>
                    <a
                        href="<?php echo esc_url($item['url']); ?>"
                        <?php if (!empty($item['target']) && $item['target'] === '_blank') echo 'target="_blank" rel="noopener noreferrer"'; ?>
                        class="w-full px-4 py-3 text-left border-b border-transparent hover:border-white/20"
                    >
                        <p class="font-medium text-white text-lg whitespace-nowrap"><?php echo esc_html($item['label']); ?></p>
                    </a>
                <?php endforeach; ?>
            </nav>
        </div>
    </div>
</div>
