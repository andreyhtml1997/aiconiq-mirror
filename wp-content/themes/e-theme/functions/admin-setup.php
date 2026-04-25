<?php
/**
 * WP admin Tools page that runs the home-page seeder. Anyone with `manage_options`
 * can install/update the demo content with one click. Idempotent.
 */

if (!defined('ABSPATH')) exit;

const AICONIQ_SEED_OPTION = 'aiconiq_seed_done';

/**
 * Auto-seed on theme activation. First time the theme is switched to e-theme,
 * download all media + create home/footer pages + menus. Idempotent.
 */
add_action('after_switch_theme', function () {
    aiconiq_maybe_run_initial_seed('after_switch_theme');
});

/**
 * Catch case where the theme is already active when this code is first deployed:
 * on the next admin page load, run the seed if it hasn't run yet.
 */
add_action('admin_init', function () {
    if (get_option(AICONIQ_SEED_OPTION)) return;
    aiconiq_maybe_run_initial_seed('admin_init');
});

function aiconiq_maybe_run_initial_seed(string $trigger): void
{
    if (get_option(AICONIQ_SEED_OPTION)) return;
    if (!function_exists('update_field')) return; // ACF Pro not loaded yet
    if (!function_exists('pll_set_post_language')) {
        // Polylang not yet ready — defer
        return;
    }

    require_once get_template_directory() . '/setup/seed-home.php';
    $log = aiconiq_run_seed();
    update_option(AICONIQ_SEED_OPTION, [
        'trigger' => $trigger,
        'when' => current_time('mysql'),
        'lines' => count($log),
    ]);
    set_transient('aiconiq_initial_seed_log', $log, 300);
}

add_action('admin_notices', function () {
    $log = get_transient('aiconiq_initial_seed_log');
    if (!$log) return;
    delete_transient('aiconiq_initial_seed_log');
    $count = count($log);
    echo '<div class="notice notice-success is-dismissible"><p>';
    echo '<strong>AICONIQ:</strong> Site auto-seeded (' . esc_html((string) $count) . ' steps). ';
    echo '<a href="' . esc_url(admin_url('tools.php?page=aiconiq-seed-home')) . '">View log / re-run</a>.';
    echo '</p></div>';
});

add_action('admin_menu', function () {
    add_management_page(
        'AICONIQ: Seed home page',
        'AICONIQ: Seed home page',
        'manage_options',
        'aiconiq-seed-home',
        'aiconiq_render_seed_admin_page'
    );
});

function aiconiq_render_seed_admin_page(): void
{
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }

    $log = [];
    if (
        isset($_POST['aiconiq_seed_run']) &&
        check_admin_referer('aiconiq_seed_home')
    ) {
        require_once get_template_directory() . '/setup/seed-home.php';
        $log = aiconiq_run_seed();
    }

    echo '<div class="wrap"><h1>AICONIQ — Seed home page</h1>';
    echo '<p>Downloads media from <code>aiconiq.io</code>, creates the EN + DE Home pages with all 13 section blocks, and sets up the Primary menu. Idempotent — safe to re-run.</p>';
    echo '<form method="post">';
    wp_nonce_field('aiconiq_seed_home');
    echo '<p><button type="submit" name="aiconiq_seed_run" value="1" class="button button-primary">Run seeder</button></p>';
    echo '</form>';

    if ($log) {
        echo '<h2>Log</h2><pre style="background:#1d2327;color:#c8d3df;padding:16px;border-radius:6px;max-height:480px;overflow:auto">';
        foreach ($log as $line) {
            echo esc_html($line) . "\n";
        }
        echo '</pre>';
    }

    echo '</div>';
}
