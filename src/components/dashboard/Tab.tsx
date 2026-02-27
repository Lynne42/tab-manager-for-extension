import Button from '@/atoms/Button';
import DeleteIcon from '@/assets/delete.svg?react';
import EditIcon from '@/assets/edit.svg?react';
import MoveIcon from '@/assets/move.svg?react';

interface TabCardProps {
    tab: any
    spaceId: string
    groupId: string
    onClick: () => void
    onDelete: () => void
    onEditTab: () => void
    onMove: () => void
}

/**
 * Tab 组件 - 显示单个标签页的卡片
 * @param {TabCardProps} props - 组件属性
 * @returns {JSX.Element} Tab 卡片的 React 元素
 */
function Tab({ tab, onClick, onDelete, onEditTab, onMove }: TabCardProps) {
    return (
        <div className="w-56 flex flex-col justify-between bg-gray-700 rounded-lg overflow-hidden group/tab hover:bg-gray-650 transition-colors">
            {/* Tab 卡片 */}
            <div className="p-4 cursor-pointer" onClick={onClick} title={tab.url}>
                {/* 图标和标题 */}
                <div className="flex items-center gap-3 mb-2">
                    {tab.favIconUrl ? (
                        <img
                            src={tab.favIconUrl}
                            alt=""
                            className="w-6 h-6 flex-shrink-0 mt-0.5"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    ) : (
                        <div className="w-6 h-6 bg-gray-600 rounded flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate leading-tight">{tab.title}</div>
                    </div>
                </div>
                {/* URL */}
                {/* <div className="text-xs text-gray-400 truncate mb-1">{tab.url}</div> */}
                {/* Description */}
                {tab.description && (
                    <div className="text-xs text-gray-500 leading-tight" title={tab.description}>
                        {tab.description.length > 50 ? `${tab.description.substring(0, 50)}...` : tab.description}
                    </div>
                )}
            </div>

            {/* 操作栏 */}
            <div className="px-4 pb-3 flex justify-end gap-1 opacity-0 group-hover/tab:opacity-100 transition-opacity">
                <Button
                    icon={<MoveIcon />}
                    onClick={onMove}
                    className='text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-all'
                    title="移动标签"
                />
                <Button
                    icon={<EditIcon />}
                    onClick={onEditTab}
                    className='text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-all'
                    title="编辑标签"
                />
                <Button 
                    icon={<DeleteIcon />} 
                    onClick={onDelete}
                    className='text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-all'
                    title="删除标签"
                />
            </div>
        </div>
    )
}
export default Tab;