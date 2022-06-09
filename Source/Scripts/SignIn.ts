const {ccclass, property} = cc._decorator;

@ccclass
export default class SignIn extends cc.Component {

    @property({type:cc.AudioClip})
    btnSound: cc.AudioClip = null;

    playEffect(sound) {
        cc.audioEngine.playEffect(sound, false);
    }

    stopBGM() {
        cc.audioEngine.stopMusic();
    }

    initSignInBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "SignIn";
        clickEventHandler.handler = "signIn";
        cc.find("Canvas/menu_bg/Window/SignInBtn").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    signIn() {
        this.playEffect(this.btnSound);
        let emailBox = cc.find("Canvas/menu_bg/Window/Email").getComponent(cc.EditBox);
        let passwordBox = cc.find("Canvas/menu_bg/Window/Password").getComponent(cc.EditBox);
        let email = emailBox.string;
        let password = passwordBox.string;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                this.stopBGM();
                cc.director.loadScene("GameMenu");
            }).catch((e) => {
                alert(e.message);
            });
    }

    initBackBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "SignIn";
        clickEventHandler.handler = "back";
        cc.find("Canvas/menu_bg/BackBtn").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    back() {
        this.playEffect(this.btnSound);
        cc.director.loadScene("Menu");
    }

    start() {
        this.initSignInBtn();
        this.initBackBtn();
    }

}
