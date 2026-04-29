'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var button = require('../button/button.js');
var icon = require('../icon/icon.js');

const exec = (a, b, c) => {
    if (typeof document === "undefined")
        return;
    return document.execCommand(a, b, c);
};
const escapeHtmlAttr = (value) => value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const xssOptions = {
    onIgnoreTagAttr(tag, name, value) {
        if (["class", "contenteditable"].includes(name)) {
            return name + '="' + escapeHtmlAttr(value) + '"';
        }
        if (["data-", "style"].includes(name.substring(0, 5))) {
            return name + '="' + escapeHtmlAttr(value) + '"';
        }
    },
};
const handleMouseDown = (e) => {
    e.preventDefault();
};
const defaultControls = [
    { key: "undo", icon: jsxRuntime.jsx(material.UndoRound, {}), onClick: () => exec("undo") },
    { key: "redo", icon: jsxRuntime.jsx(material.RedoRound, {}), onClick: () => exec("redo") },
    { key: "bold", icon: jsxRuntime.jsx(material.FormatBoldRound, {}), onClick: () => exec("bold") },
    { key: "italic", icon: jsxRuntime.jsx(material.FormatItalicRound, {}), onClick: () => exec("italic") },
    {
        key: "underline",
        icon: jsxRuntime.jsx(material.FormatUnderlinedRound, {}),
        onClick: () => exec("underline"),
    },
    {
        key: "strike",
        icon: jsxRuntime.jsx(material.StrikethroughSRound, {}),
        onClick: () => exec("strikeThrough"),
    },
    {
        key: "clear",
        icon: jsxRuntime.jsx(material.ClearAllRound, {}),
        onClick: () => exec("removeFormat"),
    },
];
function getControls(options) {
    const { controlBtnProps, addtionControls, getSelection } = options;
    const controls = defaultControls.map(({ key, icon: icon$1, onClick }) => (jsxRuntime.jsx(button.default, { ...controlBtnProps, onMouseDown: handleMouseDown, onClick: onClick, children: jsxRuntime.jsx(icon.default, { icon: icon$1 }) }, key)));
    const extControls = (addtionControls ?? []).map((item, index) => (jsxRuntime.jsx(button.default, { ...controlBtnProps, onMouseDown: handleMouseDown, onClick: (e) => item.onClick?.(getSelection(), e), children: item.icon }, `addtion-${index}`)));
    return [...controls, ...extControls];
}

exports.default = getControls;
exports.exec = exec;
exports.xssOptions = xssOptions;
//# sourceMappingURL=controls.js.map
