<?php
/*--------------------------------Options Page-----------------------*/
if (function_exists('acf_add_options_page')) {


}



add_action('init', function () {
  register_post_type('article', [
    'labels' => [
      'name' => 'Articles',
      'singular_name' => 'Article',
      'add_new' => 'Add Article',
      'add_new_item' => 'Add New Article',
      'edit_item' => 'Edit Article',
      'new_item' => 'New Article',
      'view_item' => 'View Article',
      'search_items' => 'Search Articles',
      'not_found' => 'No articles found',
      'not_found_in_trash' => 'No articles found in Trash',
      'all_items' => 'All Articles',
      'archives' => 'Article Archives',
      'attributes' => 'Article Attributes',
      'insert_into_item' => 'Insert into article',
      'uploaded_to_this_item' => 'Uploaded to this article',
      'menu_name' => 'Articles',
      'name_admin_bar' => 'Article',
    ],
    'public' => true,
    'show_ui' => true,
    'show_in_rest' => true,
    'publicly_queryable' => true,
    'exclude_from_search' => false,
    'has_archive' => true,
    'rewrite' => [
      'slug' => 'articles', // /articles/slug
      'with_front' => false,
    ],
    'supports' => [
      'title',
      'editor',
      'thumbnail',
      'excerpt',
    ],
  ]);
});

add_action('init', function () {
  $labels = [
    'name' => 'Article Tags',
    'singular_name' => 'Article Tag',
    'search_items' => 'Search Tags',
    'popular_items' => 'Popular Tags',
    'all_items' => 'All Tags',
    'edit_item' => 'Edit Tag',
    'view_item' => 'View Tag',
    'update_item' => 'Update Tag',
    'add_new_item' => 'Add New Tag',
    'new_item_name' => 'New Tag Name',
    'separate_items_with_commas' => 'Separate tags with commas',
    'add_or_remove_items' => 'Add or remove tags',
    'choose_from_most_used' => 'Choose from the most used tags',
    'not_found' => 'No tags found',
    'menu_name' => 'Article Tags',
  ];

  register_taxonomy('article_tag', ['article'], [
    'labels' => $labels,
    'public' => true,
    'show_ui' => true,
    'show_admin_column' => true,
    'show_in_rest' => true, // важно для React / REST
    'hierarchical' => false, // как обычные пост-теги
    'rewrite' => [
      'slug' => 'article-tag',
      'with_front' => false,
    ],
  ]);
});




add_action('template_redirect', function () {
  if (is_admin()) {
    return;
  }

  // Текущий путь, без домена и без GET-параметров
  $request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $request_path = trim($request_path, '/'); // "articles", "en/articles", "de/articles" и т.п.

  // Если уже есть префикс языка — ничего не делаем
  // (чтоб не было циклов для /en/articles и /de/articles)
  if (strpos($request_path, 'en/articles') === 0 || strpos($request_path, 'de/articles') === 0) {
    return;
  }

  // Нас интересует именно "articles" без языка
  if ($request_path === 'articles') {

    // Определяем текущий язык Polylang
    $lang = 'en';
    if (function_exists('pll_current_language')) {
      $lang = pll_current_language('slug'); // вернёт "en" или "de"
    }

    // Собираем правильный URL с языком
    $target = home_url('/' . $lang . '/articles/');

    wp_redirect($target, 301);
    exit;
  }
});







add_action('rest_api_init', function () {
  // добавляем доп. поле к постам типа article
  register_rest_field('article', 'hero', [
    'get_callback' => function ($object) {
      if (!function_exists('get_field')) {
        return null;
      }

      $post_id = $object['id'];

      // hero_content_type: 'video' или 'images'
      $type = get_field('hero_content_type', $post_id);
      if (!$type) {
        $type = 'images';
      }

      // hero_slider: массив картинок (галерея)
      $slider = [];
      $slider_raw = get_field('hero_slider', $post_id);
      if (is_array($slider_raw)) {
        foreach ($slider_raw as $img) {
          $slider[] = [
            'id' => isset($img['ID']) ? (int) $img['ID'] : null,
            'url' => isset($img['url']) ? $img['url'] : '',
            'alt' => isset($img['alt']) ? $img['alt'] : '',
            'caption' => isset($img['caption']) ? $img['caption'] : '',
          ];
        }
      }

      // hero_video: файл
      $video = null;
      $video_raw = get_field('hero_video', $post_id);
      if (is_array($video_raw) && !empty($video_raw['url'])) {
        $video = [
          'url' => $video_raw['url'],
          'filename' => $video_raw['filename'] ?? basename($video_raw['url']),
        ];
      }

      // Tabs: repeater [ [title, text], ... ]
      $tabs = [];
      $tabs_raw = get_field('Tabs', $post_id);
      if (is_array($tabs_raw)) {
        foreach ($tabs_raw as $row) {
          $tabs[] = [
            'title' => isset($row['title']) ? $row['title'] : '',
            'text' => isset($row['text']) ? $row['text'] : '',
          ];
        }
      }

      return [
        'type' => $type,
        'slider' => $slider,
        'video' => $video,
        'tabs' => $tabs,
      ];
    },
    'schema' => null,
  ]);
});





add_action('rest_api_init', function () {
  // Доп. поле с тегами для article
  register_rest_field('article', 'article_tags', [
    'get_callback' => function ($object) {
      $post_id = $object['id'];

      $terms = get_the_terms($post_id, 'article_tag');
      if (!$terms || is_wp_error($terms)) {
        return [];
      }

      $result = [];

      foreach ($terms as $term) {
        $result[] = [
          'id' => (int) $term->term_id,
          'name' => $term->name,
          'slug' => $term->slug,
        ];
      }

      return $result;
    },
    'schema' => null,
  ]);
});