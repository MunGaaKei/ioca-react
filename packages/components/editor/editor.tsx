import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import xss from "xss";
import { IButton } from "../button/type";
import getControls, { exec, xssOptions } from "./controls";
import "./index.css";
import Memtion, {
    filterMemtionOptions,
    getMemtionReplaceRange,
    getMemtionText,
    getSelectionRect,
    insertMemtionOption,
    removeAdjacentMemtionTag,
} from "./memtion";
import { IEditor, IEditorMemtionOption } from "./type";

const controlBtnProps: IButton = {
    square: true,
    flat: true,
    size: "small",
};

const Editor = (props: IEditor) => {
    const {
        ref,
        value = "",
        width,
        height = "10em",
        placeholder,
        autosize,
        border = true,
        mode = "rich",
        hideControl,
        addtionControls,
        memtion,
        className,
        style,
        onChange,
        onEnter,
        onFocus,
        onBlur,
        onPaste,
        onMouseUp,
        onKeyUp,
        onKeyDown,
        ...restProps
    } = props;
    const editorRef = useRef<HTMLDivElement>(null);
    const selectionRef = useRef<Range | null>(null);
    const memtionTriggerRangeRef = useRef<Range | null>(null);
    const pendingMemtionRef = useRef(false);
    const [memtionVisible, setMemtionVisible] = useState(false);
    const [memtionRect, setMemtionRect] = useState<DOMRect | null>(null);
    const [memtionKeyword, setMemtionKeyword] = useState("");
    const [memtionActiveIndex, setMemtionActiveIndex] = useState(0);
    const memtionOptions = useMemo(
        () => filterMemtionOptions(memtion?.options ?? [], memtionKeyword),
        [memtion?.options, memtionKeyword],
    );

    const sanitizeValue = (nextValue: string) => {
        if (mode === "plaintext") {
            return nextValue === "\n" ? "" : nextValue;
        }

        const safeHtml = xss(nextValue, xssOptions);

        return safeHtml === "<br>" ? "" : safeHtml;
    };

    const rememberSelection = () => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const parent =
            container.nodeType === Node.ELEMENT_NODE
                ? (container as Element)
                : container.parentElement;

        if (!parent || !editorRef.current.contains(parent)) return;

        selectionRef.current = range.cloneRange();
    };

    const setEditorValue = (nextValue: string) => {
        if (!editorRef.current) return;

        const safeValue = sanitizeValue(nextValue);

        if (mode === "plaintext") {
            editorRef.current.textContent = safeValue;
            return;
        }

        editorRef.current.innerHTML = safeValue;
    };

    const getEditorValue = (sanitize = false) => {
        if (!editorRef.current) return "";

        const nextValue =
            mode === "plaintext"
                ? (editorRef.current.textContent ?? "")
                : editorRef.current.innerHTML;

        return sanitize ? sanitizeValue(nextValue) : nextValue;
    };

    const hideMemtion = () => {
        pendingMemtionRef.current = false;
        memtionTriggerRangeRef.current = null;
        setMemtionVisible(false);
        setMemtionRect(null);
        setMemtionKeyword("");
        setMemtionActiveIndex(0);
    };

    const insertMemtion = (option: IEditorMemtionOption) => {
        const replaceRange = getMemtionReplaceRange(
            memtionTriggerRangeRef.current,
            selectionRef.current,
        );

        const range = insertMemtionOption({
            editor: editorRef.current,
            range: replaceRange,
            mode,
            memtion,
            option,
            sanitizeValue,
        });

        if (!range || !editorRef.current) return;

        selectionRef.current = range.cloneRange();
        hideMemtion();
        editorRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const handlePaste = (e) => {
        onPaste?.(e);

        if (e.defaultPrevented) return;

        e.preventDefault();

        if (mode === "plaintext") {
            const text = e.clipboardData.getData("text/plain");
            exec("insertText", false, text);
            return;
        }

        const html = e.clipboardData.getData("text/html");
        if (html) {
            exec("insertHTML", false, sanitizeValue(html));
            return;
        }

        const text = e.clipboardData.getData("text/plain");
        exec("insertText", false, text);
    };

    const handleKeyDown = (e) => {
        onKeyDown?.(e);

        if (
            mode === "rich" &&
            (e.key === "Backspace" || e.key === "Delete") &&
            removeAdjacentMemtionTag(editorRef.current, e.key)
        ) {
            e.preventDefault();
            rememberSelection();
            editorRef.current?.dispatchEvent(
                new Event("input", { bubbles: true }),
            );
            return;
        }

        const memtionKey = memtion?.key ?? "@";
        if (memtionVisible && e.key === " ") {
            hideMemtion();
        }

        if (memtionVisible && memtionOptions.length) {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setMemtionActiveIndex((index) =>
                        index + 1 >= memtionOptions.length ? 0 : index + 1,
                    );
                    return;
                case "ArrowUp":
                    e.preventDefault();
                    setMemtionActiveIndex((index) =>
                        index - 1 < 0 ? memtionOptions.length - 1 : index - 1,
                    );
                    return;
                case "Enter":
                    e.preventDefault();
                    insertMemtion(memtionOptions[memtionActiveIndex]);
                    return;
                default:
                    break;
            }
        }

        if (memtion && e.key === memtionKey) {
            rememberSelection();
            memtionTriggerRangeRef.current =
                selectionRef.current?.cloneRange() ?? null;
            pendingMemtionRef.current = true;
        }

        switch (e.key) {
            case "Tab":
                e.preventDefault();
                exec(
                    mode === "plaintext" ? "insertText" : "insertHTML",
                    false,
                    mode === "plaintext" ? "\t" : "&#09;",
                );
                break;
            case "Enter":
                if (!onEnter) break;
                e.preventDefault();
                onEnter(e);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (!editorRef.current) return;
        const nextValue = sanitizeValue(value);
        if (getEditorValue(true) === nextValue) return;

        setEditorValue(nextValue);

        if (autosize) {
            editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
        }
    }, [autosize, mode, value]);

    useEffect(() => {
        if (!memtionOptions.length) {
            setMemtionActiveIndex(0);
            return;
        }

        setMemtionActiveIndex((index) =>
            index >= memtionOptions.length ? 0 : index,
        );
    }, [memtionOptions]);

    const handleInput = (e) => {
        const rawValue = getEditorValue();
        let nextValue = sanitizeValue(rawValue);

        if (!nextValue && rawValue && editorRef.current) {
            nextValue = "";
            setEditorValue(nextValue);
        }

        rememberSelection();

        if (memtion && (pendingMemtionRef.current || memtionVisible)) {
            const memtionKey = memtion?.key ?? "@";
            const memtionText = getMemtionText(
                memtionTriggerRangeRef.current,
                selectionRef.current,
            );

            if (!memtionText.startsWith(memtionKey) || /\s/.test(memtionText)) {
                hideMemtion();
            } else {
                const keyword = memtionText.slice(memtionKey.length);
                pendingMemtionRef.current = false;
                setMemtionRect(getSelectionRect(selectionRef.current));
                setMemtionKeyword(keyword);
                setMemtionActiveIndex(0);
                setMemtionVisible(true);
            }
        }

        if (autosize && editorRef.current) {
            editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
        }

        onChange?.(nextValue, e);
    };

    const handleFocus = (e) => {
        rememberSelection();
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        hideMemtion();
        onBlur?.(e);
    };

    const handleMouseUp = (e) => {
        rememberSelection();
        onMouseUp?.(e);
    };

    const handleKeyUp = (e) => {
        rememberSelection();
        onKeyUp?.(e);
    };

    const handleRef = (node: HTMLDivElement | null) => {
        editorRef.current = node;

        if (typeof ref === "function") {
            ref(node);
            return;
        }

        if (ref) {
            ref.current = node;
        }
    };

    const getSelection = useCallback(
        () => selectionRef.current?.cloneRange() ?? null,
        [],
    );

    const controls = useMemo(
        () =>
            getControls({
                controlBtnProps,
                addtionControls,
                getSelection,
            }),
        [addtionControls, getSelection],
    );

    return (
        <div
            className={classNames("i-editor", className, {
                "i-editor-borderless": !border,
            })}
            style={{
                ...style,
                [autosize ? "minHeight" : "height"]: height,
                width,
            }}
        >
            {!hideControl && (
                <div className="i-editor-controls">{controls}</div>
            )}

            {memtion && (
                <Memtion
                    visible={memtionVisible}
                    rect={memtionRect}
                    options={memtionOptions}
                    activeIndex={memtionActiveIndex}
                    onActiveChange={setMemtionActiveIndex}
                    onSelect={insertMemtion}
                />
            )}

            <div
                ref={handleRef}
                className="i-editor-content"
                data-placeholder={placeholder}
                contentEditable={mode === "plaintext" ? "plaintext-only" : true}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseUp={handleMouseUp}
                onPaste={handlePaste}
                onInput={handleInput}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                {...restProps}
            />
        </div>
    );
};

export default Editor;
