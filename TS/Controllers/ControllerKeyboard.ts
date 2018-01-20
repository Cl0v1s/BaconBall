/**
 * Created by clovis on 26/08/17.
 */
class ControllerKeyboard implements Controller {
    player: EntityPlayer;
    timer;

    constructor(player: EntityPlayer, upcode : number, downcode : number, leftcode : number, rightcode : number) {
        this.player = player;
        let left = this.left.bind(this);
        let right = this.right.bind(this);
        let up = this.up.bind(this);
        let down = this.down.bind(this);
        ControllerKeyboard.keyboard(leftcode).press = () => {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.left();
            }, 20);
        };
        ControllerKeyboard.keyboard(upcode).press = () => {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.up();
            }, 20);
        };
        ControllerKeyboard.keyboard(rightcode).press = () => {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.right();
            }, 20);
        };
        ControllerKeyboard.keyboard(downcode).press = () => {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.down();
            }, 20);
        };

        /*ControllerKeyboard.keyboard(leftcode).release = () => {
        };
        ControllerKeyboard.keyboard(upcode).release = () => {

        };
        ControllerKeyboard.keyboard(rightcode).release = () => {

        };
        ControllerKeyboard.keyboard(downcode).release = () => {
        };*/

    }

    private static keyboard(keyCode) {
        var key : any = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };

        //The `upHandler`
        key.upHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };

        //Attach event listeners
        window.addEventListener(
            "keydown", key.downHandler.bind(key), false
        );
        window.addEventListener(
            "keyup", key.upHandler.bind(key), false
        );
        return key;
    }

    left(): void {
        this.player.moveLeft();
    }

    right(): void {
        this.player.moveRight();
    }

    up(): void {
        this.player.moveUp();
    }

    down(): void {
        this.player.moveDown();
    }

    action(): void {

    }

    public cancel() : void 
    {
        clearInterval(this.timer);
        this.timer = null;
    }

}