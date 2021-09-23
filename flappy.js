var config = {
    width:720,
    height:480,
    physics:{
        default:"arcade",
        arcade:{
            gravity:{y:400}
        }
    },
    scene:{
        preload:preload,
        create:create,
        update:update
    }
};

var game = new Phaser.Game(config);

var player;
var pipe;
var missile;
var coin;
var lava;

var score = 0;
var scoreLabel;
var randomX;
var randomY;
var gameOver = false;

var parallax;
var timedEvent;

function preload(){
    this.load.image("bg","Assets/Background.png");
    this.load.spritesheet("player","Assets/CharaAnimSpriteSheet2.png",{frameWidth:64,frameHeight:64});
    this.load.spritesheet("lava","Assets/LavaBallSpriteSheet.png",{frameWidth:64,frameHeight:64});
    this.load.image("pipe","Assets/Pipe.png");
    this.load.image("missile","Assets/Missile3.png");
    this.load.spritesheet("coin","Assets/CoinAnimation2.png",{frameWidth:64,frameHeight:64});
    this.load.image("parallax","Assets/Parallax2.png");
    this.load.image("score","Assets/Score.png");
}

function create(){
   this.add.image(360,240,"bg");
   
   player =  this.physics.add.sprite(100,100,"player");

   pipe = this.physics.add.image(700,450,"pipe");
   pipe.setImmovable(true);
   pipe.body.allowGravity = false;
   pipe.setVelocityX(-150);
   
   randomX = player.x + Phaser.Math.Between(100,700);
   randomY = Phaser.Math.Between(100,400);
   
   coin = this.physics.add.sprite(randomX,randomY,"coin");
   coin.setImmovable = true;
   coin.body.allowGravity = false;
   coin.setVelocityX(-150);
   
   parallax = this.physics.add.image(400,380,"parallax");
   parallax.setImmovable(true);
   parallax.body.allowGravity = false;
   parallax.setVelocityX(-250);
   
   missile = this.physics.add.image(player.x + Phaser.Math.Between(100,800),player.y,"missile");
   missile.setImmovable(true);
   missile.body.allowGravity = false;
   missile.setVelocityX(-300);
   
   lava = this.physics.add.sprite(player.x + Phaser.Math.Between(100,800),500,"lava");
   lava.setImmovable(true);
   lava.body.allowGravity = false;
   lava.setVelocityY(-400);

   this.physics.add.overlap(player,coin,collectCoins,null,this);
   this.physics.add.collider(player,pipe,death,null,this);
   this.physics.add.collider(player,missile,death,null,this);
   this.physics.add.collider(player,lava,death,null,this)
   player.setBounce(0.1);
  
   this.anims.create({
       key:"jump",
       frames:this.anims.generateFrameNumbers("player",{start:0,end:16}),
       framerate:24,
       repeat:-1
   });
   this.anims.create({
       key:"lava",
       frames:this.anims.generateFrameNumbers("lava",{start:0,end:16}),
       framerate:24,
       repeat: -1
   });
   this.anims.create({
       key:"coin",
       frames:this.anims.generateFrameNumbers("coin",{start:0,end:34}),
       framerate:24,
       repeat: -1
   });
   
   this.input.keyboard.on("keydown-R",reset,this);
   timedEvent = this.time.addEvent({delay: 3000, callback: spawnMissile,callbackScope: this,loop: true});
   scoreLabel = this.add.text(16, 16, "Score: 0",{fontsize:"32px",fill:"#000"});
}


function collectCoins(player,coin){
    coin.disableBody(true,true);
    score += 10; 
    scoreLabel.setText("Score: " + score);
    randomX = player.x + Phaser.Math.Between(100,800);
    randomY = Phaser.Math.Between(0,480);
    coin.enableBody(true,randomX,randomY,true,true);
    coin.setVelocityX(-150);

}

function death(){

    gameOver = true;
    player.disableBody(true,true);
}

function reset(){
   
   this.sys.game.destroy(true);
   game = new Phaser.Game(config);
   gameOver = false;
}

function spawnMissile(){
    missile.enableBody(true,player.x + Phaser.Math.Between(400,800),player.y,true,true);
    missile.setVelocityX(-300);
    lava.enableBody(true,player.x + Phaser.Math.Between(100,800),500,true,true);
    lava.setVelocityY(-400);
}


function update(){
    var cur =  this.input.keyboard.createCursorKeys();
    play(cur);
}
  

function play(cur){
   
    lava.anims.play("lava",true);
    coin.anims.play("coin",true);
    if(gameOver){
     pipe.setVelocityX(0);
     coin.setVelocityX(0);
     missile.setVelocityX(0);
     parallax.setVelocityX(0);
     timedEvent.remove(false);
     return;
    }
    if(missile.x < -50){
        missile.disableBody(true,true);
    }
    if(cur.space.isDown){
         player.anims.play("jump",true);
         player.setVelocityY(-200);
    }
    if(pipe.x < -50){
        var x = Phaser.Math.Between(0,10);
        if(x <= 5){
             pipe.x = 800;
             pipe.flipY = true;
             pipe.y = 48;
       }
       else{
         pipe.x = 800;
         pipe.flipY = false;
         pipe.y = 450;
       }
        
    }
    if(parallax.x < -800){
        parallax.x = 1200;
    }
    if(coin.x <-50){
        randomX = player.x + Phaser.Math.Between(100,800);
        randomY = Phaser.Math.Between(0,400);
        coin.y = randomY;
        coin.x = randomX;
    } 
    if(player.y > 800)
        death();
    if(player.y > 450)
        death();  
    if(lava.y < -60){
        lava.disableBody(true,true);
    } 
}