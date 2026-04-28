<?php
/**
 * Headless deploy hook integration: ping a build webhook (Netlify/Vercel/
 * Cloudflare Pages/...) whenever editor changes content, so the static
 * front-end gets a fresh build automatically.
 *
 * Admin page: WP Admin → Site Rebuild (top-level).
 * - Paste your Netlify "Build hook" URL there.
 * - Toggle "Auto rebuild on save" if you want every content edit to
 *   trigger a fresh deploy (default on).
 * - Big button "Rebuild site now" for manual triggers.
 *
 * Auto-rebuild fires on:
 *   - any Page save (including ACF body_blocks edits)
 *   - any ACF Options save (Footer EN/DE)
 *   - any nav menu update
 *   - any Article publish/update
 *
 * Debounce: ignores triggers fired within 60 seconds of the previous
 * one — so saving a Page five times in a row only rebuilds once.
 *
 * Storage:
 *   option `aiconiq_rebuild_url`         — webhook URL (string)
 *   option `aiconiq_rebuild_auto`        — '1' or '0'
 *   option `aiconiq_rebuild_last_ts`     — UNIX timestamp of last fire
 *   option `aiconiq_rebuild_last_status` — 'ok' | error message
 */

if (!defined('ABSPATH')) exit;

const AICONIQ_REBUILD_DEBOUNCE_SEC = 60;
const AICONIQ_REBUILD_URL_OPT       = 'aiconiq_rebuild_url';
const AICONIQ_REBUILD_AUTO_OPT      = 'aiconiq_rebuild_auto';
const AICONIQ_REBUILD_LAST_TS_OPT   = 'aiconiq_rebuild_last_ts';
const AICONIQ_REBUILD_LAST_RESULT_OPT = 'aiconiq_rebuild_last_status';
const AICONIQ_REBUILD_NONCE = 'aiconiq_rebuild_nonce';

// -----------------------------------------------------------------------------
// Admin page
// -----------------------------------------------------------------------------

add_action('admin_menu', function () {
    add_menu_page(
        'Site Rebuild',
        'Site Rebuild',
        'manage_options',
        'aiconiq-rebuild',
        'aiconiq_rebuild_admin_page',
        'dashicons-update',
        31
    );
});

function aiconiq_rebuild_admin_page(): void
{
    if (!current_user_can('manage_options')) wp_die('Permission denied');

    // Save settings (POST submit from settings form)
    if (isset($_POST['aiconiq_rebuild_save'])
        && check_admin_referer(AICONIQ_REBUILD_NONCE, 'aiconiq_rebuild_nonce_field')) {
        $url = trim((string) ($_POST['aiconiq_rebuild_url'] ?? ''));
        update_option(AICONIQ_REBUILD_URL_OPT, esc_url_raw($url));
        update_option(AICONIQ_REBUILD_AUTO_OPT, !empty($_POST['aiconiq_rebuild_auto']) ? '1' : '0');
        echo '<div class="notice notice-success is-dismissible"><p>Settings saved.</p></div>';
    }

    // Manual rebuild trigger
    if (isset($_POST['aiconiq_rebuild_now'])
        && check_admin_referer(AICONIQ_REBUILD_NONCE, 'aiconiq_rebuild_nonce_field')) {
        $result = aiconiq_rebuild_fire('Manual trigger from admin', /*ignore_debounce*/ true);
        if ($result['ok']) {
            echo '<div class="notice notice-success is-dismissible"><p>Build triggered ✓ — give Netlify ~3 minutes.</p></div>';
        } else {
            echo '<div class="notice notice-error is-dismissible"><p>' . esc_html($result['message']) . '</p></div>';
        }
    }

    $url = (string) get_option(AICONIQ_REBUILD_URL_OPT, '');
    $auto = (string) get_option(AICONIQ_REBUILD_AUTO_OPT, '1');
    $last_ts = (int) get_option(AICONIQ_REBUILD_LAST_TS_OPT, 0);
    $last_status = (string) get_option(AICONIQ_REBUILD_LAST_RESULT_OPT, '—');
    $last_human = $last_ts ? human_time_diff($last_ts) . ' ago (' . wp_date('Y-m-d H:i', $last_ts) . ')' : 'never';
    ?>
    <div class="wrap">
        <h1>Site Rebuild</h1>
        <p>This page tells the front-end host (Netlify, Vercel, …) to rebuild
            the static site whenever content here changes. After saving a
            Page, it normally takes about 3 minutes for the change to appear
            live.</p>

        <h2 class="title">Configuration</h2>
        <form method="post">
            <?php wp_nonce_field(AICONIQ_REBUILD_NONCE, 'aiconiq_rebuild_nonce_field'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="aiconiq_rebuild_url">Build hook URL</label></th>
                    <td>
                        <input
                            type="url"
                            id="aiconiq_rebuild_url"
                            name="aiconiq_rebuild_url"
                            value="<?php echo esc_attr($url); ?>"
                            class="large-text code"
                            placeholder="https://api.netlify.com/build_hooks/abc123…"
                        />
                        <p class="description">
                            Get this from <strong>Netlify → Project configuration → Build & deploy → Build hooks → Add build hook</strong>.
                            Paste the URL it gives you.
                            For Vercel: <em>Project Settings → Git → Deploy Hooks</em>.
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Auto rebuild on save</th>
                    <td>
                        <label>
                            <input type="checkbox" name="aiconiq_rebuild_auto" value="1" <?php checked($auto, '1'); ?> />
                            Trigger a build automatically when a Page, ACF Footer option, menu, or Article is saved.
                        </label>
                        <p class="description">Multiple saves within <?php echo (int) AICONIQ_REBUILD_DEBOUNCE_SEC; ?> seconds are coalesced into a single build.</p>
                    </td>
                </tr>
            </table>
            <p class="submit">
                <button type="submit" name="aiconiq_rebuild_save" value="1" class="button button-primary">Save settings</button>
            </p>
        </form>

        <hr />

        <h2 class="title">Manual trigger</h2>
        <form method="post">
            <?php wp_nonce_field(AICONIQ_REBUILD_NONCE, 'aiconiq_rebuild_nonce_field'); ?>
            <p>Force a fresh build right now. Useful after running the seeder, switching languages, or any out-of-band change.</p>
            <p>
                <button type="submit" name="aiconiq_rebuild_now" value="1" class="button button-primary button-hero" <?php echo $url ? '' : 'disabled'; ?>>
                    Rebuild site now
                </button>
                <?php if (!$url): ?>
                    <em>(disabled — no build hook URL configured above)</em>
                <?php endif; ?>
            </p>
        </form>

        <hr />

        <h2 class="title">Status</h2>
        <table class="form-table" role="presentation">
            <tr>
                <th scope="row">Last fire</th>
                <td><?php echo esc_html($last_human); ?></td>
            </tr>
            <tr>
                <th scope="row">Last result</th>
                <td><code><?php echo esc_html($last_status); ?></code></td>
            </tr>
        </table>
    </div>
    <?php
}

// -----------------------------------------------------------------------------
// Webhook fire helper
// -----------------------------------------------------------------------------

/**
 * POSTs the configured webhook. Non-blocking by default so editor doesn't
 * wait for the network round-trip on save.
 */
function aiconiq_rebuild_fire(string $reason, bool $ignore_debounce = false): array
{
    $url = (string) get_option(AICONIQ_REBUILD_URL_OPT, '');
    if (!$url) {
        return ['ok' => false, 'message' => 'Build hook URL not configured.'];
    }

    if (!$ignore_debounce) {
        $last = (int) get_option(AICONIQ_REBUILD_LAST_TS_OPT, 0);
        if ($last && (time() - $last) < AICONIQ_REBUILD_DEBOUNCE_SEC) {
            return ['ok' => false, 'message' => 'Debounced (recently fired).'];
        }
    }

    $resp = wp_remote_post($url, [
        'timeout'   => 5,
        'blocking'  => $ignore_debounce, // wait for confirmation only on manual trigger
        'body'      => wp_json_encode(['trigger_title' => $reason]),
        'headers'   => ['Content-Type' => 'application/json'],
    ]);

    update_option(AICONIQ_REBUILD_LAST_TS_OPT, time());
    if (is_wp_error($resp)) {
        $msg = 'WP error: ' . $resp->get_error_message();
        update_option(AICONIQ_REBUILD_LAST_RESULT_OPT, $msg);
        return ['ok' => false, 'message' => $msg];
    }
    $code = $ignore_debounce ? wp_remote_retrieve_response_code($resp) : 200;
    if ($code >= 400) {
        $msg = 'HTTP ' . $code . ' from build hook';
        update_option(AICONIQ_REBUILD_LAST_RESULT_OPT, $msg);
        return ['ok' => false, 'message' => $msg];
    }
    update_option(AICONIQ_REBUILD_LAST_RESULT_OPT, $reason . ' → ok');
    return ['ok' => true, 'message' => 'Triggered.'];
}

// -----------------------------------------------------------------------------
// Auto-rebuild hooks
// -----------------------------------------------------------------------------

function aiconiq_rebuild_maybe_fire(string $reason): void
{
    if (get_option(AICONIQ_REBUILD_AUTO_OPT, '1') !== '1') return;
    aiconiq_rebuild_fire($reason);
}

// Page saves (incl. body_blocks edits via ACF)
add_action('save_post_page', function ($post_id, $post, $update) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) return;
    if ($post->post_status !== 'publish') return;
    aiconiq_rebuild_maybe_fire('Page saved: ' . $post->post_title);
}, 99, 3);

// Article saves (CPT)
add_action('save_post_article', function ($post_id, $post, $update) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) return;
    if ($post->post_status !== 'publish') return;
    aiconiq_rebuild_maybe_fire('Article saved: ' . $post->post_title);
}, 99, 3);

// ACF Options saves (Footer EN/DE)
add_action('acf/save_post', function ($post_id) {
    // ACF passes 'options' (or 'aiconiq_footer_en' / 'aiconiq_footer_de') for options pages.
    if (is_numeric($post_id)) return; // already handled by save_post_*
    aiconiq_rebuild_maybe_fire('Options saved: ' . $post_id);
}, 99);

// Nav menu changes (item add/remove/reorder, menu rename, location assignment)
add_action('wp_update_nav_menu', function ($menu_id) {
    aiconiq_rebuild_maybe_fire('Menu updated: #' . $menu_id);
}, 99);
