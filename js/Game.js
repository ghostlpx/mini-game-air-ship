import Player from './Player.js'
import Obstacle from './Obstacle.js'
import EnergyOrb from './EnergyOrb.js'
import ParticleSystem from './ParticleSystem.js'
import Background from './Background.js'
import Storage from './Storage.js'
import AudioManager from './AudioManager.js'

export default class Game {
  constructor() {
    this.canvas = window.canvas
    this.ctx = window.context
    
    // 确保Canvas和Context存在
    if (!this.canvas || !this.ctx) {
      console.error('Canvas或Context未正确初始化')
      return
    }
    
    this.width = window.innerWidth || 375
    this.height = window.innerHeight || 667
    
    console.log(`游戏画布尺寸: ${this.width} x ${this.height}`)
    
    this.gameState = 'start' // start, playing, gameOver
    this.score = 0
    this.distance = 0
    this.speed = 2
    this.lastTime = 0
    
    this.highScore = Storage.getHighScore()
    this.bestDistance = Storage.getBestDistance()
    this.isNewRecord = false
    
    this.player = new Player(this.width / 2, this.height * 0.6)
    this.obstacles = []
    this.energyOrbs = []
    this.particles = new ParticleSystem()
    this.background = new Background(this.width, this.height)
    this.audioManager = new AudioManager()
    
    this.obstacleSpawnTimer = 0
    this.orbSpawnTimer = 0
    this.difficultyTimer = 0
  }
  
  init() {
    if (!this.canvas || !this.ctx) {
      console.error('游戏初始化失败：Canvas未准备好')
      return
    }
    
    console.log('游戏初始化开始')
    this.bindEvents()
    this.showStartScreen()
    this.gameLoop()
  }
  
  bindEvents() {
    wx.onTouchStart((e) => {
      if (this.gameState === 'start' || this.gameState === 'gameOver') {
        this.startGame()
      } else if (this.gameState === 'playing') {
        // 获取触摸位置的横坐标
        const touchX = e.touches[0].clientX
        
        // 跳跃
        this.player.jump()
        this.audioManager.playJump()
        
        // 设置目标横坐标 - 飞船飞到点击位置
        this.player.setTargetX(touchX)
      }
    })
  }
  
  startGame() {
    this.gameState = 'playing'
    this.score = 0
    this.distance = 0
    this.speed = 2
    this.isNewRecord = false
    this.obstacles = []
    this.energyOrbs = []
    this.particles.clear()
    this.player.reset(this.width / 2, this.height * 0.6)
    this.player.velocityY = -10 // 给玩家初始向上速度
    this.obstacleSpawnTimer = 0
    this.orbSpawnTimer = 0
    this.difficultyTimer = 0
    this.lastTime = Date.now() // 重置时间基准
  }
  
  update(deltaTime) {
    if (this.gameState !== 'playing') return
    
    // 更新距离和难度
    this.distance += this.speed * deltaTime / 1000
    this.difficultyTimer += deltaTime
    
    if (this.difficultyTimer > 5000) { // 每5秒增加难度
      this.speed += 0.2
      this.difficultyTimer = 0
    }
    
    // 更新玩家
    this.player.update(deltaTime)
    
    // 生成障碍物
    this.obstacleSpawnTimer += deltaTime
    if (this.obstacleSpawnTimer > 2500 - Math.min(this.speed * 50, 1000)) { // 延长初始安全时间
      this.spawnObstacle()
      this.obstacleSpawnTimer = 0
    }
    
    // 生成能量球
    this.orbSpawnTimer += deltaTime
    if (this.orbSpawnTimer > 2000) {
      this.spawnEnergyOrb()
      this.orbSpawnTimer = 0
    }
    
    // 更新障碍物
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i]
      obstacle.update(deltaTime, this.speed)
      
      if (obstacle.y > this.height + 50) {
        this.obstacles.splice(i, 1)
      } else if (this.checkCollision(this.player, obstacle)) {
        this.audioManager.playCrash()
        this.gameOver()
        return
      }
    }
    
    // 更新能量球
    for (let i = this.energyOrbs.length - 1; i >= 0; i--) {
      const orb = this.energyOrbs[i]
      orb.update(deltaTime, this.speed)
      
      if (orb.y > this.height + 50) {
        this.energyOrbs.splice(i, 1)
      } else if (this.checkCollision(this.player, orb)) {
        this.score += 10
        this.audioManager.playCollect()
        this.particles.addBurst(orb.x, orb.y, '#00ffff')
        this.energyOrbs.splice(i, 1)
      }
    }
    
    // 更新粒子系统
    this.particles.update(deltaTime)
    
    // 更新背景
    this.background.update(deltaTime, this.speed)
    
    // 检查玩家是否掉出屏幕
    if (this.player.y > this.height + 100) {
      this.gameOver()
    }
  }
  
  spawnObstacle() {
    const x = Math.random() * (this.width - 80) + 40
    this.obstacles.push(new Obstacle(x, -50))
  }
  
  spawnEnergyOrb() {
    const x = Math.random() * (this.width - 40) + 20
    this.energyOrbs.push(new EnergyOrb(x, -30))
  }
  
  checkCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x
    const dy = obj1.y - obj2.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < (obj1.radius + obj2.radius)
  }
  
  gameOver() {
    this.gameState = 'gameOver'
    
    // 保存最高分和最远距离
    const isNewHighScore = Storage.saveHighScore(this.score)
    const isNewBestDistance = Storage.saveBestDistance(Math.floor(this.distance))
    this.isNewRecord = isNewHighScore || isNewBestDistance
    
    // 更新本地记录
    this.highScore = Storage.getHighScore()
    this.bestDistance = Storage.getBestDistance()
    
    // 分享到微信
    try {
      wx.shareAppMessage({
        title: `我在星际跳跃中飞行了${Math.floor(this.distance)}米，获得${this.score}分！${this.isNewRecord ? '刷新了个人纪录！' : ''}`,
        imageUrl: '', // 可以添加游戏截图
      })
    } catch (e) {
      console.log('分享功能不可用')
    }
  }
  
  render() {
    if (!this.ctx) return
    
    // 清空画布
    this.ctx.fillStyle = '#000011'
    this.ctx.fillRect(0, 0, this.width, this.height)
    
    if (this.gameState === 'start') {
      this.renderStartScreen()
    } else if (this.gameState === 'playing') {
      this.renderGame()
    } else if (this.gameState === 'gameOver') {
      this.renderGameOver()
    }
  }
  
  renderStartScreen() {
    this.background.render(this.ctx)
    
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = 'bold 48px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('🚀 星际跳跃', this.width / 2, this.height / 2 - 120)
    
    this.ctx.font = '24px Arial'
    this.ctx.fillText('点击屏幕开始游戏', this.width / 2, this.height / 2 - 20)
    
    this.ctx.fillStyle = '#888888'
    this.ctx.font = '18px Arial'
    this.ctx.fillText('点击跳跃，避开障碍物，收集能量球', this.width / 2, this.height / 2 + 20)
    
    // 显示历史最佳记录
    this.ctx.fillStyle = '#FFD700'
    this.ctx.font = 'bold 20px Arial'
    this.ctx.fillText(`最高分: ${this.highScore}`, this.width / 2, this.height / 2 + 60)
    this.ctx.fillText(`最远距离: ${this.bestDistance}米`, this.width / 2, this.height / 2 + 90)
  }
  
  renderGame() {
    // 渲染背景
    this.background.render(this.ctx)
    
    // 渲染粒子效果
    this.particles.render(this.ctx)
    
    // 渲染障碍物
    this.obstacles.forEach(obstacle => obstacle.render(this.ctx))
    
    // 渲染能量球
    this.energyOrbs.forEach(orb => orb.render(this.ctx))
    
    // 渲染玩家
    this.player.render(this.ctx)
    
    // 渲染UI
    this.renderUI()
  }
  
  renderGameOver() {
    this.renderGame()
    
    // 半透明遮罩
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, 0, this.width, this.height)
    
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = 'bold 36px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('游戏结束', this.width / 2, this.height / 2 - 120)
    
    // 新纪录提示
    if (this.isNewRecord) {
      this.ctx.fillStyle = '#FFD700'
      this.ctx.font = 'bold 24px Arial'
      this.ctx.fillText('🎉 恭喜刷新纪录！', this.width / 2, this.height / 2 - 80)
    }
    
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '24px Arial'
    this.ctx.fillText(`本次得分: ${this.score}`, this.width / 2, this.height / 2 - 40)
    this.ctx.fillText(`飞行距离: ${Math.floor(this.distance)}米`, this.width / 2, this.height / 2 - 10)
    
    this.ctx.fillStyle = '#FFD700'
    this.ctx.font = '20px Arial'
    this.ctx.fillText(`最高分: ${this.highScore}`, this.width / 2, this.height / 2 + 30)
    this.ctx.fillText(`最远距离: ${this.bestDistance}米`, this.width / 2, this.height / 2 + 60)
    
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '20px Arial'
    this.ctx.fillText('点击屏幕重新开始', this.width / 2, this.height / 2 + 100)
  }
  
  renderUI() {
    // 得分
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = 'bold 24px Arial'
    this.ctx.textAlign = 'left'
    this.ctx.fillText(`得分: ${this.score}`, 20, 40)
    
    // 距离
    this.ctx.fillText(`距离: ${Math.floor(this.distance)}m`, 20, 70)
    
    // 速度指示器
    this.ctx.fillText(`速度: ${this.speed.toFixed(1)}x`, 20, 100)
    
    // 最高分（右上角）
    this.ctx.fillStyle = '#FFD700'
    this.ctx.textAlign = 'right'
    this.ctx.font = '18px Arial'
    this.ctx.fillText(`最高: ${this.highScore}`, this.width - 20, 40)
  }
  
  showStartScreen() {
    this.gameState = 'start'
  }
  
  gameLoop() {
    const currentTime = Date.now()
    const deltaTime = this.lastTime === 0 ? 16 : currentTime - this.lastTime
    this.lastTime = currentTime
    
    this.update(deltaTime)
    this.render()
    
    requestAnimationFrame(() => this.gameLoop())
  }
}