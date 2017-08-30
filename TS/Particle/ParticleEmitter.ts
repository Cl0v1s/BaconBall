interface ParticleEmitterConfiguration
{
    x : number; 
    y : number;
    life : number;
    particleLife : number;
    particleSpeed : number;
    frequency? : number;
    angleMax : number;
    sizeRandom? : boolean;
    sizeMax? : number;
    zone? : PIXI.Rectangle;

}


class ParticleEmitter
{
    private particlePool : Array<Particle> = [];
    
    private totalParticles : number = 25;
    public container : PIXI.particles.ParticleContainer;

    public config : ParticleEmitterConfiguration;

    private life : number;
    private id : number;

    private frequency : number = 0;

    private scene : SceneGame;

    private callback : Function = null;

    public static create(scene, texture : PIXI.Texture, config : ParticleEmitterConfiguration, callback? : Function, totalParticles?  : number)
    {
        let em = new ParticleEmitter();
        em.callback = callback;
        em.scene = scene;
        em.config = config;
        em.life = em.config.life;
        em.container = new PIXI.particles.ParticleContainer;
        if(totalParticles != null)
            em.totalParticles = totalParticles;
        for(let i = 0; i < em.totalParticles; i++)
        {
            em.particlePool.push(new Particle(texture));
        }
        em.id = em.scene.registerParticleEmitter(em);
        console.log(em.config.zone);
        return em;
    }

    private createParticle() : void 
    {
        let particle = this.getFreeParticeFromPool();
        if(particle == null)
            return;
        let angle = Math.random() * this.config.angleMax;
        angle -= 90;

        let x = this.config.x;
        let y = this.config.y;
        
        if(this.config.zone != null)
        {
            x += Math.floor(Math.random() * this.config.zone.width);
            y += Math.floor(Math.random() * this.config.zone.height);            
        }


        particle.set(
            x, y, this.config.particleLife, this.config.particleSpeed, angle,
            this.config.sizeRandom, this.config.sizeMax
        );
        this.container.addChild(particle.sprite);
    }

    public destroy(execute : boolean = true)
    {
        if(this.callback != null && execute)
            this.callback();
        this.scene.unregisterParticleEmitter(this.id);
        this.container.destroy({children: true});
    }

    public update(delta : number)
    {
        if(this.life != Infinity)
            this.life -= delta;

        this.frequency -= delta;
        if(this.frequency <= 0)
        {
            this.createParticle();
            this.frequency = this.config.frequency != null ? this.config.frequency : 0;
        }   
        if(this.life < 0)
        {
            this.destroy();
            return;
        }
        for(let i = 0; i < this.totalParticles; i++)
        {
            if(!this.particlePool[i].Ready())
            {
                this.particlePool[i].update(delta);    
                if(this.particlePool[i].Ready())
                    this.container.removeChild(this.particlePool[i].sprite);          
            }
        }
    }

    private getFreeParticeFromPool() : Particle
    {
        for(let i = 0; i < this.totalParticles; i++)
        {
            if(this.particlePool[i].Ready())
                return this.particlePool[i];
        }
        return null;
    }
}