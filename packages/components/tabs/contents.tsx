import classNames from "classnames";
import { memo, ReactNode } from "react";
import { ITabItem } from "./type";

interface ITabsContentsProps {
    tabs: ITabItem[];
    activeKey?: string;
    cachedTabKeySet: Set<string>;
    getContent: (key: string) => ReactNode;
}

const TabsContents = (props: ITabsContentsProps) => {
    const { tabs, activeKey, cachedTabKeySet, getContent } = props;

    return (
        <div className="i-tab-contents">
            {tabs.map((tab, i) => {
                const key = tab.key ?? `${i}`;
                const content = getContent(key);
                const isActive = activeKey === key;
                const show = isActive || cachedTabKeySet.has(key);

                return (
                    show && (
                        <div
                            key={key}
                            className={classNames("i-tab-content", {
                                "i-tab-active": isActive,
                            })}
                            role="tabpanel"
                            aria-hidden={!isActive}
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
