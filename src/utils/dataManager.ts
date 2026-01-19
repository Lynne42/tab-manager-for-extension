/**
 * 数据导入导出工具
 */

import type { TabManagerStorage, Space, Group, Tab } from '../types'

/**
 * 创建导出用的数据结构，过滤掉不必要的字段
 * @param {TabManagerStorage} data - 完整的存储数据
 * @returns {any} 过滤后的导出数据结构
 */
function createExportData(data: TabManagerStorage): any {
  const filteredSpaces = data.spaces.map(space => ({
    name: space.name,
    description: space.description,
    icon: space.icon,
    color: space.color,
    groups: space.groups
      .filter(group => group.tabs.length > 0) // 只包含有标签的分组
      .map(group => ({
        name: group.name,
        description: group.description,
        icon: group.icon,
        color: group.color,
        tabs: group.tabs.map(tab => ({
          url: tab.url,
          title: tab.title,
          favIconUrl: tab.favIconUrl,
          description: tab.description,
          status: tab.status,
          pinned: tab.pinned,
        }))
      }))
  }))

  return {
    spaces: filteredSpaces,
    activeSpaceId: data.activeSpaceId,
    version: data.version,
    exportTime: new Date().toISOString(),
    exportedFrom: 'Tab Manager',
  }
}

/**
 * 导出数据为 JSON 文件
 */
export function exportData(data: TabManagerStorage, filename: string = 'tab-manager-backup.json') {
  try {
    // 创建过滤后的数据
    const exportDataObj = createExportData(data)

    // 创建 JSON 字符串
    const jsonString = JSON.stringify(exportDataObj, null, 2)

    // 创建 Blob
    const blob = new Blob([jsonString], { type: 'application/json' })

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log('Data exported successfully')
  } catch (error) {
    console.error('Failed to export data:', error)
    throw new Error('Failed to export data')
  }
}

/**
 * 生成 UUID
 * @returns {string} 随机生成的 UUID 字符串
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 生成当前时间戳
 * @returns {number} 当前时间的 Unix 时间戳
 */
function generateTimestamp(): number {
  return Date.now()
}

/**
 * 将嵌套的导入格式转换为 TabManagerStorage 格式（生成新ID）
 */
export function convertImportFormatToStorage(importData: any): { spaces: Space[], maxOrder: number } {
  const spaces: Space[] = []
  let maxOrder = 0

  // 处理每个 space
  // 处理新的导出格式（直接返回 spaces 数组）
  const spacesArray = Array.isArray(importData) ? importData : importData.spaces || []

  spacesArray.forEach((spaceData: any) => {
    // 生成新的 Space ID（忽略导入中的ID）
    const spaceId = generateUUID()

    // 如果有现有的空间，找到最大的 order
    maxOrder = Math.max(maxOrder, spaceData.order || 0)

    // 创建 Space
    const space: Space = {
      id: spaceId,
      name: spaceData.name,
      description: spaceData.description || '',
      icon: 'workspace', // 默认图标
      color: 'blue', // 默认颜色
      groups: [], // 将在后面填充
      active: false,
      order: maxOrder + 1, // 新空间放在最后
      createdAt: generateTimestamp(),
      updatedAt: generateTimestamp(),
    }

    // 处理每个 group
    spaceData.groups.forEach((groupData: any, groupIndex: number) => {
      // 跳过没有 tabs 的分组
      if (!groupData.tabs || groupData.tabs.length === 0) {
        console.log(`Skipping group "${groupData.name}" because it has no tabs`)
        return
      }

      // 生成新的 Group ID（忽略导入中的ID）
      const groupId = generateUUID()

      // 创建 Group
      const group: Group = {
        id: groupId,
        spaceId: spaceId,
        name: groupData.name,
        description: groupData.description || undefined,
        icon: groupData.icon || undefined,
        color: groupData.color || undefined,
        tabs: [], // 将在后面填充
        expanded: true,
        order: groupIndex,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp(),
      }

      // 处理每个 tab
      groupData.tabs.forEach((tabData: any) => {
        // 生成新的 Tab ID（忽略导入中的ID）
        const tabId = generateUUID()

        // 自动推导 favicon URL（如果没有提供）
        let favIconUrl = tabData.favIconUrl
        if (!favIconUrl && tabData.url) {
          try {
            const url = new URL(tabData.url)
            favIconUrl = `${url.origin}/favicon.ico`
          } catch {
            // 如果 URL 无效，保持原样
          }
        }

        // 创建 Tab
        const tab: Tab = {
          id: tabId,
          groupId: groupId,
          url: tabData.url,
          title: tabData.title,
          favIconUrl: favIconUrl,
          description: tabData.description,
          status: tabData.status || 'idle',
          pinned: tabData.pinned || false,
          createdAt: generateTimestamp(),
          updatedAt: generateTimestamp(),
        }

        group.tabs.push(tab)
      })

      space.groups.push(group)
    })

    spaces.push(space)
    maxOrder = space.order
  })

  return { spaces, maxOrder }
}

/**
 * 计算导入数据的统计信息（包括被跳过的空分组）
 */
export function calculateImportStats(importData: any): {
  totalSpaces: number
  totalGroups: number
  totalTabs: number
  skippedGroups: number
  skippedSpaces: number
} {
  let totalSpaces = 0
  let totalGroups = 0
  let totalTabs = 0
  let skippedGroups = 0
  let skippedSpaces = 0

  // 处理新的导出格式（直接返回 spaces 数组）
  const spacesArray = Array.isArray(importData) ? importData : importData.spaces || []

  spacesArray.forEach((spaceData: any) => {
    totalSpaces++

    let spaceHasValidGroups = false
    if (spaceData.groups && Array.isArray(spaceData.groups)) {
      spaceData.groups.forEach((groupData: any) => {
        totalGroups++

        if (groupData.tabs && Array.isArray(groupData.tabs) && groupData.tabs.length > 0) {
          totalTabs += groupData.tabs.length
          spaceHasValidGroups = true
        } else {
          skippedGroups++
        }
      })
    }

    if (!spaceHasValidGroups) {
      skippedSpaces++
    }
  })

  return {
    totalSpaces,
    totalGroups,
    totalTabs,
    skippedGroups,
    skippedSpaces
  }
}

/**
 * 将导入的数据合并到现有存储中
 */
export function mergeImportedData(existingData: TabManagerStorage, importedSpaces: Space[]): TabManagerStorage {
  const mergedSpaces = [...existingData.spaces]

  // 添加导入的空间
  importedSpaces.forEach(importedSpace => {
    // 检查是否已存在同名空间
    const existingSpace = mergedSpaces.find(s => s.name === importedSpace.name)

    if (existingSpace) {
      // 如果存在同名空间，合并其分组
      importedSpace.groups.forEach(importedGroup => {
        // 跳过没有 tabs 的分组
        if (importedGroup.tabs.length === 0) {
          console.log(`Skipping merged group "${importedGroup.name}" because it has no tabs`)
          return
        }
        // 检查是否已存在同名分组
        const existingGroup = existingSpace.groups.find(g => g.name === importedGroup.name)

        if (existingGroup) {
          // 合并标签
          importedGroup.tabs.forEach(importedTab => {
            // 检查是否已存在相同URL的标签
            const existingTab = existingGroup.tabs.find(t => t.url === importedTab.url)
            if (!existingTab) {
              // 添加新标签
              existingGroup.tabs.push({
                ...importedTab,
                id: generateUUID(),
                groupId: existingGroup.id,
                createdAt: generateTimestamp(),
                updatedAt: generateTimestamp(),
              })
            }
          })
        } else {
          // 添加新分组
          existingSpace.groups.push({
            ...importedGroup,
            id: generateUUID(),
            spaceId: existingSpace.id,
            createdAt: generateTimestamp(),
            updatedAt: generateTimestamp(),
          })
        }
      })
    } else {
      // 添加新空间
      // 过滤掉没有 tabs 的分组
      const filteredGroups = importedSpace.groups.filter(group => group.tabs.length > 0)
      if (filteredGroups.length > 0) {
        mergedSpaces.push({
          ...importedSpace,
          groups: filteredGroups
        })
      } else {
        console.log(`Skipping space "${importedSpace.name}" because it has no groups with tabs`)
      }
    }
  })

  // 更新版本号
  const newVersion = existingData.version ? existingData.version + 1 : 1

  return {
    ...existingData,
    spaces: mergedSpaces,
    version: newVersion,
    lastSyncAt: generateTimestamp(),
  }
}

/**
 * 从文件导入数据（返回转换后的空间，不合并到存储）
 */
export async function importData(file: File): Promise<{ spaces: Space[], maxOrder: number }> {
  try {
    const text = await file.text()
    const spacesData = parseImportDataForConversion(text)

    // 验证数据格式
    if (!spacesData || !Array.isArray(spacesData)) {
      throw new Error('Invalid data format: spaces array is required')
    }

    // 转换为内部格式
    const { spaces, maxOrder } = convertImportFormatToStorage({ spaces: spacesData })

    console.log('Data parsed successfully')
    return { spaces, maxOrder }
  } catch (error) {
    console.error('Failed to import data:', error)
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON file')
    }
    throw error
  }
}

/**
 * 直接解析导入数据（用于统计计算）
 */
export function parseImportData(text: string): any {
  return JSON.parse(text)
}

/**
 * 解析导入数据格式，兼容新旧格式
 */
export function parseImportDataForConversion(text: string): any {
  const data = JSON.parse(text)

  // 如果是新的导出格式（包含 exportTime 和 exportedFrom 字段）
  if (data.exportTime && data.exportedFrom === 'Tab Manager') {
    return data.spaces
  }

  // 兼容旧格式（直接是 spaces 数组）
  if (Array.isArray(data.spaces)) {
    return data.spaces
  }

  throw new Error('Invalid import data format')
}

/**
 * 导入并合并数据到现有存储
 */
export async function importAndMergeData(file: File, existingData: TabManagerStorage): Promise<TabManagerStorage> {
  try {
    // 解析导入文件
    const { spaces: importedSpaces } = await importData(file)

    // 合并数据
    const mergedData = mergeImportedData(existingData, importedSpaces)

    console.log('Data merged successfully')
    return mergedData
  } catch (error) {
    console.error('Failed to merge imported data:', error)
    throw error
  }
}

/**
 * 生成导出文件名
 */
export function generateExportFilename(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `tab-manager-backup-${timestamp}.json`
}

/**
 * 创建示例数据模板
 */
export function createSampleData(): TabManagerStorage {
  return {
    spaces: [],
    activeSpaceId: null,
    version: 1,
    lastSyncAt: Date.now(),
  }
}