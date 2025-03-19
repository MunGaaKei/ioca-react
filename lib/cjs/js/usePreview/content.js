'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var button = require('../../components/button/button.js');
var icon = require('../../components/icon/icon.js');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var hooks = require('../hooks.js');
var utils = require('../utils.js');
var renderFile = require('./renderFile.js');
var type = require('./type.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function Content(props) {
    const { items = [], initial = 0, renderFile: renderFile$1 = renderFile.default, onRotate, onChange, onClose, onZoom, } = props;
    const state = ahooks.useReactive({
        current: initial,
        rotate: 0,
        scale: 1,
        translate: [0, 0],
        start: [0, 0],
        dragging: false,
        controlHidden: true,
    });
    const box = react.useRef(null);
    const translate = react.useRef([0, 0]);
    const hiddenTO = react.useRef(null);
    const files = react.useMemo(() => {
        return items.map((item) => {
            const o = {
                src: "",
            };
            if (typeof item === "string") {
                o.src = item;
            }
            else {
                Object.assign(o, item);
            }
            o.suffix = utils.getSuffixByUrl(o.src) || "";
            o.type = utils.getFileType(o.suffix, item["type"]);
            return o;
        });
    }, [items]);
    const { file, content } = react.useMemo(() => {
        const file = files[state.current];
        const content = renderFile$1(file);
        return {
            file,
            content,
        };
    }, [state.current, items]);
    const isImage = file.type === type.TFileType.IMAGE;
    const handleSwitch = (next) => {
        const l = files.length;
        const { current: before } = state;
        if (next >= l) {
            state.current = 0;
        }
        else if (next < 0) {
            state.current = l - 1;
        }
        else {
            state.current = next;
        }
        onChange?.(state.current, before);
        state.rotate = files[state.current].rotate || 0;
        if (state.scale !== 1) {
            state.scale = 1;
            onZoom?.(1);
        }
        onRotate?.(state.rotate);
        state.translate = translate.current = [0, 0];
    };
    const handleRotate = (deg) => {
        state.rotate += deg;
        onRotate?.(state.rotate);
    };
    const handleMouseWheel = radash.throttle({ interval: 60 }, (e) => {
        if (!isImage)
            return;
        let after = state.scale + (e.deltaY < 0 ? 0.05 : -0.05);
        if (after > 2)
            after = 2;
        if (after < 0.25)
            after = 0.25;
        onZoom?.(after);
        state.scale = after;
    });
    const handleMouseDown = (e) => {
        if (!isImage)
            return;
        e.preventDefault();
        state.dragging = true;
        state.start = [e.pageX, e.pageY];
    };
    const clearHiddenTO = () => {
        if (!hiddenTO.current || state.controlHidden)
            return;
        clearTimeout(hiddenTO.current);
        hiddenTO.current = null;
    };
    const setHiddenFalse = () => {
        if (!state.controlHidden)
            return;
        state.controlHidden = false;
        clearHiddenTO();
        hiddenTO.current = setTimeout(() => {
            state.controlHidden = true;
        }, 1000);
    };
    const throttleMouseMove = radash.throttle({ interval: 300 }, setHiddenFalse);
    const handleMouseMove = (e) => {
        throttleMouseMove();
        if (!state.dragging)
            return;
        e.preventDefault();
        const [x, y] = translate.current;
        const [ox, oy] = state.start;
        const offsetX = e.pageX - ox;
        const offsetY = e.pageY - oy;
        state.translate = [x + offsetX, y + offsetY];
    };
    const handleMouseUp = () => {
        if (!state.dragging)
            return;
        state.dragging = false;
        translate.current = state.translate;
    };
    hooks.useMouseMove(handleMouseMove);
    hooks.useMouseUp(handleMouseUp);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("div", { ref: box, className: classNames__default("i-preview-content", {
                    "no-transition": state.dragging,
                }), style: {
                    transform: `translate(${state.translate
                        .map((n) => `${n}px`)
                        .join(",")}) rotate(${state.rotate}deg) scale(${state.scale})`,
                }, onWheel: handleMouseWheel, onMouseDown: handleMouseDown, onClick: (e) => e.stopPropagation(), children: content }), jsxRuntime.jsxs("div", { className: classNames__default("i-preview-controls", {
                    "i-preview-controls-hidden": state.controlHidden,
                }), children: [jsxRuntime.jsx(button.default, { square: true, flat: true, onClick: onClose, children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.CloseRound, {}) }) }), files.length > 1 && (jsxRuntime.jsxs("span", { className: 'px-8', children: [state.current + 1, " / ", files.length] })), state.scale !== 1 && (jsxRuntime.jsxs(button.default, { flat: true, onClick: () => (state.scale = 1), children: [jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.AspectRatioRound, {}) }), jsxRuntime.jsxs("span", { className: 'mt-2', children: [(state.scale * 100).toFixed(0), "%"] })] })), jsxRuntime.jsx(button.default, { square: true, flat: true, href: file.src, target: '_blank', children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.OpenInNewRound, {}) }) }), jsxRuntime.jsx(button.default, { square: true, flat: true, href: file.src, download: true, target: '_blank', children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.FileDownloadOutlined, {}) }) }), jsxRuntime.jsx(button.default, { square: true, flat: true, onClick: () => handleRotate(90), children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.RotateRightRound, {}) }) }), jsxRuntime.jsx(button.default, { square: true, flat: true, onClick: () => handleRotate(-90), children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.RotateLeftRound, {}) }) }), files.length > 1 && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(button.default, { square: true, flat: true, onClick: () => handleSwitch(state.current - 1), children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowLeftRound, {}) }) }), jsxRuntime.jsx(button.default, { square: true, flat: true, onClick: () => handleSwitch(state.current + 1), children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowRightRound, {}) }) })] }))] })] }));
}

exports.default = Content;
//# sourceMappingURL=content.js.map
