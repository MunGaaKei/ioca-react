import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { memo } from 'react';

const TabsContents = (props) => {
    const { tabs, activeKey, cachedTabKeySet, getContent } = props;
    return (jsx("div", { className: "i-tab-contents", children: tabs.map((tab, i) => {
            const key = tab.key ?? `${i}`;
            const content = getContent(key);
            const isActive = activeKey === key;
            const show = isActive || cachedTabKeySet.has(key);
            return (show && (jsx("div", { className: classNames("i-tab-content", {
                    "i-tab-active": isActive,
                }), role: "tabpanel", "aria-hidden": !isActive, children: content }, key)));
        }) }));
};
var TabsContents$1 = memo(TabsContents);

export { TabsContents$1 as default };
//# sourceMappingURL=contents.js.map
