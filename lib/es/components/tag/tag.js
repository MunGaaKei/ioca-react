import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import Helpericon from '../utils/helpericon/helpericon.js';

const Tag = (props) => {
    const { dot, dotClass, outline, round, size = "normal", hoverShowClose, className, children, onClose, onClick, ...restProps } = props;
    return (jsxs("span", { className: classNames("i-tag", {
            "i-tag-outline": outline,
            "i-tag-clickable": onClick,
            [`i-tag-${size}`]: size !== "normal",
            round,
        }, className), onClick: onClick, ...restProps, children: [dot && jsx("span", { className: classNames("i-tag-dot", dotClass) }), children, onClose && (jsx(Helpericon, { active: true, className: classNames("i-tag-close", {
                    "i-tag-hover-close": hoverShowClose,
                }), onClick: onClose }))] }));
};

export { Tag as default };
//# sourceMappingURL=tag.js.map
