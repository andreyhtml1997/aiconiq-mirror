<?php

/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package etheme
 */

get_header();
?>

<main>


  <section class="section first-section">
    <div class="container">
      <div class="row">
        <div class="m-auto col-xxl-8 col-xl-9 col-lg-10 col-md-11">
          <div class="d-flex">

            <button class="go-back go-back--dark" onClick="window.history.go(-1); return false;" type="button">
              <span class="go-back__icon">
                <svg class="svg-arrow-left-white-dims">
                  <use xlink:href="#arrow-left-white"></use>
                </svg>
              </span>
              <span class="go-back__text">назад</span>
            </button>
          </div>
          <h1 class="h3 position-relative my-5 text-lg-start text-center"><?php the_title(); ?></h1>
          <div class="text-content">
            <?php the_content(); ?>
          </div>
        </div>
      </div>
    </div>
  </section>


  <?php
  // Получаем текущий ID и категории текущего поста
  $current_post_id = get_the_ID();
  $categories = get_the_category($current_post_id);

  // Если есть хотя бы одна категория
  if (!empty($categories)) {
    $category_ids = wp_list_pluck($categories, 'term_id');

    // Настроим запрос WP_Query
    $args = array(
      'category__in' => $category_ids,
      'post__not_in' => array($current_post_id),
      'orderby' => 'date',
      'order' => 'DESC',
      'posts_per_page' => -1, // Вывести все похожие посты
    );
    $query = new WP_Query($args);

    // Если есть похожие посты — выводим секцию
    if ($query->have_posts()): ?>
      <section class="section blog-els pb-0">
        <div class="container">
          <h2 class="h2 mb-5 pb-lg-4 text-lg-start text-center">Також пропонуємо вашій увазі</h2>
          <div class="line-top">
            <ul class="row blog-els-row">
              <?php while ($query->have_posts()):
                $query->the_post(); ?>
                <?php if (has_category('events')): ?>
                  <?php
                  $date_str = get_field('date');
                  $day = '';
                  $month = '';
                  $year = '';
                  if ($date_str) {
                    $date_obj = DateTime::createFromFormat('d/m/Y', $date_str);
                    if ($date_obj) {
                      $day = $date_obj->format('d');
                      $month_num = $date_obj->format('n');
                      $year = $date_obj->format('Y');
                      $months = array(
                        1 => 'Січня',
                        2 => 'Лютого',
                        3 => 'Березня',
                        4 => 'Квітня',
                        5 => 'Травня',
                        6 => 'Червня',
                        7 => 'Липня',
                        8 => 'Серпня',
                        9 => 'Вересня',
                        10 => 'Жовтня',
                        11 => 'Листопада',
                        12 => 'Грудня'
                      );
                      $month = $months[$month_num];
                    }
                  }
                  ?>
                  <li class="col-lg-6">
                    <figure class="blog-el has-inner-link-js cursor-pointer d-flex">
                      <div class="row">
                        <div class="col-sm-6 d-flex">
                          <div class="blog-el__description d-flex flex-column align-items-lg-start align-items-start mw-100">
                            <?php if ($date_str && $date_obj): ?>
                              <time datetime="<?php echo esc_attr($date_obj->format('Y-m-d')); ?>"
                                class="blog-el__date d-flex align-items-center mb-xl-5 mb-4 text-start">
                                <div class="h4 blog-el__date-day me-xl-4 me-3 line-height-1"><?php echo $day; ?></div>
                                <div class="blog-el__date-month-and-year color-text-dark line-height-1-2 body-1">
                                  <?php echo $month; ?><br><?php echo $year; ?>
                                </div>
                              </time>
                            <?php endif; ?>
                            <div class="d-block h-100 mw-100">
                              <a href="<?php the_permalink(); ?>" class="blog-el__title h6"><?php the_title(); ?></a>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-6 mt-sm-0 mt-4">
                          <div class="h-100 position-relative mb-sm-0">
                            <picture class="blog-el__icon w-100 h-100 position-absolute">
                              <img src="<?php echo THEME_ASSETS_URL; ?>img/icons/logo-decor.svg" alt="#"
                                class="position-absolute object-fit-contain w-100 h-100">
                            </picture>
                            <picture class="blog-el__img d-flex h-100 w-100 overflow-hidden position-relative mt-sm-0">
                              <?php if (has_post_thumbnail()): ?>
                                <?php the_post_thumbnail('full', ['class' => 'w-100 h-100 object-fit-cover']); ?>
                              <?php else: ?>
                                <img src="<?php echo THEME_ASSETS_URL; ?>img/home/sale.jpg" alt="#"
                                  class="w-100 h-100 object-fit-cover">
                              <?php endif; ?>
                            </picture>
                          </div>
                        </div>
                      </div>
                    </figure>
                  </li>
                <?php else: ?>
                  <li class="col-lg-6">
                    <figure class="blog-el has-inner-link-js cursor-pointer d-flex">
                      <div class="row">
                        <div class="col-sm-6 d-flex">
                          <div class="blog-el__description d-flex flex-column align-items-lg-start align-items-start mw-100">
                            <div class="d-block h-100 mw-100">
                              <a href="<?php the_permalink(); ?>" class="blog-el__title h6"><?php the_title(); ?></a>
                              <div class="body-3 fw-500 h-100 my-4 py-xl-3 blog-el__text">
                                <?php the_excerpt(); ?>
                              </div>
                            </div>
                            <span class="read-more">детальніше</span>
                          </div>
                        </div>
                        <div class="col-sm-6 mt-sm-0 mt-4">
                          <div class="h-100 position-relative mb-sm-0">
                            <picture class="blog-el__icon w-100 h-100 position-absolute">
                              <img src="<?php echo THEME_ASSETS_URL; ?>img/icons/logo-decor.svg" alt="#"
                                class="position-absolute object-fit-contain w-100 h-100">
                            </picture>
                            <picture class="blog-el__img d-flex h-100 w-100 overflow-hidden position-relative mt-sm-0">
                              <?php if (has_post_thumbnail()): ?>
                                <?php the_post_thumbnail('full', ['class' => 'w-100 h-100 object-fit-cover']); ?>
                              <?php else: ?>
                                <img src="<?php echo THEME_ASSETS_URL; ?>img/home/sale.jpg" alt="#"
                                  class="w-100 h-100 object-fit-cover">
                              <?php endif; ?>
                            </picture>
                          </div>
                        </div>
                      </div>
                    </figure>
                  </li>
                <?php endif; ?>
              <?php endwhile; ?>
            </ul>
          </div>
        </div>
      </section>
      <?php
      wp_reset_postdata();
    endif;
  }
  ?>

</main>

<?php
get_footer();
