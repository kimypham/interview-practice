import { useState } from 'react';
import { getTabData, isTabActive, TabItem } from './Tabs.service';

export default function Tabs() {
    const tabData: TabItem[] = getTabData();
    const [activeTabId, setActiveTabId] = useState<string>(tabData[0].id);

    const handleTabClick = (tabId: string): void => {
        setActiveTabId(tabId);
    };

    const getButtonClassName = (tabId: string): string => {
        const baseClasses: string =
            'px-4 py-2 font-medium text-white transition-colors';
        const activeClasses: string = 'bg-blue-500';
        const inactiveClasses: string = 'bg-gray-400 hover:bg-gray-500';

        return `${baseClasses} ${
            isTabActive(tabId, activeTabId) ? activeClasses : inactiveClasses
        }`;
    };

    const isParagraphVisible = (tabId: string): boolean => {
        return isTabActive(tabId, activeTabId);
    };

    return (
        <div>
            <div className="flex space-x-2 mb-4">
                {tabData.map((tab: TabItem) => (
                    <button
                        key={tab.id}
                        className={getButtonClassName(tab.id)}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>
                {tabData.map((tab: TabItem) => (
                    <p
                        key={tab.id}
                        id={`${tab.id}-content`}
                        className={
                            isParagraphVisible(tab.id) ? 'block' : 'hidden'
                        }
                    >
                        {tab.content}
                    </p>
                ))}
            </div>
        </div>
    );
}
