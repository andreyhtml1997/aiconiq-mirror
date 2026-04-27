<?php
/**
 * REST API CORS for the headless front-end.
 *
 * The Next.js app lives on a different origin than WordPress, so the
 * browser blocks REST calls without an explicit `Access-Control-Allow-Origin`
 * header. This file whitelists the front-end origins we expect:
 *   - localhost dev (npm run dev → :3000)
 *   - Vercel preview/production deployments (*.vercel.app)
 *   - any extra hosts listed via `AICONIQ_ALLOWED_ORIGINS` env / constant
 *   - the WP host itself (so wp-admin previews and same-origin calls work)
 *
 * Public REST routes only (GET). No credentials, no Authorization header
 * exposure beyond what wp-json already supports — no security hole.
 */

if (!defined('ABSPATH')) exit;

function aiconiq_cors_allowed_origin(string $origin): bool
{
    if ($origin === '') return false;

    // Same origin as WP — always allowed.
    $site_host = parse_url(site_url(), PHP_URL_HOST);
    $origin_host = parse_url($origin, PHP_URL_HOST);
    if ($site_host && $origin_host && $site_host === $origin_host) return true;

    $static_allow = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
    ];
    if (in_array($origin, $static_allow, true)) return true;

    // Any *.vercel.app — covers preview and production deploys without
    // hard-coding the project's URL.
    if ($origin_host && (str_ends_with($origin_host, '.vercel.app') || $origin_host === 'vercel.app')) {
        return true;
    }

    // Override list from a constant defined in wp-config.php:
    //   define('AICONIQ_ALLOWED_ORIGINS', 'https://aiconiq.io,https://staging.aiconiq.io');
    if (defined('AICONIQ_ALLOWED_ORIGINS')) {
        $extras = array_filter(array_map('trim', explode(',', (string) AICONIQ_ALLOWED_ORIGINS)));
        if (in_array($origin, $extras, true)) return true;
    }

    return false;
}

add_action('rest_api_init', function () {
    // WP's default CORS handler emits a wildcard `*` for ?_jsonp and nothing
    // useful for cross-origin GETs from a different host. Replace it.
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    add_filter('rest_pre_serve_request', function ($value) {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($origin && aiconiq_cors_allowed_origin($origin)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Vary: Origin', false);
            header('Access-Control-Allow-Methods: GET, OPTIONS');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
            header('Access-Control-Max-Age: 600');
        }
        return $value;
    }, 15);
}, 15);

// Preflight OPTIONS comes in BEFORE rest_api_init runs, so handle it on
// the earlier `init` hook. If the request is a REST preflight, emit the
// CORS headers and exit before WP starts routing.
add_action('init', function () {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'OPTIONS') return;
    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($request_uri, '/wp-json/') === false) return;

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && aiconiq_cors_allowed_origin($origin)) {
        header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        header('Vary: Origin', false);
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        header('Access-Control-Max-Age: 600');
    }
    status_header(204);
    exit;
}, 0);
