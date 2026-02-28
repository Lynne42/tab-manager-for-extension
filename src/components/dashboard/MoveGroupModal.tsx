/**
 * MoveGroupModal 组件 - 移动分组到不同空间
 */

import { useState, useEffect } from 'react'
import type { Space, Group } from '../../types'

interface MoveGroupModalProps {
  isOpen: boolean
  group: Group | null
  spaces: Space[]
  currentSpaceId: string
  moving: boolean
  onClose: () => void
  onMove: (toSpaceId: string) => void
}

export default function MoveGroupModal({
  isOpen,
  group,
  spaces,
  currentSpaceId,
  moving,
  onClose,
  onMove,
}: MoveGroupModalProps) {
  const [selectedSpaceId, setSelectedSpaceId] = useState(currentSpaceId)

  // 当打开模态框或 props 变化时，重置选中项
  useEffect(() => {
    if (isOpen) {
      setSelectedSpaceId(currentSpaceId)
    }
  }, [isOpen, currentSpaceId])

  if (!isOpen || !group) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-2xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          Move Group
        </h3>

        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-1">Group to move:</div>
          <div className="bg-gray-700 p-3 rounded-lg flex items-center gap-3 border border-gray-600">
            {group.icon && (
              <span className="text-xl">{group.icon}</span>
            )}
            <div>
              <div className="font-medium truncate">{group.name}</div>
              <div className="text-xs text-gray-400">{group.tabs.length} tabs inside</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* 选择 Space */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Target Space</label>
            <select
              value={selectedSpaceId}
              onChange={(e) => setSelectedSpaceId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.id === currentSpaceId ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onMove(selectedSpaceId)}
            disabled={moving || !selectedSpaceId || selectedSpaceId === currentSpaceId}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
          >
            {moving ? 'Moving...' : 'Confirm Move'}
          </button>
        </div>
      </div>
    </div>
  )
}
