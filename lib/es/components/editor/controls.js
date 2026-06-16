import { jsx } from 'react/jsx-runtime';
import { UndoRound, RedoRound, FormatBoldRound, FormatItalicRound, FormatUnderlinedRound, StrikethroughSRound, ClearAllRound } from '@ricons/material';
import Button from '../button/button.js';
import Icon from '../icon/icon.js';

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
    { key: "undo", icon: jsx(UndoRound, {}), onClick: () => exec("undo") },
    { key: "redo", icon: jsx(RedoRound, {}), onClick: () => exec("redo") },
    { key: "bold", icon: jsx(FormatBoldRound, {}), onClick: () => exec("bold") },
    { key: "italic", icon: jsx(FormatItalicRound, {}), onClick: () => exec("italic") },
    {
        key: "underline",
        icon: jsx(FormatUnderlinedRound, {}),
        onClick: () => exec("underline"),
    },
    {
        key: "strike",
        icon: jsx(StrikethroughSRound, {}),
        onClick: () => exec("strikeThrough"),
    },
    {
        key: "clear",
        icon: jsx(ClearAllRound, {}),
        onClick: () => exec("removeFormat"),
    },
];
function getControls(options) {
    const { controlBtnProps, addtionControls, getSelection } = options;
    const controls = defaultControls.map(({ key, icon, onClick }) => (jsx(Button, { ...controlBtnProps, onMouseDown: handleMouseDown, onClick: onClick, children: jsx(Icon, { icon: icon }) }, key)));
    const extControls = (addtionControls ?? []).map((item, index) => (jsx(Button, { ...controlBtnProps, onMouseDown: handleMouseDown, onClick: (e) => item.onClick?.(getSelection(), e), children: item.icon }, `addtion-${index}`)));
    return [...controls, ...extControls];
}

export { getControls as default, exec, xssOptions };
