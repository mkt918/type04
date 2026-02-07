import './style.css';
import { GameState } from './engine/gameState.js';
import { RomajiTypingEngine } from './engine/romajiEngine.js';
import { ScoreCalculator, formatNumber } from './engine/scoreCalculator.js';
import { ParticleSystem } from './effects/particles.js';
import { SHOP_ITEMS, purchaseItem, getItemPrice, canPurchase } from './systems/shop.js';
import { CardDraft } from './systems/cardDraft.js';
import { getRarityColor } from './data/cards.js';
import { getRandomJapaneseWord } from './data/japaneseWords.js';
import Decimal from 'break_infinity.js';

/**
 * メインゲームコントローラー（日本語専用版）
 */
class Game {
  constructor() {
    this.gameState = new GameState();
    this.romajiEngine = new RomajiTypingEngine();
    this.scoreCalculator = new ScoreCalculator(this.gameState);
    this.particles = new ParticleSystem('particles-canvas');
    this.cardDraft = new CardDraft(this.gameState);

    this.currentScreen = 'title';
    this.roundTimer = null;
    this.timeRemaining = 30;
    this.currentWordMultiplier = 1.0;

    // タイピング統計
    this.combo = 0;
    this.totalCharsTyped = 0;
    this.missCount = 0;
    this.criticalHits = 0;
    this.startTime = null;
    this.recentKeyPresses = [];
    this.isPenalty = false;

    this.initializeUI();
    this.showScreen('title');
  }

  /**
   * UI初期化
   */
  initializeUI() {
    // タイトル画面
    document.getElementById('start-game-btn').addEventListener('click', () => {
      this.startNewCycle();
    });

    // タイピング画面の入力
    const input = document.getElementById('typing-input');
    input.addEventListener('keydown', (e) => {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        this.handleTyping(e.key);
      }
    });

    // ショップ画面
    document.getElementById('shop-continue-btn').addEventListener('click', () => {
      this.showDraftScreen();
    });

    // 転生ボタン
    document.getElementById('prestige-btn').addEventListener('click', () => {
      this.prestige();
    });
  }

  /**
   * 画面切り替え
   */
  showScreen(screenName) {
    const screens = ['title-screen', 'typing-screen', 'shop-screen', 'draft-screen', 'result-screen'];
    screens.forEach(screen => {
      document.getElementById(screen).classList.add('hidden');
    });
    document.getElementById(`${screenName}-screen`).classList.remove('hidden');
    this.currentScreen = screenName;

    // タイピング画面の場合、入力フィールドにフォーカス
    if (screenName === 'typing') {
      setTimeout(() => {
        document.getElementById('typing-input').focus();
      }, 100);
    }
  }

  /**
   * 新しい周回を開始
   */
  startNewCycle() {
    this.gameState.currentRound = 1;
    this.gameState.totalCookies = new Decimal(0);
    this.gameState.activeCards = [];
    this.startRound();
  }

  /**
   * ラウンド開始
   */
  startRound() {
    this.gameState.startRound();

    // 統計リセット
    this.combo = 0;
    this.totalCharsTyped = 0;
    this.missCount = 0;
    this.startTime = Date.now();
    this.recentKeyPresses = [];
    this.isPenalty = false;

    // 新しい単語を取得
    this.getNewWord();

    this.timeRemaining = 30;

    this.showScreen('typing');
    this.updateTypingUI();

    // タイマー開始
    this.roundTimer = setInterval(() => {
      this.timeRemaining--;
      this.updateTimer();

      if (this.timeRemaining <= 0) {
        this.endRound();
      }
    }, 1000);
  }

  /**
   * 新しい単語を取得
   */
  getNewWord() {
    const { word, multiplier } = getRandomJapaneseWord(this.gameState.unlockedWordLists);
    this.romajiEngine.setText(word);
    this.currentWordMultiplier = multiplier;
  }

  /**
   * タイピング処理
   */
  handleTyping(char) {
    // ペナルティ中は入力を受け付けない
    if (this.isPenalty) {
      return;
    }

    const result = this.romajiEngine.handleInput(char);

    if (!result.success) {
      // ミスタイプ
      this.combo = 0;
      this.missCount++;
      this.gameState.stats.totalMisses++;
      this.showMissPenalty();

      // ペナルティ発動（0.5秒間入力不可）
      this.isPenalty = true;
      setTimeout(() => {
        this.isPenalty = false;
      }, 500);

      return;
    }

    // 正解
    this.totalCharsTyped++;
    this.recentKeyPresses.push(Date.now());

    // 古いキープレス記録を削除（1秒以内のみ保持）
    const now = Date.now();
    this.recentKeyPresses = this.recentKeyPresses.filter(time => now - time < 1000);

    // かな文字が完成した場合
    if (result.kanaCompleted) {
      this.combo++;

      // スコア計算
      const kps = this.recentKeyPresses.length;
      const scoreResult = this.scoreCalculator.calculateScore(
        this.romajiEngine.targetText,
        this.combo,
        kps,
        this.timeRemaining,
        this.currentWordMultiplier
      );

      // クリティカル判定
      if (scoreResult.isCritical) {
        this.criticalHits++;
        this.gameState.stats.criticalHits++;
      }

      // スコア加算
      this.gameState.roundCookies = this.gameState.roundCookies.add(scoreResult.score);

      // パーティクル生成
      const cookieEl = document.getElementById('cookie-image');
      const rect = cookieEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      this.particles.createCookieCrumbs(centerX, centerY, 5);
      this.particles.createScorePopup(centerX, centerY, formatNumber(scoreResult.score), scoreResult.isCritical);

      // クリティカル演出
      if (scoreResult.isCritical) {
        this.showCriticalEffect();
      }

      // コンボエフェクト
      if (this.combo % 10 === 0 && this.combo > 0) {
        this.particles.createComboEffect(centerX, centerY, this.combo);
      }

      // 単語完成
      if (result.completed) {
        this.scoreCalculator.incrementWordMastery(this.romajiEngine.targetText);
        this.getNewWord();
      }
    }

    this.updateTypingUI();
  }

  /**
   * WPM計算
   */
  calculateWPM() {
    if (!this.startTime) return 0;
    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    if (elapsedMinutes === 0) return 0;
    const words = this.totalCharsTyped / 5;
    return Math.round(words / elapsedMinutes);
  }

  /**
   * KPS計算
   */
  calculateKPS() {
    return this.recentKeyPresses.length;
  }

  /**
   * タイピングUIを更新
   */
  updateTypingUI() {
    const progress = this.romajiEngine.getProgress();
    const kps = this.calculateKPS();
    const scoreResult = this.scoreCalculator.calculateScore(
      this.romajiEngine.targetText,
      this.combo,
      kps,
      this.timeRemaining,
      this.currentWordMultiplier
    );

    // ラウンド表示
    document.getElementById('current-round').textContent = this.gameState.currentRound;

    // スコア表示
    document.getElementById('total-cookies').textContent = formatNumber(this.gameState.roundCookies);

    // 単語表示（日本語）
    const typed = progress.typedText;
    const remaining = progress.remainingText;
    const buffer = progress.currentRomajiBuffer;

    document.querySelector('.word-typed').textContent = typed;
    document.querySelector('.word-untyped').textContent = remaining;

    // ローマ字ガイドの描画
    const romajiDisplay = document.getElementById('romaji-display');
    const fullGuide = this.romajiEngine.fullRomajiGuide;
    let romajiHTML = '';
    let currentKanaPos = 0;

    fullGuide.forEach((item, index) => {
      if (currentKanaPos < progress.currentKanaIndex) {
        // 既に入力済みのかな
        romajiHTML += `<span class="text-green-400">${item.romaji}</span>`;
      } else if (currentKanaPos === progress.currentKanaIndex) {
        // 現在入力中のかな
        const typedInBuffer = progress.currentRomajiBuffer;
        if (typedInBuffer) {
          romajiHTML += `<span class="text-green-400">${typedInBuffer}</span>`;
          romajiHTML += `<span class="text-white/40">${item.romaji.substring(typedInBuffer.length)}</span>`;
        } else {
          romajiHTML += `<span class="text-white/40">${item.romaji}</span>`;
        }
      } else {
        // 未入力のかな
        romajiHTML += `<span class="text-white/40">${item.romaji}</span>`;
      }
      currentKanaPos += item.kana.length;
    });
    romajiDisplay.innerHTML = romajiHTML;

    // ステータス表示
    document.getElementById('combo-display').textContent = this.combo;
    document.getElementById('multiplier-display').textContent = scoreResult.totalMultiplier.toFixed(1) + 'x';
    document.getElementById('cpc-display').textContent = formatNumber(this.gameState.calculateCpC());
    document.getElementById('wpm-display').textContent = this.calculateWPM();
  }

  /**
   * タイマー更新
   */
  updateTimer() {
    document.getElementById('time-remaining').textContent = this.timeRemaining;

    const percentage = (this.timeRemaining / 30) * 100;
    const timeBar = document.getElementById('time-bar');
    timeBar.style.width = percentage + '%';

    // 残り5秒で警告
    if (this.timeRemaining <= 5) {
      timeBar.classList.add('progress-bar-danger');
      document.body.classList.add('screen-shake');
    } else {
      timeBar.classList.remove('progress-bar-danger');
      document.body.classList.remove('screen-shake');
    }
  }

  /**
   * ミスペナルティ表示
   */
  showMissPenalty() {
    const overlay = document.getElementById('miss-overlay');
    overlay.classList.remove('hidden');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 500);
  }

  /**
   * クリティカルエフェクト表示
   */
  showCriticalEffect() {
    const display = document.getElementById('critical-display');
    display.classList.remove('hidden');
    setTimeout(() => {
      display.classList.add('hidden');
    }, 500);
  }

  /**
   * ラウンド終了
   */
  endRound() {
    clearInterval(this.roundTimer);
    this.gameState.endRound();

    // パーフェクト・ベイクカードの判定
    const hasPerfectBake = this.gameState.activeCards.some(card => card.id === 'perfect_bake');
    if (hasPerfectBake && this.missCount === 0) {
      this.gameState.roundCookies = this.gameState.roundCookies.mul(100);
    }

    // 統計更新
    const wpm = this.calculateWPM();
    this.gameState.stats.totalWordsTyped += Math.floor(this.totalCharsTyped / 5);
    this.gameState.stats.totalCharactersTyped += this.totalCharsTyped;
    this.gameState.stats.maxCombo = Math.max(this.gameState.stats.maxCombo, this.combo);
    this.gameState.stats.wpmHistory.push(wpm);

    this.gameState.saveToStorage();

    // 10ラウンド完了チェック
    if (this.gameState.currentRound > 10) {
      this.showResultScreen();
    } else {
      this.showShopScreen();
    }
  }

  /**
   * ショップ画面を表示
   */
  showShopScreen() {
    this.showScreen('shop');

    // 所持クッキー表示
    document.getElementById('shop-cookies').textContent = formatNumber(this.gameState.totalCookies);

    // ショップアイテム生成
    const container = document.getElementById('shop-items');
    container.innerHTML = '';

    for (const [itemId, item] of Object.entries(SHOP_ITEMS)) {
      const price = getItemPrice(itemId, this.gameState);
      const canBuy = canPurchase(itemId, this.gameState);
      const purchased = item.oneTime && this.gameState.shopPurchases[itemId];

      const card = document.createElement('div');
      card.className = `card ${!canBuy || purchased ? 'opacity-50' : ''}`;
      card.innerHTML = `
        <div class="text-6xl mb-4">${item.icon}</div>
        <h3 class="text-2xl font-bold mb-2">${item.name}</h3>
        <p class="text-white/70 mb-4">${item.description}</p>
        <div class="text-xl font-bold number-notation mb-4">
          ${purchased ? '購入済み' : formatNumber(price) + ' クッキー'}
        </div>
        ${!purchased ? `<button class="btn-primary w-full ${!canBuy ? 'opacity-50 cursor-not-allowed' : ''}" 
          ${canBuy ? `onclick="game.buyItem('${itemId}')"` : 'disabled'}>
          購入
        </button>` : ''}
      `;
      container.appendChild(card);
    }
  }

  /**
   * アイテム購入
   */
  buyItem(itemId) {
    if (purchaseItem(itemId, this.gameState)) {
      this.showShopScreen(); // 再描画
    }
  }

  /**
   * ドラフト画面を表示
   */
  showDraftScreen() {
    this.showScreen('draft');

    const cards = this.cardDraft.startDraft();
    const container = document.getElementById('draft-cards');
    container.innerHTML = '';

    cards.forEach((card, index) => {
      const rarityColor = getRarityColor(card.rarity);
      const cardEl = document.createElement('div');
      cardEl.className = 'card cursor-pointer';
      cardEl.innerHTML = `
        <div class="bg-gradient-to-r ${rarityColor} text-white px-4 py-2 rounded-t-xl -mx-6 -mt-6 mb-4">
          <span class="text-sm uppercase tracking-wide">${card.rarity}</span>
        </div>
        <h3 class="text-2xl font-bold mb-4">${card.name}</h3>
        <p class="text-white/80">${card.description}</p>
      `;
      cardEl.addEventListener('click', () => this.selectCard(index));
      container.appendChild(cardEl);
    });
  }

  /**
   * カード選択
   */
  selectCard(index) {
    this.cardDraft.selectCard(index);
    this.startRound();
  }

  /**
   * リザルト画面を表示
   */
  showResultScreen() {
    this.showScreen('result');

    const totalCookies = this.gameState.totalCookies;
    const newChips = new Decimal(Math.floor(totalCookies.log10()));
    const avgWPM = this.gameState.stats.wpmHistory.reduce((a, b) => a + b, 0) / this.gameState.stats.wpmHistory.length;

    document.getElementById('result-total-cookies').textContent = formatNumber(totalCookies);
    document.getElementById('result-chips').textContent = '+' + formatNumber(newChips);
    document.getElementById('result-avg-wpm').textContent = Math.round(avgWPM);
    document.getElementById('result-max-combo').textContent = this.gameState.stats.maxCombo;
    document.getElementById('result-critical-count').textContent = this.gameState.stats.criticalHits;
  }

  /**
   * 転生
   */
  prestige() {
    const chips = this.gameState.prestige();
    alert(`転生完了！ヘブンリーチップスを ${formatNumber(chips)} 枚獲得しました！`);
    this.showScreen('title');
  }
}

// グローバルに公開（HTMLからアクセスするため）
window.game = new Game();
