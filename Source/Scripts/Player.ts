//import Stage from "./Stage";
import Temp from "./Temp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    /*
    @property(Stage)
    Stage: Stage = null;
    */
    @property(Temp)
    Temp: Temp = null;

    @property({type:cc.AudioClip})
    jumpSound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    dieSound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    thudSound: cc.AudioClip = null;

    private aDown: boolean = false;

    private dDown: boolean = false;

    private wDown: boolean = false;

    private anim: cc.Animation = null;

    isDead: boolean = false;

    private onGround: boolean = false;

    private life: number = 0;

    private moveDir: number = 0;

    private playerSpeed: number = 300;

    private isBig: boolean = false;

    private pause: boolean = false;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.anim = this.getComponent(cc.Animation);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        this.initLife();
    }

    update(dt) {
        if(this.isDead || this.pause)
            return;
        this.playerMove(dt);
        this.playerAnimation();
        if(this.node.y - cc.find("Canvas/Main Camera").y < -600) 
            this.die();
    }

    onKeyDown(e) {
        if(e.keyCode == cc.macro.KEY.a) {  // left
            this.aDown = true;
        }
        else if(e.keyCode == cc.macro.KEY.d) {  // right
            this.dDown = true;
        }
        else if(e.keyCode == cc.macro.KEY.w) {  // jump
            this.wDown = true;
        }
    }

    onKeyUp(e) {
        if(e.keyCode == cc.macro.KEY.a) {  // left
            this.aDown = false;
        }
        else if(e.keyCode == cc.macro.KEY.d) {  // right
            this.dDown = false;
        }
        else if(e.keyCode == cc.macro.KEY.w) {  // jump
            this.wDown = false;
        }
    }

    onBeginContact(contact, self, other) {
        //console.log("Player hit " + other.node.name);
        if(this.isDead) {
            contact.disabled = true;
            return;
        }
        //console.log("Player hit " + other.node.name);
        if(other.tag == 99) {
            this.Temp.win();
        }
        else {
            cc.audioEngine.playEffect(this.thudSound, false);
            if(contact.getWorldManifold().normal.y < 0 && contact.getWorldManifold().normal.x == 0) {
                this.onGround = true;
            }
        }
    }

    initLife() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                firebase.database().ref("users/" + user.uid).once("value").then((snapshot) => {
                    this.life = Number(snapshot.val().life);
                });
            }
        });
    }

    playerMove(dt) {
        if(this.aDown && !this.dDown) {  // left
            this.moveDir = -1;
        }
        else if(this.dDown && !this.aDown) {  // right
            this.moveDir = 1;
        }
        else if(!this.aDown && !this.dDown) {  // idle
            this.moveDir = 0;
        }
        this.node.scaleX = (this.moveDir == 0) ? this.node.scaleX : this.moveDir;
        this.node.x += this.moveDir * this.playerSpeed * dt;

        if(this.wDown && this.onGround) {  // jump
            this.jump();
        }
    }

    jump() {
        this.onGround = false;
        cc.audioEngine.playEffect(this.jumpSound, false);
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 700);
    }

    playerAnimation() {
        if(this.isBig) {
            if(!this.onGround) {
                if(!this.anim.getAnimationState("big_jump").isPlaying)
                    this.anim.play("big_jump");
            }
            else if(this.onGround) {
                if(this.moveDir == 0) {
                    this.anim.play("big_idle");
                }
                else {
                    if(!this.anim.getAnimationState("big_move").isPlaying)
                        this.anim.play("big_move");
                }
            }
        }
        else {
            if(!this.onGround) {
                if(!this.anim.getAnimationState("jump").isPlaying)
                    this.anim.play("jump");
            }
            else if(this.onGround) {
                if(this.moveDir == 0) {
                    this.anim.play("idle");
                }
                else {
                    if(!this.anim.getAnimationState("move").isPlaying)
                        this.anim.play("move");
                }
            }
        }
    }

    die() {
        this.isDead = true;
        this.life -= 1;
        this.Temp.updateLife(-1);
        cc.audioEngine.playEffect(this.dieSound, false);
        cc.audioEngine.stopMusic();
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1000);
        //this.stopBGM();
        this.Temp.updateDatabase();
        console.log(this.life);
        if(this.life > 0) {
            let stageNum = cc.find("Canvas/Main Camera/NUM").getComponent(cc.Label).string;
            this.scheduleOnce(function() {
                if(stageNum == "1")
                    this.Temp.loadScene("GameStart1");
                else
                    this.Temp.loadScene("GameStart2");
            }, 2);
        }
        else {  // game over
            console.log("Game over");
            this.scheduleOnce(function() {
                //this.playEffect(this.gameOverSound);
                this.Temp.loadScene("GameOver");
            }, 2);
        }
    }

}
