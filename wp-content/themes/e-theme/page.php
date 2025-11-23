<?php 
  
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
</section>


<section class="padding-top first-section margin-bottom">
<div class="container-fluid">
<?php the_content(); ?>	
</div>
</section>




	
<?php get_footer();?>  



