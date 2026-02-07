import Decimal from 'break_infinity.js';

/**
 * スコア計算システム
 * 基本式: 獲得クッキー = (基礎CpC + 加算バフ) × (コンボ倍率 × カード倍率 × フィーバー倍率 × クリティカル倍率)
 */

export class ScoreCalculator {
    constructor(gameState) {
        this.gameState = gameState;
    }

    /**
     * 1文字入力時のスコアを計算
     * @param {string} word - 現在の単語
     * @param {number} combo - 現在のコンボ数
     * @param {number} kps - Keys Per Second
     * @param {number} timeRemaining - 残り時間（秒）
     * @param {number} wordMultiplier - ワードリストの倍率
     * @returns {Decimal} 獲得クッキー数
     */
    calculateScore(word, combo, kps, timeRemaining, wordMultiplier = 1.0) {
        // 基礎CpC
        let baseCpC = this.gameState.calculateCpC();

        // コンボ倍率
        const comboMultiplier = this.gameState.calculateComboMultiplier(combo);

        // クリティカル判定
        const isCritical = Math.random() < this.gameState.calculateCriticalRate();
        const criticalMultiplier = isCritical ? this.gameState.calculateCriticalMultiplier() : 1;

        // カード効果の適用
        let cardMultiplier = 1;
        for (const card of this.gameState.activeCards) {
            if (card.effect && typeof card.effect === 'function') {
                try {
                    const result = card.effect(word, 1, kps, timeRemaining);
                    cardMultiplier *= result;
                } catch (e) {
                    console.error('カード効果の適用エラー:', e);
                }
            }
        }

        // ワードリスト倍率
        const totalMultiplier = comboMultiplier * cardMultiplier * criticalMultiplier * wordMultiplier;

        // 最終スコア
        const score = baseCpC.mul(totalMultiplier);

        return {
            score,
            isCritical,
            criticalMultiplier,
            comboMultiplier,
            cardMultiplier,
            wordMultiplier,
            totalMultiplier
        };
    }

    /**
     * 単語熟練度ボーナスを取得
     */
    getWordMasteryBonus(word) {
        const mastery = this.gameState.prestigeUpgrades.wordMastery[word] || 0;
        return 1 + (mastery * 0.5); // 1回ごとに+50%
    }

    /**
     * 単語熟練度を増加
     */
    incrementWordMastery(word) {
        if (!this.gameState.prestigeUpgrades.wordMastery[word]) {
            this.gameState.prestigeUpgrades.wordMastery[word] = 0;
        }
        this.gameState.prestigeUpgrades.wordMastery[word]++;
    }
}

/**
 * 数値を読みやすい形式に変換
 * @param {Decimal} value - 変換する数値
 * @param {string} notation - 表記法 ('standard', 'scientific', 'engineering')
 * @returns {string} フォーマットされた文字列
 */
export function formatNumber(value, notation = 'standard') {
    if (!(value instanceof Decimal)) {
        value = new Decimal(value);
    }

    if (value.lt(1000)) {
        return value.toFixed(0);
    }

    if (notation === 'scientific') {
        return value.toExponential(2);
    }

    if (notation === 'engineering') {
        const exp = Math.floor(value.log10() / 3) * 3;
        const mantissa = value.div(Decimal.pow(10, exp));
        return `${mantissa.toFixed(2)}e${exp}`;
    }

    // Standard notation with suffixes
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    const tier = Math.floor(value.log10() / 3);

    if (tier >= suffixes.length) {
        return value.toExponential(2);
    }

    const suffix = suffixes[tier];
    const scale = Decimal.pow(10, tier * 3);
    const scaled = value.div(scale);

    return `${scaled.toFixed(2)}${suffix}`;
}
