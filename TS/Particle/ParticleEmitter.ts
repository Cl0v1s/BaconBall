interface ParticleEmitterConfiguration
{
    x : number; 
    y : number;
    life : number;
    particleLife : number;
    particleSpeed : number;
    angleMax : number;
    sizeRandom : boolean;
    sizeMax : number;
}


class ParticleEmitter
{
    private particlePool : Array<Particle> = [];
    
    private totalParticles : number = 25;
    public container : PIXI.particles.ParticleContainer;

    public config : ParticleEmitterConfiguration;

    private life : number;
    private id : number;

    private scene : SceneGame;

    public static create(scene, texture : PIXI.Texture, config : ParticleEmitterConfiguration, totalParticles?  : number)
    {
        let em = new ParticleEmitter();
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
        return em;
    }

    private createParticle() : void 
    {
        let particle = this.getFreeParticeFromPool();
        if(particle == null)
            return;
        let angle = Math.random() * this.config.angleMax;
        angle -= 90;
        
        particle.set(
            this.config.x, this.config.y, this.config.particleLife, this.config.particleSpeed, angle,
            this.config.sizeRandom, this.config.sizeMax
        );
        this.container.addChild(particle.sprite);
    }

    public destroy()
    {
        this.scene.unregisterParticleEmitter(this.id);
        this.container.destroy({children: true});
    }

    public update(delta : number)
    {
        this.life -= delta;
        this.createParticle();
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