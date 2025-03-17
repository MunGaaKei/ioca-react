'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var item = require('./item.js');

const Step = (props) => {
    const { active = 0, vertical, renderIcon, line, style, asList, className, children, onClick, } = props;
    const steps = react.useMemo(() => {
        const nodes = [];
        let index = 0;
        react.Children.map(children, (el) => {
            if (!el || el.type !== item.default)
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
    return (jsxRuntime.jsx("div", { className: classNames("i-step", { "i-step-vertical": vertical }, className), style: style, children: steps }));
};
Step.Item = item.default;

exports.default = Step;
//# sourceMappingURL=step.js.map
