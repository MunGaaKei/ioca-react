import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';

const Content = (props) => {
    const { ref, getContainer = (trigger) => {
        if (typeof document === "undefined")
            return null;
        return trigger?.offsetParent ?? document.body;
    }, trigger, arrow, arrowProps = {}, className, children, ...restProps } = props;
    const arrowCSS = useMemo(() => {
        let { left, top, pos } = arrowProps;
        let transform = "";
        switch (pos) {
            case "left":
                left += 2;
                transform = `translate(-100%, -50%) rotate(180deg)`;
                break;
            case "right":
                left -= 2;
                transform = `translate(0, -50%)`;
                break;
            case "top":
                top -= 2;
                transform = `translate(-50%, -50%) rotate(-90deg)`;
                break;
            case "bottom":
                top += 2;
                transform = `translate(-50%, -50%) rotate(90deg)`;
                break;
        }
        return {
            left,
            top,
            transform,
        };
    }, [arrowProps]);
    const content = (jsxs("div", { ref: ref, className: classNames("i-popup", className), ...restProps, children: [arrow && (jsx("svg", { xmlns: 'http://www.w3.org/2000/svg', className: 'i-popup-arrow', style: arrowCSS, children: jsx("path", { d: 'M0.5 0L1.5 0C1.5 4, 3 5.5, 5 7.5S8,10 8,12S7 14.5, 5 16.5S1.5,20 1.5,24L0.5 24L0.5 0z' }) })), children] }));
    return createPortal(content, getContainer(trigger));
};

export { Content as default };
//# sourceMappingURL=content.js.map
