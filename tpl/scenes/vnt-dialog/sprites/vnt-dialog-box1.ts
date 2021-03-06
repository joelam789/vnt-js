export class SceneDialogSpriteDialogBox1 {

    minHeight = 60;

    open(plotspr: any, speaker: string, words: Array<string>, speed: number = 50, more: boolean = false, 
        color: string = "#FFFFFF", weight: string = "normal") {
        let game = plotspr.game;
        let tween = plotspr.scene.sys("tween");
        let chatbox = plotspr.scene.sprites["vnt-dialog-box1"];
        let chatmsg = plotspr.scene.sprites["vnt-dialog-text1"];
        let chatguy = plotspr.scene.sprites["vnt-dialog-speaker1"];
        let cursor = plotspr.scene.sprites["vnt-dialog-cursor1"];
		if (chatbox && chatmsg && cursor) {

            let showing = chatbox.active;
            let display = chatbox.get("display").object;

            if (!showing) {
                display.x = (game.get("display").width - display.width) / 2;
                display.y = game.get("display").height - display.height;
            }

            if (!chatbox.custom) {
                chatbox.custom = {};
                if (display) {
                    chatbox.custom.posY = display.y;
                    chatbox.custom.maxH = display.height;
                    chatbox.custom.minH = this.minHeight;
                }
            }
            if (!chatmsg.custom) chatmsg.custom = {};

            chatbox.custom.status = "open";
            chatbox.custom.plot = plotspr.name;

            if (chatguy) chatguy.get("display").object.text = speaker ? speaker : "";

            //let history = chatmsg.custom.history ? chatmsg.custom.history : "";
            //chatmsg.custom.current = words.join("\n");
            //chatmsg.get("text").content = history + chatmsg.custom.current;
            //chatmsg.get("display").object.text = history;
            //chatmsg.custom.content = history + chatmsg.custom.current;

            chatmsg.code.prepareCurrent(words, more, color, weight);

            let canShowAnima = !showing && tween && display && chatbox.custom.posY 
                                && chatbox.custom.maxH && chatbox.custom.minH;
            if (canShowAnima) {
                display.y = chatbox.custom.posY + (chatbox.custom.maxH - chatbox.custom.minH) / 2 ;
                display.height = chatbox.custom.minH;
            }

            chatbox.active = true;
            chatmsg.active = chatmsg.code.history.length > 0 ? true : false;
            if (chatguy) chatguy.active = chatmsg.active;
            cursor.active = false;

            if (canShowAnima) {
                tween.get(display)
                    .to({y: chatbox.custom.posY, height: chatbox.custom.maxH}, 120)
                    .call(() => {
                        chatmsg.active = true;
                        chatmsg.code.updateText(speed, more);
                        if (chatguy) chatguy.active = chatmsg.active;
                });
            } else {
                chatmsg.active = true;
                if (chatguy) chatguy.active = chatmsg.active;
                plotspr.scene.timeout(150, () => chatmsg.code.updateText(speed, more));
            }

        }
    }

    next(flag: string = null) {
        let spr = (this as any).owner;
        let chatbox = spr.scene.sprites["vnt-dialog-box1"];
        let chatstate = chatbox && chatbox.custom ? chatbox.custom.status : "";
        //if (flag) console.log(chatstate, flag, chatbox.custom.plot);
        if (chatstate == "done" || chatstate == "more" ) {
            let activePlotName = spr.scene.sys("vnt").getActivePlotName();
            let plotctx = activePlotName ? spr.scene.sprites[activePlotName] : null;
            if (plotctx) {
                if (flag) plotctx.plot.signal(flag);
                else plotctx.plot.signal();
            }
        } else if (chatstate == "open") {
            let chatmsg = spr.scene.sprites["vnt-dialog-text1"];
            //if (chatmsg && chatmsg.custom && chatmsg.custom.content) {
            //    chatmsg.get("display").object.text = chatmsg.custom.content;
            //}
            if (chatmsg) chatmsg.code.enableCurrent();
        }
    }

    close(needAnima = true) {
        let spr = (this as any).owner;
        let tween = spr.scene.sys("tween");
        let chatbox = spr.scene.sprites["vnt-dialog-box1"];
        let chatmsg = spr.scene.sprites["vnt-dialog-text1"];
        let chatguy = spr.scene.sprites["vnt-dialog-speaker1"];
        let cursor = spr.scene.sprites["vnt-dialog-cursor1"];
        if (chatbox && chatmsg && cursor) {

            chatmsg.active = false;
            if (chatguy) chatguy.active = chatmsg.active;
            cursor.active = false;

            chatmsg.code.disableCurrent();
            chatmsg.code.clearHistory();

            let showing = chatbox.active;
            let display = chatbox.get("display").object;
            let canShowAnima = showing && tween && display && chatbox.custom.posY 
                                && chatbox.custom.maxH && chatbox.custom.minH;
            if (canShowAnima && needAnima) {
                tween.get(display)
                    .to({ y: chatbox.custom.posY + (chatbox.custom.maxH - chatbox.custom.minH) / 2, 
                            height: chatbox.custom.minH }, 120)
                    .call(() => {
                        chatbox.active = false;
                        display.y = chatbox.custom.posY;
                        display.height = chatbox.custom.maxH;
                    });
            } else {
                chatbox.active = false;
            }
        } else {
            // ...
        }
    }

    isAnswering() {
        let spr = (this as any).owner;
        let answer1 = spr.scene.spr("vnt-answer-box1").code;
        return answer1 && answer1.isAnswering();
    }

    getChoice() {
        let spr = (this as any).owner;
        let answer1 = spr.scene.spr("vnt-answer-box1").code;
        return answer1 ? answer1.getChoice() : 0;
    }

    moveCursor(dir: string) {
        let spr = (this as any).owner;
        let answer1 = spr.scene.spr("vnt-answer-box1").code;
        if (answer1) answer1.moveCursor(dir);
    }

    selectAnswer() {
        let spr = (this as any).owner;
        let cursor = spr.scene.spr("vnt-answer-cursor1");
        let answer1 = spr.scene.spr("vnt-answer-box1").code;
        if (answer1 && cursor) answer1.selectAnswer(cursor);
    }

    clearHistory() {
        let spr = (this as any).owner;
        let chatmsg = spr.scene.spr("vnt-dialog-text1").code;
        if (chatmsg) chatmsg.clearHistory();
    }

    answer(spr, options: Array<string>, gap = 80) {
        let answer1 = spr.scene.spr("vnt-answer-box1").code;
        if (answer1) answer1.open(spr, options, gap);
    }
    
    onPointerup(spr, event) {
        let pos = event.data.getLocalPosition(spr.get("display").object);
        if (pos.y > 130 && pos.x < 540) return; // event.stopped not work for parent...
        this.next();
	}

}
