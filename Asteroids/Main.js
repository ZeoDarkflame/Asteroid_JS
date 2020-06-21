//setting up variables
var winsize = (window.innerHeight > window.innerWidth) ? window.innerWidth : window.innerHeight;//stores the size of the game
var player;
var bullets;
var rage;
var bomb;
var star;
var smallast;
var largeast;
var enemy;
var enemyspeed = 500;
var warningtext;
var cursor;
var shootable = 1;
var ragemode = 0;
var playerspeed = 200;
var powerupcount = 0;
var bulletdelay = 200;
var powerupsize = 0.05;
var particles;
var maxspeed = 80;
var score = 0;
var scoreText;
var spawnpoweruptimeout;
var spawnasteroidtimeout;
var poweruptext;
var poweruptexttimeout;
var speedchangetimeout;
var scorechangetimeout;
var ref;


class Main extends Phaser.Scene{
    constructor(){
        super("playGame");
    }

    preload(){
        //loading assets
        this.load.image('laser', 'assets/laserblue02.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('rage','assets/RageSphere.png');
        this.load.image('enemy','assets/spaceship1.png');
        this.load.spritesheet('asteroid','assets/asteroid.png',{frameWidth: 487/4, frameHeight: 90})
        this.load.spritesheet('player','assets/spaceship.png',{ frameWidth: 32, frameHeight: 32});
    }

    create(){
        ref = this;

        //adding all gameobjects
        bullets = this.physics.add.group();
        star = this.physics.add.group();
        bomb = this.physics.add.group();
        rage = this.physics.add.group();
        largeast = this.physics.add.group();
        smallast = this.physics.add.group();
        enemy = this.physics.add.sprite(-20,-20,'enemy');
        enemy.displayHeight = winsize * 0.08;
        enemy.displayWidth = winsize * 0.08;
        enemy.allowRotation = true;

        //adding the player
        player = this.physics.add.sprite((game.config.width)/2, (game.config.height)/2, 'player').setScale(1.5);
        player.displayWidth = game.config.width * 0.08;
        player.displayHeight = game.config.height * 0.08;
        player.setOrigin(0.5,0.5);
        player.body.setCircle(8,6,6);
        player.body.allowRotation = true;
        
        //making the animations
        this.anims.create({
            key: 'standing',
            frames: [{key: 'player',frame: 0}],
            frameRate: 20
        });

        this.anims.create({
            key: 'moving',
            frames: [{key:'player',frame:1}],
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'aster',
            frames: this.anims.generateFrameNumbers('asteroid', {start: 0, end:3}),
            frameRate: 5,
            repeat: -1
        });

        //adding collisions and detections
        this.physics.add.overlap(player, star, collectStar, null, this);
        this.physics.add.overlap(player, bomb, collectbomb, null, this);
        this.physics.add.overlap(player, rage, collectrage, null, this);
        this.physics.add.overlap(bullets, largeast, hitasteroid, null, this);
        this.physics.add.overlap(bullets, smallast, hitsmallasteroid, null, this);
        this.physics.add.overlap(player,smallast,playerhit,null,this);
        this.physics.add.overlap(player,largeast,playerhit,null,this);
        this.physics.add.overlap(bullets,enemy,enemyshot,null,this);
        this.physics.add.overlap(player,enemy,playerhitbyenemy,null,this);

        //for keyboard input
        cursor = this.input.keyboard.createCursorKeys();

        //intialising game variables
        shootable = 1;
        playerspeed = 200;
        powerupcount = 0;
        bulletdelay = 200;
        ragemode = 0;

        //starting powerup and asteroid spawning functions
        setTimeout(spawnpowerup,5000);
        setTimeout(spawnasteroid,1000);
        setTimeout(spawnenemy,5000);

        //setting up particles and ui
        particles = this.add.particles('asteroid');
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
        poweruptext = this.add.text(16,48,'',{fontSize: '18px',fill:'#fff'} );
        warningtext = this.add.text(winsize/2,winsize/2,'Approaching',{fontSize:'32px'});
        warningtext.setOrigin(0.5,0.5);
        this.tweens.add({
            targets : warningtext,
            alpha : 0.2,
            duration : 250,
            ease : 'Power1',
            yoyo : true,
            repeat: -1
        });
        warningtext.setVisible(false);
    }

    update(){
        //taking bullet input and shooting
        if(cursor.down.isDown && shootable){
            var bul = bullets.create(player.x + 10,player.y + 10,'laser').setScale(0.6);
            bul.displayHeight = game.config.height * 0.05;
            bul.displayWidth = game.config.width * 0.01;
            bul.angle = player.angle
            bul.body.velocity.x = Math.sin((Math.PI/180) * player.angle) * 1000;
            bul.body.velocity.y = Math.cos((Math.PI/180) * player.angle) * -1000;
            bul.setVisible(false);
            setTimeout(function(){
                bul.setVisible(true);
            },10);
            shootable = 0;
            setTimeout(function(){
                bul.destroy();
            },3000);
            setTimeout(function(){
                shootable = 1;
            },bulletdelay)
        }
    
        //taking rotary input
        if(cursor.left.isDown){
            player.body.angularVelocity = -200;
        } else if (cursor.right.isDown){
            player.body.angularVelocity = 200;
        } else {
            player.body.angularVelocity = 0;
        }
        
        //for translation
        if(cursor.up.isDown){
            //since inbuilt cos and sin use radians intead of degree we convert
            player.body.velocity.x = Math.sin((Math.PI/180) * player.angle) * playerspeed;
            player.body.velocity.y = Math.cos((Math.PI/180) * player.angle) * -1 * playerspeed;
            player.anims.play('moving');
        } else {
            if(player.body.velocity.x < 0){
                player.body.velocity.x += 5;
            } else if (player.body.velocity.x > 0){
                player.body.velocity.x -= 5;
            }
            if(player.body.velocity.y < 0){
                player.body.velocity.y += 5;
            } else if (player.body.velocity.y > 0){
                player.body.velocity.y -= 5;
            }
            player.anims.play('standing');
        }

        //making world bounds convergent for player and asteroids
        //for player
        if(player.x < -5){
            player.x = winsize + 5;
        } else if (player.x > winsize + 5){
            player.x = -5
        }
        if(player.y < -5){
            player.y = winsize + 5;
        } else if (player.y > winsize + 5){
            player.y = -5
        }
        //for asteroids
        largeast.children.iterate(function(child){
            if(child.x < -5){
                child.x = winsize + 5;
            } else if (child.x > winsize + 5){
                child.x = -5
            }
            if(child.y < -5){
                child.y = winsize + 5;
            } else if (child.y > winsize + 5){
                child.y = -5
            }
        });
        smallast.children.iterate(function(child){
            if(child.x < -5){
                child.x = winsize + 5;
            } else if (child.x > winsize + 5){
                child.x = -5
            }
            if(child.y < -5){
                child.y = winsize + 5;
            } else if (child.y > winsize + 5){
                child.y = -5
            }
        });
    }
}

//function to spawnpowerups
function spawnpowerup(){
    if(Phaser.Math.Between(0,10) > 6 && powerupcount <= 0){
        if(Phaser.Math.Between(0,10) > 2){
            if(Phaser.Math.Between(0,10) > 5){
                star1 = star.create(Phaser.Math.Between(0,winsize),Phaser.Math.Between(0,winsize),'star');
                star1.displayHeight = game.config.height*powerupsize;
                star1.displayWidth = game.config.width*powerupsize;
                stardes = setTimeout(function(){
                    if(star1){
                        star1.destroy();
                        powerupcount -= 1;
                    }
                },8000);
            } else {
                bomb1 = bomb.create(Phaser.Math.Between(0,winsize),Phaser.Math.Between(0,winsize),'bomb');
                bomb1.displayHeight = game.config.height * powerupsize;
                bomb1.displayWidth = game.config.width * powerupsize;
                bombdes = setTimeout(function(){
                    if(bomb1){
                        bomb1.destroy();
                        powerupcount -= 1;
                    }
                },8000);
            }
        } else {
            rage1 = rage.create(Phaser.Math.Between(0,winsize),Phaser.Math.Between(0,winsize),'rage');
            rage1.displayHeight = game.config.height * powerupsize;
            rage1.displayWidth = game.config.width * powerupsize;
            ragedes = setTimeout(function(){
                if(rage1){
                    rage1.destroy()
                    powerupcount -= 1;
                }
            },8000);
        }
        powerupcount += 1;
    }
    spawnpoweruptimeout = setTimeout(spawnpowerup,5000);
}

//collision detection with star powerup
function collectStar(player,star){
    star.destroy();
    clearTimeout(stardes);
    clearTimeout(poweruptexttimeout);
    
    poweruptext.setText('SPEED++');
    poweruptext.setTint(0x00ff00);
    poweruptexttimeout = setTimeout(function(){
        poweruptext.setText('');
    },8000)
    powerupcount -= 1;
    playerspeed = 300;
    setTimeout(function(){
        playerspeed = 200;
    },8000);
}

//collision detection with bomb powerup
function collectbomb(player,bomb){
    bomb.destroy();
    clearTimeout(bombdes);
    clearTimeout(poweruptexttimeout);
    
    poweruptext.setText('Bullet++');
    poweruptext.setTint(0x00ffff);
    poweruptexttimeout = setTimeout(function(){
        poweruptext.setText('');
    },8000)
    powerupcount -= 1;
    bulletdelay = 50;
    setTimeout(function(){
        bulletdelay = 200;
    },8000);
}

//collsion detection with rage powerup
function collectrage(player, rage){
    rage.destroy();
    clearTimeout(ragedes);
    clearTimeout(poweruptexttimeout);
    
    poweruptext.setText('Rage');
    poweruptext.setTint(0xff0000);
    poweruptexttimeout = setTimeout(function(){
        poweruptext.setText('');
    },5000)
    powerupcount -= 1;
    ragemode = 1;
    player.setTint(0xff0000);
    playerspeed = 260;
    bulletdelay = 100;
    setTimeout(function(){
        ragemode = 0;
        playerspeed = 200;
        bulletdelay = 200;
        player.setTint(0xffffff);
    },5000);
}

//function to spawn asteroids
function spawnasteroid(){
    if(Phaser.Math.Between(0,10) > 6 ){
        ast = smallast.create((player.x > winsize/2) ? Phaser.Math.Between(0,winsize/2):Phaser.Math.Between(winsize/2,winsize),(player.y > winsize/2) ? Phaser.Math.Between(0,winsize/2):Phaser.Math.Between(winsize/2,winsize),'asteroid');
        ast.displayHeight = winsize * 0.05;
        ast.displayWidth = winsize * 0.05;
        ast.body.velocity.x = Phaser.Math.Between(-maxspeed,maxspeed);
        ast.body.velocity.y = Phaser.Math.Between(-maxspeed,maxspeed);
        ast.anims.play('aster');
    } else {
        ast = largeast.create((player.x > winsize/2) ? Phaser.Math.Between(0,winsize/2):Phaser.Math.Between(winsize/2,winsize),(player.y > winsize/2) ? Phaser.Math.Between(0,winsize/2):Phaser.Math.Between(winsize/2,winsize),'asteroid');
        ast.displayHeight = winsize * 0.1;
        ast.displayWidth = winsize * 0.1;
        ast.body.velocity.x = Phaser.Math.Between(-maxspeed,maxspeed);
        ast.body.velocity.y = Phaser.Math.Between(-maxspeed,maxspeed);
        ast.anims.play('aster');
    }
    spawnasteroidtimeout = setTimeout(spawnasteroid,3000);
}

//function to spawn enemy spaceship
function spawnenemy(){
    warningtext.setVisible(true);
    setTimeout(function(){
        warningtext.setVisible(false);
        if(player.x > winsize/2){
            enemy.x = -20;
            if(player.y > winsize/2){
                enemy.y = -20;
                var x = player.x - enemy.x;
                var y = player.y - enemy.y;
                var rads = Math.asin(y/Math.sqrt(x*x+y*y));
                var degree = rads * 180/Math.PI;
                enemy.angle = degree + 90;
            } else {
                enemy.y = winsize + 20;
                var x = player.x - enemy.x;
                var y = enemy.y - player.y;
                var rads = Math.asin(x/Math.sqrt(x*x+y*y));
                var degree = rads * 180/Math.PI;
                enemy.angle = degree;
            }
        } else {
            enemy.x = winsize + 20;
            if(player.y > winsize/2){
                enemy.y = -20;
                var x = enemy.x - player.x;
                var y = player.y - enemy.y;
                var rads = Math.asin(x/Math.sqrt(x*x+y*y));
                var degree = rads * 180/Math.PI;
                enemy.angle = degree + 180;
            } else {
                enemy.y = winsize + 20;
                var x = enemy.x - player.x;
                var y = enemy.y - player.y;
                var rads = Math.asin(x/Math.sqrt(x*x+y*y));
                var degree = rads * 180/Math.PI;
                enemy.angle = 360 - degree;
            }
        }
        enemy.body.velocity.x = Math.sin((Math.PI/180) * enemy.angle) * enemyspeed;
        enemy.body.velocity.y = Math.cos((Math.PI/180) * enemy.angle) * -1 * enemyspeed;
        var randtime = Phaser.Math.Between(2,6);
        setTimeout(spawnenemy,randtime * 1000);
    },1000);
}

//when bullets hit large asteroid
function hitasteroid(bullet,aster){
    //keep track of hits taken with angle
    aster.angle += 1;
    if(aster.angle > 4){
        //spawn two small asteroids
        s1 = smallast.create(aster.x + aster.displayWidth,aster.y + aster.displayHeight/4,'asteroid');
        s1.displayWidth = winsize * 0.05;
        s1.displayHeight = winsize * 0.05;
        s1.body.velocity.x = aster.body.velocity.x *0.9;
        s1.body.velocity.y = aster.body.velocity.y *0.9;
        s1.anims.play('aster');
        s2 = smallast.create(aster.x + aster.displayWidth,aster.y + aster.displayHeight *3/4,'asteroid');
        s2.displayWidth = winsize * 0.05;
        s2.displayHeight = winsize * 0.05;
        s2.body.velocity.x = aster.body.velocity.x * 0.9;
        s2.body.velocity.y = aster.body.velocity.y * 0.9;
        s2.anims.play('aster');
        score += 20;
        scoreText.setText('Score: ' + score);
        aster.destroy()
    }
    //emit particles where bullet hits
    var emitter = particles.createEmitter({
        x: bullet.x,
        y: bullet.y,
        speed: { min: 50, max: 150 },
        lifespan: 1000,
        scale : 0.05,
        blendMode: 'Normal'
    });
    bullet.destroy();
    setTimeout(function(){
        emitter.stop();
    },200)
}

//when bullet hits enemy spacehship
function enemyshot(enemy,bullet){
    var emitter = particles.createEmitter({
        x: bullet.x,
        y: bullet.y,
        speed: { min: 50, max: 150 },
        lifespan: 1000,
        scale : 0.05,
        blendMode: 'Normal'
    });
    bullet.destroy();
    score += 1;
    scoreText.setText('score: '+score);
    setTimeout(function(){
        emitter.stop();
    },200)
}

//when bullets hit small asteroid
function hitsmallasteroid(bullet,aster){
    //keep track of hits taken with angle
    aster.angle += 1;
    if(aster.angle > 1){
        score += 10;
        scoreText.setText('Score: ' + score);
        aster.destroy();
    }
    //emit particles where bullet hits
    var emitter = particles.createEmitter({
        x: bullet.x,
        y: bullet.y,
        speed: { min: 50, max: 150 },
        lifespan: 1000,
        scale : 0.05,
        blendMode: 'Normal'
    });
    bullet.destroy();
    setTimeout(function(){
        emitter.stop();
    },200)
}

//when player hits asteroid
function playerhit(player,ast){
    //destroy asteroid if ragemode on else end game
    if(ragemode){
        ast.destroy();
        var emitter = particles.createEmitter({
            x: ast.x,
            y: ast.y,
            speed: { min: 50, max: 150 },
            lifespan: 1000,
            scale : 0.05,
            blendMode: 'Normal'
        });
        setTimeout(function(){
            emitter.stop();
        },200)
    } else {
        this.physics.pause();
        clearTimeout(spawnasteroidtimeout);
        clearTimeout(spawnpoweruptimeout);
        shootable = false;
        setTimeout(function(){
            ref.scene.start('lostGame',{scoreval:score});
        },2000);
    }
}

function playerhitbyenemy(player,enemy){
    poweruptext.setText('Speed--');
    poweruptext.setTint(0x800000);
    playerspeed = 100;
    clearTimeout(speedchangetimeout);
    speedchangetimeout = setTimeout(function(){
        playerspeed = 200;
        poweruptext.setText('');
    },4000);
    clearTimeout(scorechangetimeout);
    scorechangetimeout = setTimeout(function(){
        score -= 15;
        scoreText.setText('score: '+score);
    },500);
}