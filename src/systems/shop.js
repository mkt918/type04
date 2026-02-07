import Decimal from 'break_infinity.js';
import { JAPANESE_WORD_LISTS } from '../data/japaneseWords.js';

/**
 * ショップシステム（日本語専用版）
 * アイテムの購入、価格計算を担当
 */

export const SHOP_ITEMS = {
    oven: {
        id: 'oven',
        name: 'プロフェッショナル・オーブン',
        description: '基礎CpCを+10増加',
        icon: '🔥',
        basePrice: 100,
        priceMultiplier: 1.15,
        effect: (gameState) => {
            gameState.shopPurchases.oven++;
            gameState.baseCpC = gameState.baseCpC.add(10);
        }
    },

    mixer: {
        id: 'mixer',
        name: '精密ミキサー',
        description: 'ミスペナルティ時間を-0.05秒短縮',
        icon: '🥄',
        basePrice: 500,
        priceMultiplier: 1.2,
        effect: (gameState) => {
            gameState.shopPurchases.mixer++;
        }
    },

    butter: {
        id: 'butter',
        name: '高純度バター',
        description: 'クリティカル率+1%、倍率+2',
        icon: '🧈',
        basePrice: 1000,
        priceMultiplier: 1.25,
        effect: (gameState) => {
            gameState.shopPurchases.butter++;
            gameState.criticalRate += 0.01;
            gameState.criticalMultiplier += 2;
        }
    },

    wordList2: {
        id: 'wordList2',
        name: JAPANESE_WORD_LISTS.level2.name,
        description: `倍率${JAPANESE_WORD_LISTS.level2.multiplier}xの単語が出現`,
        icon: '📖',
        basePrice: JAPANESE_WORD_LISTS.level2.cost,
        priceMultiplier: 1,
        oneTime: true,
        effect: (gameState) => {
            gameState.shopPurchases.wordList2 = true;
            gameState.unlockedWordLists.push('level2');
        }
    },

    wordList3: {
        id: 'wordList3',
        name: JAPANESE_WORD_LISTS.level3.name,
        description: `倍率${JAPANESE_WORD_LISTS.level3.multiplier}xの単語が出現`,
        icon: '📚',
        basePrice: JAPANESE_WORD_LISTS.level3.cost,
        priceMultiplier: 1,
        oneTime: true,
        requires: 'wordList2',
        effect: (gameState) => {
            gameState.shopPurchases.wordList3 = true;
            gameState.unlockedWordLists.push('level3');
        }
    },

    wordList4: {
        id: 'wordList4',
        name: JAPANESE_WORD_LISTS.level4.name,
        description: `倍率${JAPANESE_WORD_LISTS.level4.multiplier}xの単語が出現`,
        icon: '📕',
        basePrice: JAPANESE_WORD_LISTS.level4.cost,
        priceMultiplier: 1,
        oneTime: true,
        requires: 'wordList3',
        effect: (gameState) => {
            gameState.shopPurchases.wordList4 = true;
            gameState.unlockedWordLists.push('level4');
        }
    },

    wordList5: {
        id: 'wordList5',
        name: JAPANESE_WORD_LISTS.level5.name,
        description: `倍率${JAPANESE_WORD_LISTS.level5.multiplier}xの単語が出現`,
        icon: '📜',
        basePrice: JAPANESE_WORD_LISTS.level5.cost,
        priceMultiplier: 1,
        oneTime: true,
        requires: 'wordList4',
        effect: (gameState) => {
            gameState.shopPurchases.wordList5 = true;
            gameState.unlockedWordLists.push('level5');
        }
    }
};

/**
 * アイテムの現在価格を計算
 */
export function getItemPrice(itemId, gameState) {
    const item = SHOP_ITEMS[itemId];
    if (!item) return new Decimal(0);

    // 買い切りアイテムの場合
    if (item.oneTime) {
        return new Decimal(item.basePrice);
    }

    // 購入回数に応じて価格上昇
    const purchaseCount = gameState.shopPurchases[itemId] || 0;
    const price = new Decimal(item.basePrice).mul(
        Math.pow(item.priceMultiplier, purchaseCount)
    );

    return price;
}

/**
 * アイテムを購入可能か判定
 */
export function canPurchase(itemId, gameState) {
    const item = SHOP_ITEMS[itemId];
    if (!item) return false;

    // 買い切りアイテムで既に購入済み
    if (item.oneTime && gameState.shopPurchases[itemId]) {
        return false;
    }

    // 前提条件チェック
    if (item.requires && !gameState.shopPurchases[item.requires]) {
        return false;
    }

    // 資金チェック
    const price = getItemPrice(itemId, gameState);
    return gameState.totalCookies.gte(price);
}

/**
 * アイテムを購入
 */
export function purchaseItem(itemId, gameState) {
    if (!canPurchase(itemId, gameState)) {
        return false;
    }

    const item = SHOP_ITEMS[itemId];
    const price = getItemPrice(itemId, gameState);

    // クッキーを消費
    gameState.totalCookies = gameState.totalCookies.sub(price);

    // 効果を適用
    item.effect(gameState);

    // セーブ
    gameState.saveToStorage();

    return true;
}
