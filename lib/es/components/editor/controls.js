import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { FormatBoldRound, FormatItalicRound, FormatUnderlinedRound, StrikethroughSRound, RedoRound, UndoRound, ClearAllRound } from '@ricons/material';
import { escapeAttrValue } from 'xss';
import '../button/index.js';
import Icon from '../icon/icon.js';
import Button from '../button/button.js';

const exec = (a, b, c) => {
    if (typeof document === "undefined")
        return;
    return document.execCommand(a, b, c);
};
const xssOptions = {
    onIgnoreTagAttr: function (tag, name, value) {
        if (["data-", "style"].includes(name.substr(0, 5))) {
            return name + '="' + escapeAttrValue(value) + '"';
        }
    },
};
const fnMap = {
    bold: {
        icon: jsx(FormatBoldRound, {}),
        onClick: () => exec("bold"),
        tip: "粗体",
    },
    italic: {
        icon: jsx(FormatItalicRound, {}),
        onClick: () => exec("italic"),
        tip: "斜体",
    },
    underline: {
        icon: jsx(FormatUnderlinedRound, {}),
        onClick: () => exec("underline"),
        tip: "下划线",
    },
    strike: {
        icon: jsx(StrikethroughSRound, {}),
        onClick: () => exec("strikeThrough"),
        tip: "删除线",
    },
    redo: {
        icon: jsx(RedoRound, {}),
        onClick: () => exec("redo"),
        tip: "重做",
    },
    undo: {
        icon: jsx(UndoRound, {}),
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
        icon: jsx(ClearAllRound, {}),
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
            const { icon, render, tip, onClick } = fnMap[k];
            if (render) {
                return render(options);
            }
            return (jsxs(Button, { ...controlBtnProps, onClick: onClick, children: [jsx(Icon, { icon: icon }), tip && jsx("span", { className: 'i-editor-control-tip', children: tip })] }, k));
        }
        return jsx(Fragment, {}, k);
    });
}

export { getControls as default, exec, xssOptions };
//# sourceMappingURL=controls.js.map
