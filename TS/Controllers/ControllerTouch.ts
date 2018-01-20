class ControllerTouch implements Controller
{
    player: EntityPlayer;
    private canvas : HTMLCanvasElement;
    private bounds : PIXI.Rectangle;
    private timer;
    private touch : Touch;
        constructor(player: EntityPlayer, bounds : PIXI.Rectangle) {
            this.player = player;
            this.bounds = bounds;
            
            

            document.getElementById("touch").addEventListener("touchstart", (e) => {
                for(let i = 0; i < e.changedTouches.length; i++)
                    this.start(e.changedTouches[i]);   
            }, true);

            document.getElementById("touch").addEventListener("touchmove", (e) => {
                for(let i = 0; i < e.changedTouches.length; i++)
                    this.move(e.changedTouches[i]);   
            }, true);
           
            /*document.getElementById("touch").addEventListener("touchend", (e) => {
                for(let i = 0; i < e.changedTouches.length; i++)
                    this.end(e.changedTouches[i]);   
            }, true);
            document.getElementById("touch").addEventListener("touchcancel", (e) => {
                for(let i = 0; i < e.changedTouches.length; i++)
                    this.end(e.changedTouches[i]);   
            }, true);*/

        }

        private start(e : Touch) : void 
        {
            let coords = {
                x : e.clientX,
                y : e.clientY
            };
            if(!(coords.x >= this.bounds.x && coords.x <= this.bounds.x + this.bounds.width && coords.y >= this.bounds.y && coords.y <= this.bounds.y + this.bounds.height))
                return;
            this.touch = e;
        }

        private move(e : Touch) : void 
        {
            if(this.touch == null || e.identifier != this.touch.identifier)
                return;
            let coords = {
                x : e.clientX - this.touch.clientX,
                y : e.clientY - this.touch.clientY
            };
            console.log(coords);
            if(Math.abs(coords.x) > Math.abs(coords.y))
            {
                if(coords.x < 0)
                    this.left();
                else if(coords.x > 0)
                    this.right() 
            }
            else if(Math.abs(coords.x) < Math.abs(coords.y))
            {
                if(coords.y < 0)
                    this.up();
                else if(coords.y > 0)
                    this.down();  
                /*console.log(this.bounds.y >= Program.GetInstance().App().renderer.height / 2);
                if(this.bounds.y >= Program.GetInstance().App().renderer.height / 2)
                {
                    if(coords.y < 0)
                        this.up();
                    else if(coords.y > 0)
                        this.down();
                }
                else 
                    {
                        if(coords.y > 0)
                            this.up();
                        else if(coords.y < 0)
                            this.down();    
                    }*/
            }
             /*   {
                    this.up();
                    return;
                }   
                {
                    this.down();
                    return;
                }   
                {
                   this.right();
                   return; 
                }  
                {
                    this.left(); 
                    return;
                }*/
        }

        private end(e : Touch = null) : void 
        {
            console.log(e);
            
            if(e != null && (this.touch != null && this.touch.identifier != e.identifier))
                return;
            this.touch = null;
            clearInterval(this.timer);
            this.timer = null;
        }


        left(): void {
            this.end();
            this.timer = setInterval(() => {
                this.player.moveLeft();                
            }, 20);
        }
    
        right(): void {
            this.end();
            this.timer = setInterval(() => {
                this.player.moveRight();                
            }, 20);
        }
    
        up(): void {
            this.end();
            
            this.timer = setInterval(() => {
                this.player.moveUp();                
            }, 20);
        }
    
        down(): void {
            this.end();
            
            this.timer = setInterval(() => {
                this.player.moveDown();                
            }, 20);
        }
    
        action(): void {
    
        }

        public cancel() : void 
        {
            clearInterval(this.timer);
            this.timer = null;

        }
}