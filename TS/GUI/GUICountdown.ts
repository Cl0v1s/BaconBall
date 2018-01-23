class GUICountdown implements GUI 
{
    private counter : number;
    private oldCounter : number;
    private timer;

    constructor()
    {
        this.counter = 0;
        this.oldCounter = 0;
        this.timer = null;
    }

    public start(counter : number) : void 
    {
        this.counter = counter;
        this.timer = window.setInterval(() => {
            this.tick();
        })
    }

    private tick() : void 
    {
        this.counter--;
        if(this.counter <= 0)
        {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    update(): void {
        if(this.oldCounter != this.counter)
        {
            //TODO: particles
        }
        this.oldCounter = this.counter;

        if(this.counter < 0)
            this.destroy();
    }
    destroy(): void {
    }
    
}