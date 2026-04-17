import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getStorage, setStorage, clearStorage, onStorageChanged } from './storage'
import type { TabManagerStorage } from '../types'

describe('Storage Utils', () => {
  beforeEach(() => {
    // 重置并模拟全局 chrome 对象
    globalThis.chrome = {
      storage: {
        local: {
          get: vi.fn(),
          set: vi.fn(),
          remove: vi.fn(),
        },
        onChanged: {
          addListener: vi.fn(),
        },
      },
    } as any
  })

  it('should get storage with default fallback', async () => {
    // 模拟 chrome.storage.local.get 返回空数据
    ;(globalThis.chrome.storage.local.get as any).mockResolvedValueOnce({})

    const data = await getStorage()

    // 验证返回值是否包含了默认 fallback 形态
    expect(globalThis.chrome.storage.local.get).toHaveBeenCalledWith('tab_manager_data')
    expect(data).toEqual({ spaces: [], activeSpaceId: null, version: 1 })
  })

  it('should set storage successfully', async () => {
    const mockData: TabManagerStorage = {
      spaces: [],
      activeSpaceId: null,
      version: 1,
    }

    await setStorage(mockData)

    // 验证传给 chrome.storage.local.set 的结构是否被包裹在 tab_manager_data key 中
    expect(globalThis.chrome.storage.local.set).toHaveBeenCalledWith({
      tab_manager_data: mockData,
    })
  })

  it('should clear storage using the correct key', async () => {
    await clearStorage()

    expect(globalThis.chrome.storage.local.remove).toHaveBeenCalledWith('tab_manager_data')
  })

  it('should only trigger callback when local storage changes on correct key', () => {
    const mockCallback = vi.fn()
    onStorageChanged(mockCallback)

    // 获取被注册的 listener 函数
    const registeredListener = vi.mocked(globalThis.chrome.storage.onChanged.addListener).mock
      .calls[0][0]

    // 模拟错误的 areaName
    registeredListener({ tab_manager_data: { newValue: null } } as any, 'sync')
    expect(mockCallback).not.toHaveBeenCalled()

    // 模拟正确的 areaName，但是错误的 key
    registeredListener({ some_other_key: { newValue: null } } as any, 'local')
    expect(mockCallback).not.toHaveBeenCalled()

    // 模拟正确的 areaName 和 key
    const validChanges = { tab_manager_data: { newValue: {} } } as any
    registeredListener(validChanges, 'local')
    expect(mockCallback).toHaveBeenCalledWith(validChanges)
  })
})
