/**
 * Space 服务 - 工作空间的增删改查
 */

import type { Space, CreateSpaceParams, UpdateSpaceParams } from '../types'
import { getStorage, setStorage } from '../utils/storage'

/**
 * 获取所有工作空间
 */
export async function getAllSpaces(): Promise<Space[]> {
  const storage = await getStorage()
  return storage.spaces
}

/**
 * 根据 ID 获取工作空间
 */
export async function getSpaceById(id: string): Promise<Space | null> {
  const storage = await getStorage()
  return storage.spaces.find((space) => space.id === id) || null
}

/**
 * 获取当前激活的工作空间
 */
export async function getActiveSpace(): Promise<Space | null> {
  const storage = await getStorage()
  if (!storage.activeSpaceId) return null
  return storage.spaces.find((space) => space.id === storage.activeSpaceId) || null
}

/**
 * 创建工作空间
 */
export async function createSpace(params: CreateSpaceParams): Promise<Space> {
  const storage = await getStorage()

  const now = Date.now()
  const maxOrder = storage.spaces.reduce((max, space) => Math.max(max, space.order), 0)

  const newSpace: Space = {
    id: generateId(),
    name: params.name,
    description: params.description,
    icon: params.icon,
    color: params.color,
    groups: [],
    active: false,
    order: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  }

  storage.spaces.push(newSpace)
  await setStorage(storage)

  return newSpace
}

/**
 * 更新工作空间
 */
export async function updateSpace(id: string, params: UpdateSpaceParams): Promise<Space | null> {
  const storage = await getStorage()
  const index = storage.spaces.findIndex((space) => space.id === id)

  if (index === -1) return null

  storage.spaces[index] = {
    ...storage.spaces[index],
    ...params,
    updatedAt: Date.now(),
  }

  await setStorage(storage)
  return storage.spaces[index]
}

/**
 * 删除工作空间
 */
export async function deleteSpace(id: string): Promise<boolean> {
  const storage = await getStorage()
  const initialLength = storage.spaces.length

  storage.spaces = storage.spaces.filter((space) => space.id !== id)

  // 如果删除的是当前激活的工作空间，清除激活状态
  if (storage.activeSpaceId === id) {
    storage.activeSpaceId = null
  }

  if (storage.spaces.length < initialLength) {
    await setStorage(storage)
    return true
  }

  return false
}

/**
 * 设置激活的工作空间
 */
export async function setActiveSpace(id: string): Promise<void> {
  const storage = await getStorage()

  // 取消所有工作空间的激活状态
  storage.spaces.forEach((space) => {
    space.active = space.id === id
  })

  storage.activeSpaceId = id
  await setStorage(storage)
}

/**
 * 更新工作空间排序
 */
export async function reorderSpaces(spaceIds: string[]): Promise<void> {
  const storage = await getStorage()
  const spaceMap = new Map(storage.spaces.map((space) => [space.id, space]))

  storage.spaces = spaceIds
    .map((id) => spaceMap.get(id))
    .filter((space): space is Space => space !== undefined)

  // 更新排序权重
  storage.spaces.forEach((space, index) => {
    space.order = index
  })

  await setStorage(storage)
}

// ==================== 辅助函数 ====================

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `space_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
