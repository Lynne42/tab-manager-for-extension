/**
 * SpaceList 组件 - 左侧工作空间列表
 */

import { useState } from 'react'
import type { Space } from '../../types'
import SpaceItem from './SpaceListItem';
import SpaceCreate from './SpaceCreate';
import { reorderSpaces } from '../../services/spaceService'

interface SpaceListProps {
  spaces: Space[]
  selectedSpaceId: string | null
  searchQuery: string
  loadSpaces: () => void;
  isDemoSpace: (space: Space) => boolean
  onSpaceClick: (spaceId: string) => void
  onDeleteSpace: (spaceId: string) => void
  onSearchChange: (query: string) => void
  onNewSpace: () => void
}

export default function SpaceList({
  spaces,
  selectedSpaceId,
  searchQuery,
  loadSpaces,
  isDemoSpace,
  onSpaceClick,
  onDeleteSpace,
  onSearchChange,
}: SpaceListProps) {
  const [draggedSpaceId, setDraggedSpaceId] = useState<string | null>(null)
  const [dragOverSpaceId, setDragOverSpaceId] = useState<string | null>(null)

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, spaceId: string) => {
    setDraggedSpaceId(spaceId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', spaceId)
  }

  // 处理拖拽经过
  const handleDragOver = (e: React.DragEvent, spaceId: string) => {
    e.preventDefault()
    setDragOverSpaceId(spaceId)
    e.dataTransfer.dropEffect = 'move'
  }

  // 处理拖拽离开
  const handleDragLeave = () => {
    setDragOverSpaceId(null)
  }

  // 处理放置
  const handleDrop = async (e: React.DragEvent, targetSpaceId: string) => {
    e.preventDefault()
    setDragOverSpaceId(null)

    if (!draggedSpaceId || draggedSpaceId === targetSpaceId) {
      setDraggedSpaceId(null)
      return
    }

    // 找到拖拽项和目标项的索引
    const draggedIndex = spaces.findIndex(s => s.id === draggedSpaceId)
    const targetIndex = spaces.findIndex(s => s.id === targetSpaceId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedSpaceId(null)
      return
    }

    // 创建新的空间顺序数组
    const newSpaceIds = [...spaces.map(s => s.id)]
    const [removed] = newSpaceIds.splice(draggedIndex, 1)
    newSpaceIds.splice(targetIndex, 0, removed)

    // 更新排序
    try {
      await reorderSpaces(newSpaceIds)
      loadSpaces() // 刷新列表
    } catch (error) {
      console.error('Failed to reorder spaces:', error)
    }

    setDraggedSpaceId(null)
  }
  // 过滤工作空间
  const filteredSpaces = spaces.filter((space) =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="w-80 bg-gray-850 border-r border-gray-700 flex flex-col">
      {/* 搜索框 + New Space 按钮 */}
      <div className="shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="Search spaces..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <SpaceCreate
            loadSpaces={loadSpaces}
            onSpaceClick={onSpaceClick} />
        </div>

        <div className="text-xs text-gray-500 text-center">{spaces.length} spaces</div>
        <div className="text-xs text-gray-600 text-center mt-1">Drag to reorder</div>
      </div>

      {/* Spaces 列表 */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredSpaces.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            {searchQuery ? 'No spaces found' : 'No spaces yet'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSpaces.map((space, index) => (
              <div
                key={space.id}
                draggable
                onDragStart={(e) => handleDragStart(e, space.id)}
                onDragOver={(e) => handleDragOver(e, space.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, space.id)}
                className={`transition-all ${
                  draggedSpaceId === space.id
                    ? 'opacity-50'
                    : dragOverSpaceId === space.id
                    ? 'bg-gray-700'
                    : 'hover:translate-x-1'
                } ${draggedSpaceId ? 'border border-dashed border-gray-600 rounded-lg p-2' : ''}`}
              >
                <SpaceItem
                  space={space}
                  isSelected={selectedSpaceId === space.id}
                  isDemoSpace={isDemoSpace(space)}
                  onSpaceClick={onSpaceClick}
                  onDeleteSpace={onDeleteSpace}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}