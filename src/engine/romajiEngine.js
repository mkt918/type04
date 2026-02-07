/**
 * ローマ字変換システム
 * CSVファイルから読み込んだローマ字マッピングを使用して、
 * 日本語のかな文字をローマ字入力で判定する
 */

// ローマ字マッピングデータ（CSVから生成）
export const ROMAJI_MAP = {
    // 清音
    'あ': ['a'],
    'い': ['i', 'yi'],
    'う': ['u', 'wu'],
    'え': ['e', 'ye'],
    'お': ['o'],
    'か': ['ka'],
    'き': ['ki'],
    'く': ['ku', 'qu'],
    'け': ['ke'],
    'こ': ['ko'],
    'さ': ['sa'],
    'し': ['si', 'shi'],
    'す': ['su'],
    'せ': ['se'],
    'そ': ['so'],
    'た': ['ta'],
    'ち': ['ti', 'chi'],
    'つ': ['tu', 'tsu'],
    'て': ['te'],
    'と': ['to'],
    'な': ['na'],
    'に': ['ni'],
    'ぬ': ['nu'],
    'ね': ['ne'],
    'の': ['no'],
    'は': ['ha'],
    'ひ': ['hi'],
    'ふ': ['hu', 'fu'],
    'へ': ['he'],
    'ほ': ['ho'],
    'ま': ['ma'],
    'み': ['mi'],
    'む': ['mu'],
    'め': ['me'],
    'も': ['mo'],
    'や': ['ya'],
    'ゆ': ['yu'],
    'よ': ['yo'],
    'ら': ['ra'],
    'り': ['ri'],
    'る': ['ru'],
    'れ': ['re'],
    'ろ': ['ro'],
    'わ': ['wa'],
    'を': ['wo'],
    'ん': ['nn', 'n'],

    // 濁音
    'が': ['ga'],
    'ぎ': ['gi'],
    'ぐ': ['gu'],
    'げ': ['ge'],
    'ご': ['go'],
    'ざ': ['za'],
    'じ': ['zi', 'ji'],
    'ず': ['zu'],
    'ぜ': ['ze'],
    'ぞ': ['zo'],
    'だ': ['da'],
    'ぢ': ['di'],
    'づ': ['du'],
    'で': ['de'],
    'ど': ['do'],
    'ば': ['ba'],
    'び': ['bi'],
    'ぶ': ['bu'],
    'べ': ['be'],
    'ぼ': ['bo'],

    // 半濁音
    'ぱ': ['pa'],
    'ぴ': ['pi'],
    'ぷ': ['pu'],
    'ぺ': ['pe'],
    'ぽ': ['po'],

    // 拗音
    'きゃ': ['kya'],
    'きゅ': ['kyu'],
    'きょ': ['kyo'],
    'しゃ': ['sya', 'sha'],
    'しゅ': ['syu', 'shu'],
    'しょ': ['syo', 'sho'],
    'ちゃ': ['tya', 'cha'],
    'ちゅ': ['tyu', 'chu'],
    'ちょ': ['tyo', 'cho'],
    'にゃ': ['nya'],
    'にゅ': ['nyu'],
    'にょ': ['nyo'],
    'ひゃ': ['hya'],
    'ひゅ': ['hyu'],
    'ひょ': ['hyo'],
    'みゃ': ['mya'],
    'みゅ': ['myu'],
    'みょ': ['myo'],
    'りゃ': ['rya'],
    'りゅ': ['ryu'],
    'りょ': ['ryo'],
    'ぎゃ': ['gya'],
    'ぎゅ': ['gyu'],
    'ぎょ': ['gyo'],
    'じゃ': ['ja', 'zya'],
    'じゅ': ['ju', 'zyu'],
    'じょ': ['jo', 'zyo'],
    'びゃ': ['bya'],
    'びゅ': ['byu'],
    'びょ': ['byo'],
    'ぴゃ': ['pya'],
    'ぴゅ': ['pyu'],
    'ぴょ': ['pyo'],

    // 特殊
    'ふぁ': ['fa'],
    'ふぃ': ['fi'],
    'ふぇ': ['fe'],
    'ふぉ': ['fo'],
    'てぃ': ['thi'],
    'でぃ': ['dhi'],
    'でゅ': ['dhu'],

    // 小書き
    'ぁ': ['la', 'xa'],
    'ぃ': ['li', 'xi'],
    'ぅ': ['lu', 'xu'],
    'ぇ': ['le', 'xe'],
    'ぉ': ['lo', 'xo'],
    'っ': ['ltu', 'xtu'],
    'ゃ': ['lya', 'xya'],
    'ゅ': ['lyu', 'xyu'],
    'ょ': ['lyo', 'xyo']
};

/**
 * ローマ字タイピングエンジン
 * 日本語のかな文字をローマ字で入力判定する
 */
export class RomajiTypingEngine {
    constructor() {
        this.targetText = '';
        this.currentKanaIndex = 0;
        this.currentRomajiBuffer = '';
        this.possibleInputs = [];
    }

    /**
     * 新しい日本語テキストを設定
     */
    setText(text) {
        this.targetText = text;
        this.currentKanaIndex = 0;
        this.currentRomajiBuffer = '';
        this.updatePossibleInputs();
    }

    /**
     * 現在のかな文字に対する可能な入力を更新
     */
    updatePossibleInputs() {
        if (this.currentKanaIndex >= this.targetText.length) {
            this.possibleInputs = [];
            return;
        }

        // 2文字の拗音をチェック（きゃ、しゃ等）
        const twoChar = this.targetText.substring(this.currentKanaIndex, this.currentKanaIndex + 2);
        if (ROMAJI_MAP[twoChar]) {
            this.possibleInputs = ROMAJI_MAP[twoChar].map(romaji => ({
                romaji,
                kanaLength: 2
            }));
            return;
        }

        // 1文字のかな
        const oneChar = this.targetText[this.currentKanaIndex];
        if (ROMAJI_MAP[oneChar]) {
            this.possibleInputs = ROMAJI_MAP[oneChar].map(romaji => ({
                romaji,
                kanaLength: 1
            }));
        } else {
            // マッピングにない文字（記号など）はそのまま
            this.possibleInputs = [{
                romaji: oneChar,
                kanaLength: 1
            }];
        }

        // 「ん」の特殊処理：次の文字によって「n」だけで確定できる場合がある
        if (oneChar === 'ん' && this.currentKanaIndex + 1 < this.targetText.length) {
            const nextChar = this.targetText[this.currentKanaIndex + 1];
            // 次が「な行」「や行」以外なら「n」1文字で確定
            if (!['な', 'に', 'ぬ', 'ね', 'の', 'や', 'ゆ', 'よ'].includes(nextChar)) {
                this.possibleInputs.push({ romaji: 'n', kanaLength: 1 });
            }
        }

        // 促音「っ」の特殊処理：次の子音を重ねる
        if (oneChar === 'っ' && this.currentKanaIndex + 1 < this.targetText.length) {
            const nextChar = this.targetText[this.currentKanaIndex + 1];
            if (ROMAJI_MAP[nextChar]) {
                const nextRomaji = ROMAJI_MAP[nextChar][0];
                if (nextRomaji && nextRomaji.length > 0) {
                    const consonant = nextRomaji[0];
                    this.possibleInputs.push({ romaji: consonant, kanaLength: 1 });
                }
            }
        }
    }

    /**
     * キー入力を処理
     * @param {string} key - 入力されたキー
     * @returns {Object} { success: boolean, completed: boolean, kanaCompleted: boolean }
     */
    handleInput(key) {
        this.currentRomajiBuffer += key;

        // 完全一致チェック
        for (const input of this.possibleInputs) {
            if (this.currentRomajiBuffer === input.romaji) {
                // 一致！
                this.currentKanaIndex += input.kanaLength;
                this.currentRomajiBuffer = '';
                this.updatePossibleInputs();

                const completed = this.currentKanaIndex >= this.targetText.length;
                return {
                    success: true,
                    kanaCompleted: true,
                    completed
                };
            }
        }

        // 部分一致チェック
        const hasPartialMatch = this.possibleInputs.some(input =>
            input.romaji.startsWith(this.currentRomajiBuffer)
        );

        if (hasPartialMatch) {
            // 部分一致あり、続行
            return {
                success: true,
                kanaCompleted: false,
                completed: false
            };
        }

        // 一致なし、ミス
        this.currentRomajiBuffer = '';
        return {
            success: false,
            kanaCompleted: false,
            completed: false
        };
    }

    /**
     * 現在の進捗を取得
     */
    getProgress() {
        return {
            targetText: this.targetText,
            currentKanaIndex: this.currentKanaIndex,
            currentRomajiBuffer: this.currentRomajiBuffer,
            typedText: this.targetText.substring(0, this.currentKanaIndex),
            remainingText: this.targetText.substring(this.currentKanaIndex)
        };
    }

    /**
     * リセット
     */
    reset() {
        this.targetText = '';
        this.currentKanaIndex = 0;
        this.currentRomajiBuffer = '';
        this.possibleInputs = [];
    }
}
