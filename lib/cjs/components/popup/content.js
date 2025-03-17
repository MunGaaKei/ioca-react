'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var reactDom = require('react-dom');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

const Content = (props) => {
    const { ref, getContainer = (trigger) => trigger?.offsetParent ?? document.body, trigger, arrow, arrowProps = {}, className, children, ...restProps } = props;
    const arrowCSS = react.useMemo(() => {
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
    const content = (jsxRuntime.jsxs("div", { ref: ref, className: classNames__default.default("i-popup", className), ...restProps, children: [arrow && (jsxRuntime.jsx("svg", { xmlns: 'http://www.w3.org/2000/svg', className: 'i-popup-arrow', style: arrowCSS, children: jsxRuntime.jsx("path", { d: 'M0.5 0L1.5 0C1.5 4, 3 5.5, 5 7.5S8,10 8,12S7 14.5, 5 16.5S1.5,20 1.5,24L0.5 24L0.5 0z' }) })), children] }));
    return reactDom.createPortal(content, getContainer(trigger));
};

exports.default = Content;
//# sourceMappingURL=content.js.map
