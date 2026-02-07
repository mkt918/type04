/**
 * ドラフトカードの定義
 * ラウンド間で3枚からランダムに提示され、1枚選択できる
 * 効果は現在の周回（10ラウンド）のみ有効
 */

export const DRAFT_CARDS = [
    {
        id: 's_assault',
        name: '「S」の猛攻',
        description: '単語の先頭が「S」の場合、その単語全体のスコアが10倍',
        rarity: 'rare',
        effect: (word, baseScore) => {
            if (word[0].toUpperCase() === 'S') {
                return baseScore * 10;
            }
            return baseScore;
        }
    },

    {
        id: 'speed_demon',
        name: 'スピード・デーモン',
        description: '秒間入力文字数（KPS）が8を超えている間、全生産量が5倍',
        rarity: 'epic',
        effect: (word, baseScore, kps) => {
            if (kps >= 8) {
                return baseScore * 5;
            }
            return baseScore;
        }
    },

    {
        id: 'sugar_rush',
        name: 'シュガー・ラッシュ',
        description: 'ラウンドの残り10秒間、タイピング速度に応じて倍率が最大50倍まで加速',
        rarity: 'legendary',
        effect: (word, baseScore, kps, timeRemaining) => {
            if (timeRemaining <= 10) {
                const multiplier = Math.min(50, 1 + (kps * 5));
                return baseScore * multiplier;
            }
            return baseScore;
        }
    },

    {
        id: 'perfect_bake',
        name: 'パーフェクト・ベイク',
        description: 'ラウンド中に一度もミスをしなかった場合、リザルトで獲得クッキーが100倍（ハイリスク・ハイリターン）',
        rarity: 'legendary',
        effect: null, // ラウンド終了時に判定
        isRoundEndEffect: true
    },

    {
        id: 'combo_master',
        name: 'コンボマスター',
        description: 'コンボ倍率の上昇速度が2倍（10コンボごとに+0.2倍）',
        rarity: 'rare',
        effect: null, // コンボ計算時に適用
        isComboEffect: true
    },

    {
        id: 'critical_surge',
        name: 'クリティカル・サージ',
        description: 'クリティカル発生率が2倍、クリティカル倍率が+50',
        rarity: 'epic',
        effect: null, // クリティカル判定時に適用
        isCriticalEffect: true
    },

    {
        id: 'long_word_bonus',
        name: 'ロングワード・ボーナス',
        description: '8文字以上の単語は倍率が3倍',
        rarity: 'common',
        effect: (word, baseScore) => {
            if (word.length >= 8) {
                return baseScore * 3;
            }
            return baseScore;
        }
    },

    {
        id: 'short_word_bonus',
        name: 'ショートワード・ボーナス',
        description: '5文字以下の単語は倍率が4倍',
        rarity: 'common',
        effect: (word, baseScore) => {
            if (word.length <= 5) {
                return baseScore * 4;
            }
            return baseScore;
        }
    },

    {
        id: 'vowel_power',
        name: '母音パワー',
        description: '母音（A,E,I,O,U）を含む単語は文字数×0.5倍のボーナス',
        rarity: 'common',
        effect: (word, baseScore) => {
            const vowels = ['A', 'E', 'I', 'O', 'U'];
            const vowelCount = word.toUpperCase().split('').filter(c => vowels.includes(c)).length;
            return baseScore * (1 + vowelCount * 0.5);
        }
    },

    {
        id: 'double_letter',
        name: 'ダブルレター',
        description: '同じ文字が連続する単語（例：Cookie）は倍率が6倍',
        rarity: 'rare',
        effect: (word, baseScore) => {
            for (let i = 0; i < word.length - 1; i++) {
                if (word[i].toLowerCase() === word[i + 1].toLowerCase()) {
                    return baseScore * 6;
                }
            }
            return baseScore;
        }
    },

    {
        id: 'first_last_same',
        name: 'ファースト・ラスト',
        description: '最初と最後の文字が同じ単語は倍率が8倍',
        rarity: 'epic',
        effect: (word, baseScore) => {
            if (word.length >= 2 && word[0].toLowerCase() === word[word.length - 1].toLowerCase()) {
                return baseScore * 8;
            }
            return baseScore;
        }
    },

    {
        id: 'chocolate_lover',
        name: 'チョコレート・ラバー',
        description: '「Chocolate」を入力すると、その1回だけ倍率が100倍',
        rarity: 'legendary',
        effect: (word, baseScore) => {
            if (word.toLowerCase() === 'chocolate') {
                return baseScore * 100;
            }
            return baseScore;
        }
    }
];

/**
 * ランダムに3枚のカードを選択
 * @returns {Array} 3枚のカード
 */
export function getRandomCards() {
    const shuffled = [...DRAFT_CARDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
}

/**
 * レアリティに応じた色を取得
 */
export function getRarityColor(rarity) {
    const colors = {
        common: 'from-gray-400 to-gray-600',
        rare: 'from-blue-400 to-blue-600',
        epic: 'from-purple-400 to-purple-600',
        legendary: 'from-yellow-400 to-orange-600'
    };
    return colors[rarity] || colors.common;
}
