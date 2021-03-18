class LoadingScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LoadingScene",
    });

    this.tilesets = null;
    this.progress = 0

  }

  preload() {
    this.load.image(
      "menu_background",
      "../game/Map/PNG/Background/Background_01.png"
    );

    for(let i = 0; i < 1000; i++)
      this.load.image( "go_background" + i, "../game/Map/PNG/Background/Background_02.png"); // gameover scene background
    this.load.image("bug", "../game/assets/fbug_01.png"); // bug
    this.load.image("play_button", "../game/assets/play_button.png");
    this.load.image("options_button", "../game/assets/options_button.png");

    this.load.spritesheet(
      "animation_sprite",
      "../game/assets/spritesheet2.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );

    this.loadTilesets()

    this.load.tilemapTiledJSON("env", "../game/fp-env.json"); // load tilemap

    for (let i = 0; i < this.tilesets.length; i++) {
      let obj = this.tilesets[i];
      this.load.image(obj.name, obj.image);
    }

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();

    var loadingText = this.make.text({
      x: 2.5 * gameWidth / 6,
      y: 1.6 * gameHeight / 4,
      text: 'Loading...',
      style: {
          font: '30px monospace',
          fill: '#ffffff',
    }})

    var assetLoadingText = this.make.text({
      x: 10,
      y: gameHeight - 20,
      text: 'Loading Assest: bug.png',
      style: {
          font: '10px monospace',
          fill: '#ffffff',
    }})


    progressBox.fillStyle(0xffffff, 0.2);

    let pbSettings = {
      'x': gameWidth / 6,
      'y': 2 * gameHeight / 4,
      'width': 4 * gameWidth / 6,
      'height': 60
    }
    progressBox.fillRect(pbSettings['x'], pbSettings['y'], pbSettings['width'], pbSettings['height']);

    this.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0x23aaee, 1);
      let factor = (value == 0)?0: -20
      progressBar.fillRect(pbSettings['x'] + 10, pbSettings['y'] + 10, factor + pbSettings['width'] * value, pbSettings['height'] - 20);
      console.log(value)
    });
                
    this.load.on('fileprogress', function (file) {
      let filename = file.src.split('/').slice(-1).pop()
        assetLoadingText.setText(`Loading asset: ${filename}`)
    });

  }

  create() 
  {
   
    this.scene.start("MenuScene", {tilesets: this.tilesets} );
  }

   loadTilesets() {
    let json = $.ajax({
      url: "../game/fp-env.json",
      dataType: "json",
      async: false,
    }).responseJSON;
    let tilesets = json["tilesets"];
    this.tilesets = tilesets.map((item) => {
      return {
        image: "../game/" + item.image,
        gid: item.firstgid,
        name: item.name,
      };
    });
  }
}
