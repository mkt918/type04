/**
 * クッキー関連の英単語リスト
 * 難易度別に分類され、ショップで購入することで高難易度ワードリストが解放される
 */

export const WORD_LISTS = {
    // レベル1: 基本ワード（初期から使用可能）
    level1: {
        name: '基本ワードリスト',
        multiplier: 1.0,
        cost: 0,
        words: [
            'Cookie', 'Oven', 'Sugar', 'Milk', 'Egg',
            'Flour', 'Bake', 'Sweet', 'Dough', 'Mix',
            'Heat', 'Tray', 'Bowl', 'Spoon', 'Cup'
        ]
    },

    // レベル2: 中級ワード（ショップで購入）
    level2: {
        name: '中級ワードリスト',
        multiplier: 1.5,
        cost: 1000,
        words: [
            'Baking', 'Kitchen', 'Vanilla', 'Butter', 'Recipe',
            'Chocolate', 'Caramel', 'Cinnamon', 'Almond', 'Walnut',
            'Frosting', 'Sprinkle', 'Melting', 'Mixing', 'Rolling'
        ]
    },

    // レベル3: 上級ワード（ショップで購入）
    level3: {
        name: '上級ワードリスト',
        multiplier: 2.0,
        cost: 10000,
        words: [
            'Ingredient', 'Temperature', 'Confection', 'Delicious', 'Homemade',
            'Shortbread', 'Macadamia', 'Peanutbutter', 'Gingerbread', 'Snickerdoodle',
            'Preparation', 'Measurement', 'Consistency', 'Crystallize', 'Caramelize'
        ]
    },

    // レベル4: 超上級ワード（ショップで購入）
    level4: {
        name: '超上級ワードリスト',
        multiplier: 3.0,
        cost: 100000,
        words: [
            'Confectionery', 'Extraordinary', 'Sophisticated', 'Masterpiece', 'Professional',
            'Refrigeration', 'Incorporation', 'Transformation', 'Experimentation', 'Customization',
            'Authenticity', 'Craftsmanship', 'Presentation', 'Appreciation', 'Celebration'
        ]
    },

    // レベル5: 伝説ワード（ショップで購入）
    level5: {
        name: '伝説ワードリスト',
        multiplier: 5.0,
        cost: 1000000,
        words: [
            'Gastronomical', 'Extraordinaire', 'Unparalleled', 'Quintessential', 'Revolutionary',
            'Unprecedented', 'Unforgettable', 'Incomparable', 'Transcendent', 'Phenomenal',
            'Indescribable', 'Irreplaceable', 'Unbelievable', 'Breathtaking', 'Overwhelming'
        ]
    }
};

/**
 * 現在解放されているワードリストから単語を取得
 * @param {Array<string>} unlockedLevels - 解放済みレベルの配列 (例: ['level1', 'level2'])
 * @returns {Object} { word: string, multiplier: number }
 */
export function getRandomWord(unlockedLevels) {
    // 解放済みレベルからランダムに選択
    const randomLevel = unlockedLevels[Math.floor(Math.random() * unlockedLevels.length)];
    const wordList = WORD_LISTS[randomLevel];
    const randomWord = wordList.words[Math.floor(Math.random() * wordList.words.length)];

    return {
        word: randomWord,
        multiplier: wordList.multiplier
    };
}
