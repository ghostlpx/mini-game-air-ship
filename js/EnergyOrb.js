export default class EnergyOrb {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.radius = 15
    this.rotation = 0
    this.pulseScale = 1
    this.pulseDirection = 1
    this.sparkles = []
    
    // 创建闪烁粒子
    for (let i = 0; i < 6; i++) {
      this.sparkles.push({
        angle: (i * Math.PI * 2) / 6,
        distance: this.radius + 10,
        alpha: Math.random()
      })
    }
  }
  
  update(deltaTime, speed) {
    this.y += speed * 100 * deltaTime / 1000 // 与障碍物相同的移动速度
    this.rotation += 0.1
    
    // 脉冲动画
    this.pulseScale += this.pulseDirection * 0.03
    if (this.pulseScale >= 1.3) {
      this.pulseDirection = -1
    } else if (this.pulseScale <= 0.8) {
      this.pulseDirection = 1
    }
    
    // 更新闪烁粒子
    for (let sparkle of this.sparkles) {
      sparkle.angle += 0.05
      sparkle.alpha = 0.5 + 0.5 * Math.sin(Date.now() * 0.01 + sparkle.angle * 3)
    }
  }
  
  render(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    
    // 渲染闪烁粒子
    for (let sparkle of this.sparkles) {
      const sparkleX = Math.cos(sparkle.angle) * sparkle.distance
      const sparkleY = Math.sin(sparkle.angle) * sparkle.distance
      
      ctx.save()
      ctx.globalAlpha = sparkle.alpha
      ctx.fillStyle = '#00E5FF'
      ctx.beginPath()
      ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    
    ctx.scale(this.pulseScale, this.pulseScale)
    ctx.rotate(this.rotation)
    
    // 外层发光
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius + 15)
    glowGradient.addColorStop(0, '#00E5FF')
    glowGradient.addColorStop(0.5, '#0091EA')
    glowGradient.addColorStop(1, 'rgba(0, 229, 255, 0)')
    
    ctx.fillStyle = glowGradient
    ctx.beginPath()
    ctx.arc(0, 0, this.radius + 15, 0, Math.PI * 2)
    ctx.fill()
    
    // 主体能量球
    const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius)
    coreGradient.addColorStop(0, '#E1F5FE')
    coreGradient.addColorStop(0.7, '#00E5FF')
    coreGradient.addColorStop(1, '#0091EA')
    
    ctx.fillStyle = coreGradient
    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
    ctx.fill()
    
    // 内部高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.beginPath()
    ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.4, 0, Math.PI * 2)
    ctx.fill()
    
    // 能量环
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.arc(0, 0, this.radius * 0.7, 0, Math.PI * 2)
    ctx.stroke()
    
    ctx.restore()
  }
} 