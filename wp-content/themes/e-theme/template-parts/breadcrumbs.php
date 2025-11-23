<li class="square-after"><a href="<?php echo home_url(); ?>"><?php echo get_the_title(get_option('page_on_front')); ?></a></li>

<?php if (is_singular('services')) : ?>
    <li class="square-after"><a href="<?php echo get_permalink(32); ?>"><?php echo get_the_title(32); ?></a></li>
    <li><span><?php the_title(); ?></span></li>
<?php elseif (is_singular('cottages')) : ?>
    <li class="square-after"><a href="<?php echo get_permalink(109); ?>"><?php echo get_the_title(109); ?></a></li> <!-- Убедитесь, что ID 32 относится к нужной странице -->
    <li><span><?php the_title(); ?></span></li>
<?php elseif (is_singular('rooms')) : ?>
    <li class="square-after"><a href="<?php echo get_permalink(30); ?>"><?php echo get_the_title(30); ?></a></li> <!-- Убедитесь, что ID 32 относится к нужной странице -->
    <li><span><?php the_title(); ?></span></li>
<?php elseif (is_single()) : ?>
    <li><a href="<?php echo get_permalink(get_option('page_for_posts')); ?>"><?php echo get_the_title(get_option('page_for_posts')); ?></a></li>
    <li><span><?php the_title(); ?></span></li>
<?php elseif (is_page()) : ?>
    <?php if ($post->post_parent) : ?>
        <li><a href="<?php echo get_permalink($post->post_parent); ?>"><?php echo get_the_title($post->post_parent); ?></a></li>
    <?php endif; ?>
    <li><span><?php the_title(); ?></span></li>
<?php elseif (is_category()) : ?>
    <li><span><?php single_cat_title(); ?></span></li>
<?php endif; ?>
