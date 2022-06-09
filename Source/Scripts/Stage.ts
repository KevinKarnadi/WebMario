import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Stage extends cc.Component {

    @property(Player)
    Player: Player = null;

    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    winSound: cc.AudioClip = null;

    private score: number = 0;

    private coins: number = 0;

    private life: number = 0;

    private time: number = 300;

    private isWin: boolean = false;

    playBGM() {
        cc.audioEngine.playMusic(this.bgm, true);
    }

    playEffect(sound) {
        cc.audioEngine.playEffect(sound, false);
    }

    stopBGM() {
        cc.audioEngine.stopMusic();
    }

    start() {
        this.playBGM();
        this.initInformation();
    }

    update(dt) {
        this.moveCamera(dt);
        this.updateUI(dt);
        if(!this.Player.isDead) {
            if(!this.isWin) {
                if(Math.floor(this.time) > 0)
                    this.time -= dt;
                else {
                    this.Player.die();
                }
            }
        }
    }

    initInformation() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                firebase.database().ref("users/" + user.uid).once("value").then((snapshot) => {
                    this.life = Number(snapshot.val().life);
                    this.coins = Number(snapshot.val().curCoins);
                    this.score = Number(snapshot.val().curScore);
                });
            }
        });
    }

    moveCamera(dt) {
        let dist = this.Player.node.x - cc.find("Canvas/Main Camera").x;
        if(this.Player.node.x != cc.find("Canvas/Main Camera").x) {
            cc.find("Canvas/Main Camera").x = this.Player.node.x;
            if(cc.find("Canvas/Main Camera").x < 0)
                cc.find("Canvas/Main Camera").x = 0;
            if(cc.find("Canvas/Main Camera").x > 3333)
                cc.find("Canvas/Main Camera").x = 3333;
            //cc.find("Canvas/Main Camera/leftBound").x = -600;
            //cc.find("Canvas/Main Camera/rightBound").x = 600;
        }
    }

    updateUI(dt) {
        let lifeStr = cc.find("Canvas/Main Camera/LifeStr").getComponent(cc.Label);
        let coinsStr = cc.find("Canvas/Main Camera/CoinsStr").getComponent(cc.Label);
        let scoreStr = cc.find("Canvas/Main Camera/ScoreStr").getComponent(cc.Label);
        let timeStr = cc.find("Canvas/Main Camera/TimeStr").getComponent(cc.Label);
        lifeStr.string = String(this.life);
        coinsStr.string = String(this.coins);
        scoreStr.string = String((Array(6).join("0") + this.score).slice(-6));
        timeStr.string = String(Math.floor(this.time));
    }

    updateLife(n) {
        this.life += n;
    }

    updateCoins(n) {
        this.coins += n;
    }

    updateScore(n) {
        this.score += n;
    }

    win() {
        this.isWin = true;
        this.stopBGM();
        this.playEffect(this.winSound);
        this.updateDatabase();
        this.scheduleOnce(function() {
            cc.find("Canvas/Player").active = false;
        }, 0.2);
        this.scheduleOnce(function() {
            cc.director.loadScene("GameMenu");
        }, 7);
    }

    updateDatabase() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                let S;
                let C;
                firebase.database().ref("users/" + user.uid).once("value").then((snapshot) => {
                    let highscore = Number(snapshot.val().hiScore);
                    let highcoins = Number(snapshot.val().hiCoins);
                    S = (this.score > highscore) ? this.score : highscore;
                    C = (this.coins > highcoins) ? this.coins : highcoins;
                    if(this.life > 0) {
                        firebase.database().ref("users/" + user.uid).update({
                            life: this.life,
                            curCoins: 0,
                            curScore: 0,
                            hiCoins: C,
                            hiScore: S
                        })
                    }
                    else {
                        firebase.database().ref("users/" + user.uid).update({
                            life: 5,
                            curCoins: 0,
                            curScore: 0,
                            hiCoins: C,
                            hiScore: S
                        })
                    }
                });
            }
        });
    }

    loadScene(name) {
        this.stopBGM();
        cc.director.loadScene(name);
    }

}
