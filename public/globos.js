class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'default' });
        this.balloonContainer = null;
        this.balloon = null;
        this.explodedBalloon = null;
        this.clickCount = 0;
        this.maxClicks = 10; // Número exacto de clics para inflar
        this.explosionThreshold = 11; // Un clic más para explotar
        this.balloonScale = 0.2;
        this.scaleIncrement = 0.05;
        this.score = 0;
        this.scoreText = null;
        this.canClick = true; // Control para evitar clics después de inflar o explotar
        this.isClicking = false; // Nueva bandera para controlar el doble clic
        this.timerText = null;
        this.gameTimer = null;
        this.totalTime = 60; // ¡Tiempo total ahora es 1 minuto!
    }

    preload() {
        this.load.image('balloon', '/balloon.png');
        this.load.image('balloon_exploded', '/balloon_exploded.png');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.balloonContainer = this.add.container(centerX, centerY);

        this.balloon = this.add.image(0, 0, 'balloon').setScale(this.balloonScale).setInteractive();
        this.balloon.setOrigin(0.5, 0.5);
        this.balloonContainer.add(this.balloon);
        this.balloon.on('pointerdown', this.handleBalloonClick, this); // Nueva función para manejar el clic

        this.explodedBalloon = this.add.image(0, 0, 'balloon_exploded').setScale(this.balloonScale * 1.2).setOrigin(0.5, 0.5);
        this.explodedBalloon.setVisible(false);
        this.balloonContainer.add(this.explodedBalloon);

        this.scoreText = this.add.text(20, 20, 'Globos inflados: 0/10', { fontSize: '24px', fill: '#FFFFFF' });

        // Crear el texto del temporizador
        this.timerText = this.add.text(this.cameras.main.width - 160, 20, this.formatTime(this.totalTime), { fontSize: '24px', fill: '#FFFFFF' });

        // Iniciar el temporizador del juego
        this.gameTimer = this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });
    }

    update() {
        // Ya no necesitamos verificar la escala para la explosión aquí
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    updateTimer() {
        this.totalTime--;
        this.timerText.setText(this.formatTime(this.totalTime));

        if (this.totalTime <= 0) {
            this.gameTimer.remove(false); // Detener el temporizador
            this.canClick = false; // Desactivar la interacción
            this.scoreText.setText(`¡Tiempo agotado! Inflaste ${this.score} globos.`);
            this.balloon.off('pointerdown', this.handleBalloonClick); // Desactivar clics
            this.endGame(false); // Llamar a endGame con resultado de pérdida
        }
    }

    handleBalloonClick() {
        if (this.canClick && !this.isClicking) {
            this.isClicking = true;
            this.inflateBalloon();
            this.time.delayedCall(100, () => { // Pequeño retraso para permitir solo un clic
                this.isClicking = false;
            }, [], this);
        }
    }

    inflateBalloon() {
        this.clickCount++;
        this.balloonScale += this.scaleIncrement;
        this.balloon.setScale(this.balloonScale);

        console.log('Click Count:', this.clickCount);

        if (this.clickCount >= this.explosionThreshold) {
            // Explotó
            console.log('¡Debería explotar!');
            this.explodeBalloon();
            this.canClick = false; // Evitar más clics hasta el reinicio
        } else if (this.clickCount === this.maxClicks) {
            // Inflado exitoso
            this.score++;
            this.scoreText.setText('Globos inflados: ' + this.score + '/10');
            this.canClick = true; // Permitir clics para el siguiente globo
            this.time.delayedCall(1000, this.resetGame, [], this); // Reiniciar el globo
            if (this.score === 10) {
                this.balloon.off('pointerdown', this.handleBalloonClick); // Desactivar clic al completar los 10 globos
                this.scoreText.setText('¡Felicidades! ¡Inflaste los 10 globos!');
                this.endGame(true); // Llamar a endGame con resultado de victoria
            }
        }
    }

    explodeBalloon() {
        this.balloon.setVisible(false); // Oculta el globo
        this.explodedBalloon.setVisible(true); // Muestra la explosión
        this.balloon.off('pointerdown', this.handleBalloonClick);
        this.time.delayedCall(1000, this.resetSingleBalloon, [], this); // Reiniciar SOLO el globo actual
        this.canClick = true; // Permitir clics en el nuevo globo
        this.score = 0; // Reiniciar el contador de globos inflados
        this.scoreText.setText('Globos inflados: 0/10'); // Actualizar el texto del marcador
    }

    resetSingleBalloon() {
        this.balloon.setVisible(true); // Vuelve a mostrar el globo
        this.explodedBalloon.setVisible(false); // Oculta la explosión
        this.clickCount = 0;
        this.balloonScale = 0.2;
        this.balloon.setScale(this.balloonScale);
        this.balloon.on('pointerdown', this.handleBalloonClick, this);
        this.canClick = true;
    }

    resetGame() {
        this.balloon.setVisible(true);
        this.explodedBalloon.setVisible(false);
        this.clickCount = 0;
        this.balloonScale = 0.2;
        this.balloon.setScale(this.balloonScale);
        this.balloon.on('pointerdown', this.handleBalloonClick, this);
        this.canClick = true;
        if (this.score < 10) {
            this.scoreText.setText('Globos inflados: ' + this.score + '/10');
        }
    }

    endGame(win) {
        this.gameTimer.remove(false); // Detener el temporizador si aún está activo
        this.canClick = false; // Desactivar la interacción
        this.balloon.off('pointerdown', this.handleBalloonClick); // Desactivar clics

        const result = win ? 'ganado' : 'perdido';
        localStorage.setItem('globos_result', JSON.stringify({ completedTask: 2, from: 'globos', result: result }));

        setTimeout(() => {
            window.close();
        }, 1000);
    }

    restartGame() { // Ya no se usa, la lógica está en endGame
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ADD8E6', // Fondo azul claro
    scene: GameScene
};

const game = new Phaser.Game(config);