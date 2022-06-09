import Stage from "./Stage";
import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyMushroom extends cc.Component {

    @property(Player)
    Player: Player = null;

    @property(Stage)
    Stage: Stage = null;

    @property({type:cc.AudioClip})
    dieSound: cc.AudioClip = null;

    private anim: cc.Animation = null;

    private isDead: boolean = false;

    private moveDir: number = -1;

    private moveSpeed: number = 100;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.anim = this.getComponent(cc.Animation);
    }

    start() {
        this.schedule(function() {
            this.node.scaleX *= -1;
        }, 0.1);
    }

    update(dt) {
        this.enemyMove(dt);
    }

    onBeginContact(contact, self, other) {
        if(other.tag == 3) {  // player
            if(this.isDead) {
                contact.disabled = true;
                return;
            }
            if(this.Player.isDead)
                return;
            if(contact.getWorldManifold().normal.y == 1 && contact.getWorldManifold().normal.x == 0) {
                //console.log("hit player");
                this.anim.play("mushroom_die");
                cc.audioEngine.playEffect(this.dieSound, false);
                this.Player.jump();
                //contact.disabled = true;
                this.isDead = true;
                
                let addScore = cc.callFunc(function(target) {
                    this.Stage.updateScore(100);
                }, this);

                let destroy = cc.callFunc(function(target) {
                    this.node.destroy(); 
                }, this);

                let action = cc.sequence(cc.fadeOut(0.5), addScore, destroy);
                this.node.runAction(action);
                //this.node.destroy();
            }
            else
                this.Player.die();
        }
        else if(other.tag != 0) {  // non-player
            if(contact.getWorldManifold().normal.y == 0) {
                //console.log("hit nonplayer");
                this.moveDir *= -1;
            }
        }
    }

    enemyMove(dt) {
        this.node.x += this.moveDir * this.moveSpeed * dt;
    }

}
