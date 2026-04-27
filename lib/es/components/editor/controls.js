import { jsx } from 'react/jsx-runtime';
import { ClearAllRound, UndoRound, RedoRound, StrikethroughSRound, FormatUnderlinedRound, FormatItalicRound, FormatBoldRound } from '@ricons/material';
import { escapeAttrValue } from 'xss';
import Button from '../button/button.js';
import Icon from '../icon/icon.js';

const exec = (a, b, c) => {
    if (typeof document === "undefined")
        return;
    return document.execCommand(a, b, c);
};
const xssOptions = {
    onIgnoreTagAttr(tag, name, value) {
        if (["class", "contenteditable"].includes(name)) {
            return name + '="' + escapeAttrValue(value) + '"';
        }
        if (["data-", "style"].includes(name.substring(0, 5))) {
            return name + '="' + escapeAttrValue(value) + '"';
        }
    },
};
const handleMouseDown = (e) => {
    e.preventDefault();
};
const fnMap = {
    bold: {
        icon: jsx(FormatBoldRound, {}),
        onClick: () => exec("bold"),
    },
    italic: {
        icon: jsx(FormatItalicRound, {}),
        onClick: () => exec("italic"),
    },
    underline: {
        icon: jsx(FormatUnderlinedRound, {}),
        onClick: () => exec("underline"),
    },
    strike: {
        icon: jsx(StrikethroughSRound, {}),
        onClick: () => exec("strikeThrough"),
    },
    redo: {
        icon: jsx(RedoRound, {}),
        onClick: () => exec("redo"),
    },
    undo: {
        icon: jsx(UndoRound, {}),
        onClick: () => exec("undo"),
    },
    clear: {
        icon: jsx(ClearAllRound, {}),
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
        const { icon, onClick } = typedFnMap[k];
        return (jsx(Button, { ...controlBtnProps, onMouseDown: handleMouseDown, onClick: onClick, children: jsx(Icon, { icon: icon }) }, k));
    });
    const extControls = (addtionControls ?? []).map((item, index) => (jsx(Button, { ...controlBtnProps, onMouseDown: handleMouseDown, onClick: (e) => item.onClick?.(getSelection(), e), children: item.icon }, `addtion-${index}`)));
    return [...controls, ...extControls];
}

export { getControls as default, exec, xssOptions };
//# sourceMappingURL=controls.js.map
