/**
 * ドラフトカードの定義（バランス再調整版：全100種類）
 * カード倍率を最大3倍程度（URのみ最大5倍）にデフレ調整
 */

export const RARITIES = {
    N: { label: 'N', weight: 100, color: 'from-gray-400 to-gray-500', bonusRange: [1.1, 1.3] },
    NR: { label: 'NR', weight: 50, color: 'from-green-400 to-green-600', bonusRange: [1.4, 1.6] },
    R: { label: 'R', weight: 25, color: 'from-blue-400 to-blue-600', bonusRange: [1.7, 2.0] },
    SR: { label: 'SR', weight: 10, color: 'from-purple-400 to-purple-600', bonusRange: [2.1, 2.5] },
    SSR: { label: 'SSR', weight: 4, color: 'from-pink-500 to-red-600', bonusRange: [2.6, 3.0] },
    UR: { label: 'UR', weight: 1, color: 'from-yellow-400 via-orange-500 to-red-700', bonusRange: [3.1, 5.0] }
};

const createCard = (id, name, description, rarity, icon, effectFunc, isSpecial = false) => ({
    id, name, description, rarity, icon, effect: effectFunc,
    isRoundEndEffect: isSpecial === 'roundEnd',
    isComboEffect: isSpecial === 'combo',
    isCriticalEffect: isSpecial === 'critical'
});

export const DRAFT_CARDS = [
    // --- 汎用バフ（30種類） ---数値もデフレ調整
    createCard('gen_01', 'パワーアップ', '全生産量が1.2倍', 'N', 'muscle-up.png', (w, s) => s * 1.2),
    createCard('gen_02', 'ダブル・パワー', '全生産量が1.5倍', 'NR', 'pointy-sword.png', (w, s) => s * 1.5),
    createCard('gen_03', 'トリプル・パワー', '全生産量が1.8倍', 'R', 'heavy-thorny-triskelion.png', (w, s) => s * 1.8),
    createCard('gen_04', 'マスター・パワー', '全生産量が2.3倍', 'SR', 'shining-heart.png', (w, s) => s * 2.3),
    createCard('gen_05', 'アルティメット・パワー', '全生産量が2.8倍', 'SSR', 'power-generator.png', (w, s) => s * 2.8),
    createCard('gen_06', '創造主の力', '全生産量が4.0倍', 'UR', 'mailed-fist.png', (w, s) => s * 4.0),
    createCard('gen_07', 'コンボ・ブースト', 'コンボ倍率が+20%', 'N', 'all-for-one.png', null, 'combo'),
    createCard('gen_08', 'クリティカル・エッジ', 'クリティカル率+2%', 'NR', 'deadly-strike.png', null, 'critical'),
    createCard('gen_09', 'クリティカル・バースト', 'クリティカル倍率+10.0', 'R', 'anvil-impact.png', null, 'critical'),
    createCard('gen_10', 'タイム・プラス', '毎ラウンド残り時間+5秒（演出上は倍率x1.1）', 'N', 'stopwatch.png', (w, s) => s * 1.1),
    createCard('gen_11', '効率化', '全生産量が1.25倍', 'N', 'gears.png', (w, s) => s * 1.25),
    createCard('gen_12', '生産ライン強化', '全生産量が1.6倍', 'NR', 'cog.png', (w, s) => s * 1.6),
    createCard('gen_13', '精密作業', 'ミスなし時の生産量が2.0倍', 'R', 'awareness.png', (w, s) => s * 2),
    createCard('gen_14', '集中力', '全生産量が1.45倍', 'NR', 'brain-leak.png', (w, s) => s * 1.45),
    createCard('gen_15', '幸運の星', 'ランダムで1〜2倍', 'R', 'sparkly-bow.png', (w, s) => s * (1 + Math.random())),
    createCard('gen_16', '加速', 'KPSに関わらず常時1.15倍', 'N', 'afterburn.png', (w, s) => s * 1.15),
    createCard('gen_17', 'オーバー・クロック', '生産量が1.9倍になるが、ミスしやすくなる', 'R', 'volcano.png', (w, s) => s * 1.9),
    createCard('gen_18', '素材厳選', '全生産量が1.55倍', 'NR', 'shiny-apple.png', (w, s) => s * 1.55),
    createCard('gen_19', 'ブランド力', '全生産量が1.85倍', 'R', 'medal.png', (w, s) => s * 1.85),
    createCard('gen_20', '黄金のレシピ', '全生産量が2.4倍', 'SR', 'parchment.png', (w, s) => s * 2.4),
    createCard('gen_21', '魔法の触媒', '全生産量が2.7倍', 'SSR', 'bubbling-flask.png', (w, s) => s * 2.7),
    createCard('gen_22', '神の息吹', '全生産量が5.0倍', 'UR', 'prayer.png', (w, s) => s * 5.0),
    createCard('gen_23', '継続は力', 'コンボが続くほど倍率アップ（最大2.5倍）', 'SR', 'cycling.png', (w, s, k, t, combo) => s * Math.min(2.5, 1 + (combo || 0) * 0.05)),
    createCard('gen_24', '正確さのご褒美', '全生産量が1.4倍', 'NR', 'bullseye.png', (w, s) => s * 1.4),
    createCard('gen_25', 'リズム感', '全生産量が1.75倍', 'R', 'metronome.png', (w, s) => s * 1.75),
    createCard('gen_26', 'エナジードリンク', '全生産量が2.2倍', 'SR', 'energy-drink.png', (w, s) => s * 2.2),
    createCard('gen_27', 'ハイテンション', '全生産量が2.5倍', 'SR', 'burning-passion.png', (w, s) => s * 2.5),
    createCard('gen_28', '宇宙の理', '全生産量が2.9倍', 'SSR', 'globe.png', (w, s) => s * 2.9),
    createCard('gen_29', '無の境地', '全生産量が2.45倍', 'SR', 'meditation.png', (w, s) => s * 2.45),
    createCard('gen_30', '王者の誇り', '全生産量が3.0倍', 'SSR', 'crown.png', (w, s) => s * 3.0),

    // --- 条件付き・特化型（残り70種類） ---数値デフレ版
    // N (Normal)
    createCard('n_length_3', 'ショートバイト', '3文字以下の単語は1.3倍', 'N', 'apple-seeds.png', (w, s) => w.length <= 3 ? s * 1.3 : s),
    createCard('n_vowel_1', '母音の響き', '母音が1つあれば1.2倍', 'N', 'aura.png', (w, s) => /[aeiou]/.test(w.toLowerCase()) ? s * 1.2 : s),
    createCard('n_start_a', '「A」の予感', '「A」で始まる単語は1.3倍', 'N', 'ace.png', (w, s) => w[0].toUpperCase() === 'A' ? s * 1.3 : s),
    createCard('n_start_k', '「K」のキレ', '「K」で始まる単語は1.3倍', 'N', 'blade-fall.png', (w, s) => w[0].toUpperCase() === 'K' ? s * 1.3 : s),
    createCard('n_start_s', '「S」の疾走', '「S」で始まる単語は1.3倍', 'N', 'air-zigzag.png', (w, s) => w[0].toUpperCase() === 'S' ? s * 1.3 : s),
    createCard('n_start_t', '「T」の鼓動', '「T」で始まる単語は1.3倍', 'N', 'anthem.png', (w, s) => w[0].toUpperCase() === 'T' ? s * 1.3 : s),
    createCard('n_even', '偶数のリズム', '文字数が偶数なら1.2倍', 'N', 'balance.png', (w, s) => w.length % 2 === 0 ? s * 1.2 : s),
    createCard('n_odd', '奇数への執着', '文字数が奇数なら1.2倍', 'N', 'angular-spider.png', (w, s) => w.length % 2 !== 0 ? s * 1.2 : s),
    createCard('n_speed_1', '早打ち初心者', 'KPS2以上で1.25倍', 'N', 'boots.png', (w, s, kps) => kps >= 2 ? s * 1.25 : s),
    createCard('n_last_10', '駆け込み乗車', '残り10秒以下で1.3倍', 'N', 'alarm-clock.png', (w, s, k, t) => t <= 10 ? s * 1.3 : s),
    createCard('n_chocolate', '甘い誘惑', '「ちょこ」を含むと1.35倍', 'N', 'cake-slice.png', (w, s) => w.includes('ちょこ') ? s * 1.35 : s),
    createCard('n_morning', '朝のご飯', '「ごはん」で1.4倍', 'N', 'fried-eggs.png', (w, s) => w === 'ごはん' ? s * 1.4 : s),
    createCard('n_snack', 'おやつタイム', '「おやつ」で1.4倍', 'N', 'cake-slice.png', (w, s) => w === 'おやつ' ? s * 1.4 : s),

    // NR (Normal Rare)
    createCard('nr_length_8', 'ロングスケール', '8文字以上で1.6倍', 'NR', 'all-for-one.png', (w, s) => w.length >= 8 ? s * 1.6 : s),
    createCard('nr_vowels_3', '母音の三重奏', '母音が3つ以上で1.5倍', 'NR', 'beams-aura.png', (w, s) => (w.match(/[aeiou]/gi) || []).length >= 3 ? s * 1.5 : s),
    createCard('nr_start_b', '「B」の爆発', '「B」で始まる単語は1.65倍', 'NR', 'burning-dot.png', (w, s) => w[0].toUpperCase() === 'B' ? s * 1.65 : s),
    createCard('nr_start_d', '「D」の破壊', '「D」で始まる単語は1.65倍', 'NR', 'demolish.png', (w, s) => w[0].toUpperCase() === 'D' ? s * 1.65 : s),
    createCard('nr_double', '鏡合わせの音', '同じ文字が続く、1.6倍', 'NR', 'dna1.png', (w, s) => {
        for (let i = 0; i < w.length - 1; i++) if (w[i] === w[i + 1]) return s * 1.6; return s;
    }),
    createCard('nr_choko', 'チョコの魔法', '「ちょこれーと」で1.7倍', 'NR', 'wrapped-sweet.png', (w, s) => w === 'ちょこれーと' ? s * 1.7 : s),
    createCard('nr_kps_5', '光速の鼓動', 'KPS 5以上で1.6倍', 'NR', 'afterburn.png', (w, s, kps) => kps >= 5 ? s * 1.6 : s),
    createCard('nr_cook', 'クッキーの愛', '「くっきー」で1.7倍', 'NR', 'cookie.png', (w, s) => w === 'くっきー' ? s * 1.7 : s),
    createCard('nr_accuracy_2', '精神統一', 'ミスなしラウンド終了で獲得1.6倍', 'NR', 'awareness.png', null, 'roundEnd'),
    createCard('nr_first_last', '円環の理', '最初と最後が同じ文字で1.6倍', 'NR', 'cycle.png', (w, s) => w[0] === w[w.length - 1] ? s * 1.6 : s),

    // R (Rare)
    createCard('r_speed_king', 'タイピング・キング', 'KPS 8以上で2.0倍', 'R', 'jetpack.png', (w, s, kps) => kps >= 8 ? s * 2.0 : s),
    createCard('r_combo_50', 'コンボ・エキサイト', 'コンボ50以上で2.2倍', 'R', 'flame-spin.png', (w, s) => s * 2.2),
    createCard('r_long_12', '大長編', '12文字以上で2.5倍', 'R', 'tower-fall.png', (w, s) => w.length >= 12 ? s * 2.5 : s),
    createCard('r_perfect_round', '無欠の美学', 'ミスなしラウンド終了で獲得2.5倍', 'R', 'angel-wings.png', null, 'roundEnd'),
    createCard('r_sugar_high', 'シュガー・ハイ', '残り15秒で倍率アップ（最大2.4倍）', 'R', 'bubbling-flask.png', (w, s, k, t) => t <= 15 ? s * Math.min(2.4, 1 + (15 - t) * 0.1) : s),
    createCard('r_special_q', '「Q」の深淵', '「Q」が含まれる単語は2.4倍', 'R', 'alien-stare.png', (w, s) => w.toLowerCase().includes('q') ? s * 2.4 : s),
    createCard('r_patissier', '一流シェフ', '「ぱてぃしえ」で2.5倍', 'R', 'master-of-arms.png', (w, s) => w === 'ぱてぃしえ' ? s * 2.5 : s),
    createCard('r_alphabet_range', '前半の英知', 'AからMで始まる単語は1.8倍', 'R', 'book-cover.png', (w, s) => w[0].toUpperCase() <= 'M' ? s * 1.8 : s),
    createCard('r_alphabet_range_2', '後半の英知', 'NからZで始まる単語は1.8倍', 'R', 'open-book.png', (w, s) => w[0].toUpperCase() >= 'N' ? s * 1.8 : s),

    // SR (Super Rare)
    createCard('sr_god_speed', '神速の指', 'KPS 12以上で2.5倍', 'SR', 'lightning-saber.png', (w, s, kps) => kps >= 12 ? s * 2.5 : s),
    createCard('sr_combo_100', 'コンボ・ジェネシス', 'コンボ100以上で2.8倍', 'SR', 'super-mushroom.png', (w, s) => s * 2.8),
    createCard('sr_long_15', '叙事詩', '15文字以上で3.0倍', 'SR', 'burning-book.png', (w, s) => w.length >= 15 ? s * 30 : s),
    createCard('sr_miracle_accuracy', '奇跡の正確性', 'ノーミスラウンド終了で3.5倍', 'SR', 'angel-wings.png', null, 'roundEnd'),
    createCard('sr_fever_time', 'フィーバー・モード', '30秒間ずっと2.3倍', 'SR', 'burning-passion.png', (w, s) => s * 2.3),
    createCard('sr_berserker', '狂戦士', '全生産量が常に2.4倍', 'SR', 'axe-swing.png', (w, s) => s * 2.4),
    createCard('sr_hidden_power', '秘められた力', '「Z,X,Q」全てあれば3.2倍', 'SR', 'crystalize.png', (w, s) => {
        const l = w.toLowerCase();
        return l.includes('z') && l.includes('x') && l.includes('q') ? s * 3.2 : s;
    }),

    // SSR (Special Super Rare)
    createCard('ssr_universe', '宇宙の創造', '基礎CpCを3.0倍にする', 'SSR', 'globe.png', (w, s) => s * 3.0),
    createCard('ssr_catastrophe', 'カタストロフィ', '成功で3.5倍、ミスでリセット', 'SSR', 'caldera.png', (w, s) => s * 3.5),
    createCard('ssr_shining_blade', '聖剣の輝き', '全単語がクリティカル＆2.8倍', 'SSR', 'shining-sword.png', (w, s) => s * 2.8),
    createCard('ssr_legendary', '伝説の叙事詩', '20文字以上で3.8倍', 'SSR', 'burning-book.png', (w, s) => w.length >= 20 ? s * 3.8 : s),
    createCard('ssr_royal', 'ロイヤル・ケーキ', '「しょーとけーき」で3.3倍', 'SSR', 'cake-slice.png', (w, s) => w === 'しょーとけーき' ? s * 3.3 : s),

    // UR (Ultra Rare)
    createCard('ur_god_hand', 'ゴッド・ハンド', '全生産量が5.0倍', 'UR', 'mailed-fist.png', (w, s) => s * 5.0),
    createCard('ur_typing_god', 'タイピングの神', '全生産量が6.0倍', 'UR', 'prayer.png', (w, s) => s * 6.0),
    createCard('ur_big_bang', 'ビッグバン', 'ラウンド終了時に獲得量を10倍にする', 'UR', 'bright-explosion.png', null, 'roundEnd'),
    createCard('ur_absolute_zero', '絶対零度', 'KPS 15以上で15倍', 'UR', 'icebergs.png', (w, s, k) => k >= 15 ? s * 15 : s * 2.0)
];

/**
 * 重み付きランダムでカードを選択
 */
export function getRandomCards() {
    const cards = [];
    const totalWeight = Object.values(RARITIES).reduce((sum, r) => sum + r.weight, 0);

    for (let i = 0; i < 3; i++) {
        let random = Math.random() * totalWeight;
        let selectedRarity = 'N';

        for (const [key, config] of Object.entries(RARITIES)) {
            if (random < config.weight) {
                selectedRarity = key;
                break;
            }
            random -= config.weight;
        }

        const rarityCards = DRAFT_CARDS.filter(c => c.rarity === selectedRarity);
        const pool = rarityCards.length > 0 ? rarityCards : DRAFT_CARDS.filter(c => c.rarity === 'N');
        const card = pool[Math.floor(Math.random() * pool.length)];

        if (cards.some(c => c.id === card.id) && pool.length > 1) {
            i--;
            continue;
        }

        cards.push(card);
    }

    return cards;
}

/**
 * レアリティに応じた色を取得
 */
export function getRarityColor(rarity) {
    return RARITIES[rarity]?.color || RARITIES.N.color;
}
