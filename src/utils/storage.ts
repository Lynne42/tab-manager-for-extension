/**
 * Chrome Storage 封装
 * 提供类型安全的存储操作
 */

import type { TabManagerStorage } from '../types'

const STORAGE_KEY = 'tab_manager_data'

/**
 * 获取存储的所有数据
 */
export async function getStorage(): Promise<TabManagerStorage> {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  return result[STORAGE_KEY] || { spaces: [], activeSpaceId: null, version: 1 }
}

/**
 * 保存数据到存储
 */
export async function setStorage(data: TabManagerStorage): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: data })
}

/**
 * 清空所有存储数据
 */
export async function clearStorage(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY)
}

/**
 * 监听存储变化
 */
export function onStorageChanged(
  callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void
): void {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes[STORAGE_KEY]) {
      callback(changes)
    }
  })
}
