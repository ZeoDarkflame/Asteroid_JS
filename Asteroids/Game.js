var winsize = (window.innerHeight > window.innerWidth) ? window.innerWidth : window.innerHeight;//stores size of the game
var playbtn;
var changeName;
var ref;
var toptext;
var config = {
    type: Phaser.AUTO,
    parent: 'Aux',
    width: winsize,
    height: winsize,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    dom: {
        createContainer: true
    },
    scene: [{
        preload : preload,
        create: create,
        update: update
    },Main,Lost]
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.html('nameinput', 'assets/nameinput.html');
}

function create ()
{
    playbtn = this.add.text(winsize/2,winsize/2 - 100,"PLAY",{fontSize:64});
    playbtn.setOrigin(0.5,0.5);
    playbtn.setInteractive().on('pointerdown', () => onplaybtnclicked()).on('pointerup', () => onplaybtnclickeddone());
    playbtn.setVisible(false);
    changeName = this.add.text(winsize/2,50,"Change Name",{fontSize:26});
    changeName.setOrigin(0.5,0.5);
    changeName.setInteractive().on('pointerdown',() => onchangenameclicked());
    changeName.setVisible(false);
    ref = this;
    toptext = this.add.text(winsize/2, 10, 'Please enter your name', { color: 'white', fontSize: '20px '});
    toptext.setOrigin(0.5,0.5);

    if(localStorage.getItem('Name')){
        playbtn.setVisible(true);
        changeName.setVisible(true);
        toptext.setText(localStorage.getItem('Name'));
    } else {
        makeinput();
    }

    //setting up the leaderboard
    var len = localStorage.length;
    var leaderboard = [];
    for(var i = 0;i<len;i++){
        if(localStorage.key(i) != 'Name'){
            var playername = localStorage.key(i);
            var playerscore = localStorage.getItem(playername);
            console.log(playername,playerscore);
            leaderboard.push({name:playername,score:playerscore});
        }
    }
    console.log(leaderboard);
    for(i=0;i<leaderboard.length;i++){
        for(var j=0;j<leaderboard.length;j++){
            if(parseInt(leaderboard[i].score) > parseInt(leaderboard[j].score)){
                var temp = leaderboard[i];
                leaderboard[i] = leaderboard[j];
                leaderboard[j] = temp;
            }
        }
    }

    console.log(0-15);
    leaderboardlen = (leaderboard.length > 5) ? 5 : leaderboard.length;
    for(i=0;i<leaderboardlen;i++){
        var playername = leaderboard[i].name;
        var playerscore = leaderboard[i].score;
        this.add.text(winsize/2,winsize/2 + 18*i + 100,(i+1)+'.) '+playername+': '+playerscore + 'pts',{fontSize:18,fixedWidth:360}).setOrigin(0.5,0.5);
    }
}

function update(){

}

function onplaybtnclicked(){
    playbtn.setStyle({fontSize:62});
    playbtn.setTint(0x00ff00);
    setTimeout(function(){
        ref.scene.start("playGame");
    },200);
}

function onplaybtnclickeddone(){
    playbtn.setStyle({fontSize:64});
}

function onchangenameclicked(){
    makeinput();
    changeName.setVisible(false);
    playbtn.setVisible(false);
    toptext.setText('Please Enter a New Name');
}

//function to take name input from user
function makeinput() {
    var element = ref.add.dom(winsize/2, -10).createFromCache('nameinput');

    element.addListener('click');

    element.on('click', function (event) {

        if (event.target.name === 'playButton')
        {
            var inputText = this.getChildByName('nameField');

            if (inputText.value !== '')
            {
                this.removeListener('click');

                this.setVisible(false);

                playbtn.setVisible(true);
                changeName.setVisible(true);

                localStorage.setItem('Name',inputText.value);

                toptext.setText(inputText.value);
            }
            else
            {
                //Flash text
                this.scene.tweens.add({
                    targets: toptext,
                    alpha: 0.2,
                    duration: 250,
                    ease: 'Power3',
                    yoyo: true
                });
            }
        }

    });

    ref.tweens.add({
        targets: element,
        y: 250,
        duration: 3000,
        ease: 'Power3'
    });
}