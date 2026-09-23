/**
 * Tab Manager Background Service Worker
 * 用于处理后台任务、监听浏览器事件以及支持 HMR
 */

console.log('[Tab Manager] Background Service Worker Initialized')

// 监听扩展安装/更新
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log('[Tab Manager] First-time installation detected')
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    console.log('[Tab Manager] Extension updated')
  }
})

// 预留：监听标签页事件 (后续可扩展)
// chrome.tabs.onCreated.addListener((tab) => { ... });
// chrome.tabs.onRemoved.addListener((tabId, removeInfo) => { ... });

export {}
