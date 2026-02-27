/**
 * MoveTabModal 组件 - 移动标签到不同分组/空间
 */

import { useState, useEffect } from 'react'
import type { Space, Tab } from '../../types'

interface MoveTabModalProps {
  isOpen: boolean
  tab: Tab | null
  spaces: Space[]
  currentSpaceId: string
  currentGroupId: string
  moving: boolean
  onClose: () => void
  onMove: (toSpaceId: string, toGroupId: string) => void
}

export default function MoveTabModal({
  isOpen,
  tab,
  spaces,
  currentSpaceId,
  currentGroupId,
  moving,
  onClose,
  onMove,
}: MoveTabModalProps) {
  const [selectedSpaceId, setSelectedSpaceId] = useState(currentSpaceId)
  const [selectedGroupId, setSelectedGroupId] = useState(currentGroupId)

  // 当打开模态框或 props 变化时，重置选中项
  useEffect(() => {
    if (isOpen) {
      setSelectedSpaceId(currentSpaceId)
      setSelectedGroupId(currentGroupId)
    }
  }, [isOpen, currentSpaceId, currentGroupId])

  if (!isOpen || !tab) return null

  const selectedSpace = spaces.find((s) => s.id === selectedSpaceId)
  const availableGroups = selectedSpace?.groups || []

  // 当选择的 Space 变化时，如果当前选中的 Group 不在新 Space 中，默认选中第一个 Group
  const handleSpaceChange = (spaceId: string) => {
    setSelectedSpaceId(spaceId)
    const newSpace = spaces.find((s) => s.id === spaceId)
    if (newSpace && newSpace.groups.length > 0) {
      setSelectedGroupId(newSpace.groups[0].id)
    } else {
      setSelectedGroupId('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-2xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          Move Tab
        </h3>

        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-1">Tab to move:</div>
          <div className="bg-gray-700 p-3 rounded-lg flex items-center gap-3">
            {tab.favIconUrl && (
              <img src={tab.favIconUrl} alt="" className="w-5 h-5" />
            )}
            <div className="font-medium truncate">{tab.title}</div>
          </div>
        </div>

        <div className="space-y-4">
          {/* 选择 Space */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Target Space</label>
            <select
              value={selectedSpaceId}
              onChange={(e) => handleSpaceChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.id === currentSpaceId ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 选择 Group */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Target Group</label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={availableGroups.length === 0}
            >
              {availableGroups.length > 0 ? (
                availableGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} {g.id === currentGroupId && selectedSpaceId === currentSpaceId ? '(Current)' : ''}
                  </option>
                ))
              ) : (
                <option value="">No groups available</option>
              )}
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
            onClick={() => onMove(selectedSpaceId, selectedGroupId)}
            disabled={moving || !selectedGroupId || (selectedSpaceId === currentSpaceId && selectedGroupId === currentGroupId)}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
          >
            {moving ? 'Moving...' : 'Confirm Move'}
          </button>
        </div>
      </div>
    </div>
  )
}
