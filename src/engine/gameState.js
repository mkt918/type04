import Decimal from 'break_infinity.js';
import { JAPANESE_WORD_LISTS } from '../data/japaneseWords.js';

/**
 * ゲーム全体のステート管理（日本語専用版）
 * LocalStorageへの永続化も担当
 */

export class GameState {
    constructor() {
        this.loadFromStorage();
    }

    /**
     * 初期化
     */
    reset() {
        // 現在の周回データ
        this.currentRound = 1;
        this.totalCookies = new Decimal(0);
        this.roundCookies = new Decimal(0);

        // プレイヤーの基礎ステータス
        this.baseCpC = new Decimal(1); // Cookies per Character
        this.criticalRate = 0.05; // 5%
        this.criticalMultiplier = 2;

        // ショップアイテムの購入回数
        this.shopPurchases = {
            oven: 0,      // プロフェッショナル・オーブン（CpC増加）
            mixer: 0,     // 精密ミキサー（ミス耐性）
            butter: 0,    // 高純度バター（クリティカル強化）
            wordList2: false,
            wordList3: false,
            wordList4: false,
            wordList5: false
        };

        // 解放済みワードリスト
        this.unlockedWordLists = ['level1'];

        // 現在の周回で選択したカード
        this.activeCards = [];

        // 統計情報
        this.stats = {
            totalWordsTyped: 0,
            totalCharactersTyped: 0,
            maxCombo: 0,
            criticalHits: 0,
            totalMisses: 0,
            wpmHistory: []
        };

        // 転生（プレステージ）データ
        this.heavenlyChips = new Decimal(0);
        this.prestigeUpgrades = {
            initialCapital: 0,      // 初期資本レベル
            draftReroll: false,     // ドラフトリロール権
            wordMastery: {}         // 単語ごとの熟練度 { 'くっきー': 5, ... }
        };
    }

    /**
     * CpCを計算（ショップアイテムとヘブンリーチップスを考慮）
     */
    calculateCpC() {
        let cpc = this.baseCpC.add(this.shopPurchases.oven * 10);

        // ヘブンリーチップスボーナス（1チップごとに+2% CpC）
        const chipBonus = this.heavenlyChips.mul(0.02);
        cpc = cpc.mul(chipBonus.add(1));

        return cpc;
    }

    /**
     * クリティカル率を計算
     */
    calculateCriticalRate() {
        let rate = this.criticalRate + (this.shopPurchases.butter * 0.01);

        // カード効果
        const hasCriticalSurge = this.activeCards.some(card => card.id === 'critical_surge');
        if (hasCriticalSurge) {
            rate *= 2;
        }

        return Math.min(rate, 0.5); // 最大50%
    }

    /**
     * クリティカル倍率を計算
     */
    calculateCriticalMultiplier() {
        let multiplier = this.criticalMultiplier + (this.shopPurchases.butter * 2);

        // カード効果
        const hasCriticalSurge = this.activeCards.some(card => card.id === 'critical_surge');
        if (hasCriticalSurge) {
            multiplier += 50;
        }

        return multiplier;
    }

    /**
     * コンボ倍率を計算
     */
    calculateComboMultiplier(combo) {
        const hasComboMaster = this.activeCards.some(card => card.id === 'combo_master');
        const increment = hasComboMaster ? 0.2 : 0.1;

        return 1 + Math.floor(combo / 10) * increment;
    }

    /**
     * ラウンド開始
     */
    startRound() {
        this.roundCookies = new Decimal(0);
    }

    /**
     * ラウンド終了
     */
    endRound() {
        this.totalCookies = this.totalCookies.add(this.roundCookies);
        this.currentRound++;
    }

    /**
     * 周回終了（10ラウンド完了）
     */
    endCycle() {
        // ヘブンリーチップス計算: log10(総生産数)
        const newChips = new Decimal(Math.floor(this.totalCookies.log10()));
        this.heavenlyChips = this.heavenlyChips.add(newChips);

        return newChips;
    }

    /**
     * 転生（プレステージ）
     */
    prestige() {
        const chips = this.endCycle();

        // 転生データ以外をリセット
        const savedPrestige = {
            heavenlyChips: this.heavenlyChips,
            prestigeUpgrades: this.prestigeUpgrades
        };

        this.reset();

        this.heavenlyChips = savedPrestige.heavenlyChips;
        this.prestigeUpgrades = savedPrestige.prestigeUpgrades;

        // 初期資本を適用
        if (this.prestigeUpgrades.initialCapital > 0) {
            this.totalCookies = new Decimal(10).pow(this.prestigeUpgrades.initialCapital * 3);
        }

        this.saveToStorage();
        return chips;
    }

    /**
     * LocalStorageに保存
     */
    saveToStorage() {
        const data = {
            currentRound: this.currentRound,
            totalCookies: this.totalCookies.toString(),
            roundCookies: this.roundCookies.toString(),
            baseCpC: this.baseCpC.toString(),
            criticalRate: this.criticalRate,
            criticalMultiplier: this.criticalMultiplier,
            shopPurchases: this.shopPurchases,
            unlockedWordLists: this.unlockedWordLists,
            activeCards: this.activeCards,
            stats: this.stats,
            heavenlyChips: this.heavenlyChips.toString(),
            prestigeUpgrades: this.prestigeUpgrades
        };

        localStorage.setItem('typingCookerSave', JSON.stringify(data));
    }

    /**
     * LocalStorageから読み込み
     */
    loadFromStorage() {
        const saved = localStorage.getItem('typingCookerSave');

        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentRound = data.currentRound || 1;
                this.totalCookies = new Decimal(data.totalCookies || 0);
                this.roundCookies = new Decimal(data.roundCookies || 0);
                this.baseCpC = new Decimal(data.baseCpC || 1);
                this.criticalRate = data.criticalRate || 0.05;
                this.criticalMultiplier = data.criticalMultiplier || 2;
                this.shopPurchases = data.shopPurchases || {};
                this.unlockedWordLists = data.unlockedWordLists || ['level1'];
                this.activeCards = data.activeCards || [];
                this.stats = data.stats || {};
                this.heavenlyChips = new Decimal(data.heavenlyChips || 0);
                this.prestigeUpgrades = data.prestigeUpgrades || {};
            } catch (e) {
                console.error('セーブデータの読み込みに失敗しました:', e);
                this.reset();
            }
        } else {
            this.reset();
        }
    }

    /**
     * セーブデータを削除
     */
    clearSave() {
        localStorage.removeItem('typingCookerSave');
        this.reset();
    }
}
