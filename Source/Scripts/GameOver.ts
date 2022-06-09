const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {

    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;
    
    start() {
        cc.audioEngine.playMusic(this.bgm, false);
        this.scheduleOnce(function() {
            cc.audioEngine.stopMusic();
            cc.director.loadScene("GameMenu");
        }, 5);
    }

}
