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
import { escapeAttrValue, type IFilterXSSOptions } from "xss";
import Button from "../button";
import { IButton } from "../button/type";
import Icon from "../icon";
import { IEditorAddtionControl } from "./type";

export const exec = (a, b?, c?) => {
    if (typeof document === "undefined") return;
    return document.execCommand(a, b, c);
};

export const xssOptions: IFilterXSSOptions = {
    onIgnoreTagAttr(tag, name, value) {
        if (["class", "contenteditable"].includes(name)) {
            return name + '="' + escapeAttrValue(value) + '"';
        }
        if (["data-", "style"].includes(name.substring(0, 5))) {
            return name + '="' + escapeAttrValue(value) + '"';
        }
    },
};

const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
};

const fnMap = {
    bold: {
        icon: <FormatBoldRound />,
        onClick: () => exec("bold"),
    },
    italic: {
        icon: <FormatItalicRound />,
        onClick: () => exec("italic"),
    },
    underline: {
        icon: <FormatUnderlinedRound />,
        onClick: () => exec("underline"),
    },
    strike: {
        icon: <StrikethroughSRound />,
        onClick: () => exec("strikeThrough"),
    },
    redo: {
        icon: <RedoRound />,
        onClick: () => exec("redo"),
    },
    undo: {
        icon: <UndoRound />,
        onClick: () => exec("undo"),
    },
    clear: {
        icon: <ClearAllRound />,
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
] as const;

type ControlKey = (typeof defaultKeys)[number];
type ControlItem = {
    icon: ReactNode;
    onClick: () => void;
};

const typedFnMap: Record<ControlKey, ControlItem> = fnMap;

export default function getControls(options: {
    controlBtnProps: IButton;
    addtionControls?: IEditorAddtionControl[];
    getSelection: () => Range | null;
}) {
    const { controlBtnProps, addtionControls, getSelection } = options;

    const controls = defaultKeys.map((k) => {
        const { icon, onClick } = typedFnMap[k];

        return (
            <Button
                key={k}
                {...controlBtnProps}
                onMouseDown={handleMouseDown}
                onClick={onClick}
            >
                <Icon icon={icon} />
            </Button>
        );
    });

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
