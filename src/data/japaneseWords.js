/**
 * 日本語ワードリスト（料理・お菓子関連）
 * ローマ字入力で打つ日本語の単語
 */

export const JAPANESE_WORD_LISTS = {
    // レベル1: 基本ワード（初期から使用可能）
    level1: {
        name: '基本ワードリスト（日本語）',
        multiplier: 1.0,
        cost: 0,
        words: [
            'くっきー',
            'けーき',
            'ちょこ',
            'あめ',
            'がむ',
            'ぱん',
            'みるく',
            'さとう',
            'たまご',
            'こむぎこ',
            'ばたー',
            'おーぶん',
            'おかし',
            'やく',
            'まぜる'
        ]
    },

    // レベル2: 中級ワード
    level2: {
        name: '中級ワードリスト（日本語）',
        multiplier: 1.5,
        cost: 1000,
        words: [
            'ちょこれーと',
            'きゃらめる',
            'ばにら',
            'すとろべりー',
            'まかろん',
            'ぷりん',
            'しゅーくりーむ',
            'どーなつ',
            'まふぃん',
            'わっふる',
            'ぱんけーき',
            'ちーずけーき',
            'もんぶらん',
            'てぃらみす',
            'ばうむくーへん'
        ]
    },

    // レベル3: 上級ワード
    level3: {
        name: '上級ワードリスト（日本語）',
        multiplier: 2.0,
        cost: 10000,
        words: [
            'しょーとけーき',
            'ろーるけーき',
            'ぱうんどけーき',
            'ふぃなんしぇ',
            'まどれーぬ',
            'えくれあ',
            'みるふぃーゆ',
            'たると',
            'ぱい',
            'すふれ',
            'むーす',
            'ぜりー',
            'こんぽーと',
            'まーまれーど',
            'じゃむ'
        ]
    },

    // レベル4: 超上級ワード
    level4: {
        name: '超上級ワードリスト（日本語）',
        multiplier: 3.0,
        cost: 100000,
        words: [
            'ふらんべ',
            'めれんげ',
            'がなっしゅ',
            'ぐらさーじゅ',
            'かすたーどくりーむ',
            'ほいっぷくりーむ',
            'ぱてぃしえ',
            'こんふぃずりー',
            'ぶらんまんじぇ',
            'ぱんなこった',
            'ざばいおーね',
            'かぬれ',
            'ふぃなんしぇ',
            'まかろなーじゅ',
            'ぷちふーる'
        ]
    },

    // レベル5: 伝説ワード
    level5: {
        name: '伝説ワードリスト（日本語）',
        multiplier: 5.0,
        cost: 1000000,
        words: [
            'くろわっさん',
            'ぱんおしょこら',
            'ぱんおれざん',
            'ぶりおっしゅ',
            'しゅとーれん',
            'ざっはとるて',
            'しゅばるつべるだーきるしゅとると',
            'ぱてぃすりー',
            'こんふぃずーる',
            'ぱてぃしえーる',
            'がすとろのみー',
            'ぐるめ',
            'でりしゃす',
            'えくせれんと',
            'まぐにふぃせんと'
        ]
    }
};

/**
 * 現在解放されているワードリストから日本語単語を取得
 * @param {Array<string>} unlockedLevels - 解放済みレベルの配列
 * @returns {Object} { word: string, multiplier: number }
 */
export function getRandomJapaneseWord(unlockedLevels) {
    const randomLevel = unlockedLevels[Math.floor(Math.random() * unlockedLevels.length)];
    const wordList = JAPANESE_WORD_LISTS[randomLevel];
    const randomWord = wordList.words[Math.floor(Math.random() * wordList.words.length)];

    return {
        word: randomWord,
        multiplier: wordList.multiplier
    };
}
