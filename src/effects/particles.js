/**
 * パーティクルエフェクトシステム
 * タイピング時のクッキー破片やスコアポップアップを表示
 */

export class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];

        // キャンバスサイズを設定
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // アニメーションループ
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * クッキー破片パーティクルを生成
     */
    createCookieCrumbs(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                type: 'crumb',
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5,
                size: Math.random() * 8 + 4,
                color: `hsl(${30 + Math.random() * 30}, 80%, ${50 + Math.random() * 20}%)`,
                life: 1.0,
                decay: 0.02
            });
        }
    }

    /**
     * スコアポップアップを生成
     */
    createScorePopup(x, y, score, isCritical = false) {
        this.particles.push({
            type: 'score',
            x,
            y,
            vy: -3,
            text: score,
            fontSize: isCritical ? 48 : 32,
            color: isCritical ? '#ff0000' : '#ffff00',
            life: 1.0,
            decay: 0.015
        });
    }

    /**
     * コンボエフェクトを生成
     */
    createComboEffect(x, y, combo) {
        if (combo % 10 === 0 && combo > 0) {
            this.particles.push({
                type: 'combo',
                x,
                y,
                text: `${combo} COMBO!`,
                fontSize: 36,
                color: '#00ff00',
                life: 1.0,
                decay: 0.01,
                vy: -2
            });
        }
    }

    /**
     * パーティクルを更新
     */
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            if (p.type === 'crumb') {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.3; // 重力
                p.life -= p.decay;
            } else if (p.type === 'score' || p.type === 'combo') {
                p.y += p.vy;
                p.life -= p.decay;
            }

            // 寿命が尽きたパーティクルを削除
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * パーティクルを描画
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const p of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;

            if (p.type === 'crumb') {
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'score' || p.type === 'combo') {
                this.ctx.font = `bold ${p.fontSize}px Arial`;
                this.ctx.fillStyle = p.color;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(p.text, p.x, p.y);
            }

            this.ctx.restore();
        }
    }

    /**
     * アニメーションループ
     */
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    /**
     * 全パーティクルをクリア
     */
    clear() {
        this.particles = [];
    }
}
