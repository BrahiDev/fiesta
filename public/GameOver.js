class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    preload() {
        // Aquí puedes cargar assets específicos para la pantalla de Game Over,
        // como una imagen de fondo o un botón de "Volver al Menú".
        this.load.image('gameOverBackground', '/sky_game_over.PNG'); // Opcional
        this.load.image('titulo_game_over', '/GAME_OVER.png'); // Ajusta la ruta
        this.load.image('Personaje_game_over', '/dead_game_over.png'); // Ajusta la ruta
        this.load.image('botonMenu', '/boton_regreso.png'); // Opcional
        this.load.audio('derrota', '/derrota.wav');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fondo de Game Over (opcional)
        if (this.textures.exists('gameOverBackground')) {
            this.add.image(width / 2, height / 2, 'gameOverBackground').setScale(Math.max(width / this.textures.get('gameOverBackground').getSourceImage().width, height / this.textures.get('gameOverBackground').getSourceImage().height)).setDepth(-1);
        } else {
            this.cameras.main.setBackgroundColor('#000'); // Fondo negro si no hay imagen
        }

        const titulo_game_over = this.add.image(this.cameras.main.centerX, 150, 'titulo_game_over').setScale(0.8);

        // Centrar y mover el personaje a la derecha
        const Personaje_game_over = this.add.image(width / 2 + 50, height / 3, 'Personaje_game_over').setScale(0.7); // Aumenté un poco la escala

        // Texto "Volver al Menú" encima del botón
        const textoVolverMenu = this.add.text(width / 2, height / 2 + 120, 'Volver al Menú', { // Bajé el texto un poco
            fontFamily: 'Arial',
            fontSize: 32,
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        // Botón para volver al menú principal debajo del texto (más abajo)
        const botonMenu = this.add.image(width / 2, height / 2 + 180, 'botonMenu').setScale(0.1).setInteractive(); // Bajé el botón
        botonMenu.on('pointerdown', () => {
            this.scene.start('MenuPrincipal');
        });

        // Puedes añadir más elementos como la puntuación final, etc.
        this.sound.play('derrota'); // Reproduce el sonido de derrota
    }

    update() {
        // Lógica de actualización para la escena de Game Over (si es necesario)
    }
}

export default GameOver;