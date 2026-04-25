<?php
/**
 * Sidebar meta-box on the Page editor with a button:
 * "Sync block order to translations".
 *
 * Click → AJAX call → reorders `body_blocks` in every Polylang translation
 * to match the order in the page being edited. Per-language text and media
 * inside each block stay independent — only the order moves.
 *
 * Matching is by `acf_fc_layout` type (1st of type → 1st of type, …).
 * Translation blocks whose type doesn't exist on the source are appended
 * to the end so nothing is lost silently.
 */

if (!defined('ABSPATH')) exit;

const AICONIQ_SYNC_NONCE = 'aiconiq_sync_blocks_order';

function aiconiq_sync_blocks_order_run(int $source_id): array
{
    if (!function_exists('pll_get_post_translations')) {
        return ['ok' => false, 'message' => 'Polylang is not active.'];
    }
    if (!function_exists('get_field')) {
        return ['ok' => false, 'message' => 'ACF is not active.'];
    }
    if (get_post_type($source_id) !== 'page') {
        return ['ok' => false, 'message' => 'Source must be a page.'];
    }

    $source_blocks = get_field('body_blocks', $source_id, false);
    if (!is_array($source_blocks) || !$source_blocks) {
        return ['ok' => false, 'message' => 'Source page has no body_blocks to sync from.'];
    }

    $translations = pll_get_post_translations($source_id);
    if (!is_array($translations) || count($translations) < 2) {
        return ['ok' => false, 'message' => 'No other-language translations linked to this page.'];
    }

    $source_types_in_order = [];
    foreach ($source_blocks as $b) {
        $type = $b['acf_fc_layout'] ?? '';
        if ($type) $source_types_in_order[] = $type;
    }
    if (!$source_types_in_order) {
        return ['ok' => false, 'message' => 'Source has no recognizable layouts.'];
    }

    $synced = [];
    $skipped = [];
    foreach ($translations as $lang => $tid) {
        $tid = (int) $tid;
        if ($tid === $source_id || $tid <= 0) continue;

        $tr_blocks = get_field('body_blocks', $tid, false);
        if (!is_array($tr_blocks) || !$tr_blocks) {
            $skipped[] = strtoupper($lang) . ' (empty)';
            continue;
        }

        $tr_by_type = [];
        foreach ($tr_blocks as $b) {
            $type = $b['acf_fc_layout'] ?? '';
            if (!$type) continue;
            $tr_by_type[$type] = $tr_by_type[$type] ?? [];
            $tr_by_type[$type][] = $b;
        }

        $new_tr_blocks = [];
        foreach ($source_types_in_order as $type) {
            if (!empty($tr_by_type[$type])) {
                $new_tr_blocks[] = array_shift($tr_by_type[$type]);
            }
        }
        foreach ($tr_by_type as $remaining) {
            foreach ($remaining as $b) {
                $new_tr_blocks[] = $b;
            }
        }

        if (json_encode($new_tr_blocks) === json_encode($tr_blocks)) {
            $skipped[] = strtoupper($lang) . ' (already in order)';
            continue;
        }

        update_field('body_blocks', $new_tr_blocks, $tid);
        $synced[] = strtoupper($lang);
    }

    $msg_parts = [];
    if ($synced) $msg_parts[] = 'Synced: ' . implode(', ', $synced);
    if ($skipped) $msg_parts[] = 'Skipped: ' . implode(', ', $skipped);
    return ['ok' => true, 'message' => $msg_parts ? implode('. ', $msg_parts) . '.' : 'Nothing to sync.'];
}

add_action('add_meta_boxes', function () {
    add_meta_box(
        'aiconiq_sync_blocks',
        'Sync block order',
        'aiconiq_sync_blocks_metabox_render',
        'page',
        'side',
        'high'
    );
});

function aiconiq_sync_blocks_metabox_render(WP_Post $post): void
{
    $linked = function_exists('pll_get_post_translations') ? pll_get_post_translations($post->ID) : [];
    $other = [];
    foreach ($linked as $lang => $tid) {
        if ((int) $tid !== $post->ID && (int) $tid > 0) {
            $other[] = strtoupper($lang);
        }
    }
    ?>
    <p style="margin-top:0;color:#646970;font-size:12px;line-height:1.5">
        Copies the order of layouts in <strong>body_blocks</strong> from this page to its translations
        (<?php echo $other ? esc_html(implode(', ', $other)) : '<em>no translations linked</em>'; ?>).
        Per-language text and media stay independent — only the order moves.
    </p>
    <p style="margin:8px 0 4px">
        <button
            type="button"
            class="button button-primary"
            id="aiconiq-sync-blocks-btn"
            data-post-id="<?php echo (int) $post->ID; ?>"
            data-nonce="<?php echo esc_attr(wp_create_nonce(AICONIQ_SYNC_NONCE)); ?>"
            <?php echo $other ? '' : 'disabled'; ?>
        >Sync block order to translations</button>
    </p>
    <p id="aiconiq-sync-blocks-status" style="margin:6px 0 0;font-size:12px;color:#646970;min-height:1.4em" aria-live="polite"></p>
    <script>
    (function () {
        var btn = document.getElementById('aiconiq-sync-blocks-btn');
        var status = document.getElementById('aiconiq-sync-blocks-status');
        if (!btn) return;
        btn.addEventListener('click', function () {
            btn.disabled = true;
            status.style.color = '#646970';
            status.textContent = 'Syncing…';
            var fd = new FormData();
            fd.append('action', 'aiconiq_sync_blocks_order');
            fd.append('post_id', btn.dataset.postId);
            fd.append('_wpnonce', btn.dataset.nonce);
            fetch(ajaxurl, { method: 'POST', credentials: 'same-origin', body: fd })
                .then(function (r) { return r.json(); })
                .then(function (json) {
                    btn.disabled = false;
                    if (json && json.success) {
                        status.style.color = '#1a7f37';
                        status.textContent = json.data && json.data.message ? json.data.message : 'Done.';
                    } else {
                        status.style.color = '#b32d2e';
                        status.textContent = (json && json.data && json.data.message) ? json.data.message : 'Sync failed.';
                    }
                })
                .catch(function (err) {
                    btn.disabled = false;
                    status.style.color = '#b32d2e';
                    status.textContent = 'Network error: ' + (err && err.message ? err.message : err);
                });
        });
    }());
    </script>
    <?php
}

add_action('wp_ajax_aiconiq_sync_blocks_order', function () {
    check_ajax_referer(AICONIQ_SYNC_NONCE);
    $post_id = isset($_POST['post_id']) ? (int) $_POST['post_id'] : 0;
    if (!$post_id || !current_user_can('edit_post', $post_id)) {
        wp_send_json_error(['message' => 'Permission denied.'], 403);
    }
    $result = aiconiq_sync_blocks_order_run($post_id);
    if ($result['ok']) {
        wp_send_json_success(['message' => $result['message']]);
    } else {
        wp_send_json_error(['message' => $result['message']]);
    }
});
