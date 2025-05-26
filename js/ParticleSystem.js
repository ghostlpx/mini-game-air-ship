export default class ParticleSystem {
  constructor() {
    this.particles = []
  }
  
  addBurst(x, y, color) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        maxLife: 0.8 + Math.random() * 0.4,
        size: 2 + Math.random() * 4,
        color: color || '#00ffff'
      })
    }
  }
  
  addTrail(x, y, color) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 2,
      life: 1,
      maxLife: 0.5 + Math.random() * 0.3,
      size: 1 + Math.random() * 2,
      color: color || '#4FC3F7'
    })
  }
  
  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]
      
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life -= deltaTime / 1000 / particle.maxLife
      
      // 应用重力
      particle.vy += 0.1
      
      // 应用阻力
      particle.vx *= 0.98
      particle.vy *= 0.98
      
      if (particle.life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }
  
  render(ctx) {
    for (let particle of this.particles) {
      ctx.save()
      ctx.globalAlpha = particle.life
      
      // 创建发光效果
      ctx.shadowColor = particle.color
      ctx.shadowBlur = 10
      
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }
  }
  
  clear() {
    this.particles = []
  }
} 