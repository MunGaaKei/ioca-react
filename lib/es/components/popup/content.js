import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { createPortal } from 'react-dom';

const Content = forwardRef((props, ref) => {
    const { arrow, className, children, ...restProps } = props;
    const content = (jsxs("div", { ref: ref, className: classNames("i-popup", className), ...restProps, children: [arrow && jsx("div", { className: 'i-popup-arrow' }), children] }));
    const container = typeof document === "undefined" ? null : document.body;
    if (!container)
        return null;
    return createPortal(content, container);
});

export { Content as default };
