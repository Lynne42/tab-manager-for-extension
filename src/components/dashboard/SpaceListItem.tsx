import type { Space } from '../../types'
import { getSpaceIcon, getBgColorClass, getBorderColorClass } from '../../config/constants'
import Button from '@/atoms/Button';
import DeleteIcon from '@/assets/delete.svg?react';

/**
 * SpaceItem 组件 - 单个工作空间项
 */
interface SpaceItemProps {
  space: Space
  isSelected: boolean
  isDemoSpace: boolean
  onSpaceClick: (spaceId: string) => void
  onDeleteSpace: (spaceId: string) => void
}

export default function SpaceItem({ space, isSelected, isDemoSpace, onSpaceClick, onDeleteSpace }: SpaceItemProps) {
  return (
    <div
      className={`p-3 rounded-lg transition-all ${isSelected
        ? `${getBorderColorClass(space.color)} border-2 bg-gray-700`
        : 'hover:bg-gray-800'
        }`}
    >
      <div className="flex items-center gap-3">
        {/* 图标 - 可点击 */}
        <div
          onClick={() => onSpaceClick(space.id)}
          className={`w-10 h-10 rounded-lg ${getBgColorClass(space.color)} flex items-center justify-center text-lg flex-shrink-0 cursor-pointer`}
        >
          {getSpaceIcon(space.icon)}
        </div>

        {/* 信息 - 可点击 */}
        <div
          onClick={() => onSpaceClick(space.id)}
          className="flex-1 min-w-0 cursor-pointer"
        >
          <div className="font-medium truncate">{space.name}</div>
          {space.description && (
            <div className="text-xs text-gray-400 truncate">{space.description}</div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {space.groups.length} groups · {space.groups.reduce((sum, g) => sum + g.tabs.length, 0)} tabs
          </div>
        </div>

        {/* 激活指示器 */}
        {space.active && (
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
        )}

        {/* 删除按钮 */}
        {!isDemoSpace && (
          <Button
            icon={<DeleteIcon />}
            onClick={() => onDeleteSpace(space.id)}
            className='text-gray-400 hover:text-red-400 hover:bg-gray-700 '>
          </Button>
        )}
      </div>
    </div >
  )
}