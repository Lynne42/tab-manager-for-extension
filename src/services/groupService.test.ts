import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createGroup } from './groupService'
import type { TabManagerStorage } from '../types'

const STORAGE_KEY = 'tab_manager_data'

/** 构造带两个已有分组的存储数据 */
function buildStorage(): TabManagerStorage {
  return {
    spaces: [
      {
        id: 'space_1',
        groups: [
          { id: 'g_a', spaceId: 'space_1', order: 0, tabs: [] },
          { id: 'g_b', spaceId: 'space_1', order: 1, tabs: [] },
        ],
      },
    ],
    activeSpaceId: 'space_1',
    version: 1,
  } as unknown as TabManagerStorage
}

describe('groupService.createGroup', () => {
  let stored: TabManagerStorage

  beforeEach(() => {
    stored = buildStorage()
    globalThis.chrome = {
      storage: {
        local: {
          get: vi.fn().mockImplementation(async () => ({ [STORAGE_KEY]: stored })),
          set: vi.fn().mockImplementation(async (data: Record<string, TabManagerStorage>) => {
            stored = data[STORAGE_KEY]
          }),
        },
      },
    } as any
  })

  it('新分组插入列表首位，order 为 0，原有分组 order 依次后移', async () => {
    const created = await createGroup({ spaceId: 'space_1', name: 'new' })

    expect(created?.order).toBe(0)
    const groups = stored.spaces[0].groups
    expect(groups.map((g) => g.id)).toEqual([created!.id, 'g_a', 'g_b'])
    expect(groups.map((g) => g.order)).toEqual([0, 1, 2])
  })

  it('空间不存在时返回 null 且不写入', async () => {
    const created = await createGroup({ spaceId: 'missing', name: 'new' })

    expect(created).toBeNull()
    expect(globalThis.chrome.storage.local.set).not.toHaveBeenCalled()
  })
})
