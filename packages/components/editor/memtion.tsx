import { memo, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { escapeAttrValue } from "xss";
import List from "../list";
import { IEditorMemtion, IEditorMemtionOption } from "./type";

export const MEMTION_TAG_CLASS_NAME = "i-memtion-tag";

interface IMemtionProps {
    visible?: boolean;
    rect?: DOMRect | null;
    options?: IEditorMemtionOption[];
    activeIndex?: number;
    onActiveChange?: (index: number) => void;
    onSelect?: (option: IEditorMemtionOption) => void;
}

interface IInsertMemtionOptionParams {
    editor: HTMLDivElement | null;
    range: Range | null;
    mode: "rich" | "plaintext";
    memtion?: IEditorMemtion;
    option: IEditorMemtionOption;
    sanitizeValue: (value: string) => string;
}

const getInsertNode = (
    memtion: IEditorMemtion | undefined,
    option: IEditorMemtionOption,
) => memtion?.insert?.(option) ?? option.value;

const getInsertText = (
    memtion: IEditorMemtion | undefined,
    option: IEditorMemtionOption,
) => {
    const nextNode = getInsertNode(memtion, option);

    if (typeof nextNode === "string" || typeof nextNode === "number") {
        return `${String(nextNode)} `;
    }

    return `${String(option.value)} `;
};

const getInsertHtml = (
    memtion: IEditorMemtion | undefined,
    option: IEditorMemtionOption,
    sanitizeValue: (value: string) => string,
) => {
    const nextNode = getInsertNode(memtion, option);

    if (nextNode === null || nextNode === undefined || nextNode === false) {
        return "";
    }

    const content = sanitizeValue(
        renderToStaticMarkup(<>{nextNode as ReactNode}</>),
    );

    return `<span class="${MEMTION_TAG_CLASS_NAME}" contenteditable="false" data-memtion-value="${escapeAttrValue(String(option.value))}">${content}</span>`;
};

export const getSelectionRect = (range: Range | null) => {
    if (!range) return null;

    const rect = range.getBoundingClientRect();

    if (rect.width || rect.height) {
        return rect;
    }

    return range.getClientRects()[0] ?? rect;
};

export const insertMemtionOption = ({
    editor,
    range,
    mode,
    memtion,
    option,
    sanitizeValue,
}: IInsertMemtionOptionParams) => {
    if (!editor || !range) return null;

    const browserSelection = window.getSelection();
    if (!browserSelection) return null;

    const nextRange = range.cloneRange();
    browserSelection.removeAllRanges();
    browserSelection.addRange(nextRange);
    editor.focus();
    nextRange.deleteContents();

    if (mode === "plaintext") {
        const text = document.createTextNode(getInsertText(memtion, option));
        nextRange.insertNode(text);
        nextRange.setStartAfter(text);
    } else {
        const html = getInsertHtml(memtion, option, sanitizeValue);
        const fragment = nextRange.createContextualFragment(html);
        const lastNode = fragment.lastChild;
        const spacing = document.createTextNode(" ");

        nextRange.insertNode(fragment);

        if (lastNode) {
            nextRange.setStartAfter(lastNode);
            nextRange.collapse(true);
        }

        nextRange.insertNode(spacing);
        nextRange.setStartAfter(spacing);
    }

    nextRange.collapse(true);
    browserSelection.removeAllRanges();
    browserSelection.addRange(nextRange);

    return nextRange;
};

export const getMemtionText = (
    triggerRange: Range | null,
    selectionRange: Range | null,
) => {
    if (!triggerRange || !selectionRange) return "";

    const range = triggerRange.cloneRange();
    range.setEnd(selectionRange.endContainer, selectionRange.endOffset);

    return range.toString();
};

export const getMemtionReplaceRange = (
    triggerRange: Range | null,
    selectionRange: Range | null,
) => {
    if (!triggerRange || !selectionRange) return null;

    const range = triggerRange.cloneRange();
    range.setEnd(selectionRange.endContainer, selectionRange.endOffset);

    return range;
};

export const filterMemtionOptions = (
    options: IEditorMemtionOption[],
    keyword: string,
) => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
        return options;
    }

    return options.filter((option) =>
        String(option.value).toLowerCase().includes(normalizedKeyword),
    );
};

const isMemtionTag = (node: Node | null) =>
    node instanceof HTMLElement &&
    node.classList.contains(MEMTION_TAG_CLASS_NAME);

const getAdjacentMemtionTag = (
    range: Range,
    direction: "backward" | "forward",
) => {
    const { startContainer, startOffset } = range;

    if (startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = startContainer as Text;

        if (direction === "backward" && startOffset === 0) {
            return isMemtionTag(textNode.previousSibling)
                ? (textNode.previousSibling as HTMLElement)
                : null;
        }

        if (direction === "forward" && startOffset === textNode.data.length) {
            return isMemtionTag(textNode.nextSibling)
                ? (textNode.nextSibling as HTMLElement)
                : null;
        }

        return null;
    }

    const element = startContainer as Element;
    const targetIndex =
        direction === "backward" ? startOffset - 1 : startOffset;
    const targetNode = element.childNodes.item(targetIndex);

    return isMemtionTag(targetNode) ? (targetNode as HTMLElement) : null;
};

export const removeAdjacentMemtionTag = (
    editor: HTMLDivElement | null,
    key: "Backspace" | "Delete",
) => {
    if (!editor) return false;

    const selection = window.getSelection();
    if (!selection?.rangeCount || !selection.isCollapsed) return false;

    const activeRange = selection.getRangeAt(0);
    const tag = getAdjacentMemtionTag(
        activeRange,
        key === "Backspace" ? "backward" : "forward",
    );

    if (!tag || !tag.parentNode) return false;

    const parent = tag.parentNode;
    const nextSibling = tag.nextSibling;
    const index = Array.prototype.indexOf.call(parent.childNodes, tag);

    if (nextSibling?.nodeType === Node.TEXT_NODE) {
        const textNode = nextSibling as Text;

        if (textNode.data.startsWith(" ")) {
            textNode.deleteData(0, 1);

            if (!textNode.data.length) {
                nextSibling.remove();
            }
        }
    }

    tag.remove();

    const range = document.createRange();
    range.setStart(parent, Math.min(index, parent.childNodes.length));
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus();

    return true;
};

const Memtion = (props: IMemtionProps) => {
    const { visible, rect, options, activeIndex, onActiveChange, onSelect } =
        props;

    if (!visible || !rect || !options?.length) {
        return null;
    }

    return (
        <List
            className="i-editor-memtion"
            type="option"
            style={{
                position: "fixed",
                top: rect.bottom,
                left: rect.left,
            }}
        >
            {options.map((option, i) => (
                <List.Item
                    key={`${option.value}-${i}`}
                    type="option"
                    active={i === activeIndex}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => onActiveChange?.(i)}
                    onClick={() => onSelect?.(option)}
                >
                    {option.label}
                </List.Item>
            ))}
        </List>
    );
};

export default memo(Memtion);
