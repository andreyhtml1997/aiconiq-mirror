<?php 
/*Template Name: SPA*/
get_header();?>


<section class="inner-hero">
    <div class="hero-image">
    <?php $page_foto = get_field( 'page-foto' ); ?>
        <?php if ( $page_foto ) : ?>
            <img src="<?php echo esc_url( $page_foto['url'] ); ?>" alt="<?php echo esc_attr( $page_foto['alt'] ); ?>" />
            <?php else: ?>
                <img src="<?php echo get_template_directory_uri();?>/images/main1.jpg" alt="<?php echo esc_attr( $page_foto['alt'] ); ?>" />
        <?php endif; ?>
    </div>
    <div class="hero-info">
        <div class="container-fluid">
        <?php if ( get_field( 'page-h1' ) ) : ?>
            <h1><?php the_field( 'page-h1' ); ?></h1>
            <?php else: ?>
                <h1><?php the_title(); ?></h1>
            <?php endif; ?>
        </div>
    </div>
    <?php if ( get_field( 'page-vlastyvist_znachennya' ) ) : ?>
    <div class="hero-props">
						<span class="data"><?php the_field( 'page-vlastyvist' ); ?></span> <span class="value"><?php the_field( 'page-vlastyvist_znachennya' ); ?></span>
					</div>
                    <?php endif; ?>
</section>


<section class="service-section margin-bottom padding-top first-section">
    <div class="container-fluid">
        <div class="text-center">
            <h3><?php the_field( 'spa-info-zagolovok' ); ?></h3>
        </div>
        <div class="s-container d-xl-flex align-items-start justify-content-between">
            <div class="s-info order-12">
                <h2><?php the_field( 'spa-info-pidzagolovok' ); ?></h2>
                <div class="s-anons"><?php the_field( 'spa-info-anons' ); ?></div>
                
                <div class="image-1">
                <?php $spa_info_foto_2 = get_field( 'spa-info-foto_2' ); ?>
                <?php if ( $spa_info_foto_2 ) : ?>
                    <img src="<?php echo esc_url( $spa_info_foto_2['url'] ); ?>" alt="<?php echo esc_attr( $spa_info_foto_2['alt'] ); ?>" />
                <?php endif; ?>
                </div>
            </div>
            <div class="s-left">
                <div class="image-2">
                <?php $spa_info_foto_1 = get_field( 'spa-info-foto_1' ); ?>
                <?php if ( $spa_info_foto_1 ) : ?>
                    <img src="<?php echo esc_url( $spa_info_foto_1['url'] ); ?>" alt="<?php echo esc_attr( $spa_info_foto_1['alt'] ); ?>" />
                <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="spa-slider margin-bottom">
    <div class="spa-images d-none d-xl-block">
    <?php if ( have_rows( 'spa-slider' ) ) : ?>
        <?php $i=1; while ( have_rows( 'spa-slider' ) ) : the_row(); ?>
            <div class="image-container img-sp-<?php echo $i;?> <?php if($i=='2') { ?> active<?php } ?>">
                <?php $spa_slider_foto = get_sub_field( 'spa-slider-foto' ); ?>
                <?php if ( $spa_slider_foto ) : ?>
                    <img src="<?php echo esc_url( $spa_slider_foto['url'] ); ?>" alt="<?php echo esc_attr( $spa_slider_foto['alt'] ); ?>" />
                <?php endif; ?>
            </div>
        <?php $i++; endwhile; ?>
    <?php endif; ?>
    </div>
    <div class="items  d-xl-flex">
    <?php if ( have_rows( 'spa-slider' ) ) : ?>
        <?php $i=1; while ( have_rows( 'spa-slider' ) ) : the_row(); ?>
            <div class="item d-flex flex-column justify-content-end <?php if($i=='2') { ?> active<?php } ?>" id="sp-<?php echo $i;?>">
                <div class="item-info">
                    <div class="item-name"><?php the_sub_field( 'spa-slider-nazva' ); ?></div>
                    <div class="item-anons"><?php the_sub_field( 'spa-slider-anons' ); ?></div>
                </div>
                <div class="item-image d-block d-xl-none">
                <?php $spa_slider_foto = get_sub_field( 'spa-slider-foto' ); ?>
                <?php if ( $spa_slider_foto ) : ?>
                    <img src="<?php echo esc_url( $spa_slider_foto['url'] ); ?>" alt="<?php echo esc_attr( $spa_slider_foto['alt'] ); ?>" />
                <?php endif; ?>
                </div>
            </div>
        <?php $i++; endwhile; ?>
    <?php endif; ?>
    </div>
</section>
<?php 
// === SPA Info Block 2 ===
if ( get_field('spa-info2-zagolovok') || get_field('spa-info2-anons') || get_field('spa-info2-foto_1') || get_field('spa-info2-foto_2') ) : ?>
<section class="service-section margin-bottom">
    <div class="container-fluid">
        <div class="s-container reverse d-xl-flex align-items-start justify-content-between">
            <div class="s-info">
                <?php if ( get_field('spa-info2-zagolovok') ) : ?>
                    <h2><?php the_field('spa-info2-zagolovok'); ?></h2>
                <?php endif; ?>

                <?php if ( get_field('spa-info2-anons') ) : ?>
                    <div class="s-anons"><?php the_field('spa-info2-anons'); ?></div>
                <?php endif; ?>

                <?php $spa_info2_foto_2 = get_field('spa-info2-foto_2'); ?>
                <?php if ( $spa_info2_foto_2 ) : ?>
                    <div class="image-1">
                        <img src="<?php echo esc_url($spa_info2_foto_2['url']); ?>" alt="<?php echo esc_attr($spa_info2_foto_2['alt']); ?>">
                    </div>
                <?php endif; ?>
            </div>

            <div class="s-left">
                <?php $spa_info2_foto_1 = get_field('spa-info2-foto_1'); ?>
                <?php if ( $spa_info2_foto_1 ) : ?>
                    <div class="image-2">
                        <img src="<?php echo esc_url($spa_info2_foto_1['url']); ?>" alt="<?php echo esc_attr($spa_info2_foto_1['alt']); ?>">
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
<?php endif; ?>


<?php 
// === SPA Info Block 3 ===
if ( get_field('spa-info3-zagolovok') || get_field('spa-info3-anons') || get_field('spa-info3-foto') ) : ?>
<section class="big-block padding-bottom">
    <div class="bg">
        <img src="<?php echo get_template_directory_uri(); ?>/images/bg5.png" alt="">
    </div>
    <div class="container-fluid">
        <div class="title-container d-lg-flex align-items-start justify-content-between">
            <?php if ( get_field('spa-info3-zagolovok') ) : ?>
                <h2><?php the_field('spa-info3-zagolovok'); ?></h2>
            <?php endif; ?>

            <?php if ( get_field('spa-info3-anons') ) : ?>
                <div class="anons"><?php the_field('spa-info3-anons'); ?></div>
            <?php endif; ?>
        </div>

        <?php $spa_info3_foto = get_field('spa-info3-foto'); ?>
        <?php if ( $spa_info3_foto ) : ?>
            <div class="block-image">
                <img src="<?php echo esc_url($spa_info3_foto['url']); ?>" alt="<?php echo esc_attr($spa_info3_foto['alt']); ?>" class="parallax">
            </div>
        <?php endif; ?>
    </div>
</section>
<?php endif; ?>
<?php get_template_part('templates/banners'); ?>
<?php get_footer();?>






