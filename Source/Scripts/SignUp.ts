const {ccclass, property} = cc._decorator;

@ccclass
export default class SignUp extends cc.Component {

    @property({type:cc.AudioClip})
    btnSound: cc.AudioClip = null;

    playEffect(sound) {
        cc.audioEngine.playEffect(sound, false);
    }

    initSignUpBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "SignUp";
        clickEventHandler.handler = "signUp";
        cc.find("Canvas/menu_bg/Window/SignUpBtn").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    signUp() {
        this.playEffect(this.btnSound);
        let emailBox = cc.find("Canvas/menu_bg/Window/Email").getComponent(cc.EditBox);
        let usernameBox = cc.find("Canvas/menu_bg/Window/Username").getComponent(cc.EditBox);
        let passwordBox = cc.find("Canvas/menu_bg/Window/Password").getComponent(cc.EditBox);
        let email = emailBox.string;
        let username = usernameBox.string.toUpperCase();
        let password = passwordBox.string;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert("Sign Up Success!");
                let user = userCredential.user;
                let userData = {
                    email: email,
                    username: username,
                    curScore: 0,
                    curCoins: 0,
                    hiScore: 0,
                    hiCoins: 0,
                    life: 5
                };
                firebase.database().ref("users/" + user.uid).set(userData);
                emailBox.string = "";
                usernameBox.string = "";
                passwordBox.string = "";
            }).catch((e) => {
                alert(e.message);
            });
    }

    initBackBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "SignUp";
        clickEventHandler.handler = "back";
        cc.find("Canvas/menu_bg/BackBtn").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    back() {
        this.playEffect(this.btnSound);
        cc.director.loadScene("Menu");
    }

    start() {
        this.initSignUpBtn();
        this.initBackBtn();
    }

}
