import Stage from "./Stage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoxCoin extends cc.Component {

    @property(Stage)
    Stage: Stage = null;
    
    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

    @property({type:cc.AudioClip})
    hitSound: cc.AudioClip = null;

    private isActive: boolean = true;

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {

    }

    update (dt) {

    }

    onBeginContact(contact, self, other) {
        if(this.isActive) {
            if(other.tag == 3) {  // player
                if(contact.getWorldManifold().normal.y == -1 && contact.getWorldManifold().normal.x == 0) {
                    this.isActive = false;
                    this.node.getComponent(cc.Sprite).enabled = true;
                    cc.audioEngine.playEffect(this.hitSound, false);

                    let coin = cc.instantiate(this.coinPrefab);
                    coin.parent = cc.find("Canvas");
                    coin.setPosition(this.node.x, this.node.y+50);
            
                    let addCoin = cc.callFunc(function(target) {
                        this.Stage.updateCoins(1);
                    }, this);

                    let destroy = cc.callFunc(function(target) {
                        coin.destroy(); 
                    }, this);
            
                    let action = cc.sequence(cc.moveBy(0.2, 0, 80), cc.moveBy(0.2, 0, -80), addCoin, destroy);  
                    coin.runAction(action);
                }
            }
        }
    }

}
