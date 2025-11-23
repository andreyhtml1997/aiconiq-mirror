<?php
/*--------------------------------- Main Cleanup -----------------------------------*/
function e_cleanup_head()
{
  remove_action('wp_head', 'wp_generator');
  remove_action('wp_head', 'rsd_link');
  remove_action('wp_head', 'wlwmanifest_link');
  remove_action('wp_head', 'index_rel_link');
  remove_action('wp_head', 'feed_links', 2);
  remove_action('wp_head', 'feed_links_extra', 3);
  remove_action('wp_head', 'start_post_rel_link', 10, 0);
  remove_action('wp_head', 'parent_post_rel_link', 10, 0);
  remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
  remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
  remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
  remove_action('wp_head', 'print_emoji_detection_script', 7);
  remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('init', 'e_cleanup_head');

/*--------------------------------- Show less info to users on failed login for security -----------------------------------*/
function show_less_login_info()
{
  return "<strong>ERROR</strong>: ????";
}
add_filter('login_errors', 'show_less_login_info');

/*--------------------------------- Do not generate and display WordPress version -----------------------------------*/
function remove_generator()
{
  return '';
}
add_filter('the_generator', 'no_generator');

/*--------------------------------- Remove Query Strings From Static Resources -----------------------------------*/
function e_remove_script_version($src)
{
  if (current_user_can('manage_options')) {
    // Админам ничего не трогаем
    return $src;
  }

  // Если есть ?ver= — убираем его
  if (strpos($src, '?ver=') !== false) {
    $src = remove_query_arg('ver', $src);
  }

  // 🔥 ВСЕГДА возвращаем $src
  return $src;
}
add_filter('script_loader_src', 'e_remove_script_version', 15, 1);
add_filter('style_loader_src', 'e_remove_script_version', 15, 1);

/*--------------------------------- Remove Wordpress Block Library Styles -----------------------------------*/
add_action('wp_print_styles', 'wps_deregister_styles', 100);
function wps_deregister_styles()
{
  wp_deregister_style('wp-block-library-theme');
  wp_deregister_style('wp-block-library');
}

/*--------------------------------- Disable Self Pingbacks -----------------------------------*/
function wpsites_disable_self_pingbacks(&$links)
{
  foreach ($links as $l => $link)
    if (0 === strpos($link, get_option('home')))
      unset($links[$l]);
}
add_action('pre_ping', 'wpsites_disable_self_pingbacks');

/*--------------------------------- Disapble Embeds Code Init -----------------------------------*/
function disable_embeds_code_init()
{
  remove_action('rest_api_init', 'wp_oembed_register_route');
  add_filter('embed_oembed_discover', '__return_false');
  remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);
  remove_action('wp_head', 'wp_oembed_add_discovery_links');
  remove_action('wp_head', 'wp_oembed_add_host_js');
  add_filter('tiny_mce_plugins', 'disable_embeds_tiny_mce_plugin');
  add_filter('rewrite_rules_array', 'disable_embeds_rewrites');
  remove_filter('pre_oembed_result', 'wp_filter_pre_oembed_result', 10);
}
add_action('init', 'disable_embeds_code_init', 9999);
function disable_embeds_tiny_mce_plugin($plugins)
{
  return array_diff($plugins, array('wpembed'));
}
function disable_embeds_rewrites($rules)
{
  foreach ($rules as $rule => $rewrite) {
    if (false !== strpos($rewrite, 'embed=true')) {
      unset($rules[$rule]);
    }
  }
  return $rules;
}
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

/*--------------------------------- Remove Feed Support -----------------------------------*/
add_action('after_theme_support', 'remove_feed');
function remove_feed()
{
  remove_theme_support('automatic-feed-links');
}

/*--------------------------------- Remove Comments -----------------------------------*/
add_action('admin_menu', 'my_remove_admin_menus');
function my_remove_admin_menus()
{
  remove_menu_page('edit-comments.php');
}
add_action('init', 'remove_comment_support', 100);
function remove_comment_support()
{
  remove_post_type_support('post', 'comments');
  remove_post_type_support('page', 'comments');
}
function mytheme_admin_bar_render()
{
  global $wp_admin_bar;
  $wp_admin_bar->remove_menu('comments');
}
add_action('wp_before_admin_bar_render', 'mytheme_admin_bar_render');

/*--------------------------------- Disable Post revisions ----------------------------------- 
define('WP_POST_REVISIONS', false);


/*--------------------------------- Disable Welcome panel -----------------------------------*/
remove_action('welcome_panel', 'wp_welcome_panel');

/*--------------------------------- Some Pretty stuff -----------------------------------*/
add_action('admin_head', 'my_custom_fonts');

function my_custom_fonts()
{
  echo '<style>
    .acf-clone-fields .acf-field-group > .acf-label{
		display: none !important;
	} 
  </style>';
}
