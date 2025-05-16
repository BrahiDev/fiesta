const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let objetosEncontrados = 0;
let objetosTotal = 10; // Número total de objetos a encontrar
let textoContador;
let posicionesObjetos = [];
let tiempoRestante = 60; // ¡Tiempo restante ahora es 1 minuto!
let textoTiempo;
let temporizador;
let gameEnded = false; // Bandera para evitar llamadas múltiples a endGame

function preload() {
    this.load.image('iglu', 'assets/fondo iglu 2.jpg');
    this.load.image('mesa', 'assets/mesa.png');
    this.load.image('decoracionColgante1', 'assets/decoracion-colgante1.png');
    this.load.image('decoracionColgante2', 'assets/decoracion-colgante2.png');
    this.load.image('objeto1', 'assets/decoracion1.png');
    this.load.image('objeto2', 'assets/planta2.png');
    this.load.image('objeto3', 'assets/palomitas3.png');
    this.load.image('objeto4', 'assets/cerveza4.png');
    this.load.image('objeto5', 'assets/comida5.png');
    this.load.image('objeto6', 'assets/instrumento6.png');
    this.load.image('objeto7', 'assets/piñata7.png');
    this.load.image('objeto8', 'assets/decoracion8.png');
    this.load.image('objeto9', 'assets/bebida9.png');
    this.load.image('objeto10', 'assets/piñata10.png');
}

function create() {
    const iglu = this.textures.get('iglu').getSourceImage();
    const anchoImagen = iglu.width;
    const altoImagen = iglu.height;

    this.game.scale.resize(anchoImagen, altoImagen);
    this.add.image(anchoImagen / 2, altoImagen / 2, 'iglu');

    this.add.image(anchoImagen / 2, altoImagen - 100, 'mesa').setScale(0.5);

    this.add.image(100, 50, 'decoracionColgante1').setScale(0.8);
    this.add.image(anchoImagen - 55, 70, 'decoracionColgante2').setScale(0.7);

    this.objetos = [
        this.add.image(anchoImagen / 2 - 80, altoImagen - 170, 'objeto2').setScale(0.35),
        this.add.image(anchoImagen / 2 - 40, altoImagen - 170, 'objeto3').setScale(0.35),
        this.add.image(anchoImagen / 2 + 45, altoImagen - 165, 'objeto4').setScale(0.35),
        this.add.image(anchoImagen / 2 + 85, altoImagen - 165, 'objeto5').setScale(0.35),
        this.add.image(anchoImagen / 2, altoImagen - 170, 'objeto9').setScale(0.35),
        this.add.image(50, altoImagen - 50, 'objeto6').setScale(0.7),
        this.add.image(540, altoImagen - 110, 'objeto1').setScale(0.7),
        this.add.image(300, 200, 'objeto8').setScale(0.35),
        this.add.image(anchoImagen - 200, 40, 'objeto10').setScale(0.50),
        this.add.image(anchoImagen / 2, 50, 'objeto7').setScale(0.5),
    ];

    this.objetos.forEach(objeto => {
        objeto.setInteractive();
    });

    textoContador = this.add.text(10, 10, 'Objetos encontrados: 0', { fill: '#fff' });

    textoTiempo = this.add.text(10, 40, 'Tiempo: 1:00', { fill: '#fff' }); // Texto inicial del tiempo ajustado

    temporizador = setInterval(() => {
        tiempoRestante--;
        let minutos = Math.floor(tiempoRestante / 60);
        let segundos = tiempoRestante % 60;
        textoTiempo.setText('Tiempo: ' + minutos + ':' + (segundos < 10 ? '0' : '') + segundos);

        if (tiempoRestante <= 0 && !gameEnded) {
            gameEnded = true;
            endGame.call(this, false); // Llamar a endGame con resultado de pérdida
        }
    }, 1000);

    this.input.on('gameobjectdown', (pointer, gameObject) => {
        if (!gameEnded) {
            objetosEncontrados++;
            textoContador.setText('Objetos encontrados: ' + objetosEncontrados);
            gameObject.destroy();

            if (objetosEncontrados === objetosTotal && !gameEnded) {
                gameEnded = true;
                endGame.call(this, true); // Llamar a endGame con resultado de victoria
            }
        }
    });
}

function update() {

}

function endGame(win) {
    clearInterval(temporizador);
    const result = win ? 'ganado' : 'perdido';
    const message = win ? '¡Ganaste!' : '¡Tiempo agotado!';
    alert(message);

    localStorage.setItem('objetos_result', JSON.stringify({ completedTask: 1, from: 'objetos', result: result }));

    setTimeout(() => {
        window.close();
    }, 1000);
}