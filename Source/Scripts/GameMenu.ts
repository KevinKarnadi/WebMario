const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMenu extends cc.Component {

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

    stopBGM() {
        cc.audioEngine.stopMusic();
    }

    start() {
        this.playBGM();
        this.initHeader();
        this.initRankBtn();
        this.initHelpBtn();
        this.initExitBtn();
        this.initStage1Btn();
    }

    initHeader() {
        let userStr = cc.find("Canvas/menu_bg/Header/UserStr").getComponent(cc.Label);
        let scoreStr = cc.find("Canvas/menu_bg/Header/ScoreStr").getComponent(cc.Label);
        let coinsStr = cc.find("Canvas/menu_bg/Header/CoinsStr").getComponent(cc.Label);
        let lifeStr = cc.find("Canvas/menu_bg/Header/LifeStr").getComponent(cc.Label);
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                firebase.database().ref("users/" + user.uid).once("value").then((snapshot) => {
                    //console.log(snapshot.val());
                    userStr.string = snapshot.val().username;
                    scoreStr.string = (Array(6).join("0") + snapshot.val().hiScore).slice(-6);
                    coinsStr.string = snapshot.val().hiCoins;
                    lifeStr.string = snapshot.val().life;
                });
            }
        });
    }

    initRankBtn() {
        firebase.database().ref("users").orderByChild("hiScore").once("value", function(snapshot) {
            let user = [];
            let score = [];
            snapshot.forEach(function(item) {
                user.push(item.val().username);
                score.push(item.val().hiScore);
            })
            user.reverse();
            score.reverse(); 

            for (var i = 1; i <= user.length; i++) {
                cc.find("Canvas/menu_bg/RankText/"+String(i)+"/Name").getComponent(cc.Label).string = user[i-1];
                cc.find("Canvas/menu_bg/RankText/"+String(i)+"/Score").getComponent(cc.Label).string = score[i-1];
            }
        });
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "GameMenu";
        clickEventHandler.handler = "rank";
        cc.find("Canvas/menu_bg/RankBtn").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    rank() {
        this.playEffect(this.btnSound);
        console.log("click rank");
        cc.find("Canvas/menu_bg/RankText").active = true;
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.closeRank);
    }

    closeRank() {
        cc.find("Canvas/menu_bg/RankText").active = false;
        //this.node.off(cc.Node.EventType.MOUSE_DOWN, this.closeHelp);
    }

    initHelpBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "GameMenu";
        clickEventHandler.handler = "help";
        cc.find("Canvas/menu_bg/HelpBtn").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    help() {
        this.playEffect(this.btnSound);
        cc.find("Canvas/menu_bg/HelpText").active = true;
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.closeHelp);
    }

    closeHelp() {
        cc.find("Canvas/menu_bg/HelpText").active = false;
        //this.node.off(cc.Node.EventType.MOUSE_DOWN, this.closeHelp);
    }

    initExitBtn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "GameMenu";
        clickEventHandler.handler = "exit";
        cc.find("Canvas/menu_bg/ExitBtn").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    exit() {
        this.playEffect(this.btnSound);
        firebase.auth().signOut()
            .then(() => {
                this.stopBGM();
                cc.director.loadScene("Menu");
            });
    }

    initStage1Btn() {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "GameMenu";
        clickEventHandler.handler = "stage1";
        cc.find("Canvas/menu_bg/Stage1Btn").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    stage1() {
        this.playEffect(this.btnSound);
        this.stopBGM();
        cc.director.loadScene("GameStart1");
    }

}
