import { Activity, memo, ReactNode } from "react";
import { ITabItem } from "./type";

interface ITabsContentsProps {
    tabs: ITabItem[];
    activeKey?: string;
    activatedKeys: Set<string>;
    getContent: (key: string) => ReactNode;
}

const TabsContents = (props: ITabsContentsProps) => {
    const { tabs, activeKey, activatedKeys, getContent } = props;

    return (
        <div className="i-tab-contents">
            {tabs.map((tab, i) => {
                const key = tab.key ?? `${i}`;
                const content = getContent(key);
                const isActive = activeKey === key;

                if (tab.cached && activatedKeys.has(key)) {
                    return (
                        <Activity mode={isActive ? "visible" : "hidden"} key={key}>
                            <div
                                className="i-tab-content"
                                role="tabpanel"
                                aria-hidden={!isActive}
                            >
                                {content}
                            </div>
                        </Activity>
                    );
                }

                return (
                    isActive && (
                        <div
                            key={key}
                            className="i-tab-content i-tab-active"
                            role="tabpanel"
                        >
                            {content}
                        </div>
                    )
                );
            })}
        </div>
    );
};

export default memo(TabsContents);
