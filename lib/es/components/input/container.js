import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

function InputContainer(props) {
    const { as: As = "label", label, className, labelInline, style, children, status, tip, required, } = props;
    return (jsxs(As, { className: classNames("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && (jsxs("span", { className: 'i-input-label-text', children: [required && jsx("span", { className: 'error', children: "*" }), label] })), children, tip && (jsx("span", { className: classNames("i-input-message", {
                    [`i-input-${status}`]: status !== "normal",
                }), children: tip }))] }));
}

export { InputContainer as default };
//# sourceMappingURL=container.js.map
