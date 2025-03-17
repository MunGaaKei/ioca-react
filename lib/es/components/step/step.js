import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useMemo, Children } from 'react';
import Item from './item.js';

const Step = (props) => {
    const { active = 0, vertical, renderIcon, line, style, asList, className, children, onClick, } = props;
    const steps = useMemo(() => {
        const nodes = [];
        let index = 0;
        Children.map(children, (el) => {
            if (!el || el.type !== Item)
                return;
            const { props: elProps } = el;
            nodes.push({
                ...el,
                props: {
                    renderIcon,
                    line,
                    onClick,
                    ...elProps,
                    vertical,
                    active,
                    asList,
                    index: index++,
                },
            });
        });
        return nodes;
    }, [active, children]);
    return (jsx("div", { className: classNames("i-step", { "i-step-vertical": vertical }, className), style: style, children: steps }));
};
Step.Item = Item;

export { Step as default };
//# sourceMappingURL=step.js.map
