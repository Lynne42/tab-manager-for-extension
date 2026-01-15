/**
 * GroupList 组件 - 分组列表
 */

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
  onEditTabVisible,
}: GroupListProps) {
  if (space.groups.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">No groups yet</p>
        <p className="text-sm">Click "Add Group" to create your first group</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {space.groups.map((group) => (
        <GroupItem
          key={group.id}
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
          onEditTabVisible={onEditTabVisible}
        />
      ))}
    </div>
  )
}
