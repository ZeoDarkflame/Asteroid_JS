var score = 0;
var prevscore;
class Lost extends Phaser.Scene{
    constructor(){
        super("lostGame");
    }

    init(data){
        score = data.scoreval;
    }

    create(){
        var winsize = (window.innerHeight > window.innerWidth) ? window.innerWidth : window.innerHeight;//stores size of the game
        this.losttext = this.add.text(winsize/2,winsize/2 - 64,"YOU LOST",{fontSize:64});
        this.losttext.setOrigin(0.5,0.5);
        this.scoretext = this.add.text(winsize/2,winsize/2 + 32,'',{fontSize: 32});
        this.scoretext.setOrigin(0.5,0.5);
        this.scoretext.setText('SCORE: ' + score);
        this.retry = this.add.text(winsize/2,winsize - 50,'Retry',{fontSize: 32});
        this.retry.setOrigin(0.5,0.5);
        this.retry.setInteractive().on('pointerdown',() => this.onhomeclicked());
        var xhttp = new XMLHttpRequest();
        console.log(localStorage.getItem(localStorage.getItem('Name')))
        if(localStorage.getItem(localStorage.getItem('Name'))){
            prevscore = 0;
        } else {
            prevscore = localStorage.getItem(localStorage.getItem('Name'));
        }
        if(prevscore < score){
            localStorage.setItem(localStorage.getItem('Name'),score);
        }
    }

    onhomeclicked(){
        window.location.reload();
    }
}