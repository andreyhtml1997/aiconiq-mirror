<?php
require get_template_directory() . '/functions/cleanup.php';
require get_template_directory() . '/functions/setup.php';
require get_template_directory() . '/functions/enqueues.php';
require get_template_directory() . '/functions/acf.php';
require get_template_directory() . '/functions/acf-blocks.php';
require get_template_directory() . '/functions/rest-blocks.php';
require get_template_directory() . '/functions/acf-footer-options.php';
require get_template_directory() . '/functions/menu.php';
require get_template_directory() . '/functions/sync-blocks-order.php';
require get_template_directory() . '/functions/acf-json-bootstrap.php';
require get_template_directory() . '/functions/cors.php';
if (is_admin()) {
    require get_template_directory() . '/functions/admin-setup.php';
}

add_filter('excerpt_more', function () {
    return '…';
});