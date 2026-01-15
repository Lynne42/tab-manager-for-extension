/**
 * Demo 数据初始化
 * 创建示例工作空间、分组和标签
 */

import type { TabManagerStorage } from '../types'
import { getStorage, setStorage } from '../utils/storage'
import { createSpace, setActiveSpace } from '../services/spaceService'
import { createGroup } from '../services/groupService'
import { createTabs } from '../services/tabService'

/**
 * 检查是否已初始化
 */
export async function isInitialized(): Promise<boolean> {
  const storage = await getStorage()
  return storage.spaces.length > 0
}

/**
 * 初始化 Demo 数据
 */
export async function initDemoData(): Promise<void> {
  // 如果已有数据，不再初始化
  if (await isInitialized()) {
    return
  }

  // 创建工作空间 1: 工作
  const workSpace = await createSpace({
    name: 'demo-workspace',
    description: 'demo workspace',
    icon: 'work',
    color: 'blue',
  })

  if (workSpace) {
    // 开发工具分组
    const devGroup = await createGroup({
      spaceId: workSpace.id,
      name: '开发工具',
      color: 'purple',
    })

    if (devGroup) {
      await createTabs(workSpace.id, devGroup.id, [
        {
          title: 'github',
          url: 'https://github.com',
          description: 'Code collaboration platform for developers',
        },
        {
          title: 'stackoverflow',
          url: 'https://stackoverflow.com',
          description: 'Q&A site for programmers',
        },
        {
          title: 'vite',
          url: 'https://vitejs.dev',
          description: 'Fast and lightweight build tool for modern web projects',
        },
      ])
    }

    // 文档分组
    const docsGroup = await createGroup({
      spaceId: workSpace.id,
      name: '文档',
      color: 'green',
    })

    if (docsGroup) {
      await createTabs(workSpace.id, docsGroup.id, [
        {
          title: 'developer',
          url: 'https://developer.mozilla.org',
          description: 'Web development documentation and tutorials',
          status: 'idle',
          pinned: false,
        },
        {
          title: 'react',
          url: 'https://react.dev',
          description: 'JavaScript library for building user interfaces',
          status: 'idle',
          pinned: false,
        },
      ])
    }
  }


  // 设置第一个工作空间为激活状态
  if (workSpace) {
    await setActiveSpace(workSpace.id)
  }

  console.log('Demo data initialized successfully!')
}

/**
 * 重置所有数据
 */
export async function resetData(): Promise<void> {
  const { clearStorage } = await import('../utils/storage')
  await clearStorage()
  await initDemoData()
}

/**
 * 导出所有数据为 JSON
 */
export async function exportData(): Promise<string> {
  const storage = await getStorage()
  return JSON.stringify(storage, null, 2)
}

/**
 * 从 JSON 导入数据
 */
export async function importData(jsonData: string): Promise<void> {
  const data: TabManagerStorage = JSON.parse(jsonData)
  await setStorage(data)
}
