class ControllerTouch implements Controller
{
    player: EntityPlayer;
    private canvas : HTMLCanvasElement;
    private bounds : PIXI.Rectangle;
    private timer;
    private lastTouch : number = null;
        constructor(player: EntityPlayer, bounds : PIXI.Rectangle) {
            this.player = player;
            this.bounds = bounds;
            
            

            document.getElementById("touch").addEventListener("touchstart", (e) => {
                for(let i = 0; i < e.changedTouches.length; i++)
                    this.mousedown(e.changedTouches[i]);   
            }, true);
           

        }

        mouseup(e : Touch = null) : void 
        {
            if(e != null && e.identifier != this.lastTouch)
                return;
            clearInterval(this.timer);
            this.timer = null;
            this.lastTouch = null;
        }

        

        mousedown(e : Touch) : void 
        {
            let coords = {
                x : e.clientX,
                y : e.clientY
            };
            this.lastTouch = e.identifier;
            if(!(coords.x >= this.bounds.x && coords.x <= this.bounds.x + this.bounds.width && coords.y >= this.bounds.y && coords.y <= this.bounds.y + this.bounds.height))
                return;
            if(coords.x >= this.bounds.x + this.bounds.width/3 && coords.x <= this.bounds.x + this.bounds.width - this.bounds.width / 3 && coords.y < this.bounds.y + this.bounds.height /2 )
            {
                this.up();
                return;
            }   
            if(coords.x >= this.bounds.x + this.bounds.width/3 && coords.x <= this.bounds.x + this.bounds.width - this.bounds.width / 3 && coords.y > this.bounds.y + this.bounds.height /2 )
            {
                this.down();
                return;
            }   
            if(coords.x >= this.bounds.x + this.bounds.width/3)
            {
               this.right(); 
            }  
            if(coords.x <= this.bounds.x + this.bounds.width - this.bounds.width/3)
            {
                this.left(); 
            }
        }



    
       
    
        left(): void {
            this.mouseup();
            this.timer = setInterval(() => {
                this.player.moveLeft();                
            }, 20);
        }
    
        right(): void {
            this.mouseup();
            this.timer = setInterval(() => {
                this.player.moveRight();                
            }, 20);
        }
    
        up(): void {
            this.mouseup();
            this.timer = setInterval(() => {
                this.player.moveUp();                
            }, 20);
        }
    
        down(): void {
            this.mouseup();
            this.timer = setInterval(() => {
                this.player.moveDown();                
            }, 20);
        }
    
        action(): void {
    
        }
}