import { jsx } from 'react/jsx-runtime';
import { memo, Activity } from 'react';

const TabsContents = (props) => {
    const { tabs, activeKey, activatedKeys, getContent } = props;
    return (jsx("div", { className: "i-tab-contents", children: tabs.map((tab, i) => {
            const key = tab.key ?? `${i}`;
            const content = getContent(key);
            const isActive = activeKey === key;
            if (tab.cached && activatedKeys.has(key)) {
                return (jsx(Activity, { mode: isActive ? "visible" : "hidden", children: jsx("div", { className: "i-tab-content", role: "tabpanel", "aria-hidden": !isActive, children: content }) }, key));
            }
            return (isActive && (jsx("div", { className: "i-tab-content i-tab-active", role: "tabpanel", children: content }, key)));
        }) }));
};
var TabsContents$1 = memo(TabsContents);

export { TabsContents$1 as default };
