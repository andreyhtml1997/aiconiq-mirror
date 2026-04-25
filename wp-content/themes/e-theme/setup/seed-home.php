<?php
/**
 * One-shot seeder: builds the Home page (EN + DE) with all 13 section blocks,
 * downloads required media from aiconiq.io into the WP Media Library, links
 * the two language versions via Polylang, and creates a Primary menu.
 *
 * Idempotent: re-runs reuse existing posts / attachments by source URL.
 *
 * Triggered from Tools → "AICONIQ: Seed home page" (functions/admin-setup.php).
 */

if (!defined('ABSPATH')) exit;

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function aiconiq_seed_log(array &$log, string $msg): void
{
    $log[] = $msg;
}

/**
 * Imports one media file into the WP Media Library.
 *
 * Order of attempts:
 *   1. Reuse existing attachment (matched by `_aiconiq_source_url` meta).
 *   2. Local file in `assets/public/{rel_path}` — the Next.js front-end
 *      ships these as static assets, so we get an offline-capable seeder
 *      for everything bundled with the repo.
 *   3. Network fallback: download from https://aiconiq.io{rel_path}.
 *      Only needed for heavy media (~5 videos) that are not committed to
 *      the repo.
 */
function aiconiq_seed_sideload(string $rel_path, string $title, array &$log): ?int
{
    $url = 'https://aiconiq.io' . $rel_path;
    $local_path = get_template_directory() . '/assets/public' . $rel_path;
    $basename = basename(parse_url($url, PHP_URL_PATH));

    // 1. Existing attachment?
    $existing = get_posts([
        'post_type' => 'attachment',
        'meta_key' => '_aiconiq_source_url',
        'meta_value' => $url,
        'numberposts' => 1,
        'post_status' => 'any',
    ]);
    if ($existing) {
        aiconiq_seed_log($log, "↻ reused {$title} (#{$existing[0]->ID})");
        return (int) $existing[0]->ID;
    }

    // 2. Try a local copy from the front-end bundle first.
    if (file_exists($local_path) && is_readable($local_path)) {
        $tmp = wp_tempnam($basename);
        if ($tmp && @copy($local_path, $tmp)) {
            $att_id = media_handle_sideload(
                ['name' => $basename, 'tmp_name' => $tmp],
                0,
                $title
            );
            if (!is_wp_error($att_id)) {
                update_post_meta($att_id, '_aiconiq_source_url', $url);
                aiconiq_seed_log($log, "✓ imported {$title} from local bundle (#{$att_id})");
                return (int) $att_id;
            }
            @unlink($tmp);
            aiconiq_seed_log($log, "⚠ local sideload failed for {$title}: " . $att_id->get_error_message() . " — falling back to network");
        }
    }

    // 3. Network fallback.
    $tmp = download_url($url, 600);
    if (is_wp_error($tmp)) {
        aiconiq_seed_log($log, "✗ {$title}: no local copy in assets/public{$rel_path} AND network download failed — " . $tmp->get_error_message());
        return null;
    }
    $att_id = media_handle_sideload(
        ['name' => $basename, 'tmp_name' => $tmp],
        0,
        $title
    );
    if (is_wp_error($att_id)) {
        @unlink($tmp);
        aiconiq_seed_log($log, "✗ sideload failed: {$url} — " . $att_id->get_error_message());
        return null;
    }
    update_post_meta($att_id, '_aiconiq_source_url', $url);
    aiconiq_seed_log($log, "✓ downloaded {$title} from network (#{$att_id})");
    return (int) $att_id;
}

/**
 * Upsert the EN Home page and its DE translation. Returns [en_id, de_id].
 *
 * Polylang complication: WP enforces unique slugs across all posts of one type.
 * We can't have two pages both with slug "home". So we find the EN page by
 * slug, then find the DE translation via Polylang's translation linkage. If
 * the DE doesn't exist, create it (WP will assign a unique slug like home-2)
 * and link it via pll_save_post_translations().
 */
function aiconiq_seed_upsert_home_pages(array &$log): array
{
    $find_by_slug_lang = function (string $slug, string $lang): ?int {
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT p.ID FROM {$wpdb->posts} p
             WHERE p.post_type = 'page'
               AND p.post_status IN ('publish','draft','pending','private','future')
               AND p.post_name = %s
             ORDER BY p.ID ASC",
            $slug
        ));
        if (!$row) return null;
        // Walk each candidate and return the one whose Polylang language matches.
        $candidates = $wpdb->get_col($wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts} WHERE post_type='page' AND post_name=%s",
            $slug
        ));
        foreach ($candidates as $cid) {
            $cid = (int) $cid;
            if (!function_exists('pll_get_post_language')) {
                return $cid;
            }
            if (pll_get_post_language($cid) === $lang) return $cid;
        }
        return null;
    };

    // EN page
    $en_id = $find_by_slug_lang('home', 'en');
    if (!$en_id) {
        $en_id = (int) wp_insert_post([
            'post_type' => 'page', 'post_status' => 'publish',
            'post_title' => 'Home (EN)', 'post_name' => 'home',
        ]);
        if (function_exists('pll_set_post_language')) {
            pll_set_post_language($en_id, 'en');
        }
        aiconiq_seed_log($log, "✓ created page Home (EN) (#{$en_id})");
    } else {
        aiconiq_seed_log($log, "↻ reused page Home (EN) (#{$en_id})");
    }
    update_post_meta($en_id, '_wp_page_template', 'page-templates/blocks.php');

    // DE page — find by Polylang link first
    $de_id = null;
    if (function_exists('pll_get_post')) {
        $maybe = pll_get_post($en_id, 'de');
        if ($maybe) $de_id = (int) $maybe;
    }
    if (!$de_id) {
        // Insert without slug — WP would otherwise rename it to home-2 because
        // it doesn't yet know this post is a different language.
        $de_id = (int) wp_insert_post([
            'post_type' => 'page', 'post_status' => 'publish',
            'post_title' => 'Home (DE)',
        ]);
        if (function_exists('pll_set_post_language')) {
            pll_set_post_language($de_id, 'de');
        }
        if (function_exists('pll_save_post_translations')) {
            pll_save_post_translations(['en' => $en_id, 'de' => $de_id]);
        }
        // Now that Polylang knows the language, the same slug across languages is OK.
        global $wpdb;
        $wpdb->update($wpdb->posts, ['post_name' => 'home'], ['ID' => $de_id]);
        clean_post_cache($de_id);
        aiconiq_seed_log($log, "✓ created page Home (DE) (#{$de_id}), linked to EN, slug=home");
    } else {
        aiconiq_seed_log($log, "↻ reused page Home (DE) (#{$de_id})");
    }
    update_post_meta($de_id, '_wp_page_template', 'page-templates/blocks.php');

    return [$en_id, $de_id];
}

// -----------------------------------------------------------------------------
// Asset manifest
// -----------------------------------------------------------------------------

function aiconiq_seed_assets(): array
{
    return [
        'hero_video' => '/assets/hero/f570a274-optimized.mp4',
        'hero_avatar1' => '/assets/hero/avatar/avatar1.webp',
        'hero_avatar2' => '/assets/hero/avatar/avatar2.webp',
        'hero_avatar3' => '/assets/hero/avatar/avatar3.webp',
        'hero_logo' => '/assets/logo.svg',

        'auto_video' => '/assets/INVENTIVE_AICONIQ_Hero-Video_20260127_16x9_1080p_FINAL_x264.mp4',
        'auto_icon' => '/assets/auto/icon1.webp',

        'pos_left_icon' => '/assets/icons/user.svg',
        'pos_right_image' => '/assets/positioning-img/avatar.webp',

        'ps_chatgpt_icon' => '/assets/problem/chatgpt.svg',
        'ps_chatgpt_img' => '/assets/problem/1.webp',
        'ps_rag_icon' => '/assets/problem/rag.svg',
        'ps_rag_img' => '/assets/problem/2.webp',
        'ps_aiconiq_icon' => '/assets/problem/aicoin1.webp',
        'ps_aiconiq_img' => '/assets/problem/3.webp',

        'k_video' => '/assets/main_video_new.mp4',
        'k_icon1' => '/assets/knowledge-img/icon1.svg',
        'k_icon2' => '/assets/knowledge-img/icon2.svg',
        'k_icon3' => '/assets/knowledge-img/icon3.svg',
        'k_icon4' => '/assets/knowledge-img/icon4.svg',

        'lc_video' => '/assets/interview-101.mp4',
        'lc_banner' => '/assets/ctabanner.webp',
        'lc_avatar' => '/assets/lead-img/avatar.webp',
        'lc_bg' => '/assets/lead-img/bg.webp',

        'so_icon1' => '/assets/solutions-icons/1.svg',
        'so_icon2' => '/assets/solutions-icons/2.svg',
        'so_icon3' => '/assets/solutions-icons/3.svg',
        'so_icon4' => '/assets/solutions-icons/4.svg',

        'te_logo' => '/assets/mumdatlogo.svg',
        'te_video' => '/assets/mainmumdat.mp4',

        'mi_team' => '/assets/team-image.png',

        'cah_logo' => '/assets/logo-con.webp',
        'cah_banner' => '/assets/banner-con.webp',

        'cs_logo' => '/assets/consultant/consult-logo.webp',
        'cs_back' => '/assets/consultant/back-logo.svg',
        'cs_ava1' => '/assets/consultant/ava1.webp',
        'cs_ava2' => '/assets/consultant/ava2.webp',
        'cs_ava3' => '/assets/consultant/ava3.webp',

        'se_card1' => '/assets/security/card1.webp',
        'se_card2' => '/assets/security/card2.webp',
        'se_card3' => '/assets/security/card3.webp',
        'se_card4' => '/assets/security/card4.webp',
        'se_card5' => '/assets/security/card5.webp',

        'ft_logo' => '/assets/footer/aiconiq-logo-purple.svg',
        'ft_big_logo' => '/assets/footer/AICONIQ.svg',
    ];
}

// -----------------------------------------------------------------------------
// Footer block content (per language)
// -----------------------------------------------------------------------------


function aiconiq_seed_footer_options(string $lang, array $ids, array &$log): void
{
    $opt = $lang === 'de' ? 'aiconiq_footer_de' : 'aiconiq_footer_en';
    $en = [
        'description' => 'AICONIQ develops AI solutions for medium-sized businesses - to maintain the competitiveness of our industrial location.',
        'social_label' => 'Social', 'links_label' => 'Links',
        'links' => [
            ['name' => 'Legal Notice', 'url' => '/en/imprint'],
            ['name' => 'Terms of Use', 'url' => 'https://aiconiq.io/ds.pdf'],
        ],
    ];
    $de = [
        'description' => 'AICONIQ entwickelt AI Lösungen für den Mittelstand - um die Wettbewerbsfähigkeit unseres Industriestandortes zu erhalten.',
        'social_label' => 'Social', 'links_label' => 'Links',
        'links' => [
            ['name' => 'Impressum', 'url' => '/de/imprint'],
            ['name' => 'Nutzungsbedingungen', 'url' => 'https://aiconiq.io/ds.pdf'],
        ],
    ];
    $L = $lang === 'de' ? $de : $en;

    update_field('logo', $ids['ft_logo'] ?? '', $opt);
    update_field('big_logo', $ids['ft_big_logo'] ?? '', $opt);
    update_field('description', $L['description'], $opt);
    update_field('email', 'contact@aiconiq.io', $opt);
    update_field('social_label', $L['social_label'], $opt);
    update_field('links_label', $L['links_label'], $opt);
    update_field('socials', [
        ['name' => 'Linkedin', 'url' => 'https://www.linkedin.com/company/aiconiq-group/posts/'],
    ], $opt);
    update_field('links', $L['links'], $opt);

    aiconiq_seed_log($log, "✓ wrote footer options for {$lang} ({$opt})");
}

// -----------------------------------------------------------------------------
// Block content per language
// -----------------------------------------------------------------------------

function aiconiq_seed_blocks_en(array $ids): array
{
    return [
        [
            'acf_fc_layout' => 'hero_main',
            'main_heading' => 'Others deliver agents.',
            'we_deliver' => 'We deliver',
            'digital_employees' => 'digital employees',
            'description' => 'Digital colleagues who understand your company, think along and collaborate – for less routine, more innovation and real business value.',
            'video' => $ids['hero_video'] ?? '',
            'image' => '',
            'stats' => [
                ['pre_value' => 'Up to', 'value' => '9x', 'label' => 'Faster Time-to-Market'],
                ['pre_value' => '', 'value' => '-40%', 'label' => 'Implementation Duration'],
                ['pre_value' => '', 'value' => '-60%', 'label' => 'Project Costs'],
            ],
            'avatars' => [
                ['image' => $ids['hero_avatar1'] ?? ''],
                ['image' => $ids['hero_avatar2'] ?? ''],
                ['image' => $ids['hero_avatar3'] ?? ''],
            ],
            'logo' => $ids['hero_logo'] ?? '',
            'anchor' => 'home', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'auto_vs_intro_video',
            'video' => $ids['auto_video'] ?? '',
            'anchor' => 'auto-vs-video', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'auto_vs_cards',
            'badge' => 'Automation Collaboration',
            'middle_word' => 'vs',
            'title' => 'AICONIQ – from automation to real entrepreneurial intelligence.',
            'description' => 'AICONIQ expands human thinking - it connects knowledge, intuition and experience into intelligent action',
            'automation' => [
                'badge' => 'Automation', 'heading' => 'Where processes run, space emerges for strategic thinking',
                'description' => 'Less time searching, coordinating, reworking, more time for what matters. AICONIQ automates recurring tasks and creates seamless workflows across teams and systems.',
                'use_cases_title' => 'Typical Use Cases',
                'use_cases' => [
                    ['text' => 'Reporting & Documentation'],
                    ['text' => 'Data Maintenance & Process Control'],
                    ['text' => 'Meeting Protocols & Knowledge Archiving'],
                    ['text' => 'Appointment & Task Planning'],
                ],
                'example_title' => 'Practical Example',
                'example_p1' => 'Your company uses AICONIQ to save 20 hours of manual data preparation per week.',
                'example_p2' => 'The system recognizes patterns in reports, automatically summarizes results and distributes them directly to the right people.',
                'result_label' => 'THE RESULT', 'result_value' => '40',
                'result_description' => 'faster workflows – and more capacity in day-to-day business.',
                'result_icon' => $ids['auto_icon'] ?? '',
            ],
            'collaboration' => [
                'badge' => 'Collaboration', 'heading' => 'From individual knowledge to collective intelligence',
                'description' => 'Our digital co-workers support teams where experience, strategy and judgment are needed. They bring knowledge together, analyze options and help make better decisions – in real time.',
                'use_cases_title' => 'Typical Use Cases',
                'use_cases' => [
                    ['text' => 'Strategy & Product Development'],
                    ['text' => 'Management Decision Support'],
                    ['text' => 'Ideation & Innovation Processes'],
                    ['text' => 'Marketing & Communication'],
                ],
                'example_title' => 'Practical Example',
                'example_paragraph' => 'Your company uses AICONIQ to develop ideas for new service models. Your Buddy links internal experience with market and customer data, identifies trends and suggests suitable models. The team decides faster – based on clear facts instead of gut feeling.',
                'conclusion_title' => 'One system. Two effects. One goal.',
                'conclusion_text' => 'AICONIQ combines operational relief with strategic intelligence. Routine disappears, knowledge becomes usable, decisions become clearer. This creates an organization that not only works more efficiently but also acts smarter.',
            ],
            'anchor' => 'auto-vs', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'positioning_intro',
            'badge' => 'Positioning',
            'title' => 'What AICONIQ does differently',
            'description' => 'AICONIQ combines artificial intelligence with entrepreneurial intelligence. While other AI agents execute tasks, AICONIQ understands why people make decisions and integrates this logic into the system.',
            'left_block' => [
                'badge' => 'Assistants react', 'title' => 'AICONIQ acts.',
                'description' => 'Most AI systems work reactively: They answer questions, complete individual tasks or provide text suggestions. Useful, but limited. Because they understand neither the context of a company nor the connections in which decisions are made.',
                'icon' => $ids['pos_left_icon'] ?? '',
            ],
            'right_block' => [
                'overlay_text' => 'Goes one step further',
                'description' => 'Our digital co-workers work with the knowledge, data and processes of your company and act as if they were part of your team. They recognize patterns, learn from experience and support where knowledge needs to be translated into impact: in day-to-day business.',
                'image' => $ids['pos_right_image'] ?? '',
            ],
            'anchor' => 'positioning', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'positioning_bottom',
            'title' => 'How this shows in everyday life', 'badge' => 'Competencies',
            'description' => 'Where other systems only process explicit data and rules, AICONIQ can also handle implicit, institutional knowledge – that is, what lies in experience, intuition and corporate culture. The system observes, documents and learns from real decisions. Including the underlying thought processes.',
            'result_label' => 'THE RESULT', 'result_title' => 'More efficiency in day-to-day business',
            'result_description' => 'faster decisions and an organization that benefits from its own knowledge.',
            'anchor' => 'positioning-bottom', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'problem_solution',
            'badge' => 'PROBLEM Solution', 'middle_word' => 'AND',
            'title' => "We don't sell AI. We deliver implementation",
            'description1' => "Every company contains knowledge that stays in people's heads and disappears with your employees. AICONIQ makes this knowledge visible, usable and measurable.",
            'description2' => 'This creates a digital workforce that takes over routines, validates knowledge and strengthens your team.',
            'accuracy_text' => 'AICONIQ is 30% more accurate at Advice / Consult than Standard LLM.',
            'cta' => ['label' => 'Talk to me', 'mode' => 'action', 'url' => ''], 'how_it_works' => 'How AICONIQ works',
            'cards' => [
                ['label' => 'ChatGPT', 'icon' => $ids['ps_chatgpt_icon'] ?? '', 'image' => $ids['ps_chatgpt_img'] ?? '',
                    'features' => [['text' => 'LLM Knowledge'], ['text' => 'Explicit']],
                    'quality_label' => 'QUALITY OF ADVICE / CONSULT', 'quality_value' => '54%'],
                ['label' => 'RAG', 'icon' => $ids['ps_rag_icon'] ?? '', 'image' => $ids['ps_rag_img'] ?? '',
                    'features' => [['text' => 'Corporate Knowledge / Domain Knowledge'], ['text' => 'Explicit + Implicit']],
                    'quality_label' => 'QUALITY OF ADVICE / CONSULT', 'quality_value' => '59%'],
                ['label' => 'AICONIQ', 'icon' => $ids['ps_aiconiq_icon'] ?? '', 'image' => $ids['ps_aiconiq_img'] ?? '',
                    'features' => [['text' => 'Experimental Knowledge Employee / Expert and Conversational Knowledge'], ['text' => 'Explicit + Implicit + Tacit']],
                    'quality_label' => 'QUALITY OF ADVICE / CONSULT', 'quality_value' => '93%'],
            ],
            'anchor' => 'solutions', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'knowledge_intro',
            'badge' => 'Knowledge', 'title' => 'How AICONIQ works',
            'video' => $ids['k_video'] ?? '',
            'anchor' => 'about', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'knowledge_steps',
            'steps' => [
                ['icon' => $ids['k_icon1'] ?? '', 'animation_type' => 'card1', 'title' => 'Capture knowledge', 'description' => 'Captures all relevant conversations, documents and data from your company and builds a neural organizational memory from it, the basis for intelligent decisions.', 'video' => ''],
                ['icon' => $ids['k_icon2'] ?? '', 'animation_type' => 'card2', 'title' => 'Process data', 'description' => 'AICONIQ processes data into a central, company-specific data space. Within it, knowledge, memory and reasoning systems work together to store, link and verify knowledge – dynamically, securely and transparently.', 'video' => ''],
                ['icon' => $ids['k_icon3'] ?? '', 'animation_type' => 'card3', 'title' => 'Implement data', 'description' => 'AICONIQ Buddies translate knowledge into action. They operate in all business areas – from consulting to implementation, from support to training. Input Buddies capture knowledge from conversations and processes, Output Buddies implement it in a targeted manner. This creates a system that not only understands what needs to be done, but also does it.', 'video' => ''],
                ['icon' => $ids['k_icon4'] ?? '', 'animation_type' => 'card4', 'title' => 'Manage data', 'description' => 'The dashboard makes knowledge visible and measures not only activity with specially developed quality metrics, but the actual quality of your Buddies and the impact of knowledge in the company.', 'video' => ''],
            ],
            'button' => ['label' => 'Send request', 'mode' => 'action', 'url' => ''],
            'anchor' => 'knowledge-steps', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'lead_capture_top',
            'title_part1' => 'Built to', 'title_highlight' => 'deliver.', 'title_part2' => 'Not just to advise.',
            'description' => "Imagine having a team of excellent consultants and experts at your side – 24/7, who know your company inside out and support you at a fraction of the cost. That's exactly what AICONIQ delivers.",
            'button' => ['label' => '', 'mode' => 'action', 'url' => ''],
            'video' => $ids['lc_video'] ?? '', 'banner' => $ids['lc_banner'] ?? '',
            'anchor' => 'contact', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'lead_capture_bottom',
            'title' => 'Finally know what your company really knows.', 'button' => ['label' => 'Book initial consultation', 'mode' => 'action', 'url' => ''],
            'image' => $ids['lc_avatar'] ?? '', 'background' => $ids['lc_bg'] ?? '',
            'anchor' => 'lead-bottom', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'solutions_overview',
            'title' => 'Skilled labor shortage? Knowledge transfer? Efficiency? AICONIQ delivers answers.',
            'button' => ['label' => 'Send request', 'mode' => 'action', 'url' => ''],
            'solutions' => [
                ['icon' => $ids['so_icon1'] ?? '', 'title' => 'Secure knowledge', 'description' => 'Experience knowledge stays in the company'],
                ['icon' => $ids['so_icon2'] ?? '', 'title' => 'Solve skilled labor shortage', 'description' => 'Buddies take over routine tasks'],
                ['icon' => $ids['so_icon3'] ?? '', 'title' => 'Increase productivity', 'description' => 'Projects run faster, decisions more informed'],
                ['icon' => $ids['so_icon4'] ?? '', 'title' => 'Make knowledge measurable', 'description' => 'Real-time KPIs & dashboards'],
            ],
            'anchor' => '', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'stats',
            'top_stats' => [
                ['value' => '+60 %', 'description' => 'internal knowledge integrated into decision-making'],
                ['value' => '+35 %', 'description' => 'revenue potential through personalized, AI-based interaction'],
                ['value' => '–40 %', 'description' => 'effort through agent-controlled routine tasks'],
                ['value' => '+28 %', 'description' => 'up to +28% conversion rate through intelligent agent control'],
            ],
            'bottom_stats' => [
                ['value' => '9x', 'description' => 'up to 9x faster time-to-market'],
                ['value' => '–40 %', 'description' => 'implementation duration'],
                ['value' => '–60 %', 'description' => 'project costs'],
            ],
            'anchor' => '', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'testimonials',
            'badge' => 'Testimonials', 'title' => 'Testimonials',
            'items' => [
                ['icon' => $ids['te_logo'] ?? '', 'name' => 'markmann + müller',
                    'description' => 'Die Zusammenarbeit mit AICONIQ war für uns ein echter Gamechanger. Das Team versteht nicht nur KI auf technologischer Ebene, sondern auch unsere geschäftlichen Prozesse. Besonders beeindruckt hat uns, wie schnell komplexe Anforderungen verstanden und in funktionierende Lösungen übersetzt wurden. Man merkt sofort: Hier arbeiten Menschen, die nicht nur über Innovation sprechen, sondern sie wirklich umsetzen',
                    'video' => $ids['te_video'] ?? '', 'reverse' => true],
            ],
            'anchor' => 'testimonials', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'security',
            'badge' => 'Trust and Data Security', 'title' => 'AICONIQ is Fort Knox for your knowledge',
            'description1' => 'GDPR-compliant, ISO-certified and 100% data sovereign.',
            'description2' => "We don't see trust as a feature, but as the foundation of every collaboration.",
            'cards' => [
                ['title' => 'AICONIQ is Fort Knox for your knowledge', 'description' => 'AICONIQ meets GDPR requirements and goes beyond. All data is processed exclusively in certified European data centers – with end-to-end encryption, role-based access and zero-trust architecture.', 'badge' => 'This means:', 'highlight' => 'full transparency, no shadow processes, no uncontrolled interfaces.', 'image' => $ids['se_card1'] ?? ''],
                ['title' => 'Data security – tested, certified, resilient.', 'description' => 'Our infrastructure follows ISO 27001 standards. Access, logins and data flows are continuously monitored and documented. Every AICONIQ agent operates within defined security boundaries – with guardrails, logging and impact scoring to identify and control risks early.', 'badge' => '', 'highlight' => '', 'image' => $ids['se_card2'] ?? ''],
                ['title' => 'Corporate sovereignty – your data belongs to you', 'description' => 'AICONIQ was developed for organizations that don\'t want to give up their knowledge. Corporate data remains entirely within your systems. Nothing leaves your environment without explicit approval. The security concept follows the "Fort Knox principle": access only when necessary – control always with you.', 'badge' => '', 'highlight' => '', 'image' => $ids['se_card3'] ?? ''],
                ['title' => 'Trust architecture – traceable, auditable, accountable.', 'description' => 'Every AI decision, every access, every data movement can be tracked and audited. This creates not only protection, but also transparency – and thus trust on equal terms. AICONIQ meets the requirements of the EU AI Act regarding governance, documentation and auditability.', 'badge' => '', 'highlight' => '', 'image' => $ids['se_card4'] ?? ''],
                ['title' => 'Example from practice', 'description' => 'Using AICONIQ to consolidate product knowledge from development, sales and service. Despite sensitive data, everything remains internal – AICONIQ runs on company-owned servers and separates knowledge by roles and projects.', 'badge' => '', 'highlight' => '', 'image' => $ids['se_card5'] ?? ''],
            ],
            'anchor' => 'security', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'make_impact',
            'badge' => 'Strong Team', 'title' => 'Built by humans. Run with agents', 'coming_soon' => 'Coming soon',
            'team_image' => $ids['mi_team'] ?? '',
            'anchor' => 'team', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'competitive_advantage_hero',
            'title' => 'Turn knowledge into a competitive advantage.',
            'description' => 'Learn how AICONIQ makes your business smarter, faster and more independent.',
            'button' => ['label' => 'Send request', 'mode' => 'action', 'url' => ''],
            'logo' => $ids['cah_logo'] ?? '', 'banner' => $ids['cah_banner'] ?? '',
            'anchor' => '', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'consultant_section',
            'title' => "What if your best consultant wasn't human?", 'button' => ['label' => 'Send request', 'mode' => 'action', 'url' => ''],
            'avatars' => [
                ['image' => $ids['cs_ava1'] ?? ''],
                ['image' => $ids['cs_ava2'] ?? ''],
                ['image' => $ids['cs_ava3'] ?? ''],
            ],
            'consult_logo' => $ids['cs_logo'] ?? '', 'back_logo' => $ids['cs_back'] ?? '',
            'anchor' => '', 'divider_below' => false,
        ],
    ];
}

function aiconiq_seed_blocks_de(array $ids): array
{
    return [
        [
            'acf_fc_layout' => 'hero_main',
            'main_heading' => 'Wir bauen Ihr Corporate Brain.',
            'we_deliver' => 'Und AI Buddies,',
            'digital_employees' => 'die es ausführen',
            'description' => "Schluss mit isolierten Chatbots. Wir fusionieren Vektor-Spaces und Graph-Datenbanken zu einer zentralen Intelligenz. Das Ergebnis: Autonome 'Bodies' als digitale Workforce für komplexe Aufgaben.",
            'video' => $ids['hero_video'] ?? '',
            'image' => '',
            'stats' => [
                ['pre_value' => 'Bis zu', 'value' => '9x', 'label' => 'Schnellere Time-to-Market'],
                ['pre_value' => '', 'value' => '-40%', 'label' => 'Implementierungsdauer'],
                ['pre_value' => '', 'value' => '-60%', 'label' => 'Projektkosten'],
            ],
            'avatars' => [
                ['image' => $ids['hero_avatar1'] ?? ''],
                ['image' => $ids['hero_avatar2'] ?? ''],
                ['image' => $ids['hero_avatar3'] ?? ''],
            ],
            'logo' => $ids['hero_logo'] ?? '',
            'anchor' => 'home', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'auto_vs_intro_video',
            'video' => $ids['auto_video'] ?? '',
            'anchor' => 'auto-vs-video', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'auto_vs_cards',
            'badge' => 'Automatisierung Zusammenarbeit', 'middle_word' => 'vs',
            'title' => 'Die Architektur Ihrer Intelligenz: Corporate Brain & AI Buddies',
            'description' => 'Wir verwandeln fragmentierte Daten in ein zentrales Wissensnetz (Brain), das hochspezialisierte Buddies (Agenten) autonom steuert',
            'automation' => [
                'badge' => 'Buddies: Automatisierung', 'heading' => 'Digitale Arbeitskraft statt starrer Automation',
                'description' => 'Unsere Bodies sind mehr als Skripte. Sie sind autonome Agenten, die auf das zentrale Wissen zugreifen, um komplexe Prozesse eigenständig zu steuern – über Abteilungsgrenzen hinweg.',
                'use_cases_title' => 'Typische Einsatzfelder',
                'use_cases' => [
                    ['text' => 'Autonomes Reporting & Analyse'],
                    ['text' => 'Daten-Bereinigung (Self-Healing Data)'],
                    ['text' => 'Meeting-Protokolle & Wissensarchivierung'],
                    ['text' => 'Operative Entscheidungsfindung'],
                ],
                'example_title' => 'Praxis Beispiel',
                'example_p1' => 'Ihr Unternehmen nutzt AICONIQ, um wöchentlich 20 Stunden an manueller Datenaufbereitung zu sparen.',
                'example_p2' => 'Das System erkennt Muster in Berichten, fasst Ergebnisse automatisch zusammen und verteilt sie direkt an die richtigen Personen.',
                'result_label' => 'DAS ERGEBNIS', 'result_value' => '40',
                'result_description' => 'schnellere Abläufe – und mehr Kapazität im Tagesgeschäft.',
                'result_icon' => $ids['auto_icon'] ?? '',
            ],
            'collaboration' => [
                'badge' => 'Corporate Brain', 'heading' => 'Das zentrale Nervensystem Ihres Unternehmens',
                'description' => 'Isolierte Daten sind wertlos. Das AICONIQ Brain verknüpft Vektor-Räume (Kontext) mit Graph-Datenbanken (Logik). Ein dynamisches Asset, das mit jeder Interaktion klüger wird.',
                'use_cases_title' => 'Typische Einsatzfelder',
                'use_cases' => [
                    ['text' => 'Strategie- und Produktentwicklung'],
                    ['text' => 'Entscheidungsunterstützung im Management'],
                    ['text' => 'Ideenfindung & Innovationsprozesse'],
                    ['text' => 'Marketing & Kommunikation'],
                ],
                'example_title' => 'Praxis Beispiel',
                'example_paragraph' => 'Ihr Unternehmen nutzt AICONIQ, um Ideen für neue Service-Modelle zu entwickeln. Ihr Buddy verknüpft internes Erfahrungswissen mit Markt- und Kundendaten, zeigt Trends auf und schlägt passende Modelle vor. Das Team entscheidet schneller – auf Basis klarer Fakten statt Bauchgefühl.',
                'conclusion_title' => 'Ein System. Zwei Wirkungen. Ein Ziel.',
                'conclusion_text' => 'Buddies führen aus. Das Brain lernt. Diese Symbiose schafft einen Wettbewerbsvorteil, den Standard-KI nicht kopieren kann. Ihr Wissen bleibt sicher in Ihrer Infrastruktur.',
            ],
            'anchor' => 'auto-vs', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'positioning_intro',
            'badge' => 'Positionierung',
            'title' => 'AICONIQ USP: Brain & Buddies',
            'description' => 'Ein einzelner Agent ist nicht skalierbar. Wir bauen ein Ökosystem.',
            'left_block' => [
                'badge' => '', 'title' => 'The Brain.',
                'description' => 'Ihr zentrales Knowledge Management System. Eine dynamische Verknüpfung aus Vektor-Datenbanken (für Kontext) und Graph-Datenbanken (für logische Beziehungen). Es wächst mit jeder Interaktion.',
                'icon' => $ids['pos_left_icon'] ?? '',
            ],
            'right_block' => [
                'overlay_text' => 'Die Buddies',
                'description' => 'Spezialisierte AI-Agenten, die auf dieses Gehirn zugreifen. Ob im Vertrieb, Support oder Operations – die Bodies sind die ausführenden Organe, das Brain ist die Quelle der Wahrheit.',
                'image' => $ids['pos_right_image'] ?? '',
            ],
            'anchor' => 'positioning', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'positioning_bottom',
            'title' => 'So zeigt sich das im Alltag', 'badge' => 'Kompetenzen',
            'description' => 'Wo andere Systeme nur explizite Daten und Regeln verarbeiten, kann AICONIQ auch mit implizitem, institutionellem Wissen umgehen – also dem, was in Erfahrung, Intuition und Unternehmenskultur steckt. Das System beobachtet, dokumentiert und lernt aus realen Entscheidungen. Inklusive der dahinterliegenden Denkprozesse.',
            'result_label' => 'DAS ERGEBNIS', 'result_title' => 'Mehr Effizienz im Tagesgeschäft',
            'result_description' => 'schnellere Entscheidungen und eine Organisation, die von ihrem eigenen Wissen profitiert.',
            'anchor' => 'positioning-bottom', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'problem_solution',
            'badge' => 'PROBLEM Lösung', 'middle_word' => 'UND',
            'title' => 'Wir verkaufen keine KI. Wir liefern Umsetzung',
            'description1' => 'In jedem Unternehmen steckt Wissen, das in Köpfen bleibt und mit Ihren Mitarbeitenden verschwindet. AICONIQ macht dieses Wissen sichtbar, nutzbar und messbar.',
            'description2' => 'So entsteht eine digitale Workforce, die Routinen übernimmt, Wissen validiert und Ihr Team stärkt.',
            'accuracy_text' => 'AICONIQ is 30% more accurate at Advice / Consult than Standard LLM.',
            'cta' => ['label' => 'Sprich mit mir', 'mode' => 'action', 'url' => ''], 'how_it_works' => 'So funktioniert AICONIQ',
            'cards' => [
                ['label' => 'ChatGPT', 'icon' => $ids['ps_chatgpt_icon'] ?? '', 'image' => $ids['ps_chatgpt_img'] ?? '',
                    'features' => [['text' => 'LLM Knowledge'], ['text' => 'Explicit']],
                    'quality_label' => 'QUALITY OF ADVICE / CONSULT', 'quality_value' => '54%'],
                ['label' => 'RAG', 'icon' => $ids['ps_rag_icon'] ?? '', 'image' => $ids['ps_rag_img'] ?? '',
                    'features' => [['text' => 'Corporate Knowledge / Domain Knowledge'], ['text' => 'Explicit + Implicit']],
                    'quality_label' => 'QUALITY OF ADVICE / CONSULT', 'quality_value' => '59%'],
                ['label' => 'AICONIQ', 'icon' => $ids['ps_aiconiq_icon'] ?? '', 'image' => $ids['ps_aiconiq_img'] ?? '',
                    'features' => [['text' => 'Experimental Knowledge Employee / Expert and Conversational Knowledge'], ['text' => 'Explicit + Implicit + Tacit']],
                    'quality_label' => 'QUALITY OF ADVICE / CONSULT', 'quality_value' => '93%'],
            ],
            'anchor' => 'solutions', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'knowledge_intro',
            'badge' => 'Wissen', 'title' => 'So funktioniert AICONIQ',
            'video' => $ids['k_video'] ?? '',
            'anchor' => 'about', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'knowledge_steps',
            'steps' => [
                ['icon' => $ids['k_icon1'] ?? '', 'animation_type' => 'card1', 'title' => 'Wissen erfassen', 'description' => 'Erfasst alle relevanten Gespräche, Dokumente und Daten Ihres Unternehmens und baut daraus ein neuronales Organisationsgedächtnis, die Basis für intelligente Entscheidungen.', 'video' => ''],
                ['icon' => $ids['k_icon2'] ?? '', 'animation_type' => 'card2', 'title' => 'Daten verarbeiten', 'description' => 'AICONIQ verarbeitet Daten zu einem zentralen, unternehmensspezifischen Datenraum. Darin arbeiten Knowledge-, Memory- und Reasoning-Systeme zusammen, um Wissen zu speichern, zu verknüpfen und zu überprüfen – dynamisch, sicher und nachvollziehbar.', 'video' => ''],
                ['icon' => $ids['k_icon3'] ?? '', 'animation_type' => 'card3', 'title' => 'Daten umsetzen', 'description' => 'AICONIQ Buddies übersetzen Wissen in Handeln. Sie agieren in allen Unternehmensbereichen – von Beratung bis Umsetzung, von Support bis Schulung. Input-Buddies erfassen Wissen aus Gesprächen und Prozessen, Output-Buddies setzen es gezielt um. So entsteht ein System, das nicht nur versteht, was zu tun ist, sondern es auch tut.', 'video' => ''],
                ['icon' => $ids['k_icon4'] ?? '', 'animation_type' => 'card4', 'title' => 'Buddies aktivieren', 'description' => 'Wir deployen rollen-basierte Buddies (Agenten), die das Brain-Wissen nutzen, um komplexe Workflows in Ihrem Unternehmen zu automatisieren. Input-Buddies erfassen Wissen aus Gesprächen und Prozessen, Output-Buddies setzen es gezielt um. So entsteht ein System, das nicht nur versteht, was zu tun ist, sondern es auch tut.', 'video' => ''],
            ],
            'button' => ['label' => 'Anfrage senden', 'mode' => 'action', 'url' => ''],
            'anchor' => 'knowledge-steps', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'lead_capture_top',
            'title_part1' => 'Der richtige', 'title_highlight' => 'Moment.', 'title_part2' => 'kommt selten. Gerade passiert einer.',
            'description' => 'KI verändert gerade grundlegend, wie Unternehmen arbeiten, entscheiden und Wissen nutzen. Wenn sich ein technologisches Fundament verschiebt, entstehen neue Kategorien von Unternehmen. Genau in so einem Moment bauen wir AICONIQ.',
            'button' => ['label' => '', 'mode' => 'action', 'url' => ''],
            'video' => $ids['lc_video'] ?? '', 'banner' => $ids['lc_banner'] ?? '',
            'anchor' => 'contact', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'lead_capture_bottom',
            'title' => 'Endlich wissen, was ihr Unternehmen wirklich weiß.', 'button' => ['label' => 'Erstgespräch buchen', 'mode' => 'action', 'url' => ''],
            'image' => $ids['lc_avatar'] ?? '', 'background' => $ids['lc_bg'] ?? '',
            'anchor' => 'lead-bottom', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'solutions_overview',
            'title' => 'Fachkräftemangel? Wissenstransfer? Effizienz? AICONIQ liefert Antworten.',
            'button' => ['label' => 'Anfrage senden', 'mode' => 'action', 'url' => ''],
            'solutions' => [
                ['icon' => $ids['so_icon1'] ?? '', 'title' => 'Wissen sichern', 'description' => 'Erfahrungswissen bleibt im Unternehmen'],
                ['icon' => $ids['so_icon2'] ?? '', 'title' => 'Fachkräftemangel lösen', 'description' => 'Buddies übernehmen Routine'],
                ['icon' => $ids['so_icon3'] ?? '', 'title' => 'Produktivität steigern', 'description' => 'Projekte laufen schneller, Entscheidungen fundierter'],
                ['icon' => $ids['so_icon4'] ?? '', 'title' => 'Wissen messbar machen', 'description' => 'Echtzeit-KPIs & Dashboards'],
            ],
            'anchor' => '', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'stats',
            'top_stats' => [
                ['value' => '+60 %', 'description' => 'internes Wissen eingebunden in Entscheidungsfindung'],
                ['value' => '+35 %', 'description' => 'Umsatzpotenzial durch personalisierte, KI-basierte Interaktion'],
                ['value' => '–40 %', 'description' => 'Aufwände durch agentengesteuerte Routinetätigkeiten'],
                ['value' => '+28 %', 'description' => 'bis zu +28 % Conversion Rate durch intelligente Agentensteuerung'],
            ],
            'bottom_stats' => [
                ['value' => '9x', 'description' => 'bis zu 9x schnellere Time-to-Market'],
                ['value' => '–40 %', 'description' => 'Implementierungsdauer'],
                ['value' => '–60 %', 'description' => 'Projektkosten'],
            ],
            'anchor' => '', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'testimonials',
            'badge' => 'Testimonials', 'title' => 'Testimonials',
            'items' => [
                ['icon' => $ids['te_logo'] ?? '', 'name' => 'markmann + müller',
                    'description' => 'Die Zusammenarbeit mit AICONIQ war für uns ein echter Gamechanger. Das Team versteht nicht nur KI auf technologischer Ebene, sondern auch unsere geschäftlichen Prozesse. Besonders beeindruckt hat uns, wie schnell komplexe Anforderungen verstanden und in funktionierende Lösungen übersetzt wurden. Man merkt sofort: Hier arbeiten Menschen, die nicht nur über Innovation sprechen, sondern sie wirklich umsetzen',
                    'video' => $ids['te_video'] ?? '', 'reverse' => true],
            ],
            'anchor' => 'testimonials', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'security',
            'badge' => 'Trust and Data Security', 'title' => 'AICONIQ ist der Fort Knox für Ihr Wissen',
            'description1' => 'DSGVO-konform, ISO-zertifiziert und 100 % datensouverän.',
            'description2' => 'Ihr Corporate Brain gehört Ihnen. Es läuft auf Ihrer Infrastruktur oder in einer isolierten Private Cloud. Kein Wissen verlässt das System, um öffentliche Modelle zu trainieren.',
            'cards' => [
                ['title' => 'AICONIQ ist der Fort Knox für Ihr Wissen', 'description' => 'AICONIQ erfüllt die Anforderungen der DSGVO und geht darüber hinaus. Alle Daten werden ausschließlich in zertifizierten europäischen Rechenzentren verarbeitet – mit End-to-End-Verschlüsselung, rollenbasiertem Zugriff und Zero-Trust-Architektur.', 'badge' => 'Das bedeutet:', 'highlight' => 'volle Transparenz, keine Schattenprozesse, keine unkontrollierten Schnittstellen.', 'image' => $ids['se_card1'] ?? ''],
                ['title' => 'Datensicherheit – geprüft, zertifiziert, resilient.', 'description' => 'Unsere Infrastruktur folgt den Standards der ISO 27001. Zugriffe, Logins und Datenflüsse werden kontinuierlich überwacht und dokumentiert. Jeder AICONIQ-Agent arbeitet innerhalb definierter Sicherheitsgrenzen – mit Guardrails, Logging und Impact Scoring, um Risiken frühzeitig zu erkennen und zu kontrollieren.', 'badge' => '', 'highlight' => '', 'image' => $ids['se_card2'] ?? ''],
                ['title' => 'Unternehmenssouveränität – Ihre Daten gehören Ihnen', 'description' => 'AICONIQ wurde für Organisationen entwickelt, die ihr Wissen nicht aus der Hand geben wollen. Unternehmensdaten bleiben vollständig in Ihren Systemen. Nichts verlässt Ihre Umgebung ohne explizite Freigabe. Das Sicherheitskonzept folgt dem „Fort-Knox-Prinzip": Zugriff nur, wenn nötig – Kontrolle immer bei Ihnen.', 'badge' => '', 'highlight' => '', 'image' => $ids['se_card3'] ?? ''],
                ['title' => 'Vertrauensarchitektur – nachvollziehbar, auditierbar, verantwortbar.', 'description' => 'Jede KI-Entscheidung, jeder Zugriff, jede Datenbewegung kann nachverfolgt und geprüft werden. Damit schaffen wir nicht nur Schutz, sondern auch Transparenz – und damit Vertrauen auf Augenhöhe. AICONIQ erfüllt die Anforderungen des EU AI Act in Bezug auf Governance, Dokumentation und Auditierbarkeit.', 'badge' => '', 'highlight' => '', 'image' => $ids['se_card4'] ?? ''],
                ['title' => 'Beispiel aus der Praxis', 'description' => 'Nutzung von AICONIQ, um Produktwissen aus Entwicklung, Vertrieb und Service zu bündeln. Trotz sensibler Daten bleibt alles intern – AICONIQ läuft auf unternehmenseigenen Servern und trennt Wissen nach Rollen und Projekten.', 'badge' => '', 'highlight' => '', 'image' => $ids['se_card5'] ?? ''],
            ],
            'anchor' => 'security', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'make_impact',
            'badge' => 'Starkes Team', 'title' => 'Built by humans. Run with agents', 'coming_soon' => 'Demnächst verfügbar',
            'team_image' => $ids['mi_team'] ?? '',
            'anchor' => 'team', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'competitive_advantage_hero',
            'title' => 'Machen Sie Wissen zum Wettbewerbsvorteil.',
            'description' => 'Lernen Sie, wie AICONIQ Ihr Unternehmen smarter, schneller und unabhängiger macht.',
            'button' => ['label' => 'Anfrage senden', 'mode' => 'action', 'url' => ''],
            'logo' => $ids['cah_logo'] ?? '', 'banner' => $ids['cah_banner'] ?? '',
            'anchor' => '', 'divider_below' => false,
        ],
        [
            'acf_fc_layout' => 'consultant_section',
            'title' => 'Was wäre, wenn Ihr bester Berater kein Mensch wäre?', 'button' => ['label' => 'Anfrage senden', 'mode' => 'action', 'url' => ''],
            'avatars' => [
                ['image' => $ids['cs_ava1'] ?? ''],
                ['image' => $ids['cs_ava2'] ?? ''],
                ['image' => $ids['cs_ava3'] ?? ''],
            ],
            'consult_logo' => $ids['cs_logo'] ?? '', 'back_logo' => $ids['cs_back'] ?? '',
            'anchor' => '', 'divider_below' => false,
        ],
    ];
}

// -----------------------------------------------------------------------------
// Menu items (per language) — Custom Links with anchors + external Blog
// -----------------------------------------------------------------------------

function aiconiq_seed_menu_items(string $lang): array
{
    $labels = [
        'en' => ['home' => 'Home', 'solutions' => 'Solutions', 'about' => 'aiconiq Tech', 'team' => 'Team', 'blog' => 'Blog', 'contact' => 'Contact'],
        'de' => ['home' => 'Home', 'solutions' => 'Lösungen', 'about' => 'aiconiq Tech', 'team' => 'Team', 'blog' => 'Blog', 'contact' => 'Kontakt'],
    ];
    $L = $labels[$lang] ?? $labels['en'];
    return [
        ['label' => $L['home'], 'url' => '#home'],
        ['label' => $L['solutions'], 'url' => '#solutions'],
        ['label' => $L['about'], 'url' => '#about'],
        ['label' => $L['team'], 'url' => '#team'],
        ['label' => $L['blog'], 'url' => 'https://blog.aiconiq.io/' . $lang . '/articles', 'target' => '_blank'],
        ['label' => $L['contact'], 'url' => '#contact'],
    ];
}

function aiconiq_seed_upsert_menu(string $name, string $lang, array $items, array &$log): int
{
    global $wpdb;

    $menu = wp_get_nav_menu_object($name);
    $menu_id = $menu ? (int) $menu->term_id : (int) wp_create_nav_menu($name);

    if (function_exists('pll_set_term_language')) {
        pll_set_term_language($menu_id, $lang);
    }

    // Wipe ALL items linked to this menu — go via term_relationships directly so
    // we catch orphaned, draft and Polylang-translated copies that
    // wp_get_nav_menu_items might miss. Then delete the post rows hard.
    $term_taxonomy_id = (int) $wpdb->get_var($wpdb->prepare(
        "SELECT term_taxonomy_id FROM {$wpdb->term_taxonomy} WHERE term_id = %d AND taxonomy = 'nav_menu'",
        $menu_id
    ));
    if ($term_taxonomy_id) {
        $object_ids = $wpdb->get_col($wpdb->prepare(
            "SELECT object_id FROM {$wpdb->term_relationships} WHERE term_taxonomy_id = %d",
            $term_taxonomy_id
        ));
        foreach ($object_ids as $id) {
            wp_delete_post((int) $id, true);
        }
        // Also nuke any nav_menu_item that no longer exists in posts but still has
        // a relationship row (orphans).
        $wpdb->delete($wpdb->term_relationships, ['term_taxonomy_id' => $term_taxonomy_id]);
    }

    // Temporarily silence Polylang's menu-item duplication during seeding so the
    // count stays exact. We'll create both EN and DE explicitly anyway.
    $had_polylang_filter = remove_action('wp_update_nav_menu_item', 'pll_save_nav_menu_item', 10);

    foreach ($items as $idx => $item) {
        wp_update_nav_menu_item($menu_id, 0, [
            'menu-item-title' => $item['label'],
            'menu-item-url' => $item['url'],
            'menu-item-status' => 'publish',
            'menu-item-type' => 'custom',
            'menu-item-position' => $idx + 1,
            'menu-item-target' => $item['target'] ?? '',
        ]);
    }

    if ($had_polylang_filter) {
        add_action('wp_update_nav_menu_item', 'pll_save_nav_menu_item', 10, 3);
    }

    aiconiq_seed_log($log, "✓ menu '{$name}' ({$lang}) populated with " . count($items) . ' items (#' . $menu_id . ')');
    return $menu_id;
}

function aiconiq_seed_assign_menu_locations(string $location, int $en_menu_id, int $de_menu_id, array &$log): void
{
    $locations = get_theme_mod('nav_menu_locations') ?: [];
    $locations[$location] = $en_menu_id;
    set_theme_mod('nav_menu_locations', $locations);

    // Polylang Pro per-language menu mapping
    $polylang = get_option('polylang');
    if (is_array($polylang)) {
        $polylang['nav_menus'] = $polylang['nav_menus'] ?? [];
        $polylang['nav_menus'][get_stylesheet()] = $polylang['nav_menus'][get_stylesheet()] ?? [];
        $polylang['nav_menus'][get_stylesheet()][$location] = ['en' => $en_menu_id, 'de' => $de_menu_id];
        update_option('polylang', $polylang);
    }
    aiconiq_seed_log($log, "✓ assigned menus to '{$location}' location (EN #{$en_menu_id}, DE #{$de_menu_id})");
}

function aiconiq_seed_footer_menu_items(string $lang): array
{
    if ($lang === 'de') {
        return [
            ['label' => 'Impressum', 'url' => '/de/imprint'],
            ['label' => 'Nutzungsbedingungen', 'url' => 'https://aiconiq.io/ds.pdf', 'target' => '_blank'],
        ];
    }
    return [
        ['label' => 'Legal Notice', 'url' => '/en/imprint'],
        ['label' => 'Terms of Use', 'url' => 'https://aiconiq.io/ds.pdf', 'target' => '_blank'],
    ];
}

// -----------------------------------------------------------------------------
// Main runner
// -----------------------------------------------------------------------------

function aiconiq_run_seed(): array
{
    $log = [];
    set_time_limit(900);
    ini_set('memory_limit', '512M');

    if (!function_exists('update_field')) {
        aiconiq_seed_log($log, '✗ ACF Pro is not active');
        return $log;
    }

    // 1. Download all media
    $ids = [];
    foreach (aiconiq_seed_assets() as $key => $rel) {
        $id = aiconiq_seed_sideload($rel, ucfirst(str_replace('_', ' ', $key)), $log);
        if ($id) $ids[$key] = $id;
    }

    // 2. Upsert EN + DE pages (with Polylang linkage)
    [$en_id, $de_id] = aiconiq_seed_upsert_home_pages($log);

    // 3. Fill blocks
    update_field('body_blocks', aiconiq_seed_blocks_en($ids), $en_id);
    update_field('body_blocks', aiconiq_seed_blocks_de($ids), $de_id);
    aiconiq_seed_log($log, "✓ wrote 13 body_blocks to both EN and DE pages");

    // 4. Footer options (EN + DE)
    aiconiq_seed_footer_options('en', $ids, $log);
    aiconiq_seed_footer_options('de', $ids, $log);

    // 5. Primary + Footer menus
    $primary_en = aiconiq_seed_upsert_menu('Primary EN', 'en', aiconiq_seed_menu_items('en'), $log);
    $primary_de = aiconiq_seed_upsert_menu('Primary DE', 'de', aiconiq_seed_menu_items('de'), $log);
    aiconiq_seed_assign_menu_locations('primary', $primary_en, $primary_de, $log);

    $footer_en = aiconiq_seed_upsert_menu('Footer EN', 'en', aiconiq_seed_footer_menu_items('en'), $log);
    $footer_de = aiconiq_seed_upsert_menu('Footer DE', 'de', aiconiq_seed_footer_menu_items('de'), $log);
    aiconiq_seed_assign_menu_locations('footer', $footer_en, $footer_de, $log);

    return $log;
}
