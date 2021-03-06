export class SceneDialogSpriteDialogMsg1 {

    history = [];
    current = [];

    defaultX   = 35;
    defaultY   = 45;
    lineHeight = 20;
    wordSpace  = 10;

    prepareCurrent(words: Array<string>, more: boolean, color: string, weight: string) {
        let msgspr = (this as any).owner;
        let x = this.defaultX, y = this.defaultY;
        for (let item of this.current) item.spr.active = false;
        //console.log(this.history);
        for (let i = 0; i < this.history.length; i++) {
            let item = this.history[i];
            item.spr.active = true;
            if (item.spr.nline) {
                x = this.defaultX;
                y += this.lineHeight;
                //console.log(x, y);
            } else {
                let mt = PIXI.TextMetrics.measureText(item.content, item.spr.get("display").object.style);
                x += mt.width + this.wordSpace;
                //console.log(x, y);
            }
        }
        this.current = [];
        for (let i = 0; i < words.length; i++) {
            let line = words[i];
            let txtspr = msgspr.scene.getFreeSprite("vnt-dialog-text1");
            let item = {
                spr: txtspr,
                content: line,
                nline: i != words.length - 1 || !more
            }
            txtspr.get("display").object.text = "";
            txtspr.get("display").object.style.fill = color;
            txtspr.get("display").object.style.fontWeight = weight;
            txtspr.get("display").object.x = x;
            txtspr.get("display").object.y = y;
            txtspr.active = true;
            this.current.push(item);
            x = this.defaultX;
            y += this.lineHeight;
        }
    }

    disableCurrent() {
        for (let item of this.current) {
            item.spr.active = false;
            item.spr.get("display").object.text = "";
        }
    }

    enableCurrent() {
        for (let item of this.current) {
            item.spr.active = true;
            item.spr.get("display").object.text = item.content;
        }
    }

    appendHistory() {
        this.history.push(...this.current);
    }

    clearHistory() {
        for (let item of this.history) item.spr.active = false;
        this.history = [];
    }

    updateText(speed:number = 50, more: boolean = false) {
        let textSpeed = speed;
        if (!textSpeed || textSpeed < 1) textSpeed = 1;
        if (textSpeed > 100) textSpeed = 100;
        let msgspr = (this as any).owner;
        for (let i = 0; i < this.current.length; i++) {
            let item = this.current[i];
            if (item.spr) {
                if (!item.spr.active) item.spr.active = true;
                let displayText = item.spr.get("display").object.text;
                let len = displayText.length;
                if (item.content.length > len) {
                    //let currentText = spr.custom.history ? spr.custom.history : "";
                    item.spr.get("display").object.text = item.content.substr(0, len+1);
                    item.spr.scene.timeout(10 * (100/textSpeed), () => this.updateText(textSpeed, more));
                    break;
                } else if (item.content.length == len) {
                    if (i < this.current.length - 1) continue;
                    else {
                        let chatbox = msgspr.scene.sprites["vnt-dialog-box1"];
                        chatbox.custom.more = more;
                        this.onDisplayDone();
                    }
                    
                }
            }
        }
        
    }

    onDisplayDone(showCursor: boolean = true, updateHistory: boolean = true) {
        let spr = (this as any).owner;
        let chatbox = spr.scene.sprites["vnt-dialog-box1"];
        let cursor = spr.scene.sprites["vnt-dialog-cursor1"];
        if (chatbox && cursor) {
            //console.log("onDisplayDone - ", spr.custom);
            if (chatbox.custom && chatbox.custom.more) {
                chatbox.custom.status = "more";
                if (updateHistory) this.appendHistory();
                chatbox.code.next();
            } else {
                if (showCursor) cursor.active = true;
                chatbox.custom.status = "done";
                //this.clearHistory();
                this.current.push(...this.history);
                this.history = [];
            }
        }
    }

}
