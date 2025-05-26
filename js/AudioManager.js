export default class AudioManager {
  constructor() {
    this.sounds = {}
    this.enabled = true
    this.init()
  }
  
  init() {
    // 由于微信小游戏的音频API限制，这里使用简单的音调生成
    this.audioContext = wx.createInnerAudioContext()
  }
  
  // 播放跳跃音效（使用振动代替）
  playJump() {
    if (!this.enabled) return
    
    try {
      wx.vibrateShort({
        type: 'light'
      })
    } catch (e) {
      console.log('振动不支持')
    }
  }
  
  // 播放收集音效
  playCollect() {
    if (!this.enabled) return
    
    try {
      wx.vibrateShort({
        type: 'medium'
      })
    } catch (e) {
      console.log('振动不支持')
    }
  }
  
  // 播放碰撞音效
  playCrash() {
    if (!this.enabled) return
    
    try {
      wx.vibrateLong()
    } catch (e) {
      console.log('振动不支持')
    }
  }
  
  // 开启/关闭音效
  setEnabled(enabled) {
    this.enabled = enabled
  }
  
  // 销毁音频上下文
  destroy() {
    if (this.audioContext) {
      this.audioContext.destroy()
    }
  }
} 