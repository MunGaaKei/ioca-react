'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var xss = require('xss');
require('../button/index.js');
var icon = require('../icon/icon.js');
var button = require('../button/button.js');

const exec = (a, b, c) => {
    if (typeof document === "undefined")
        return;
    return document.execCommand(a, b, c);
};
const xssOptions = {
    onIgnoreTagAttr: function (tag, name, value) {
        if (["data-", "style"].includes(name.substr(0, 5))) {
            return name + '="' + xss.escapeAttrValue(value) + '"';
        }
    },
};
const fnMap = {
    bold: {
        icon: jsxRuntime.jsx(material.FormatBoldRound, {}),
        onClick: () => exec("bold"),
        tip: "粗体",
    },
    italic: {
        icon: jsxRuntime.jsx(material.FormatItalicRound, {}),
        onClick: () => exec("italic"),
        tip: "斜体",
    },
    underline: {
        icon: jsxRuntime.jsx(material.FormatUnderlinedRound, {}),
        onClick: () => exec("underline"),
        tip: "下划线",
    },
    strike: {
        icon: jsxRuntime.jsx(material.StrikethroughSRound, {}),
        onClick: () => exec("strikeThrough"),
        tip: "删除线",
    },
    redo: {
        icon: jsxRuntime.jsx(material.RedoRound, {}),
        onClick: () => exec("redo"),
        tip: "重做",
    },
    undo: {
        icon: jsxRuntime.jsx(material.UndoRound, {}),
        onClick: () => exec("undo"),
        tip: "撤销",
    },
    // color: {
    // 	icon: <FormatColorTextRound />,
    // 	onClick: () => exec("foreColor", false, ""),
    // },
    // backColor: {
    // 	icon: <FormatColorFillRound />,
    // 	onClick: () => exec("backColor", false, ""),
    // },
    clear: {
        icon: jsxRuntime.jsx(material.ClearAllRound, {}),
        onClick: () => exec("removeFormat"),
        tip: "清除格式",
    },
};
const aliasMap = {
    simple: ["undo", "redo", "bold", "italic", "underline", "strike", "clear"],
    all: Object.keys(fnMap),
};
function getControls(fns, options) {
    const { controlBtnProps } = options;
    const keys = typeof fns === "string" ? aliasMap[fns] : fns;
    return keys.map((k) => {
        if (fnMap[k]) {
            const { icon: icon$1, render, tip, onClick } = fnMap[k];
            if (render) {
                return render(options);
            }
            return (jsxRuntime.jsxs(button.default, { ...controlBtnProps, onClick: onClick, children: [jsxRuntime.jsx(icon.default, { icon: icon$1 }), tip && jsxRuntime.jsx("span", { className: 'i-editor-control-tip', children: tip })] }, k));
        }
        return jsxRuntime.jsx(jsxRuntime.Fragment, {}, k);
    });
}

exports.default = getControls;
exports.exec = exec;
exports.xssOptions = xssOptions;
//# sourceMappingURL=controls.js.map
