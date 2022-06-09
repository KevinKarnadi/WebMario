import Stage from "./Stage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Temp extends cc.Component {

    @property(Stage)
    Stage: Stage = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    updateLife(n) {
        this.Stage.updateLife(n);
    }

    win() {
        this.Stage.win();
    }

    updateDatabase() {
        this.Stage.updateDatabase();
    }

    loadScene(name) {
        this.Stage.loadScene(name);
    }

}
