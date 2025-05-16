const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let hook; // Solo necesitamos el gancho
let fishes;
let score = 0;
let scoreText;
let timeText;
let timeLimit = 60000; // ¡Tiempo límite ahora es 1 minuto (60000 milisegundos)!
let gameTimer;
let hookSpeed = 5; // Velocidad de movimiento del gancho

function preload() {
    this.load.image('fish', '/fish.png');
    this.load.image('hook', '/cuerda-pesca.png'); // Asegúrate de tener la imagen del gancho
}

function create() {
    this.add.rectangle(0, 0, config.width, config.height, 0x4682B4).setOrigin(0);

    // Crear el gancho con el origen ajustado (prueba con diferentes valores)
    hook = this.physics.add.sprite(config.width / 2, 30, 'hook').setOrigin(0.5, 0.8);
    hook.body.allowGravity = false;
    hook.setCollideWorldBounds(true);

    fishes = this.physics.add.group();
    createFishes(20);

    this.cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(10, 10, 'Peces: 0 / 20', { fill: '#fff' });
    timeText = this.add.text(10, 30, 'Tiempo: 1:00', { fill: '#fff' }); // Texto inicial del tiempo ajustado

    gameTimer = this.time.addEvent({
        delay: timeLimit,
        callback: endGame,
        callbackScope: this
    });
}

function createFishes(count) {
    for (let i = 0; i < count; i++) {
        let fish = fishes.create(Phaser.Math.Between(50, config.width - 50), Phaser.Math.Between(50, config.height - 50), 'fish');
        fish.setOrigin(0.5);
        fish.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
        fish.setCollideWorldBounds(true);
        fish.setBounce(1);
    }
}

function update() {
    // Mover el gancho directamente
    if (this.cursors.left.isDown) {
        hook.setVelocityX(-hookSpeed * 20); // Aumentar la velocidad
    } else if (this.cursors.right.isDown) {
        hook.setVelocityX(hookSpeed * 20);
    } else {
        hook.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        hook.setVelocityY(-hookSpeed * 20);
    } else if (this.cursors.down.isDown) {
        hook.setVelocityY(hookSpeed * 20);
    } else {
        hook.setVelocityY(0);
    }

    // Verificar la distancia entre el gancho y los peces
    Phaser.Actions.Call(fishes.getChildren(), function(fish) {
        if (Phaser.Math.Distance.Between(hook.x, hook.y, fish.x, fish.y) < 30) { // Ajusta la distancia si es necesario
            fish.destroy();
            score++;
            scoreText.setText('Peces: ' + score + ' / 20');

            if (score === 20) {
                endGame.call(this);
            }
        }
    }, this);

    updateTimer();
}

function updateTimer() {
    let remainingTime = timeLimit - gameTimer.getElapsed();
    let minutes = Math.floor(remainingTime / 60000);
    let seconds = Math.floor((remainingTime % 60000) / 1000);
    timeText.setText('Tiempo: ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
}

function endGame() {
    let win = score === 20;
    let result = win ? 'ganado' : 'perdido';
    let message = win ? '¡Has ganado!' : '¡Tiempo agotado!';
    alert(message);

    localStorage.setItem('pesca_result', JSON.stringify({ completedTask: 0, from: 'pesca', result: result }));

    setTimeout(() => {
        window.close();
    }, 1000);
}