var sceneConfig = {
    envSpeed: 3,
}

class GameScene extends Phaser.Scene {
  constructor() {
        super("GameScene");
        this.tilesets = null;
        this.tileLayer = null; // Tile Layer includes ground and Background Image
        this.objLayer = null; // Json array includes all objects except player
        this.objLayerObjects = [] // include all physical objects
        this.envSpeed = 0 // Background moving speed
        this.hasGameStarted = false // Game Started?
        this.game_over = false
        this.bug = null // Bug Player
        this.objsGroup = null
    }
    
    getObjPropertyFromGid(gid, prop) {
        if (this.tilesets == null || this.tilesets == undefined) {
            DEBUG("Object JSON Tilesets")
            return null;
        }

        for (let i = 0; i < this.tilesets.length; i++) {
            let obj = this.tilesets[i]
            if (obj.gid == gid)
                return obj[prop]
        }
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

  preload() {
    this.loadTilesets();

    this.load.tilemapTiledJSON("env", "../game/fp-env.json");

    for (let i = 0; i < this.tilesets.length; i++) {
      let obj = this.tilesets[i];
      this.load.image(obj.name, obj.image);
    }

    this.load.image("bug", "../game/assets/fbug_01.png");
  }

  create() {

    this.hasGameStarted = false // Game Started?
    this.game_over = false
    
    const map = this.make.tilemap({ key: "env" });

    const groundLayer = map.addTilesetImage("Ground_02");

    const bgLayer = map.addTilesetImage("background");

    this.tileLayer = map
      .createLayer("Tile Layer 1", [groundLayer, bgLayer], 0, 0)
      .setScale(0.83);

    this.objLayer = map.getObjectLayer("Object Layer 1")["objects"];


        this.bug = new Bug(this, gameWidth, gameHeight).render()
        this.bug.player.setScale(0.7)

        this.input.keyboard.on('keydown-SPACE', ev => { 
            this.startGame()
        });
    
        
    
    this.objsGroup = this.physics.add.group();

    this.objLayer.forEach((object) => {
      let obj = this.objsGroup.create(
        object.x,
        object.y,
        this.getObjPropertyFromGid(object.gid, "name")
      );
      obj.setScale(obj.scale * 0.79);
      obj.setX(Math.round(object.x * obj.scale));
      obj.setY(Math.round(object.y * obj.scale));
      obj.enableBody = true
      obj.body.immovable = true
      this.objLayerObjects.push(obj);
    });

    this.physics.add.overlap(this.bug.player, this.objsGroup, (_player, _obj) => {
        this.game_over = true
        this.stopGame()
        this.scene.start("GameOverScene");
        // show GameOver message
    });

  }


  update() {
    this.tileLayer.x -= this.envSpeed;

    this.objLayerObjects.forEach((obj) => {
      obj.x -= this.envSpeed;
    });

    this.bug.update();

    if(this.input.activePointer.leftButtonDown() && !this.hasGameStarted)
        this.startGame()


    // console.log(this.physics.world.collideSpriteVsGroup(this.bug.player, this.objsGroup))
    // this.physics.arcade.collide(this.bug.player, this.objsGroup, (_player, _obj) => {console.log('Collision')})
    
  }

    startGame()
    {
        if(this.game_over)
            return

        this.hasGameStarted = true
        this.bug.startGame()
        this.envSpeed = sceneConfig.envSpeed
    }


    stopGame()
    {
        this.hasGameStarted = false
        this.bug.stopGame()
        this.envSpeed = 0
    }
}
