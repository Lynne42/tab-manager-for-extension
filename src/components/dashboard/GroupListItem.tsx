
/**
 * GroupItem 组件 - 单个分组项
 */
import TabList from './TabList'
import DeleteIcon from '@/assets/delete.svg?react';
import EditIcon from '@/assets/edit.svg?react';
import AddIcon from '@/assets/add.svg?react';
import Button from '@/atoms/Button';

interface GroupItemProps {
    spaceId: string
    group: any
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

export default function GroupItem({
    spaceId,
    group,
    onGroupToggle,
    onDeleteTab,
    onOpenTab,
    onEditGroup,
    onDeleteGroup,
    onCreateTab,
    onEditTab,
    onEditTabVisible,
}: GroupItemProps) {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            {/* Group 头部 */}
            <div className="p-4">
                <div className="flex items-center gap-3">
                    {/* 展开/收起按钮 */}
                    <button
                        onClick={() => onGroupToggle(spaceId, group.id)}
                        className="flex-shrink-0"
                    >
                        <svg
                            className={`w-5 h-5 transition-transform text-gray-400 ${group.expanded ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* 图标 */}
                    {group.icon && (
                        <span className="text-xl flex-shrink-0">{group.icon}</span>
                    )}

                    {/* 名称 - 可编辑 */}
                    <div className="flex-1 min-w-0">
                        <div className="font-bold truncate cursor-pointer hover:text-blue-400" 
                            onClick={() => onGroupToggle(spaceId, group.id)}>
                            {group.name}
                        </div>
                        {group.description && (
                            <div className="text-xs text-gray-400 truncate">{group.description}</div>
                        )}
                    </div>

                    {/* Tab 数量 */}
                    <span className="text-sm text-gray-500 flex-shrink-0">{group.tabs.length} tabs</span>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {/* 添加 Tab 按钮 */}
                        <Button
                            icon={<AddIcon />}
                            onClick={() => onCreateTab(group.id)}
                            className='text-green-400 hover:text-green-400 transition-all bg-gray-700 hover:bg-gray-700  '
                            title="Add tab to this group"
                        />

                        {/* 编辑按钮 */}
                        <Button
                            icon={<EditIcon />}
                            onClick={() => onEditGroup(group)}
                            className='text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                            title="Edit group name"
                        />

                        {/* 删除按钮 */}
                        <Button
                            onClick={() => onDeleteGroup(group.id)}
                            icon={<DeleteIcon />}
                            className='text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-all'
                            title="Delete group"
                        />

                    </div>
                </div>
            </div>

            {/* Tabs 列表 */}
            {group.expanded && (
                <div className="border-t border-gray-700 p-4">
                    {group.tabs.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm py-4">No tabs in this group</div>
                    ) : (
                        <TabList
                            group={group}
                            spaceId={spaceId}
                            onOpenTab={onOpenTab}
                            onEditTab={onEditTab}
                            onDeleteTab={onDeleteTab}
                            onEditTabVisible={onEditTabVisible}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

