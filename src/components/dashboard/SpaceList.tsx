/**
 * SpaceList 组件 - 左侧工作空间列表
 */

import type { Space } from '../../types'
import SpaceItem from './SpaceListItem';
import SpaceCreate from './SpaceCreate';

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
      </div>

      {/* Spaces 列表 */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredSpaces.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            {searchQuery ? 'No spaces found' : 'No spaces yet'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSpaces.map((space) => (
              <SpaceItem
                key={space.id}
                space={space}
                isSelected={selectedSpaceId === space.id}
                isDemoSpace={isDemoSpace(space)}
                onSpaceClick={onSpaceClick}
                onDeleteSpace={onDeleteSpace}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}