/**
 * Group 服务 - 分组的增删改查
 */

import type { Group, CreateGroupParams, UpdateGroupParams } from '../types'
import { getStorage, setStorage } from '../utils/storage'

/**
 * 获取指定工作空间的所有分组
 */
export async function getGroupsBySpaceId(spaceId: string): Promise<Group[]> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)
  return space?.groups || []
}

/**
 * 根据 ID 获取分组
 */
export async function getGroupById(spaceId: string, groupId: string): Promise<Group | null> {
  const groups = await getGroupsBySpaceId(spaceId)
  return groups.find((group) => group.id === groupId) || null
}

/**
 * 创建分组
 */
export async function createGroup(params: CreateGroupParams): Promise<Group | null> {
  const storage = await getStorage()
  const spaceIndex = storage.spaces.findIndex((space) => space.id === params.spaceId)

  if (spaceIndex === -1) return null

  const space = storage.spaces[spaceIndex]
  const maxOrder = space.groups.reduce((max, group) => Math.max(max, group.order), 0)

  const now = Date.now()
  const newGroup: Group = {
    id: generateId(),
    spaceId: params.spaceId,
    name: params.name,
    description: params.description,
    icon: params.icon,
    color: params.color,
    tabs: [],
    expanded: true,
    order: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  }

  space.groups.push(newGroup)
  space.updatedAt = now

  await setStorage(storage)
  return newGroup
}

/**
 * 更新分组
 */
export async function updateGroup(
  spaceId: string,
  groupId: string,
  params: UpdateGroupParams
): Promise<Group | null> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)

  if (!space) return null

  const groupIndex = space.groups.findIndex((group) => group.id === groupId)
  if (groupIndex === -1) return null

  space.groups[groupIndex] = {
    ...space.groups[groupIndex],
    ...params,
    updatedAt: Date.now(),
  }

  space.updatedAt = Date.now()
  await setStorage(storage)

  return space.groups[groupIndex]
}

/**
 * 删除分组
 */
export async function deleteGroup(spaceId: string, groupId: string): Promise<boolean> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)

  if (!space) return false

  const initialLength = space.groups.length
  space.groups = space.groups.filter((group) => group.id !== groupId)

  if (space.groups.length < initialLength) {
    space.updatedAt = Date.now()
    await setStorage(storage)
    return true
  }

  return false
}

/**
 * 切换分组展开状态
 */
export async function toggleGroupExpanded(spaceId: string, groupId: string): Promise<Group | null> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)

  if (!space) return null

  const group = space.groups.find((g) => g.id === groupId)
  if (!group) return null

  group.expanded = !group.expanded
  space.updatedAt = Date.now()

  await setStorage(storage)
  return group
}

/**
 * 更新分组排序
 */
export async function reorderGroups(spaceId: string, groupIds: string[]): Promise<void> {
  const storage = await getStorage()
  const space = storage.spaces.find((s) => s.id === spaceId)

  if (!space) return

  const groupMap = new Map(space.groups.map((group) => [group.id, group]))

  space.groups = groupIds
    .map((id) => groupMap.get(id))
    .filter((group): group is Group => group !== undefined)

  space.groups.forEach((group, index) => {
    group.order = index
  })

  space.updatedAt = Date.now()
  await setStorage(storage)
}

// ==================== 辅助函数 ====================

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `group_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
