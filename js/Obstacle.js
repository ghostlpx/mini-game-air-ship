export default class Obstacle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.radius = 30
    this.rotation = 0
    this.rotationSpeed = 0.05 + Math.random() * 0.1
    this.glowIntensity = 0
    this.glowDirection = 1
  }
  
  update(deltaTime, speed) {
    this.y += speed * 100 * deltaTime / 1000 // 基于时间的移动，大幅降低速度
    this.rotation += this.rotationSpeed
    
    // 发光效果动画
    this.glowIntensity += this.glowDirection * 0.02
    if (this.glowIntensity >= 1) {
      this.glowDirection = -1
    } else if (this.glowIntensity <= 0) {
      this.glowDirection = 1
    }
  }
  
  render(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    
    // 外层发光
    const glowRadius = this.radius + 10 * this.glowIntensity
    const gradient = ctx.createRadialGradient(0, 0, this.radius, 0, 0, glowRadius)
    gradient.addColorStop(0, '#FF1744')
    gradient.addColorStop(0.7, '#FF5722')
    gradient.addColorStop(1, 'rgba(255, 23, 68, 0)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2)
    ctx.fill()
    
    // 主体（八边形）
    ctx.fillStyle = '#D32F2F'
    ctx.beginPath()
    const sides = 8
    for (let i = 0; i < sides; i++) {
      const angle = (i * Math.PI * 2) / sides
      const x = Math.cos(angle) * this.radius
      const y = Math.sin(angle) * this.radius
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    ctx.fill()
    
    // 边框
    ctx.strokeStyle = '#B71C1C'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 内部装饰
    ctx.fillStyle = '#FF5722'
    ctx.beginPath()
    ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = '#FF9800'
    ctx.beginPath()
    ctx.arc(0, 0, this.radius * 0.3, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}