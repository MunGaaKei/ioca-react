import {
    ClearAllRound,
    FormatBoldRound,
    FormatItalicRound,
    FormatUnderlinedRound,
    RedoRound,
    StrikethroughSRound,
    UndoRound,
} from "@ricons/material";
import { MouseEvent, ReactNode } from "react";
import { type IFilterXSSOptions } from "xss";
import Button from "../button";
import { IButton } from "../button/type";
import Icon from "../icon";
import { IEditorAddtionControl } from "./type";

export const exec = (a, b?, c?) => {
    if (typeof document === "undefined") return;
    return document.execCommand(a, b, c);
};

const escapeHtmlAttr = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

export const xssOptions: IFilterXSSOptions = {
    onIgnoreTagAttr(tag, name, value) {
        if (["class", "contenteditable"].includes(name)) {
            return name + '="' + escapeHtmlAttr(value) + '"';
        }
        if (["data-", "style"].includes(name.substring(0, 5))) {
            return name + '="' + escapeHtmlAttr(value) + '"';
        }
    },
};

const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
};

type ControlItem = {
    key: string;
    icon: ReactNode;
    onClick: () => void;
};

const defaultControls: ControlItem[] = [
    { key: "undo", icon: <UndoRound />, onClick: () => exec("undo") },
    { key: "redo", icon: <RedoRound />, onClick: () => exec("redo") },
    { key: "bold", icon: <FormatBoldRound />, onClick: () => exec("bold") },
    { key: "italic", icon: <FormatItalicRound />, onClick: () => exec("italic") },
    {
        key: "underline",
        icon: <FormatUnderlinedRound />,
        onClick: () => exec("underline"),
    },
    {
        key: "strike",
        icon: <StrikethroughSRound />,
        onClick: () => exec("strikeThrough"),
    },
    {
        key: "clear",
        icon: <ClearAllRound />,
        onClick: () => exec("removeFormat"),
    },
];

export default function getControls(options: {
    controlBtnProps: IButton;
    addtionControls?: IEditorAddtionControl[];
    getSelection: () => Range | null;
}) {
    const { controlBtnProps, addtionControls, getSelection } = options;

    const controls = defaultControls.map(({ key, icon, onClick }) => (
        <Button
            key={key}
            {...controlBtnProps}
            onMouseDown={handleMouseDown}
            onClick={onClick}
        >
            <Icon icon={icon} />
        </Button>
    ));

    const extControls = (addtionControls ?? []).map((item, index) => (
        <Button
            key={`addtion-${index}`}
            {...controlBtnProps}
            onMouseDown={handleMouseDown}
            onClick={(e) => item.onClick?.(getSelection(), e)}
        >
            {item.icon}
        </Button>
    ));

    return [...controls, ...extControls];
}
