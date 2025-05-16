class Winner extends Phaser.Scene {
    constructor() {
        super('Winner');
    }

    preload() {
        this.load.image('WinnerBackground', '/fondo iglu 2.jpg');
        this.load.image('titulo_Winner', '/YOU_WIN.png');
        this.load.image('Personaje_Winner', '/personaje_winner.png');
        this.load.image('botonMenu', '/boton_regreso.png');
        this.load.audio('victoria', '/victoria.mp3'); 
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        if (this.textures.exists('WinnerBackground')) {
            this.add.image(width / 2, height / 2, 'WinnerBackground').setScale(Math.max(width / this.textures.get('WinnerBackground').getSourceImage().width, height / this.textures.get('WinnerBackground').getSourceImage().height)).setDepth(-1);
        } else {
            this.cameras.main.setBackgroundColor('#000');
        }

        // Corremos un poco a la derecha el título
    const titulo_Winner = this.add.image(width / 2 + 30, 150, 'titulo_Winner').setScale(0.8);

    const botonMenuYOriginal = height / 2 + 180;
    const tituloWinnerY = 150;
    const personajeWinnerY = (tituloWinnerY + botonMenuYOriginal) / 2;

    const Personaje_Winner = this.add.image(width / 2, personajeWinnerY, 'Personaje_Winner').setScale(0.7);

    // Bajamos la posición vertical del texto "Volver al Menú"
    const textoVolverMenuY = height / 2 + 150;
    const textoVolverMenu = this.add.text(width / 2, textoVolverMenuY, 'Volver al Menú', {
        fontFamily: 'Arial',
        fontSize: 32,
        color: '#000000',
        align: 'center'
    }).setOrigin(0.5);

    // Bajamos la posición vertical del botón (flecha)
    const botonMenuY = height / 2 + 210;
    const botonMenu = this.add.image(width / 2, botonMenuY, 'botonMenu').setScale(0.1).setInteractive();
    botonMenu.on('pointerdown', () => {
        this.scene.start('MenuPrincipal');
    });

    this.sound.play('victoria'); // Reproduce el sonido de victoria
}

    update() {
        // No es necesario lógica de actualización por ahora.
    }
}

export default Winner;