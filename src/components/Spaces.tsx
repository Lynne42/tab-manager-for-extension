import { useState, useEffect } from 'react'
import type { Space, Group } from '../types'
import { getAllSpaces, getActiveSpace, setActiveSpace } from '../services'
import { getGroupsBySpaceId } from '../services'
import { createTab } from '../services'
import { initDemoData } from '../data'
import { getSpaceIcon, getBgColorClass, getBorderColorClass } from '../config/constants'
import logoIcon from '@/assets/ico.png'

export default function Spaces() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null)
  const [selectedSpaceGroups, setSelectedSpaceGroups] = useState<Group[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [addingGroupId, setAddingGroupId] = useState<string | null>(null)

  // 加载所有工作空间
  const loadSpaces = async () => {
    setLoading(true)
    try {
      const allSpaces = await getAllSpaces()
      setSpaces(allSpaces)

      // 如果有选中空间，加载其分组
      if (selectedSpaceId) {
        const groups = await getGroupsBySpaceId(selectedSpaceId)
        setSelectedSpaceGroups(groups)
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
      // 检查是否需要初始化 Demo 数据
      const hasData = (await getAllSpaces()).length > 0
      if (!hasData) {
        await initDemoData()
      }

      // 加载数据
      await loadSpaces()

      // 设置当前激活的工作空间为选中状态
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
    const groups = await getGroupsBySpaceId(spaceId)
    setSelectedSpaceGroups(groups)
    await setActiveSpace(spaceId)
  }

  // 处理添加当前标签到分组
  const handleAddCurrentTab = async (spaceId: string, groupId: string) => {
    try {
      setAddingGroupId(groupId)

      // 获取当前激活的标签
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })

      if (!activeTab || !activeTab.url) {
        console.error('No active tab found')
        return
      }

      // 创建标签记录
      await createTab(spaceId, groupId, {
        url: activeTab.url,
        title: activeTab.title || 'Untitled',
        favIconUrl: activeTab.favIconUrl,
        status: activeTab.status === 'loading' ? 'loading' : 'idle',
        pinned: activeTab.pinned,
        chromeTabId: activeTab.id,
      })

    } catch (error) {
      console.error('Failed to add tab:', error)
      setAddingGroupId(null)
    }
  }

  // 打开全屏管理页面
  const handleOpenDashboard = async () => {
    // 获取扩展 URL
    const dashboardUrl = chrome.runtime.getURL('src/dashboard.html')
    // 在新标签页打开
    await chrome.tabs.create({ url: dashboardUrl })
    // 关闭 popup
    window.close()
  }

  
  // 过滤工作空间
  const filteredSpaces = spaces.filter((space) =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative bg-gray-900 text-white h-[500px] w-[500px] overflow-y-hidden rounded-lg flex flex-col">
      {/* 头部 */}
      <div className="shrink-0 bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <img src={logoIcon} alt="" width={40} height={40}/>
            <span>Tab Manager</span>
          </h1>
          <button
            onClick={handleOpenDashboard}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Open full dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m0 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Search spaces..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 工作空间列表 */}
        <div className={`transition-all duration-300 overflow-y-auto ${selectedSpaceId ? 'w-1/2 border-r border-gray-700' : 'w-full'}`}>
          {loading ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : filteredSpaces.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchQuery ? 'No spaces found' : 'No spaces yet'}
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredSpaces.map((space) => (
                <div
                  key={space.id}
                  onClick={() => handleSpaceClick(space.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${selectedSpaceId === space.id
                      ? `${getBorderColorClass(space.color)} border-2 bg-gray-700`
                      : 'hover:bg-gray-800'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {/* 图标 */}
                    <div
                      className={`w-10 h-10 rounded-lg ${getBgColorClass(space.color)} flex items-center justify-center text-lg flex-shrink-0`}
                    >
                      {getSpaceIcon(space.icon)}
                    </div>

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{space.name}</div>
                      {space.description && (
                        <div className="text-xs text-gray-400 truncate">{space.description}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {space.groups.length} groups
                      </div>
                    </div>

                    {/* 激活指示器 */}
                    {space.active && (
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 分组列表 */}
        {selectedSpaceId && (
          <div className="w-1/2 p-2 overflow-y-auto">
            <div className="mb-2 px-1">
              <button
                onClick={() => {
                  setSelectedSpaceId(null)
                  setSelectedSpaceGroups([])
                }}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>

            {selectedSpaceGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No groups</div>
            ) : (
              <div className="space-y-1">
                {selectedSpaceGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-gray-800 rounded-lg p-2 flex items-center gap-2 hover:bg-gray-700 transition-colors"
                  >
                    {/* 图标 */}
                    {group.icon && (
                      <span className="text-sm flex-shrink-0">{group.icon}</span>
                    )}

                    {/* 名称 */}
                    <span className="flex-1 text-sm font-medium truncate">{group.name}</span>

                    {/* Tab 数量 */}
                    <span className="text-xs text-gray-500 flex-shrink-0">{group.tabs.length}</span>

                    {/* 添加按钮 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddCurrentTab(selectedSpaceId, group.id)
                      }}
                      disabled={addingGroupId === group.id}
                      className="shrink-0 cursor-pointer p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md transition-colors"
                      title="Add current tab"
                    >
                      {addingGroupId === group.id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部统计 */}
      <div className="shrink-0 bg-gray-800 border-t border-gray-700 px-4 py-2 text-xs text-gray-400 flex justify-between">
        <span>{spaces.length} spaces</span>
        <span>{selectedSpaceId ? `${selectedSpaceGroups.length} groups` : ''}</span>
      </div>
    </div>
  )
}
