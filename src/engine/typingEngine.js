import { getRandomWord } from '../data/words.js';

/**
 * タイピングエンジン
 * キーボード入力の処理、単語の管理、ミスタイプ判定を担当
 */

export class TypingEngine {
    constructor(gameState) {
        this.gameState = gameState;
        this.currentWord = '';
        this.currentWordMultiplier = 1.0;
        this.typedChars = 0;
        this.combo = 0;
        this.missCount = 0;
        this.isPenalty = false; // ペナルティ中かどうか

        // WPM/KPS計算用
        this.startTime = null;
        this.totalCharsTyped = 0;
        this.recentKeyPresses = []; // タイムスタンプの配列
    }

    /**
     * 新しい単語を取得
     */
    getNewWord() {
        const { word, multiplier } = getRandomWord(this.gameState.unlockedWordLists);
        this.currentWord = word;
        this.currentWordMultiplier = multiplier;
        this.typedChars = 0;
    }

    /**
     * タイピング開始
     */
    start() {
        this.startTime = Date.now();
        this.totalCharsTyped = 0;
        this.combo = 0;
        this.missCount = 0;
        this.recentKeyPresses = [];
        this.getNewWord();
    }

    /**
     * 文字入力を処理
     * @param {string} char - 入力された文字
     * @returns {Object} { success: boolean, completed: boolean, score: Decimal }
     */
    handleInput(char) {
        // ペナルティ中は入力を受け付けない
        if (this.isPenalty) {
            return { success: false, completed: false, penalty: true };
        }

        const expectedChar = this.currentWord[this.typedChars];

        // 入力判定
        if (char === expectedChar) {
            // 正解
            this.typedChars++;
            this.combo++;
            this.totalCharsTyped++;
            this.recentKeyPresses.push(Date.now());

            // 古いキープレス記録を削除（1秒以内のみ保持）
            const now = Date.now();
            this.recentKeyPresses = this.recentKeyPresses.filter(time => now - time < 1000);

            // 単語完成チェック
            if (this.typedChars >= this.currentWord.length) {
                const completedWord = this.currentWord;
                this.getNewWord();
                return {
                    success: true,
                    completed: true,
                    word: completedWord,
                    combo: this.combo
                };
            }

            return {
                success: true,
                completed: false,
                combo: this.combo
            };
        } else {
            // ミス
            this.combo = 0;
            this.missCount++;
            this.gameState.stats.totalMisses++;

            // ペナルティ発動（0.5秒間入力不可）
            this.isPenalty = true;
            setTimeout(() => {
                this.isPenalty = false;
            }, 500);

            return {
                success: false,
                completed: false,
                miss: true
            };
        }
    }

    /**
     * WPM（Words Per Minute）を計算
     */
    calculateWPM() {
        if (!this.startTime) return 0;

        const elapsedMinutes = (Date.now() - this.startTime) / 60000;
        if (elapsedMinutes === 0) return 0;

        // 5文字を1単語として計算
        const words = this.totalCharsTyped / 5;
        return Math.round(words / elapsedMinutes);
    }

    /**
     * KPS（Keys Per Second）を計算
     */
    calculateKPS() {
        return this.recentKeyPresses.length;
    }

    /**
     * 現在の進捗を取得
     */
    getProgress() {
        return {
            word: this.currentWord,
            typedChars: this.typedChars,
            combo: this.combo,
            wpm: this.calculateWPM(),
            kps: this.calculateKPS(),
            wordMultiplier: this.currentWordMultiplier,
            missCount: this.missCount
        };
    }

    /**
     * ラウンド終了時の統計を取得
     */
    getStats() {
        const wpm = this.calculateWPM();

        return {
            wpm,
            totalCharsTyped: this.totalCharsTyped,
            missCount: this.missCount,
            accuracy: this.totalCharsTyped / (this.totalCharsTyped + this.missCount)
        };
    }

    /**
     * リセット
     */
    reset() {
        this.currentWord = '';
        this.currentWordMultiplier = 1.0;
        this.typedChars = 0;
        this.combo = 0;
        this.missCount = 0;
        this.isPenalty = false;
        this.startTime = null;
        this.totalCharsTyped = 0;
        this.recentKeyPresses = [];
    }
}
