<?php
/**
 * Body blocks: ACF Flexible Content for the AICONIQ home page.
 *
 * One layout per visual section of https://aiconiq.io/. Editor reorders /
 * removes / duplicates blocks via drag-and-drop. Each block also has the
 * universal `anchor` (for menu links) and `divider_below` toggle from the TZ.
 *
 * Field-shapes intentionally mirror the existing i18n JSON keys
 * (src/locales/{en,de}/*.json) so the React section components can read
 * `data.field` instead of `t('section.field')` with minimal rework.
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('acf_add_local_field_group')) {
    return;
}

function aiconiq_block_common_fields(string $key_prefix, string $anchor_default = ''): array
{
    return [
        [
            'key' => $key_prefix . '_anchor',
            'label' => 'Anchor ID',
            'name' => 'anchor',
            'type' => 'text',
            'instructions' => 'Optional. Lets the menu link directly to this block (e.g. "solutions").',
            'default_value' => $anchor_default,
            'wrapper' => ['width' => '50'],
        ],
        [
            'key' => $key_prefix . '_divider_below',
            'label' => 'Divider below',
            'name' => 'divider_below',
            'type' => 'true_false',
            'ui' => 1,
            'wrapper' => ['width' => '50'],
        ],
    ];
}

function aiconiq_button_subfields(string $prefix): array
{
    return [
        [
            'key' => $prefix . '_label',
            'label' => 'Label',
            'name' => 'label',
            'type' => 'text',
            'wrapper' => ['width' => '40'],
        ],
        [
            'key' => $prefix . '_mode',
            'label' => 'Mode',
            'name' => 'mode',
            'type' => 'radio',
            'choices' => [
                'action' => 'Open chat / voice agent',
                'url' => 'External URL',
            ],
            'layout' => 'horizontal',
            'default_value' => 'action',
            'wrapper' => ['width' => '60'],
        ],
        [
            'key' => $prefix . '_url',
            'label' => 'URL',
            'name' => 'url',
            'type' => 'link',
            'return_format' => 'array',
            'conditional_logic' => [[['field' => $prefix . '_mode', 'operator' => '==', 'value' => 'url']]],
        ],
    ];
}

function aiconiq_body_blocks_field_group_definition(): array
{
    return [
        'key' => 'group_aiconiq_body_blocks',
        'title' => 'Body blocks',
        'fields' => [[
            'key' => 'field_aiconiq_body_blocks',
            'label' => 'Blocks',
            'name' => 'body_blocks',
            'type' => 'flexible_content',
            'button_label' => 'Add block',
            'min' => 0,
            'layouts' => [

                // ---------- 1. HERO MAIN ----------
                'hero_main' => [
                    'key' => 'lay_hero_main',
                    'name' => 'hero_main',
                    'label' => 'Hero',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_hero_main_heading', 'label' => 'Main heading', 'name' => 'main_heading', 'type' => 'text'],
                        ['key' => 'f_hero_we_deliver', 'label' => 'We deliver (top line)', 'name' => 'we_deliver', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_hero_digital_employees', 'label' => 'Digital employees (highlight)', 'name' => 'digital_employees', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_hero_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 3],
                        ['key' => 'f_hero_video', 'label' => 'Background video', 'name' => 'video', 'type' => 'file', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_hero_image', 'label' => 'Background image (poster)', 'name' => 'image', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_hero_stats', 'label' => 'Stats (3)', 'name' => 'stats', 'type' => 'repeater', 'min' => 0, 'max' => 6, 'button_label' => 'Add stat', 'sub_fields' => [
                            ['key' => 'f_hero_stat_pre', 'label' => 'Pre-value', 'name' => 'pre_value', 'type' => 'text', 'wrapper' => ['width' => '20']],
                            ['key' => 'f_hero_stat_value', 'label' => 'Value', 'name' => 'value', 'type' => 'text', 'wrapper' => ['width' => '30']],
                            ['key' => 'f_hero_stat_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ]],
                        ['key' => 'f_hero_avatars', 'label' => 'Headline avatars (3)', 'name' => 'avatars', 'type' => 'repeater', 'min' => 0, 'max' => 5, 'button_label' => 'Add avatar', 'sub_fields' => [
                            ['key' => 'f_hero_avatar_image', 'label' => 'Image', 'name' => 'image', 'type' => 'image', 'return_format' => 'array'],
                        ]],
                        ['key' => 'f_hero_logo', 'label' => 'Header logo', 'name' => 'logo', 'type' => 'image', 'return_format' => 'array'],
                        ['key' => 'f_hero_cta', 'label' => 'CTA button', 'name' => 'cta', 'type' => 'group', 'layout' => 'block', 'sub_fields' => aiconiq_button_subfields('f_hero_cta_btn')],
                    ], aiconiq_block_common_fields('f_hero', 'home')),
                ],

                // ---------- 2a. AUTO VS — INTRO VIDEO ----------
                'auto_vs_intro_video' => [
                    'key' => 'lay_auto_vs_intro_video',
                    'name' => 'auto_vs_intro_video',
                    'label' => 'Video',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_avs_iv_video', 'label' => 'Video', 'name' => 'video', 'type' => 'file', 'return_format' => 'array'],
                    ], aiconiq_block_common_fields('f_avs_iv', 'intro-video')),
                ],

                // ---------- 2b. AUTO VS — TEXT + 2 CARDS ----------
                'auto_vs_cards' => [
                    'key' => 'lay_auto_vs_cards',
                    'name' => 'auto_vs_cards',
                    'label' => 'Automation vs Teamwork',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_avs_badge', 'label' => 'Badge (e.g. "Automation Collaboration")', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '40']],
                        ['key' => 'f_avs_middle', 'label' => 'Middle word (e.g. "vs")', 'name' => 'middle_word', 'type' => 'text', 'wrapper' => ['width' => '20']],
                        ['key' => 'f_avs_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '40']],
                        ['key' => 'f_avs_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 2],

                        ['key' => 'f_avs_automation', 'label' => 'Left card — Automation', 'name' => 'automation', 'type' => 'group', 'layout' => 'block', 'sub_fields' => [
                            ['key' => 'f_avs_a_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '50']],
                            ['key' => 'f_avs_a_heading', 'label' => 'Heading', 'name' => 'heading', 'type' => 'text', 'wrapper' => ['width' => '50']],
                            ['key' => 'f_avs_a_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 3],
                            ['key' => 'f_avs_a_uc_title', 'label' => 'Use cases title', 'name' => 'use_cases_title', 'type' => 'text'],
                            ['key' => 'f_avs_a_use_cases', 'label' => 'Use cases', 'name' => 'use_cases', 'type' => 'repeater', 'button_label' => 'Add use case', 'sub_fields' => [
                                ['key' => 'f_avs_a_uc_text', 'label' => 'Text', 'name' => 'text', 'type' => 'text'],
                            ]],
                            ['key' => 'f_avs_a_ex_title', 'label' => 'Example title', 'name' => 'example_title', 'type' => 'text'],
                            ['key' => 'f_avs_a_ex_p1', 'label' => 'Paragraph 1', 'name' => 'example_p1', 'type' => 'textarea', 'rows' => 2],
                            ['key' => 'f_avs_a_ex_p2', 'label' => 'Paragraph 2', 'name' => 'example_p2', 'type' => 'textarea', 'rows' => 2],
                            ['key' => 'f_avs_a_ex_rl', 'label' => 'Result label', 'name' => 'result_label', 'type' => 'text', 'wrapper' => ['width' => '40']],
                            ['key' => 'f_avs_a_ex_rv', 'label' => 'Result value', 'name' => 'result_value', 'type' => 'text', 'wrapper' => ['width' => '20']],
                            ['key' => 'f_avs_a_ex_rd', 'label' => 'Result description', 'name' => 'result_description', 'type' => 'text', 'wrapper' => ['width' => '40']],
                            ['key' => 'f_avs_a_ex_icon', 'label' => 'Result icon', 'name' => 'result_icon', 'type' => 'image', 'return_format' => 'array'],
                        ]],

                        ['key' => 'f_avs_collab', 'label' => 'Right card — Collaboration', 'name' => 'collaboration', 'type' => 'group', 'layout' => 'block', 'sub_fields' => [
                            ['key' => 'f_avs_c_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '50']],
                            ['key' => 'f_avs_c_heading', 'label' => 'Heading', 'name' => 'heading', 'type' => 'text', 'wrapper' => ['width' => '50']],
                            ['key' => 'f_avs_c_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 3],
                            ['key' => 'f_avs_c_uc_title', 'label' => 'Use cases title', 'name' => 'use_cases_title', 'type' => 'text'],
                            ['key' => 'f_avs_c_use_cases', 'label' => 'Use cases', 'name' => 'use_cases', 'type' => 'repeater', 'button_label' => 'Add use case', 'sub_fields' => [
                                ['key' => 'f_avs_c_uc_text', 'label' => 'Text', 'name' => 'text', 'type' => 'text'],
                            ]],
                            ['key' => 'f_avs_c_ex_title', 'label' => 'Example title', 'name' => 'example_title', 'type' => 'text'],
                            ['key' => 'f_avs_c_ex_p', 'label' => 'Paragraph', 'name' => 'example_paragraph', 'type' => 'textarea', 'rows' => 4],
                            ['key' => 'f_avs_c_ex_ct', 'label' => 'Conclusion title', 'name' => 'conclusion_title', 'type' => 'text'],
                            ['key' => 'f_avs_c_ex_cx', 'label' => 'Conclusion text', 'name' => 'conclusion_text', 'type' => 'textarea', 'rows' => 4],
                            ['key' => 'f_avs_c_cta', 'label' => 'CTA button (right card)', 'name' => 'cta', 'type' => 'group', 'layout' => 'block', 'sub_fields' => aiconiq_button_subfields('f_avs_c_cta_btn')],
                        ]],
                    ], aiconiq_block_common_fields('f_avs', 'auto-vs')),
                ],

                // ---------- 3a. POSITIONING — INTRO + LEFT/RIGHT ----------
                'positioning_intro' => [
                    'key' => 'lay_positioning_intro',
                    'name' => 'positioning_intro',
                    'label' => 'Positioning',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_pos_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_pos_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_pos_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 3],
                        ['key' => 'f_pos_left', 'label' => 'Left block', 'name' => 'left_block', 'type' => 'group', 'layout' => 'block', 'sub_fields' => [
                            ['key' => 'f_pos_l_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '40']],
                            ['key' => 'f_pos_l_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '60']],
                            ['key' => 'f_pos_l_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 3],
                            ['key' => 'f_pos_l_icon', 'label' => 'Icon', 'name' => 'icon', 'type' => 'image', 'return_format' => 'array'],
                        ]],
                        ['key' => 'f_pos_right', 'label' => 'Right block', 'name' => 'right_block', 'type' => 'group', 'layout' => 'block', 'sub_fields' => [
                            ['key' => 'f_pos_r_overlay', 'label' => 'Overlay text', 'name' => 'overlay_text', 'type' => 'text'],
                            ['key' => 'f_pos_r_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 3],
                            ['key' => 'f_pos_r_image', 'label' => 'Portrait image', 'name' => 'image', 'type' => 'image', 'return_format' => 'array'],
                        ]],
                    ], aiconiq_block_common_fields('f_pos', 'positioning')),
                ],

                // ---------- 3b. POSITIONING — BOTTOM ----------
                'positioning_bottom' => [
                    'key' => 'lay_positioning_bottom',
                    'name' => 'positioning_bottom',
                    'label' => 'Competencies',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_pos_b_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_pos_b_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_pos_b_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 3],
                        ['key' => 'f_pos_b_rl', 'label' => 'Result label', 'name' => 'result_label', 'type' => 'text', 'wrapper' => ['width' => '40']],
                        ['key' => 'f_pos_b_rt', 'label' => 'Result title', 'name' => 'result_title', 'type' => 'text', 'wrapper' => ['width' => '60']],
                        ['key' => 'f_pos_b_rd', 'label' => 'Result description', 'name' => 'result_description', 'type' => 'text'],
                    ], aiconiq_block_common_fields('f_pos_b', 'positioning-bottom')),
                ],

                // ---------- 4. PROBLEM AND SOLUTION ----------
                'problem_solution' => [
                    'key' => 'lay_problem_solution',
                    'name' => 'problem_solution',
                    'label' => 'Problem & Solution',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_ps_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '40']],
                        ['key' => 'f_ps_middle', 'label' => 'Middle word', 'name' => 'middle_word', 'type' => 'text', 'wrapper' => ['width' => '20']],
                        ['key' => 'f_ps_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '40']],
                        ['key' => 'f_ps_d1', 'label' => 'Description 1', 'name' => 'description1', 'type' => 'textarea', 'rows' => 2],
                        ['key' => 'f_ps_d2', 'label' => 'Description 2', 'name' => 'description2', 'type' => 'textarea', 'rows' => 2],
                        ['key' => 'f_ps_accuracy', 'label' => 'Accuracy text (below cards)', 'name' => 'accuracy_text', 'type' => 'textarea', 'rows' => 2],
                        ['key' => 'f_ps_cta', 'label' => 'CTA button', 'name' => 'cta', 'type' => 'group', 'layout' => 'block', 'sub_fields' => aiconiq_button_subfields('f_ps_cta_btn')],
                        ['key' => 'f_ps_how', 'label' => '"How it works" label', 'name' => 'how_it_works', 'type' => 'text'],
                        ['key' => 'f_ps_cards', 'label' => 'Cards', 'name' => 'cards', 'type' => 'repeater', 'layout' => 'block', 'min' => 0, 'max' => 3, 'button_label' => 'Add card', 'sub_fields' => [
                            ['key' => 'f_ps_c_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text', 'wrapper' => ['width' => '100']],
                            ['key' => 'f_ps_c_icon', 'label' => 'Icon', 'name' => 'icon', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '100']],
                            ['key' => 'f_ps_c_image', 'label' => 'Card image', 'name' => 'image', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '100']],
                            ['key' => 'f_ps_c_ql', 'label' => 'Quality label', 'name' => 'quality_label', 'type' => 'text', 'wrapper' => ['width' => '100']],
                            ['key' => 'f_ps_c_qv', 'label' => 'Quality value', 'name' => 'quality_value', 'type' => 'text', 'wrapper' => ['width' => '100']],
                            ['key' => 'f_ps_c_features', 'label' => 'Features', 'name' => 'features', 'type' => 'repeater', 'button_label' => 'Add feature', 'wrapper' => ['width' => '100'], 'sub_fields' => [
                                ['key' => 'f_ps_c_feature_text', 'label' => 'Text', 'name' => 'text', 'type' => 'text'],
                            ]],
                        ]],
                    ], aiconiq_block_common_fields('f_ps', 'solutions')),
                ],

                // ---------- 5a. KNOWLEDGE — INTRO ----------
                'knowledge_intro' => [
                    'key' => 'lay_knowledge_intro',
                    'name' => 'knowledge_intro',
                    'label' => 'Knowledge',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_ki_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_ki_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_ki_video', 'label' => 'Main video', 'name' => 'video', 'type' => 'file', 'return_format' => 'array'],
                    ], aiconiq_block_common_fields('f_ki', 'about')),
                ],

                // ---------- 5b. KNOWLEDGE — STEPS ----------
                'knowledge_steps' => [
                    'key' => 'lay_knowledge_steps',
                    'name' => 'knowledge_steps',
                    'label' => 'Knowledge steps',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_ks_steps', 'label' => 'Steps', 'name' => 'steps', 'type' => 'repeater', 'layout' => 'block', 'min' => 0, 'button_label' => 'Add step', 'sub_fields' => [
                            ['key' => 'f_ks_s_icon', 'label' => 'Icon', 'name' => 'icon', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '40']],
                            ['key' => 'f_ks_s_animation', 'label' => 'Animation type', 'name' => 'animation_type', 'type' => 'select', 'choices' => [
                                'card1' => 'Type 1 (Capture knowledge)',
                                'card2' => 'Type 2 (Process data)',
                                'card3' => 'Type 3 (Implement data)',
                                'card4' => 'Type 4 (Manage data)',
                                'video' => 'Custom video',
                            ], 'default_value' => 'card1', 'wrapper' => ['width' => '60']],
                            ['key' => 'f_ks_s_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                            ['key' => 'f_ks_s_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 3],
                            ['key' => 'f_ks_s_video', 'label' => 'Custom video (only for "Custom video" animation type)', 'name' => 'video', 'type' => 'file', 'return_format' => 'array', 'conditional_logic' => [[['field' => 'f_ks_s_animation', 'operator' => '==', 'value' => 'video']]]],
                        ]],
                        ['key' => 'f_ks_button', 'label' => 'CTA button (after cards)', 'name' => 'button', 'type' => 'group', 'layout' => 'block', 'sub_fields' => aiconiq_button_subfields('f_ks_btn')],
                    ], aiconiq_block_common_fields('f_ks', 'knowledge-steps')),
                ],

                // ---------- 6a. LEAD CAPTURE — TOP ----------
                'lead_capture_top' => [
                    'key' => 'lay_lc_top',
                    'name' => 'lead_capture_top',
                    'label' => 'Built to deliver',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_lct_p1', 'label' => 'Title part 1', 'name' => 'title_part1', 'type' => 'text', 'wrapper' => ['width' => '33']],
                        ['key' => 'f_lct_hl', 'label' => 'Title highlight', 'name' => 'title_highlight', 'type' => 'text', 'wrapper' => ['width' => '34']],
                        ['key' => 'f_lct_p2', 'label' => 'Title part 2', 'name' => 'title_part2', 'type' => 'text', 'wrapper' => ['width' => '33']],
                        ['key' => 'f_lct_d', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 3],
                        ['key' => 'f_lct_btn', 'label' => 'CTA button', 'name' => 'button', 'type' => 'group', 'layout' => 'block', 'sub_fields' => aiconiq_button_subfields('f_lct_btn')],
                        ['key' => 'f_lct_video', 'label' => 'Video', 'name' => 'video', 'type' => 'file', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_lct_banner', 'label' => 'Banner image', 'name' => 'banner', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                    ], aiconiq_block_common_fields('f_lct', 'contact')),
                ],

                // ---------- 6b. LEAD CAPTURE — BOTTOM ----------
                'lead_capture_bottom' => [
                    'key' => 'lay_lc_bottom',
                    'name' => 'lead_capture_bottom',
                    'label' => 'Finally know',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_lcb_t', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                        ['key' => 'f_lcb_btn', 'label' => 'CTA button', 'name' => 'button', 'type' => 'group', 'layout' => 'block', 'sub_fields' => aiconiq_button_subfields('f_lcb_btn')],
                        ['key' => 'f_lcb_img', 'label' => 'Portrait image', 'name' => 'image', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_lcb_bg', 'label' => 'Background image', 'name' => 'background', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                    ], aiconiq_block_common_fields('f_lcb', 'lead-bottom')),
                ],

                // ---------- 7. SOLUTIONS OVERVIEW ----------
                'solutions_overview' => [
                    'key' => 'lay_solutions_overview',
                    'name' => 'solutions_overview',
                    'label' => 'Solutions overview',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_so_title', 'label' => 'Title', 'name' => 'title', 'type' => 'textarea', 'rows' => 2],
                        ['key' => 'f_so_btn', 'label' => 'CTA button', 'name' => 'button', 'type' => 'group', 'layout' => 'block', 'sub_fields' => aiconiq_button_subfields('f_so_btn')],
                        ['key' => 'f_so_solutions', 'label' => 'Solutions', 'name' => 'solutions', 'type' => 'repeater', 'min' => 0, 'button_label' => 'Add solution', 'sub_fields' => [
                            ['key' => 'f_so_s_icon', 'label' => 'Icon', 'name' => 'icon', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '20']],
                            ['key' => 'f_so_s_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '40']],
                            ['key' => 'f_so_s_d', 'label' => 'Description', 'name' => 'description', 'type' => 'text', 'wrapper' => ['width' => '40']],
                        ]],
                    ], aiconiq_block_common_fields('f_so', 'solutions-overview')),
                ],

                // ---------- 8. STATS ----------
                'stats' => [
                    'key' => 'lay_stats',
                    'name' => 'stats',
                    'label' => 'Stats',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_st_top', 'label' => 'Top stats (up to 4)', 'name' => 'top_stats', 'type' => 'repeater', 'max' => 4, 'button_label' => 'Add stat', 'sub_fields' => [
                            ['key' => 'f_st_t_v', 'label' => 'Value', 'name' => 'value', 'type' => 'text', 'wrapper' => ['width' => '30']],
                            ['key' => 'f_st_t_d', 'label' => 'Description', 'name' => 'description', 'type' => 'text', 'wrapper' => ['width' => '70']],
                        ]],
                        ['key' => 'f_st_bottom', 'label' => 'Bottom stats (up to 4)', 'name' => 'bottom_stats', 'type' => 'repeater', 'max' => 4, 'button_label' => 'Add stat', 'sub_fields' => [
                            ['key' => 'f_st_b_v', 'label' => 'Value', 'name' => 'value', 'type' => 'text', 'wrapper' => ['width' => '30']],
                            ['key' => 'f_st_b_d', 'label' => 'Description', 'name' => 'description', 'type' => 'text', 'wrapper' => ['width' => '70']],
                        ]],
                    ], aiconiq_block_common_fields('f_st', 'stats')),
                ],

                // ---------- 9. TESTIMONIALS ----------
                'testimonials' => [
                    'key' => 'lay_testimonials',
                    'name' => 'testimonials',
                    'label' => 'Testimonials',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_te_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_te_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_te_items', 'label' => 'Testimonials', 'name' => 'items', 'type' => 'repeater', 'layout' => 'block', 'min' => 0, 'button_label' => 'Add testimonial', 'sub_fields' => [
                            ['key' => 'f_te_i_name', 'label' => 'Name / company', 'name' => 'name', 'type' => 'text', 'wrapper' => ['width' => '60']],
                            ['key' => 'f_te_i_reverse', 'label' => 'Reverse layout', 'name' => 'reverse', 'type' => 'true_false', 'ui' => 1, 'wrapper' => ['width' => '40']],
                            ['key' => 'f_te_i_icon', 'label' => 'Logo / icon', 'name' => 'icon', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                            ['key' => 'f_te_i_video', 'label' => 'Video', 'name' => 'video', 'type' => 'file', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                            ['key' => 'f_te_i_d', 'label' => 'Quote / description', 'name' => 'description', 'type' => 'textarea', 'rows' => 5],
                        ]],
                    ], aiconiq_block_common_fields('f_te', 'testimonials')),
                ],

                // ---------- 10. SECURITY ----------
                'security' => [
                    'key' => 'lay_security',
                    'name' => 'security',
                    'label' => 'Security',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_se_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_se_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_se_d1', 'label' => 'Description 1', 'name' => 'description1', 'type' => 'textarea', 'rows' => 2],
                        ['key' => 'f_se_d2', 'label' => 'Description 2', 'name' => 'description2', 'type' => 'textarea', 'rows' => 2],
                        ['key' => 'f_se_cards', 'label' => 'Cards', 'name' => 'cards', 'type' => 'repeater', 'layout' => 'block', 'min' => 0, 'button_label' => 'Add card', 'sub_fields' => [
                            ['key' => 'f_se_c_t', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                            ['key' => 'f_se_c_d', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 4],
                            ['key' => 'f_se_c_b', 'label' => 'Highlight badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '50']],
                            ['key' => 'f_se_c_h', 'label' => 'Highlight text', 'name' => 'highlight', 'type' => 'text', 'wrapper' => ['width' => '50']],
                            ['key' => 'f_se_c_img', 'label' => 'Card image (sticky preview)', 'name' => 'image', 'type' => 'image', 'return_format' => 'array'],
                        ]],
                    ], aiconiq_block_common_fields('f_se', 'security')),
                ],

                // ---------- 11. MAKE IMPACT ----------
                'make_impact' => [
                    'key' => 'lay_make_impact',
                    'name' => 'make_impact',
                    'label' => 'Built by humans',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_mi_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'wrapper' => ['width' => '40']],
                        ['key' => 'f_mi_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '40']],
                        ['key' => 'f_mi_cs', 'label' => 'Coming soon label', 'name' => 'coming_soon', 'type' => 'text', 'wrapper' => ['width' => '20']],
                        ['key' => 'f_mi_team', 'label' => 'Team image', 'name' => 'team_image', 'type' => 'image', 'return_format' => 'array'],
                    ], aiconiq_block_common_fields('f_mi', 'team')),
                ],

                // ---------- 12. COMPETITIVE ADVANTAGE HERO ----------
                'competitive_advantage_hero' => [
                    'key' => 'lay_cah',
                    'name' => 'competitive_advantage_hero',
                    'label' => 'Competitive advantage CTA',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_cah_t', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                        ['key' => 'f_cah_d', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 2],
                        ['key' => 'f_cah_btn', 'label' => 'CTA button', 'name' => 'button', 'type' => 'group', 'layout' => 'block', 'sub_fields' => aiconiq_button_subfields('f_cah_btn')],
                        ['key' => 'f_cah_logo', 'label' => 'Logo', 'name' => 'logo', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_cah_banner', 'label' => 'Background banner', 'name' => 'banner', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                    ], aiconiq_block_common_fields('f_cah', 'cta')),
                ],

                // ---------- 13. CONSULTANT SECTION ----------
                'consultant_section' => [
                    'key' => 'lay_cs',
                    'name' => 'consultant_section',
                    'label' => 'Consultant',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_cs_t', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                        ['key' => 'f_cs_btn', 'label' => 'CTA button', 'name' => 'button', 'type' => 'group', 'layout' => 'block', 'sub_fields' => aiconiq_button_subfields('f_cs_btn')],
                        ['key' => 'f_cs_avatars', 'label' => 'Avatars (3)', 'name' => 'avatars', 'type' => 'repeater', 'min' => 0, 'max' => 5, 'button_label' => 'Add avatar', 'sub_fields' => [
                            ['key' => 'f_cs_a_img', 'label' => 'Image', 'name' => 'image', 'type' => 'image', 'return_format' => 'array'],
                        ]],
                        ['key' => 'f_cs_logo', 'label' => 'Consult logo', 'name' => 'consult_logo', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_cs_back', 'label' => 'Back logo', 'name' => 'back_logo', 'type' => 'image', 'return_format' => 'array', 'wrapper' => ['width' => '50']],
                    ], aiconiq_block_common_fields('f_cs', 'consultant')),
                ],

                // ---------- UNIVERSAL: TEXT ----------
                'text' => [
                    'key' => 'lay_text',
                    'name' => 'text',
                    'label' => 'Free text',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_t_eyebrow', 'label' => 'Eyebrow', 'name' => 'eyebrow', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_t_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text', 'wrapper' => ['width' => '50']],
                        ['key' => 'f_t_body', 'label' => 'Body', 'name' => 'body', 'type' => 'wysiwyg', 'tabs' => 'visual', 'toolbar' => 'basic', 'media_upload' => 0],
                    ], aiconiq_block_common_fields('f_t', 'text')),
                ],

                // ---------- UNIVERSAL: DIVIDER ----------
                'divider' => [
                    'key' => 'lay_div',
                    'name' => 'divider',
                    'label' => 'Divider',
                    'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'f_d_style', 'label' => 'Style', 'name' => 'style', 'type' => 'select', 'choices' => ['line' => 'Thin line', 'glow' => 'Glow / accent'], 'default_value' => 'line'],
                    ], aiconiq_block_common_fields('f_d', 'divider')),
                ],

            ],
        ]],
        // Body blocks show on every Page so editors can fill any new page
        // they create from the admin. Articles stay on their own ACF schema
        // (defined in functions/acf.php).
        'location' => [
            [['param' => 'post_type', 'operator' => '==', 'value' => 'page']],
        ],
        'menu_order' => 5,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'active' => true,
    ];
}

add_action('acf/init', function () {
    // Register from PHP only if no JSON copy exists yet — once the bootstrap
    // helper has dumped the JSON, ACF Pro's Local JSON loader takes over and
    // the field group becomes editable in admin.
    $key = 'group_aiconiq_body_blocks';
    $json = get_template_directory() . '/acf-json/' . $key . '.json';
    if (file_exists($json)) return;
    acf_add_local_field_group(aiconiq_body_blocks_field_group_definition());
});

/**
 * Default new pages to the "Blocks (Next.js)" template so editors don't
 * have to switch the template manually after creating a page. Existing
 * pages keep whatever they already chose.
 */
add_action('save_post_page', function ($post_id, $post, $update) {
    if ($update) return; // only on first save
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) return;
    if (get_post_meta($post_id, '_wp_page_template', true)) return; // already set
    update_post_meta($post_id, '_wp_page_template', 'page-templates/blocks.php');
}, 10, 3);
