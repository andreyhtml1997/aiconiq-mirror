<?php
/**
 * REST exposure for `body_blocks` — section-specific normalizers.
 *
 * Each layout produces a stable, JSON-friendly data shape consumed by the
 * NextJS components (mirrors the original i18n keys so refactoring is trivial).
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Strip protocol+host from local upload URLs so the frontend gets a same-origin
 * relative path. NextJS dev (next.config.ts) proxies /wp-content/uploads/* to
 * the actual WP host, sidestepping cross-origin / mixed-content / cert issues.
 * In production the WP host should match siteurl, so this is a no-op there.
 */
function aiconiq_public_url(string $url): string
{
    $site_host = parse_url(site_url(), PHP_URL_HOST);
    if (!$site_host) return $url;
    foreach (['https://', 'http://'] as $scheme) {
        $prefix = $scheme . $site_host;
        if (strpos($url, $prefix) === 0) {
            return substr($url, strlen($prefix));
        }
    }
    return $url;
}

function aiconiq_norm_image($image): ?array
{
    if (!is_array($image) || empty($image['url'])) return null;
    return [
        'id' => isset($image['ID']) ? (int) $image['ID'] : null,
        'url' => aiconiq_public_url($image['url']),
        'alt' => $image['alt'] ?? '',
        'width' => $image['width'] ?? null,
        'height' => $image['height'] ?? null,
    ];
}

function aiconiq_norm_file($file): ?array
{
    if (!is_array($file) || empty($file['url'])) return null;
    return [
        'id' => isset($file['ID']) ? (int) $file['ID'] : null,
        'url' => aiconiq_public_url($file['url']),
        'mime' => $file['mime_type'] ?? null,
        'filename' => $file['filename'] ?? basename($file['url']),
    ];
}

function aiconiq_norm_link($link): ?array
{
    if (!is_array($link) || empty($link['url'])) return null;
    return ['url' => $link['url'], 'title' => $link['title'] ?? '', 'target' => $link['target'] ?? ''];
}

function aiconiq_norm_button(array $row): array
{
    $mode = $row['mode'] ?? 'action';
    return [
        'label' => $row['label'] ?? '',
        'mode' => $mode,
        'url' => $mode === 'url' ? aiconiq_norm_link($row['url'] ?? null) : null,
    ];
}

function aiconiq_repeater_texts($rows, string $field = 'text'): array
{
    $out = [];
    if (is_array($rows)) {
        foreach ($rows as $r) {
            $val = is_array($r) ? ($r[$field] ?? '') : (string) $r;
            if ($val !== '') $out[] = $val;
        }
    }
    return $out;
}

/**
 * Sub-normalizer for the AvS card group (used by both automation + collaboration).
 */
function aiconiq_norm_avs_card(array $card, bool $with_result_icon = false): array
{
    $base = [
        'badge' => $card['badge'] ?? '',
        'heading' => $card['heading'] ?? '',
        'description' => $card['description'] ?? '',
        'use_cases_title' => $card['use_cases_title'] ?? '',
        'use_cases' => aiconiq_repeater_texts($card['use_cases'] ?? []),
        'example_title' => $card['example_title'] ?? '',
    ];
    return $base;
}

function aiconiq_normalize_block(array $row): ?array
{
    $type = $row['acf_fc_layout'] ?? '';
    if (!$type) return null;

    $common = [
        'anchor' => $row['anchor'] ?? '',
        'divider_below' => !empty($row['divider_below']),
    ];

    switch ($type) {

        case 'hero_main': {
            $stats = [];
            foreach ((array) ($row['stats'] ?? []) as $s) {
                if (empty($s['value']) && empty($s['label'])) continue;
                $stats[] = [
                    'pre_value' => $s['pre_value'] ?? '',
                    'value' => $s['value'] ?? '',
                    'label' => $s['label'] ?? '',
                ];
            }
            $avatars = [];
            foreach ((array) ($row['avatars'] ?? []) as $a) {
                $img = aiconiq_norm_image($a['image'] ?? null);
                if ($img) $avatars[] = $img;
            }
            $cta = is_array($row['cta'] ?? null) ? aiconiq_norm_button($row['cta']) : null;
            $data = [
                'main_heading' => $row['main_heading'] ?? '',
                'we_deliver' => $row['we_deliver'] ?? '',
                'digital_employees' => $row['digital_employees'] ?? '',
                'description' => $row['description'] ?? '',
                'video' => aiconiq_norm_file($row['video'] ?? null),
                'image' => aiconiq_norm_image($row['image'] ?? null),
                'stats' => $stats,
                'avatars' => $avatars,
                'logo' => aiconiq_norm_image($row['logo'] ?? null),
                'cta' => $cta,
            ];
            break;
        }

        case 'auto_vs_intro_video': {
            $data = [
                'video' => aiconiq_norm_file($row['video'] ?? null),
            ];
            break;
        }

        case 'auto_vs_cards': {
            $a = is_array($row['automation'] ?? null) ? $row['automation'] : [];
            $c = is_array($row['collaboration'] ?? null) ? $row['collaboration'] : [];
            $data = [
                'badge' => $row['badge'] ?? '',
                'middle_word' => $row['middle_word'] ?? '',
                'title' => $row['title'] ?? '',
                'description' => $row['description'] ?? '',
                'automation' => array_merge(aiconiq_norm_avs_card($a), [
                    'example_p1' => $a['example_p1'] ?? '',
                    'example_p2' => $a['example_p2'] ?? '',
                    'result_label' => $a['result_label'] ?? '',
                    'result_value' => $a['result_value'] ?? '',
                    'result_description' => $a['result_description'] ?? '',
                    'result_icon' => aiconiq_norm_image($a['result_icon'] ?? null),
                ]),
                'collaboration' => array_merge(aiconiq_norm_avs_card($c), [
                    'example_paragraph' => $c['example_paragraph'] ?? '',
                    'conclusion_title' => $c['conclusion_title'] ?? '',
                    'conclusion_text' => $c['conclusion_text'] ?? '',
                    'cta' => is_array($c['cta'] ?? null) ? aiconiq_norm_button($c['cta']) : null,
                ]),
            ];
            break;
        }

        case 'positioning_intro': {
            $l = is_array($row['left_block'] ?? null) ? $row['left_block'] : [];
            $r = is_array($row['right_block'] ?? null) ? $row['right_block'] : [];
            $data = [
                'badge' => $row['badge'] ?? '',
                'title' => $row['title'] ?? '',
                'description' => $row['description'] ?? '',
                'left_block' => [
                    'badge' => $l['badge'] ?? '',
                    'title' => $l['title'] ?? '',
                    'description' => $l['description'] ?? '',
                    'icon' => aiconiq_norm_image($l['icon'] ?? null),
                ],
                'right_block' => [
                    'overlay_text' => $r['overlay_text'] ?? '',
                    'description' => $r['description'] ?? '',
                    'image' => aiconiq_norm_image($r['image'] ?? null),
                ],
            ];
            break;
        }

        case 'positioning_bottom': {
            $data = [
                'title' => $row['title'] ?? '',
                'badge' => $row['badge'] ?? '',
                'description' => $row['description'] ?? '',
                'result_label' => $row['result_label'] ?? '',
                'result_title' => $row['result_title'] ?? '',
                'result_description' => $row['result_description'] ?? '',
            ];
            break;
        }

        case 'problem_solution': {
            $cards = [];
            foreach ((array) ($row['cards'] ?? []) as $c) {
                $cards[] = [
                    'label' => $c['label'] ?? '',
                    'icon' => aiconiq_norm_image($c['icon'] ?? null),
                    'image' => aiconiq_norm_image($c['image'] ?? null),
                    'features' => aiconiq_repeater_texts($c['features'] ?? []),
                    'quality_label' => $c['quality_label'] ?? '',
                    'quality_value' => $c['quality_value'] ?? '',
                ];
            }
            $cta = is_array($row['cta'] ?? null) ? aiconiq_norm_button($row['cta']) : null;
            $data = [
                'badge' => $row['badge'] ?? '',
                'middle_word' => $row['middle_word'] ?? '',
                'title' => $row['title'] ?? '',
                'description1' => $row['description1'] ?? '',
                'description2' => $row['description2'] ?? '',
                'accuracy_text' => $row['accuracy_text'] ?? '',
                'cta' => $cta,
                'how_it_works' => $row['how_it_works'] ?? '',
                'cards' => $cards,
            ];
            break;
        }

        case 'knowledge_intro': {
            $data = [
                'badge' => $row['badge'] ?? '',
                'title' => $row['title'] ?? '',
                'video' => aiconiq_norm_file($row['video'] ?? null),
            ];
            break;
        }

        case 'knowledge_steps': {
            $steps = [];
            foreach ((array) ($row['steps'] ?? []) as $s) {
                $steps[] = [
                    'icon' => aiconiq_norm_image($s['icon'] ?? null),
                    'animation_type' => $s['animation_type'] ?? 'card1',
                    'title' => $s['title'] ?? '',
                    'description' => $s['description'] ?? '',
                    'video' => aiconiq_norm_file($s['video'] ?? null),
                ];
            }
            $btn = is_array($row['button'] ?? null) ? aiconiq_norm_button($row['button']) : null;
            $data = [
                'steps' => $steps,
                'button' => $btn,
            ];
            break;
        }

        case 'lead_capture_top': {
            $btn = is_array($row['button'] ?? null) ? aiconiq_norm_button($row['button']) : null;
            $data = [
                'title_part1' => $row['title_part1'] ?? '',
                'title_highlight' => $row['title_highlight'] ?? '',
                'title_part2' => $row['title_part2'] ?? '',
                'description' => $row['description'] ?? '',
                'button' => $btn,
                'video' => aiconiq_norm_file($row['video'] ?? null),
                'banner' => aiconiq_norm_image($row['banner'] ?? null),
            ];
            break;
        }

        case 'lead_capture_bottom': {
            $btn = is_array($row['button'] ?? null) ? aiconiq_norm_button($row['button']) : null;
            $data = [
                'title' => $row['title'] ?? '',
                'button' => $btn,
                'image' => aiconiq_norm_image($row['image'] ?? null),
                'background' => aiconiq_norm_image($row['background'] ?? null),
            ];
            break;
        }

        case 'solutions_overview': {
            $sols = [];
            foreach ((array) ($row['solutions'] ?? []) as $s) {
                $sols[] = [
                    'icon' => aiconiq_norm_image($s['icon'] ?? null),
                    'title' => $s['title'] ?? '',
                    'description' => $s['description'] ?? '',
                ];
            }
            $btn = is_array($row['button'] ?? null) ? aiconiq_norm_button($row['button']) : null;
            $data = [
                'title' => $row['title'] ?? '',
                'button' => $btn,
                'solutions' => $sols,
            ];
            break;
        }

        case 'stats': {
            $top = $bot = [];
            foreach ((array) ($row['top_stats'] ?? []) as $s) {
                $top[] = ['value' => $s['value'] ?? '', 'description' => $s['description'] ?? ''];
            }
            foreach ((array) ($row['bottom_stats'] ?? []) as $s) {
                $bot[] = ['value' => $s['value'] ?? '', 'description' => $s['description'] ?? ''];
            }
            $data = ['top_stats' => $top, 'bottom_stats' => $bot];
            break;
        }

        case 'testimonials': {
            $items = [];
            foreach ((array) ($row['items'] ?? []) as $i) {
                $items[] = [
                    'icon' => aiconiq_norm_image($i['icon'] ?? null),
                    'name' => $i['name'] ?? '',
                    'description' => $i['description'] ?? '',
                    'video' => aiconiq_norm_file($i['video'] ?? null),
                    'reverse' => !empty($i['reverse']),
                ];
            }
            $data = [
                'badge' => $row['badge'] ?? '',
                'title' => $row['title'] ?? '',
                'items' => $items,
            ];
            break;
        }

        case 'security': {
            $cards = [];
            foreach ((array) ($row['cards'] ?? []) as $c) {
                $cards[] = [
                    'title' => $c['title'] ?? '',
                    'description' => $c['description'] ?? '',
                    'badge' => $c['badge'] ?? '',
                    'highlight' => $c['highlight'] ?? '',
                    'image' => aiconiq_norm_image($c['image'] ?? null),
                ];
            }
            $data = [
                'badge' => $row['badge'] ?? '',
                'title' => $row['title'] ?? '',
                'description1' => $row['description1'] ?? '',
                'description2' => $row['description2'] ?? '',
                'cards' => $cards,
            ];
            break;
        }

        case 'make_impact': {
            $data = [
                'badge' => $row['badge'] ?? '',
                'title' => $row['title'] ?? '',
                'coming_soon' => $row['coming_soon'] ?? '',
                'team_image' => aiconiq_norm_image($row['team_image'] ?? null),
            ];
            break;
        }

        case 'competitive_advantage_hero': {
            $btn = is_array($row['button'] ?? null) ? aiconiq_norm_button($row['button']) : null;
            $data = [
                'title' => $row['title'] ?? '',
                'description' => $row['description'] ?? '',
                'button' => $btn,
                'logo' => aiconiq_norm_image($row['logo'] ?? null),
                'banner' => aiconiq_norm_image($row['banner'] ?? null),
            ];
            break;
        }

        case 'consultant_section': {
            $avatars = [];
            foreach ((array) ($row['avatars'] ?? []) as $a) {
                $img = aiconiq_norm_image($a['image'] ?? null);
                if ($img) $avatars[] = $img;
            }
            $btn = is_array($row['button'] ?? null) ? aiconiq_norm_button($row['button']) : null;
            $data = [
                'title' => $row['title'] ?? '',
                'button' => $btn,
                'avatars' => $avatars,
                'consult_logo' => aiconiq_norm_image($row['consult_logo'] ?? null),
                'back_logo' => aiconiq_norm_image($row['back_logo'] ?? null),
            ];
            break;
        }

        case 'text': {
            $data = [
                'eyebrow' => $row['eyebrow'] ?? '',
                'title' => $row['title'] ?? '',
                'body' => $row['body'] ?? '',
            ];
            if (empty(trim((string) $data['title'])) && empty(trim(strip_tags((string) $data['body'])))) return null;
            break;
        }

        case 'divider': {
            $data = ['style' => $row['style'] ?? 'line'];
            break;
        }

        default:
            return null;
    }

    return array_merge(['type' => $type], $common, ['data' => $data]);
}

function aiconiq_get_body_blocks(int $post_id): array
{
    if (!function_exists('get_field')) return [];
    $rows = get_field('body_blocks', $post_id);
    if (!is_array($rows)) return [];

    $out = [];
    foreach ($rows as $row) {
        $block = aiconiq_normalize_block($row);
        if ($block) $out[] = $block;
    }
    return $out;
}

add_action('rest_api_init', function () {
    // Only `page` exposes body_blocks. Articles use their own ACF fields
    // (hero, slider, tabs) registered separately in functions/acf.php.
    register_rest_field('page', 'body_blocks', [
        'get_callback' => function ($object) {
            return aiconiq_get_body_blocks((int) $object['id']);
        },
        'schema' => null,
    ]);
});
