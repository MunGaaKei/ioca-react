'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var xss = require('xss');
var button = require('../button/button.js');
var icon = require('../icon/icon.js');

const exec = (a, b, c) => {
    if (typeof document === "undefined")
        return;
    return document.execCommand(a, b, c);
};
const xssOptions = {
    onIgnoreTagAttr(tag, name, value) {
        if (["class", "contenteditable"].includes(name)) {
            return name + '="' + xss.escapeAttrValue(value) + '"';
        }
        if (["data-", "style"].includes(name.substring(0, 5))) {
            return name + '="' + xss.escapeAttrValue(value) + '"';
        }
    },
};
const handleMouseDown = (e) => {
    e.preventDefault();
};
const fnMap = {
    bold: {
        icon: jsxRuntime.jsx(material.FormatBoldRound, {}),
        onClick: () => exec("bold"),
    },
    italic: {
        icon: jsxRuntime.jsx(material.FormatItalicRound, {}),
        onClick: () => exec("italic"),
    },
    underline: {
        icon: jsxRuntime.jsx(material.FormatUnderlinedRound, {}),
        onClick: () => exec("underline"),
    },
    strike: {
        icon: jsxRuntime.jsx(material.StrikethroughSRound, {}),
        onClick: () => exec("strikeThrough"),
    },
    redo: {
        icon: jsxRuntime.jsx(material.RedoRound, {}),
        onClick: () => exec("redo"),
    },
    undo: {
        icon: jsxRuntime.jsx(material.UndoRound, {}),
        onClick: () => exec("undo"),
    },
    clear: {
        icon: jsxRuntime.jsx(material.ClearAllRound, {}),
        onClick: () => exec("removeFormat"),
    },
};
const defaultKeys = [
    "undo",
    "redo",
    "bold",
    "italic",
    "underline",
    "strike",
    "clear",
];
const typedFnMap = fnMap;
function getControls(options) {
    const { controlBtnProps, addtionControls, getSelection } = options;
    const controls = defaultKeys.map((k) => {
        const { icon: icon$1, onClick } = typedFnMap[k];
        return (jsxRuntime.jsx(button.default, { ...controlBtnProps, onMouseDown: handleMouseDown, onClick: onClick, children: jsxRuntime.jsx(icon.default, { icon: icon$1 }) }, k));
    });
    const extControls = (addtionControls ?? []).map((item, index) => (jsxRuntime.jsx(button.default, { ...controlBtnProps, onMouseDown: handleMouseDown, onClick: (e) => item.onClick?.(getSelection(), e), children: item.icon }, `addtion-${index}`)));
    return [...controls, ...extControls];
}

exports.default = getControls;
exports.exec = exec;
exports.xssOptions = xssOptions;
//# sourceMappingURL=controls.js.map
