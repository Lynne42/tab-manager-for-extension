/**
 * ReorderGroupsModal 组件 - 分组重新排序模态框
 */

import { useState, useEffect } from 'react'
import type { Space, Group } from '../../types'
import MoveIcon from '@/assets/move.svg?react'

interface ReorderGroupsModalProps {
  isOpen: boolean
  space: Space
  onClose: () => void
  onSave: (groupIds: string[]) => Promise<void>
}

export default function ReorderGroupsModal({
  isOpen,
  space,
  onClose,
  onSave,
}: ReorderGroupsModalProps) {
  const [orderedGroups, setOrderedGroups] = useState<Group[]>([])
  const [draggedGroupId, setDraggedGroupId] = useState<string | null>(null)
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // 初始化排序列表
  useEffect(() => {
    if (isOpen) {
      // 按照当前 order 排序
      const sorted = [...space.groups].sort((a, b) => a.order - b.order)
      setOrderedGroups(sorted)
    }
  }, [isOpen, space.groups])

  if (!isOpen) return null

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, groupId: string) => {
    setDraggedGroupId(groupId)
    e.dataTransfer.effectAllowed = 'move'
    // 设置拖拽图像或数据
    e.dataTransfer.setData('text/plain', groupId)
  }

  // 处理拖拽经过
  const handleDragOver = (e: React.DragEvent, groupId: string) => {
    e.preventDefault()
    if (draggedGroupId === groupId) return
    setDragOverGroupId(groupId)
    e.dataTransfer.dropEffect = 'move'
  }

  // 处理放置
  const handleDrop = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault()
    setDragOverGroupId(null)

    if (!draggedGroupId || draggedGroupId === targetGroupId) {
      setDraggedGroupId(null)
      return
    }

    const draggedIndex = orderedGroups.findIndex((g) => g.id === draggedGroupId)
    const targetIndex = orderedGroups.findIndex((g) => g.id === targetGroupId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedGroupId(null)
      return
    }

    const newGroups = [...orderedGroups]
    const [removed] = newGroups.splice(draggedIndex, 1)
    newGroups.splice(targetIndex, 0, removed)

    setOrderedGroups(newGroups)
    setDraggedGroupId(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const groupIds = orderedGroups.map((g) => g.id)
      await onSave(groupIds)
      onClose()
    } catch (error) {
      console.error('Failed to save group order:', error)
      alert('Failed to save group order')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <h3 className="text-lg font-bold text-white">Reorder Groups</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-gray-400 mb-4">
            Drag and drop to reorder groups in <span className="text-blue-400 font-medium">{space.name}</span>.
          </p>
          
          <div className="space-y-2">
            {orderedGroups.map((group) => (
              <div
                key={group.id}
                draggable
                onDragStart={(e) => handleDragStart(e, group.id)}
                onDragOver={(e) => handleDragOver(e, group.id)}
                onDrop={(e) => handleDrop(e, group.id)}
                onDragEnd={() => {
                  setDraggedGroupId(null)
                  setDragOverGroupId(null)
                }}
                className={`
                  flex items-center gap-3 p-3 bg-gray-700/50 border rounded-lg cursor-move transition-all
                  ${draggedGroupId === group.id ? 'opacity-40 border-dashed border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'}
                  ${dragOverGroupId === group.id ? 'border-blue-500 bg-blue-500/10 translate-y-1' : ''}
                `}
              >
                <div className="text-gray-500">
                  <MoveIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 font-medium text-gray-200">
                  {group.name}
                </div>
                <div className="text-xs text-gray-500">
                  {group.tabs.length} tabs
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-850 border-t border-gray-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:text-gray-400 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
          >
            {isSaving ? 'Saving...' : 'Save Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
