import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyFlower extends cc.Component {

    @property(Player)
    Player: Player = null;

    private isStarted: boolean = false;

    private anim: cc.Animation = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.anim = this.getComponent(cc.Animation);
    }

    start() {
    }

    update(dt) {
        if(!this.anim.getAnimationState("flower").isPlaying)
            this.anim.play("flower");
        if(!this.isStarted && this.node.x - cc.find("Canvas/Main Camera").x < 680) {
            this.isStarted = true;
            this.schedule(function() {
                let action = cc.sequence(cc.moveBy(1.5, 0, 68), cc.delayTime(1.5), cc.moveBy(1.5, 0, -68));
                this.node.runAction(action);
            }, 6);
        }
    }

    onBeginContact(contact, self, other) {
        if(this.Player.isDead)
            return;
        if(other.tag == 3) {  // player
                console.log("hit player");
                this.Player.die();
            }
        }
    }

}
