import MenuPrincipal from './MenuPrincipal.js';
import Winner from './Winner.js';
import GameOver from './GameOver.js'; // Importa la escena de Game Over

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.player = null;
        this.cursors = null;
        this.background = null;
        this.señales = [];
        this.taskResults = [null, null, null];
        this.chulitos = []; // Para los checks verdes/rojos
        this.cruces = [];   // Nuevo array para las cruces rojas
        this.taskCounterText = null;
        this.localStorageCheckInterval = 1000;
        this.localStorageTimer = null;
        this.gameOverTriggered = false; // Nueva bandera para evitar múltiples Game Overs
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('background', 'assets/sky.png');
        this.load.image('senal', 'assets/point.png');
        this.load.image('chulito_verde', 'assets/chulito_verde.png');
        this.load.image('chulito_rojo', 'assets/chulito_rojo.png');
        this.load.image('cruz_roja', 'assets/cruz_roja.png'); // Carga la imagen de la cruz roja
        this.load.audio('tarea_completada', 'assets/tarea_completada.mp3');
    }

    create() {
        this.background = this.add.image(400, 300, 'background').setDisplaySize(800, 600);
        this.player = this.physics.add.image(100, 100, 'player').setOrigin(0.5, 0.5).setDisplaySize(50, 50).setDepth(2);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.señales.push(this.physics.add.image(200, 200, 'senal').setOrigin(0.5, 0.5).setDepth(1).setName('senal1').setInteractive());
        this.señales.push(this.physics.add.image(400, 400, 'senal').setOrigin(0.5, 0.5).setDepth(1).setName('senal2').setInteractive());
        this.señales.push(this.physics.add.image(600, 300, 'senal').setOrigin(0.5, 0.5).setDepth(1).setName('senal3').setInteractive());

        this.señales.forEach((senal, index) => {
            senal.taskId = index;
            // Inicialmente no mostramos cruces
            this.cruces[index] = this.add.sprite(senal.x, senal.y - senal.height / 2 - 10, 'cruz_roja').setScale(0.1).setOrigin(0.5, 0).setVisible(false);
        });

        this.displayTaskResults(); // Esto ahora también debería manejar las cruces
        this.updateTaskCounter();

        this.taskCounterText = this.add.text(20, 20, 'Tareas: 0/3', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#000'
        }).setDepth(100);

        const htmlTaskCounter = document.getElementById('taskCounter');
        if (htmlTaskCounter) {
            htmlTaskCounter.style.display = 'none';
        }

        this.localStorageTimer = this.time.addEvent({
            delay: this.localStorageCheckInterval,
            callback: this.checkLocalStorage,
            callbackScope: this,
            loop: true
        });

        // Comprobar si ya se perdió algún minijuego al iniciar la escena (por si vuelve del Game Over)
        this.checkGameOver();
    }

    checkLocalStorage() {
        // Resultado de pesca
        const pescaResult = localStorage.getItem('pesca_result');
        if (pescaResult) {
            const data = JSON.parse(pescaResult);
            this.handleTaskResult(data.completedTask, data.result);
            localStorage.removeItem('pesca_result');
        }

        // Resultado de objetos
        const objetosResult = localStorage.getItem('objetos_result');
        if (objetosResult) {
            const data = JSON.parse(objetosResult);
            this.handleTaskResult(data.completedTask, data.result);
            localStorage.removeItem('objetos_result');
        }

        // Resultado de globos
        const globosResult = localStorage.getItem('globos_result');
        if (globosResult) {
            const data = JSON.parse(globosResult);
            this.handleTaskResult(data.completedTask, data.result);
            localStorage.removeItem('globos_result');
        }
    }

    handleTaskResult(taskId, result) {
        if (this.taskResults[taskId] === null) {
            this.taskResults[taskId] = result;
            this.displayTaskResult(taskId, result);
            this.señales[taskId].removeInteractive();
            this.updateTaskCounter();
            this.checkWinner();
            if (result === 'ganado') {
                this.sound.play('tarea_completada'); // Reproduce el sonido al ganar
            }
            this.checkGameOver(); // Comprobar Game Over después de cada resultado
            
        }
    }

    displayTaskResult(taskId, result) {
        if (this.señales[taskId]) {
            const chulitoKey = result === 'ganado' ? 'chulito_verde' : 'chulito_rojo';
            const cruzVisible = result === 'perdido'; // Mostrar cruz si se perdió
            const chulitoVisible = result === 'ganado'; // Mostrar chulito solo si ganó

            if (this.textures.exists(chulitoKey)) {
                if (this.chulitos[taskId]) {
                    this.chulitos[taskId].setTexture(chulitoKey).setVisible(chulitoVisible);
                } else {
                    this.chulitos[taskId] = this.add.sprite(this.señales[taskId].x, this.señales[taskId].y - this.señales[taskId].height / 2 - 10, chulitoKey).setScale(0.1).setOrigin(0.5, 0).setVisible(chulitoVisible);
                }
            } else {
                console.warn(`La textura ${chulitoKey} NO está cargada.`);
            }

            if (this.cruces[taskId]) {
                this.cruces[taskId].setVisible(cruzVisible);
            } else {
                this.cruces[taskId] = this.add.sprite(this.señales[taskId].x, this.señales[taskId].y - this.señales[taskId].height / 2 - 10, 'cruz_roja').setScale(0.1).setOrigin(0.5, 0).setVisible(cruzVisible);
            }
        }
    }

    displayTaskResults() {
        this.taskResults.forEach((result, index) => {
            if (result) {
                this.displayTaskResult(index, result);
                if (this.señales[index]) {
                    this.señales[index].removeInteractive();
                }
            }
        });
        this.checkGameOver(); // Comprobar Game Over al iniciar la escena si ya hay resultados
    }

    updateTaskCounter() {
        const completedTasks = this.taskResults.filter(result => result !== null).length;
        const newText = `Tareas: ${completedTasks}/3`;
        if (this.taskCounterText) {
            this.taskCounterText.setText(newText);
        }
    }

    update() {
        if (!this.gameOverTriggered) {
            const speed = 5;
            if (this.cursors.left.isDown && this.player.x > 0) this.player.x -= speed;
            else if (this.cursors.right.isDown && this.player.x < 800) this.player.x += speed;
            if (this.cursors.up.isDown && this.player.y > 0) this.player.y -= speed;
            else if (this.cursors.down.isDown && this.player.y < 600) this.player.y += speed;

            this.señales.forEach(senal => {
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, senal.x, senal.y);
                if (distance < 30 && senal.input && this.taskResults[senal.taskId] === null) {
                    console.log(`Jugador cerca de ${senal.name} (taskId: ${senal.taskId})!`);
                    this.abrirMinijuego(senal.taskId);
                }
            });
        }
    }

    abrirMinijuego(taskId) {
        if (!this.gameOverTriggered) {
            let urlMinijuego = '';
            switch (taskId) {
                case 0: urlMinijuego = 'pesca.html'; break;
                case 1: urlMinijuego = 'objetos.html'; break;
                case 2: urlMinijuego = 'globos.html'; break;
                default: console.log(`taskId desconocido para abrir minijuego: ${taskId}`); return;
            }
            window.open(urlMinijuego, '_blank');
        }
    }

    checkWinner() {
        console.log('Estado de taskResults:', this.taskResults);
        const todasGanadas = this.taskResults.every(result => result === 'ganado');
        if (todasGanadas && !this.winnerTriggered) {
            console.log('¡Todas las tareas ganadas! Iniciando Winner...');
            this.winnerTriggered = true;
            this.scene.start('Winner');
            this.localStorageTimer.destroy(); // Detener la verificación del localStorage
        }
    }

    checkGameOver() {
        const perdido = this.taskResults.some(result => result === 'perdido');
        if (perdido && !this.gameOverTriggered) {
            this.gameOverTriggered = true;
            this.scene.start('GameOver');
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuPrincipal, MainScene, Winner, GameOver ] // Primero MenuPrincipal, luego MainScene
};

const game = new Phaser.Game(config);