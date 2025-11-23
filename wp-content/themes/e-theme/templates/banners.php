<section class="bottom-banner d-md-flex">

<?php if ( have_rows( 'banner-banery' ) ) : ?>
	<?php while ( have_rows( 'banner-banery' ) ) : the_row(); ?>
        <a href="<?php the_sub_field( 'banner-link' ); ?>" class="item">
            <div class="item-image">
                <?php $banner_foto = get_sub_field( 'banner-foto' ); ?>
                <?php if ( $banner_foto ) : ?>
                    <img src="<?php echo esc_url( $banner_foto['url'] ); ?>" alt="<?php echo esc_attr( $banner_foto['alt'] ); ?>" />
                <?php endif; ?>
            </div>
            <div class="item-name"><?php the_sub_field( 'banner-nazva' ); ?></div>
        </a>
	<?php endwhile; ?>
<?php else : ?>
	<?php if ( have_rows( 'banner-banery', 'option' ) ) : ?>
        <?php while ( have_rows( 'banner-banery', 'option' ) ) : the_row(); ?>
            <a href="<?php the_sub_field( 'banner-link' ); ?>" class="item">
                <div class="item-image">
                    <?php $banner_foto = get_sub_field( 'banner-foto' ); ?>
                    <?php if ( $banner_foto ) : ?>
                        <img src="<?php echo esc_url( $banner_foto['url'] ); ?>" alt="<?php echo esc_attr( $banner_foto['alt'] ); ?>" />
                    <?php endif; ?>
                </div>
                <div class="item-name"><?php the_sub_field( 'banner-nazva' ); ?></div>
            </a>
        <?php endwhile; ?>
    <?php endif; ?>
<?php endif; ?>
</section>