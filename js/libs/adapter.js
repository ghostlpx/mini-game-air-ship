// 微信小游戏适配器辅助文件
if (!window.addEventListener) {
  window.addEventListener = function() {}
}

if (!window.removeEventListener) {
  window.removeEventListener = function() {}
}

// 兼容性处理
window.global = window
window.AudioContext = window.webkitAudioContext || window.AudioContext 

console.log('Adapter 辅助模块加载完成'); 