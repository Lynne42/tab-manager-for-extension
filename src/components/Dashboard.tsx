import { useState, useEffect } from 'react'
import type { Space, CreateSpaceParams } from '../types'
import { getAllSpaces, getActiveSpace, setActiveSpace, deleteSpace } from '../services'
import { createSpace } from '../services/spaceService'
import { toggleGroupExpanded, deleteGroup } from '../services'
import { deleteTab } from '../services'

import { initDemoData } from '../data'
import Header from './dashboard/Header'
import SpaceList from './dashboard/SpaceList'
import SpaceDetail from './dashboard/SpaceDetail'

// Demo space 名称，不允许删除
const DEMO_SPACE_NAME = 'demo-workspace'

export default function Dashboard() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null)
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  

  // 加载所有工作空间
  const loadSpaces = async () => {
    setLoading(true)
    try {
      const allSpaces = await getAllSpaces()
      setSpaces(allSpaces)

      if (selectedSpaceId) {
        const space = allSpaces.find((s) => s.id === selectedSpaceId) || null
        setSelectedSpace(space)
      }
    } catch (error) {
      console.error('Failed to load spaces:', error)
    } finally {
      setLoading(false)
    }
  }

  // 初始化
  useEffect(() => {
    const init = async () => {
      const hasData = (await getAllSpaces()).length > 0
      if (!hasData) {
        await initDemoData()
      }

      await loadSpaces()

      const activeSpace = await getActiveSpace()
      if (activeSpace) {
        handleSpaceClick(activeSpace.id)
      }
    }

    init()
  }, [])

  // 处理工作空间点击
  const handleSpaceClick = async (spaceId: string) => {
    setSelectedSpaceId(spaceId)
    const allSpaces = await getAllSpaces()
    const space = allSpaces.find((s) => s.id === spaceId) || null
    setSelectedSpace(space)
    await setActiveSpace(spaceId)
  }

  // 处理分组展开/收起
  const handleGroupToggle = async (spaceId: string, groupId: string) => {
    await toggleGroupExpanded(spaceId, groupId)
    loadSpaces()
    if (selectedSpaceId) {
      const allSpaces = await getAllSpaces()
      const space = allSpaces.find((s) => s.id === selectedSpaceId) || null
      setSelectedSpace(space)
    }
  }

  // 处理删除标签
  const handleDeleteTab = async (spaceId: string, groupId: string, tabId: string) => {
    await deleteTab(spaceId, groupId, tabId)
    loadSpaces()
  }

  // 处理打开标签
  const handleOpenTab = async (tab: any) => {
    if (tab.chromeTabId) {
      await chrome.tabs.update(tab.chromeTabId, { active: true })
    } else {
      await chrome.tabs.create({ url: tab.url })
    }
  }

  // 检查是否是 Demo Space
  const isDemoSpace = (space: Space): boolean => {
    return space.name === DEMO_SPACE_NAME
  }

  // 处理删除 Space
  const handleDeleteSpace = async (spaceId: string) => {
    const space = spaces.find((s) => s.id === spaceId)
    if (!space) return

    if (isDemoSpace(space)) {
      alert('Demo space cannot be deleted')
      return
    }

    if (confirm(`Are you sure you want to delete "${space.name}"?`)) {
      await deleteSpace(spaceId)
      if (selectedSpaceId === spaceId) {
        setSelectedSpaceId(null)
        setSelectedSpace(null)
      }
      loadSpaces()
    }
  }

  // 处理删除 Group
  const handleDeleteGroup = async (groupId: string) => {
    if (!selectedSpaceId || !selectedSpace) return

    const group = selectedSpace.groups.find((g) => g.id === groupId)
    if (!group) return

    if (confirm(`Are you sure you want to delete "${group.name}"?`)) {
      await deleteGroup(selectedSpaceId, groupId)
      await loadSpaces()
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* 头部 */}
      <Header
        onNewSpace={async () => {
          const newSpace = await createSpace({
            name: 'New Space',
            description: 'A new workspace',
            icon: 'workspace',
            color: 'blue',
          })
          if (newSpace) {
            loadSpaces()
          }
        }}
        loadSpaces={loadSpaces}
      />

      {/* 主体内容 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 - Spaces 列表 */}
        <SpaceList
          spaces={spaces}
          selectedSpaceId={selectedSpaceId}
          searchQuery={searchQuery}
          isDemoSpace={isDemoSpace}
          onSpaceClick={handleSpaceClick}
          onDeleteSpace={handleDeleteSpace}
          onSearchChange={setSearchQuery}
          loadSpaces={loadSpaces}
        />

        {/* 右侧主区域 - Space 详情 */}
        <main className="flex-1 overflow-y-auto">
          {selectedSpace ? (
            <SpaceDetail
              space={selectedSpace}
              spaces={spaces}
              isDemoSpace={isDemoSpace(selectedSpace)}
              onGroupToggle={handleGroupToggle}
              onDeleteTab={handleDeleteTab}
              onOpenTab={handleOpenTab}
              onDeleteGroup={handleDeleteGroup}
              onRefresh={loadSpaces}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-xl mb-2">👈</p>
                <p>Select a space to view its groups and tabs</p>
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  )
}
