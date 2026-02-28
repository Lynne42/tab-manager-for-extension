import React, { useState } from 'react';
import Tab from './Tab';

interface Props {
    group: any
    spaceId: string
    onOpenTab: (tab: any) => void
    onEditTab: (tab: any) => void
    onMoveTab: (tab: any) => void
    onReorderTabs: (groupId: string, tabIds: string[]) => void
    onEditTabVisible: (spaceId: string, groupId: string, tabId: string) => void
    onDeleteTab: (spaceId: string, groupId: string, tabId: string) => void
    [x: string]: any
}

const TabList: React.FC<Props> = ({
    group,
    onDeleteTab,
    onOpenTab,
    onEditTab,
    onMoveTab,
    onReorderTabs,
    spaceId,
}) => {
    const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
    const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, tabId: string) => {
        setDraggedTabId(tabId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tabId);
    };

    const handleDragOver = (e: React.DragEvent, tabId: string) => {
        e.preventDefault();
        setDragOverTabId(tabId);
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragLeave = () => {
        setDragOverTabId(null);
    };

    const handleDrop = (e: React.DragEvent, targetTabId: string) => {
        e.preventDefault();
        setDragOverTabId(null);

        if (!draggedTabId || draggedTabId === targetTabId) {
            setDraggedTabId(null);
            return;
        }

        const draggedIndex = group.tabs.findIndex((t: any) => t.id === draggedTabId);
        const targetIndex = group.tabs.findIndex((t: any) => t.id === targetTabId);

        if (draggedIndex === -1 || targetIndex === -1) {
            setDraggedTabId(null);
            return;
        }

        const newTabIds = [...group.tabs.map((t: any) => t.id)];
        const [removed] = newTabIds.splice(draggedIndex, 1);
        newTabIds.splice(targetIndex, 0, removed);

        // Notify parent to reorder
        onReorderTabs(group.id, newTabIds);
        setDraggedTabId(null);
    };

    return (
        <div className="flex flex-wrap gap-3 items-stretch">
            {group.tabs.map((tab: any) => (
                <div
                    key={tab.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, tab.id)}
                    onDragOver={(e) => handleDragOver(e, tab.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, tab.id)}
                    className={`flex transition-all duration-200 ${draggedTabId === tab.id
                        ? 'opacity-50'
                        : dragOverTabId === tab.id
                            ? 'scale-105'
                            : ''
                        } ${draggedTabId ? 'outline-dashed outline-2 outline-gray-600/50 outline-offset-2 rounded-lg' : ''}`}
                >
                    <Tab
                        tab={tab}
                        spaceId={spaceId}
                        groupId={group.id}
                        onClick={() => onOpenTab(tab)}
                        onDelete={() => onDeleteTab(spaceId, group.id, tab.id)}
                        onEditTab={() => onEditTab(tab)}
                        onMove={() => onMoveTab(tab)}
                    />
                </div>
            ))}
        </div>
    );
};
export default TabList;