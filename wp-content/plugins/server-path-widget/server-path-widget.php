<?php
/**
 * Plugin Name: Server, Domain and PHP Info Widget
 * Description: Displays the full server path, domain path, and PHP version in the WordPress Dashboard.
 * Version: 1.0
 * Author: Oleg Grigoriev
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

add_action( 'wp_dashboard_setup', 'add_server_domain_php_widget' );

function add_server_domain_php_widget() {
    wp_add_dashboard_widget(
        'server_domain_php_widget',         // Widget slug.
        'Server, Domain and PHP Information', // Title.
        'display_server_domain_php_info'    // Display function.
    );
}

function display_server_domain_php_info() {
    $server_path = $_SERVER['DOCUMENT_ROOT'];
    $domain_path = "//" . $_SERVER['HTTP_HOST'];
    $php_version = phpversion();

    echo "<p><strong>Server Path:</strong> {$server_path}</p>";
    echo "<p><strong>Domain Path:</strong> {$domain_path}</p>";
    echo "<p><strong>PHP Version:</strong> {$php_version}</p>";
}