export class SceneDialogSpriteAnswerBox1 {

    selected = 0;
    answering = false;
    textRelativeX = 50;
    textRelativeY = 20;
    cursorRelativeX = 30;
    cursorRelativeY = 28;

    open(plotspr, lines: Array<string>, gap = 80) {
        //console.log("showing answers...");
        let scene = plotspr.scene;
        let itemw = scene.spr("answer-box1").get("display").width;
        let itemh = scene.spr("answer-box1").get("display").height;
        let boxh = scene.spr("dialog-box1").get("display").height;
        let left = (scene.game.get("display").width - itemw) / 2;
        let top = (scene.game.get("display").height - boxh - gap * lines.length) / 2;
        let chatmsg = scene.sprites["dialog-text1"];
        this.textRelativeX = itemw / 2;
        this.textRelativeY = itemh / 2;
        if (chatmsg && chatmsg.custom) {
            chatmsg.custom.more = false;
            chatmsg.custom.history = "";
        }
        let chatbox = plotspr.scene.sprites["dialog-box1"];
        if (chatbox && chatbox.custom) chatbox.custom.status = "wait";
        let idx = 0, posX = left, posY = top;
        for (let line of lines) {
            idx++;
            let item = scene.getFreeSprite("answer-box1");
            let text = scene.getFreeSprite("answer-text1");
            let itemDisplay = item.get("display").object;
            let textDisplay = text.get("display").object;
            itemDisplay.x = posX;
            itemDisplay.y = posY;
            if (!item.custom) item.custom = {};
            item.custom.flag = idx;
            item.active = true;
            textDisplay.x = posX + this.textRelativeX;
            textDisplay.y = posY + this.textRelativeY;
            textDisplay.text = line;
            text.active = true;
            if (idx == 1) {
                let cursor = scene.sprites["answer-cursor1"];
                if (!cursor.custom) cursor.custom = {};
                cursor.custom.flag = idx;
                let cursorDisplay = cursor.get("display").object;
                cursorDisplay.x = posX + this.cursorRelativeX;
                cursorDisplay.y = posY + this.cursorRelativeY;
                cursor.active = true;
            }
            posY += gap;
        }
        this.answering = true;
    }

    close() {
        let spr = (this as any).owner;
        //let sprName = spr.origin ? spr.origin.name : spr.name;
        let pool = spr.scene.pools["answer-box1"];
        for (let item of pool) {
            item.active = false;
            if (item.custom) item.custom.flag = 0;
        }
        let pool2 = spr.scene.pools["answer-text1"];
        for (let item of pool2) item.active = false;
        let cursor = spr.scene.sprites["answer-cursor1"];
        cursor.custom.flag = 0;
        cursor.active = false;
        this.answering = false;
    }

    getChoice() {
        return this.selected;
    }

    isAnswering() {
        return this.answering;
    }

    moveCursorTo(spr) {
        if (!spr || !spr.active) return;
        let cursor = spr.scene.sprites["answer-cursor1"];
        if (!cursor || !cursor.active) return;
        let cursorDisplay = cursor.get("display").object;
        let item = spr;
        let itemDisplay = item.get("display").object;
        cursorDisplay.x = itemDisplay.x + this.cursorRelativeX;
        cursorDisplay.y = itemDisplay.y + this.cursorRelativeY;
        cursor.custom.flag = item.custom.flag;
    }

    moveCursor(dir: string = "down") {
        let spr = (this as any).owner;
        let cursor = spr.scene.sprites["answer-cursor1"];
        if (!cursor || !cursor.active) return;
        let delta = 0;
        if (dir == "down") delta++;
        else if (dir == "up") delta--;
        if (delta == 0) return;
        let idx = 0, gap = 0, firstY = 0, lastY = 0;
        let pool = spr.scene.pools["answer-box1"];
        for (let item of pool) {
            if (item.active && item.custom && item.custom.flag > 0) {
                idx++;
                let itemDisplay = item.get("display").object;
                if (idx == 1) firstY = itemDisplay.y + this.cursorRelativeY;
                if (idx == 2) gap = itemDisplay.y - lastY;
                lastY = itemDisplay.y;
            }
        }
        lastY += this.cursorRelativeY;
        let cursorDisplay = cursor.get("display").object;
        if (delta < 0) {
            let newY = cursorDisplay.y - gap;
            if (newY < firstY) {
                newY = lastY;
                cursorDisplay.y = newY;
                cursor.custom.flag = idx;
            } else {
                cursorDisplay.y = newY;
                cursor.custom.flag -= 1;
            }
        } else if (delta > 0) {
            let newY = cursorDisplay.y + gap;
            if (newY > lastY) {
                newY = firstY;
                cursorDisplay.y = newY;
                cursor.custom.flag = 1;
            } else {
                cursorDisplay.y = newY;
                cursor.custom.flag += 1;
            }
        }
    }

    selectAnswer(spr) {
        let flag = spr && spr.custom ? spr.custom.flag : 0;
        this.selected = flag;
        this.close();
        let chatmsg = spr.scene.sprites["dialog-text1"];
        if (chatmsg) chatmsg.code.onDisplayDone(false);
        let chatbox = spr.scene.sprites["dialog-box1"];
        if (chatbox) chatbox.code.next("vnt-answer");
    }

    onPointerdown(spr, event) {
        this.moveCursorTo(spr);
	}
    
    onPointerup(spr, event) {
        this.selectAnswer(spr);
	}

}
