/**
 * 転生（プレステージ）システム
 * ヘブンリーチップスと永続アップグレードを管理
 */

import Decimal from 'break_infinity.js';

export const PRESTIGE_UPGRADES = {
    initialCapital1: {
        id: 'initialCapital1',
        name: '初期資本 Lv.1',
        description: '転生後、1,000クッキーでスタート',
        cost: 10,
        effect: (gameState) => {
            gameState.prestigeUpgrades.initialCapital = 1;
        }
    },

    initialCapital2: {
        id: 'initialCapital2',
        name: '初期資本 Lv.2',
        description: '転生後、1,000,000クッキーでスタート',
        cost: 50,
        requires: 'initialCapital1',
        effect: (gameState) => {
            gameState.prestigeUpgrades.initialCapital = 2;
        }
    },

    initialCapital3: {
        id: 'initialCapital3',
        name: '初期資本 Lv.3',
        description: '転生後、1,000,000,000クッキーでスタート',
        cost: 200,
        requires: 'initialCapital2',
        effect: (gameState) => {
            gameState.prestigeUpgrades.initialCapital = 3;
        }
    },

    draftReroll: {
        id: 'draftReroll',
        name: 'ドラフト・リロール',
        description: 'カードドラフトで気に入らない結果を1回引き直せる',
        cost: 25,
        effect: (gameState) => {
            gameState.prestigeUpgrades.draftReroll = true;
        }
    },

    chipMultiplier: {
        id: 'chipMultiplier',
        name: 'チップ倍率強化',
        description: 'ヘブンリーチップスのCpCボーナスが2%→3%に増加',
        cost: 100,
        effect: (gameState) => {
            gameState.prestigeUpgrades.chipMultiplier = true;
        }
    }
};

/**
 * アップグレードを購入可能か判定
 */
export function canPurchaseUpgrade(upgradeId, gameState) {
    const upgrade = PRESTIGE_UPGRADES[upgradeId];
    if (!upgrade) return false;

    // 既に購入済み
    if (gameState.prestigeUpgrades[upgradeId]) {
        return false;
    }

    // 前提条件チェック
    if (upgrade.requires && !gameState.prestigeUpgrades[upgrade.requires]) {
        return false;
    }

    // チップ数チェック
    return gameState.heavenlyChips.gte(upgrade.cost);
}

/**
 * アップグレードを購入
 */
export function purchaseUpgrade(upgradeId, gameState) {
    if (!canPurchaseUpgrade(upgradeId, gameState)) {
        return false;
    }

    const upgrade = PRESTIGE_UPGRADES[upgradeId];

    // チップを消費
    gameState.heavenlyChips = gameState.heavenlyChips.sub(upgrade.cost);

    // 効果を適用
    upgrade.effect(gameState);

    // セーブ
    gameState.saveToStorage();

    return true;
}
