const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    btnSound: cc.AudioClip = null;

    playBGM() {
        cc.audioEngine.playMusic(this.bgm, true);
    }

    playEffect(sound) {
        cc.audioEngine.playEffect(sound, false);
    }

    initSignUpBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "Menu";
        clickEventHandler.handler = "signUp";
        cc.find("Canvas/menu_bg/SignUpBtn").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    signUp() {
        this.playEffect(this.btnSound);
        cc.director.loadScene("SignUp");
    }

    initSignInBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "Menu";
        clickEventHandler.handler = "signIn";
        cc.find("Canvas/menu_bg/SignInBtn").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    signIn() {
        this.playEffect(this.btnSound);
        cc.director.loadScene("SignIn");
    }

    start() {
        this.playBGM();
        this.initSignUpBtn();
        this.initSignInBtn();
    }

}
