import React from 'react';
import Tab from './Tab';

interface Props {
    group: any
    spaceId: string
    onOpenTab: (tab: any) => void
    onEditTab: (tab: any) => void
    onEditTabVisible: (spaceId: string, groupId: string, tabId: string) => void
    onDeleteTab: (spaceId: string, groupId: string, tabId: string) => void
    [x: string]: any
}
const TabList: React.FC<Props> = ({
    group,
    onDeleteTab,
    onOpenTab,
    onEditTab,
    spaceId,
}) => {

    return (
        <div className="flex flex-wrap gap-3">
            {group.tabs.map((tab: any) => (
                <Tab
                    key={tab.id}
                    tab={tab}
                    spaceId={spaceId}
                    groupId={group.id}
                    onClick={() => onOpenTab(tab)}
                    onDelete={() => onDeleteTab(spaceId, group.id, tab.id)}
                    onEditTab={() => onEditTab(tab)}
                />
            ))}
            
        </div>
    );
};
export default TabList;