<?php
if (!defined('ABSPATH')) {
	exit;
}

/* ------------------Enqueues----------------------- */
add_action('wp_enqueue_scripts', function () {
	if (is_admin()) {
		return;
	}

	// 1) Базовый стиль темы (style.css)
	// get_stylesheet_uri() → /wp-content/themes/e-theme/style.css
	$theme = wp_get_theme();
	$style_uri = get_stylesheet_uri();
	$style_path = get_template_directory() . '/style.css';

	$style_ver = $theme->get('Version');
	if (file_exists($style_path)) {
		$style_ver = filemtime($style_path); // чтобы кэш сбрасывался при изменении файла
	}

	wp_enqueue_style(
		'theme-style',
		$style_uri,
		[],
		$style_ver
	);

	// 2) Где нужен React:
	$should_load_react =
		is_front_page()
		|| is_post_type_archive('article')
		|| is_singular('article');

	// if (!$should_load_react) {
	// 	return;
	// }
	$theme_dir = get_template_directory();
	$theme_uri = get_template_directory_uri();

	$dist_path = $theme_dir . '/blog_assets/dist';
	$dist_uri = $theme_uri . '/blog_assets/dist';

	// Ищем JS-файл вида assets/index-*.js
	$js_files = glob($dist_path . '/assets/index-*.js');

// print_r($dist_path . '/assets/index-*.js');
// print_r($js_files);
	if (!$js_files || !is_array($js_files)) {
		// fallback: вдруг Vite выдал просто какой-то другой index-*.js
		$js_files = glob($dist_path . '/assets/*.js');
	}

	if (!$js_files || !isset($js_files[0])) {
		// Не нашли JS — ничего не делаем, чтобы не ломать страницу
		return;
	}

	$js_file = basename($js_files[0]); // index-XXXX.js
	$js_url = $dist_uri . '/assets/' . $js_file;

// print_r($js_url);
	// Ищем CSS-файл вида assets/index-*.css
	$css_files = glob($dist_path . '/assets/index-*.css');
	if (!$css_files || !is_array($css_files)) {
		$css_files = glob($dist_path . '/assets/*.css');
	}

	$css_url = null;
	if ($css_files && isset($css_files[0])) {
		$css_url = $dist_uri . '/assets/' . basename($css_files[0]); // index-XXXX.css
	}

// print_r($css_url);
	// Стили React
	if ($css_url) {
		wp_enqueue_style(
			'react-app',
			$css_url,
			['theme-style'], // можно повесить поверх базового
			null
		);
	}

	// Скрипт React
	wp_enqueue_script(
		'react-app',
		$js_url,
		[],
		null,
		true
	);

	// 🔥 Определяем текущий язык (Polylang → slug: en, de и т.п.)
	$lang = 'en';

	if (function_exists('pll_current_language')) {
		$lang = pll_current_language('slug');
	} else {
		$locale = get_locale(); // en_US, de_DE
		$lang = substr($locale, 0, 2);
	}

	wp_localize_script('react-app', 'WP_APP', [
		'restUrl' => esc_url_raw(rest_url()),
		'siteUrl' => home_url('/'),
		'lang' => $lang,
	]);

	// Для дебага можно включить:
	// wp_add_inline_script('react-app', 'console.log("react-app loaded from WP");');
});
