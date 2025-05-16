class MenuPrincipal extends Phaser.Scene {
    constructor() {
    super('MenuPrincipal'); // Identificador único de la escena
    }
    
    preload() {
    // Aquí cargaremos los assets necesarios para el menú
    this.load.image('fondoMenu', '/fondo iglu 2.jpg'); // Ajusta la ruta
    this.load.image('titulo', '/TITULO-JUEGO.png'); // Ajusta la ruta
    this.load.image('Personaje', '/Player.png'); // Ajusta la ruta
    this.load.image('botonJugar', '/boton_jugar.png'); // Ajusta la ruta
    // Puedes cargar más imágenes o spritesheets si los necesitas para animaciones.
    }
    
    create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const fondo = this.add.image(width / 2, height / 2, 'fondoMenu');
    const scaleX = width / fondo.width;
    const scaleY = height / fondo.height;
    const scale = Math.max(scaleX, scaleY);
    fondo.setScale(scale).setDepth(-1);
    
    const titulo = this.add.image(this.cameras.main.centerX, 150, 'titulo').setScale(0.8);

    const Personaje = this.add.image(this.cameras.main.centerX, 400, 'Personaje').setScale(0.3).setInteractive();
    
    const botonJugar = this.add.image(this.cameras.main.centerX, 500, 'botonJugar').setScale(0.3).setInteractive();
    
    // Acción al hacer clic en el botón Jugar
    botonJugar.on('pointerdown', () => {
        this.scene.start('MainScene');
    });
    
    const empezarTexto = this.add.text(this.cameras.main.centerX, height - 50, 'Toca para Empezar', {
    fontFamily: 'Arial',
    fontSize: 32,
    color: '#000000'
    }).setOrigin(0.5);
    }
    
    update() {
    // Aquí puedes añadir lógica que se ejecute en cada frame, como animaciones sutiles.
    }
    }
    
    export default MenuPrincipal;