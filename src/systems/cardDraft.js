import { getRandomCards } from '../data/cards.js';

/**
 * カードドラフトシステム
 * ラウンド間でカードを選択する機能を提供
 */

export class CardDraft {
    constructor(gameState) {
        this.gameState = gameState;
        this.currentOptions = [];
    }

    /**
     * 新しいドラフトを開始（3枚のカードを提示）
     */
    startDraft() {
        this.currentOptions = getRandomCards();
        return this.currentOptions;
    }

    /**
     * カードを選択
     * @param {number} index - 選択するカードのインデックス（0-2）
     */
    selectCard(index) {
        if (index < 0 || index >= this.currentOptions.length) {
            return false;
        }

        const selectedCard = this.currentOptions[index];

        // アクティブカードに追加
        this.gameState.activeCards.push(selectedCard);

        // セーブ
        this.gameState.saveToStorage();

        return true;
    }

    /**
     * ドラフトをリロール（転生アップグレードで解放）
     */
    reroll() {
        if (!this.gameState.prestigeUpgrades.draftReroll) {
            return false;
        }

        this.currentOptions = getRandomCards();
        return this.currentOptions;
    }

    /**
     * 現在のオプションを取得
     */
    getCurrentOptions() {
        return this.currentOptions;
    }

    /**
     * 周回終了時にアクティブカードをクリア
     */
    clearActiveCards() {
        this.gameState.activeCards = [];
        this.gameState.saveToStorage();
    }
}
