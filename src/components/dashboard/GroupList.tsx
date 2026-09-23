/**
 * GroupList 组件 - 分组列表
 */

import { useState } from 'react'
import type { Space } from '../../types'
import GroupItem from './GroupListItem'

interface GroupListProps {
  space: Space
  isDemoSpace: boolean
  onGroupToggle: (spaceId: string, groupId: string) => void
  onDeleteTab: (spaceId: string, groupId: string, tabId: string) => void
  onOpenTab: (tab: any) => void
  onEditGroup: (group: any) => void
  onDeleteGroup: (groupId: string) => void
  onCreateTab: (groupId: string) => void
  onEditTab: (tab: any) => void
  onMoveTab: (tab: any) => void
  onMoveGroup: (group: any) => void
  onReorderTabs: (groupId: string, tabIds: string[]) => void
  onReorderGroups: (groupIds: string[]) => void
  onEditTabVisible: (spaceId: string, groupId: string, tabId: string) => void
}

export default function GroupList({
  space,
  isDemoSpace,
  onGroupToggle,
  onDeleteTab,
  onOpenTab,
  onEditGroup,
  onDeleteGroup,
  onCreateTab,
  onEditTab,
  onMoveTab,
  onMoveGroup,
  onReorderTabs,
  onReorderGroups,
  onEditTabVisible,
}: GroupListProps) {
  const [draggedGroupId, setDraggedGroupId] = useState<string | null>(null)
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null)

  if (space.groups.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">No groups yet</p>
        <p className="text-sm">Click "Add Group" to create your first group</p>
      </div>
    )
  }

  const handleDragStart = (e: React.DragEvent, groupId: string) => {
    setDraggedGroupId(groupId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', groupId)

    // 给一点延迟让原始元素看起来被拖走了
    setTimeout(() => {
      const target = e.target as HTMLElement
      if (target) target.classList.add('opacity-40')
    }, 0)
  }

  const handleDragOver = (e: React.DragEvent, groupId: string) => {
    e.preventDefault()
    if (draggedGroupId === groupId) return
    setDragOverGroupId(groupId)
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedGroupId(null)
    setDragOverGroupId(null)
    const target = e.target as HTMLElement
    if (target) target.classList.remove('opacity-40')
  }

  const handleDrop = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault()
    setDragOverGroupId(null)

    if (!draggedGroupId || draggedGroupId === targetGroupId) {
      setDraggedGroupId(null)
      return
    }

    const groups = [...space.groups].sort((a, b) => a.order - b.order)
    const draggedIndex = groups.findIndex((g) => g.id === draggedGroupId)
    const targetIndex = groups.findIndex((g) => g.id === targetGroupId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedGroupId(null)
      return
    }

    const newGroupIds = groups.map((g) => g.id)
    const [removed] = newGroupIds.splice(draggedIndex, 1)
    newGroupIds.splice(targetIndex, 0, removed)

    onReorderGroups(newGroupIds)
    setDraggedGroupId(null)
  }

  return (
    <div className="space-y-4">
      {[...space.groups]
        .sort((a, b) => a.order - b.order)
        .map((group) => (
          <div
            key={group.id}
            draggable
            onDragStart={(e) => handleDragStart(e, group.id)}
            onDragOver={(e) => handleDragOver(e, group.id)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, group.id)}
            className={`transition-all duration-200 ${
              dragOverGroupId === group.id ? 'border-t-2 border-blue-500 pt-2' : ''
            }`}
          >
            <GroupItem
              spaceId={space.id}
              group={group}
              isDemoSpace={isDemoSpace}
              onGroupToggle={onGroupToggle}
              onDeleteTab={onDeleteTab}
              onOpenTab={onOpenTab}
              onEditGroup={onEditGroup}
              onDeleteGroup={onDeleteGroup}
              onCreateTab={onCreateTab}
              onEditTab={onEditTab}
              onMoveTab={onMoveTab}
              onMoveGroup={onMoveGroup}
              onReorderTabs={onReorderTabs}
              onEditTabVisible={onEditTabVisible}
              isDragging={draggedGroupId === group.id}
            />
          </div>
        ))}
    </div>
  )
}
