/**
 * Tab 服务 - 标签的增删改查
 */

import type { Tab, CreateTabParams, UpdateTabParams } from '../types'
import { getStorage, setStorage } from '../utils/storage'

/**
 * 获取指定分组的所有标签
 */
export async function getTabsByGroupId(spaceId: string, groupId: string): Promise<Tab[]> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)
  const group = space?.groups.find((g) => g.id === groupId)
  return group?.tabs || []
}

/**
 * 根据 ID 获取标签
 */
export async function getTabById(spaceId: string, groupId: string, tabId: string): Promise<Tab | null> {
  const tabs = await getTabsByGroupId(spaceId, groupId)
  return tabs.find((tab) => tab.id === tabId) || null
}

/**
 * 根据 Chrome Tab ID 获取标签
 */
export async function getTabByChromeTabId(chromeTabId: number): Promise<Tab | null> {
  const storage = await getStorage()

  for (const space of storage.spaces) {
    for (const group of space.groups) {
      const tab = group.tabs.find((t) => t.chromeTabId === chromeTabId)
      if (tab) return tab
    }
  }
  return null
}

/**
 * 创建标签
 */
export async function createTab(
  spaceId: string,
  groupId: string,
  params: CreateTabParams
): Promise<Tab | null> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)

  if (!space) return null

  const group = space.groups.find((g) => g.id === groupId)
  if (!group) return null

  const now = Date.now()
  const newTab: Tab = {
    id: generateId(),
    groupId,
    url: params.url,
    title: params.title,
    favIconUrl: params.favIconUrl,
    description: params.description,
    status: params.status || 'idle',
    pinned: params.pinned || false,
    chromeTabId: params.chromeTabId,
    createdAt: now,
    updatedAt: now,
  }

  group.tabs.push(newTab)
  group.updatedAt = now
  space.updatedAt = now

  await setStorage(storage)
  return newTab
}

/**
 * 批量创建标签
 */
export async function createTabs(
  spaceId: string,
  groupId: string,
  tabsParams: CreateTabParams[]
): Promise<Tab[]> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)

  if (!space) return []

  const group = space.groups.find((g) => g.id === groupId)
  if (!group) return []

  const now = Date.now()
  const newTabs: Tab[] = tabsParams.map((params) => ({
    id: generateId(),
    groupId,
    url: params.url,
    title: params.title,
    favIconUrl: params.favIconUrl,
    description: params.description,
    status: params.status || 'idle',
    pinned: params.pinned || false,
    chromeTabId: params.chromeTabId,
    createdAt: now,
    updatedAt: now,
  }))

  group.tabs.push(...newTabs)
  group.updatedAt = now
  space.updatedAt = now

  await setStorage(storage)
  return newTabs
}

/**
 * 更新标签
 */
export async function updateTab(
  spaceId: string,
  groupId: string,
  tabId: string,
  params: UpdateTabParams
): Promise<Tab | null> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)

  if (!space) return null

  const group = space.groups.find((g) => g.id === groupId)
  if (!group) return null

  const tabIndex = group.tabs.findIndex((tab) => tab.id === tabId)
  if (tabIndex === -1) return null

  group.tabs[tabIndex] = {
    ...group.tabs[tabIndex],
    ...params,
    updatedAt: Date.now(),
  }

  group.updatedAt = Date.now()
  space.updatedAt = Date.now()

  await setStorage(storage)
  return group.tabs[tabIndex]
}

/**
 * 删除标签
 */
export async function deleteTab(spaceId: string, groupId: string, tabId: string): Promise<boolean> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)

  if (!space) return false

  const group = space.groups.find((g) => g.id === groupId)
  if (!group) return false

  const initialLength = group.tabs.length
  group.tabs = group.tabs.filter((tab) => tab.id !== tabId)

  if (group.tabs.length < initialLength) {
    group.updatedAt = Date.now()
    space.updatedAt = Date.now()
    await setStorage(storage)
    return true
  }

  return false
}

/**
 * 移动标签到另一个分组
 */
export async function moveTab(
  spaceId: string,
  fromGroupId: string,
  toGroupId: string,
  tabId: string
): Promise<Tab | null> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)

  if (!space) return null

  const fromGroup = space.groups.find((g) => g.id === fromGroupId)
  const toGroup = space.groups.find((g) => g.id === toGroupId)

  if (!fromGroup || !toGroup) return null

  const tabIndex = fromGroup.tabs.findIndex((tab) => tab.id === tabId)
  if (tabIndex === -1) return null

  const [tab] = fromGroup.tabs.splice(tabIndex, 1)
  tab.groupId = toGroupId
  tab.updatedAt = Date.now()

  toGroup.tabs.push(tab)

  fromGroup.updatedAt = Date.now()
  toGroup.updatedAt = Date.now()
  space.updatedAt = Date.now()

  await setStorage(storage)
  return tab
}

/**
 * 更新标签排序
 */
export async function reorderTabs(spaceId: string, groupId: string, tabIds: string[]): Promise<void> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)

  if (!space) return

  const group = space.groups.find((g) => g.id === groupId)
  if (!group) return

  const tabMap = new Map(group.tabs.map((tab) => [tab.id, tab]))

  group.tabs = tabIds
    .map((id) => tabMap.get(id))
    .filter((tab): tab is Tab => tab !== undefined)

  group.updatedAt = Date.now()
  space.updatedAt = Date.now()
  await setStorage(storage)
}

// ==================== 辅助函数 ====================

/**
 * 生成唯一 ID
 * @returns {string} 基于时间戳和随机字符生成的唯一ID
 */
function generateId(): string {
  return `tab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
