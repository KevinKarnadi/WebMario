import Stage from "./Stage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoxScore extends cc.Component {

    @property(Stage)
    Stage: Stage = null;

    @property(cc.Prefab)
    score100Prefab: cc.Prefab = null;

    @property({type:cc.AudioClip})
    hitSound: cc.AudioClip = null;

    private isActive: boolean = true;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    }

    start() {

    }

    update(dt) {

    }

    onBeginContact(contact, self, other) {
        if(this.isActive) {
            if(other.tag == 3) {  // player
                if(contact.getWorldManifold().normal.y == -1 && contact.getWorldManifold().normal.x == 0) {
                    this.isActive = false;
                    this.node.getComponent(cc.Sprite).enabled = true;
                    cc.audioEngine.playEffect(this.hitSound, false);

                    let addScore = cc.callFunc(function(target) {
                        this.Stage.updateScore(100);
                    }, this);

                    let score = cc.instantiate(this.score100Prefab);
                    score.parent = cc.find("Canvas");
                    score.setPosition(this.node.x, this.node.y+50);
            
                    let action = cc.sequence(cc.spawn(cc.moveBy(1, 0, 50), cc.fadeOut(1)), addScore);
                    score.runAction(action);
                }
            }
        }
    }

}
