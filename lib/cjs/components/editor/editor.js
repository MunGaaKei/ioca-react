'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var xss = require('xss');
var controls = require('./controls.js');
var memtion = require('./memtion.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);
var xss__default = /*#__PURE__*/_interopDefaultCompat(xss);

const controlBtnProps = {
    square: true,
    flat: true,
    size: "small",
};
const Editor = (props) => {
    const { ref, value = "", width, height = "10em", placeholder, autosize, border = true, mode = "rich", hideControl, addtionControls, memtion: memtion$1, className, style, onChange, onEnter, onFocus, onBlur, onPaste, onMouseUp, onKeyUp, onKeyDown, ...restProps } = props;
    const editorRef = react.useRef(null);
    const selectionRef = react.useRef(null);
    const memtionTriggerRangeRef = react.useRef(null);
    const pendingMemtionRef = react.useRef(false);
    const isPlaintextMode = mode === "plaintext";
    const isRichMode = mode === "rich";
    const isPlaintextOnMemtionMode = mode === "plaintextOnMemtion";
    const [memtionVisible, setMemtionVisible] = react.useState(false);
    const [memtionRect, setMemtionRect] = react.useState(null);
    const [memtionKeyword, setMemtionKeyword] = react.useState("");
    const [memtionActiveIndex, setMemtionActiveIndex] = react.useState(0);
    const [activeMemtionIndex, setActiveMemtionIndex] = react.useState(-1);
    const activeMemtionIndexRef = react.useRef(-1);
    const memtionOptions = react.useMemo(() => {
        if (activeMemtionIndex < 0 || !memtion$1?.length)
            return [];
        const active = memtion$1?.[activeMemtionIndex];
        return memtion.filterMemtionOptions(active?.options ?? [], memtionKeyword);
    }, [memtion$1, memtionKeyword, activeMemtionIndex]);
    const sanitizeValue = (nextValue) => {
        if (isPlaintextMode) {
            return nextValue === "\n" ? "" : nextValue;
        }
        const safeHtml = isPlaintextOnMemtionMode
            ? memtion.sanitizePlaintextOnMemtionHtml(xss__default(nextValue, controls.xssOptions))
            : xss__default(nextValue, controls.xssOptions);
        return safeHtml === "<br>" ? "" : safeHtml;
    };
    const syncHeight = () => {
        if (autosize && editorRef.current) {
            editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
        }
    };
    const rememberSelection = () => {
        if (!editorRef.current)
            return;
        const selection = window.getSelection();
        if (!selection?.rangeCount)
            return;
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const parent = container.nodeType === Node.ELEMENT_NODE
            ? container
            : container.parentElement;
        if (!parent || !editorRef.current.contains(parent))
            return;
        selectionRef.current = range.cloneRange();
    };
    const setEditorValue = (nextValue) => {
        if (!editorRef.current)
            return;
        const safeValue = sanitizeValue(nextValue);
        if (isPlaintextMode) {
            editorRef.current.textContent = safeValue;
            return;
        }
        editorRef.current.innerHTML = safeValue;
    };
    const getEditorValue = (sanitize = false) => {
        const nextValue = !editorRef.current
            ? ""
            : isPlaintextMode
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
        setActiveMemtionIndex(-1);
    };
    const syncEditorState = () => {
        selectionRef.current = null;
        hideMemtion();
    };
    const insertMemtion = (option) => {
        const activeMemtion = memtion$1?.[activeMemtionIndex];
        const replaceRange = memtion.getMemtionReplaceRange(memtionTriggerRangeRef.current, selectionRef.current);
        const range = memtion.insertMemtionOption({
            editor: editorRef.current,
            range: replaceRange,
            mode,
            memtion: activeMemtion,
            option,
            sanitizeValue,
        });
        if (!range || !editorRef.current)
            return;
        selectionRef.current = range.cloneRange();
        hideMemtion();
        editorRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const handlePaste = (e) => {
        onPaste?.(e);
        if (e.defaultPrevented)
            return;
        e.preventDefault();
        const html = e.clipboardData.getData("text/html");
        const text = e.clipboardData.getData("text/plain");
        const pasteValue = isPlaintextMode
            ? text
            : html
                ? sanitizeValue(html)
                : text;
        controls.exec(isPlaintextMode ? "insertText" : "insertHTML", false, pasteValue);
    };
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented)
            return;
        if (!isPlaintextMode &&
            (e.key === "Backspace" || e.key === "Delete") &&
            memtion.removeAdjacentMemtionTag(editorRef.current, e.key)) {
            e.preventDefault();
            rememberSelection();
            editorRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }
        if (memtionVisible && e.key === " ") {
            hideMemtion();
        }
        if (memtionVisible && memtionOptions.length) {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setMemtionActiveIndex((index) => index + 1 >= memtionOptions.length ? 0 : index + 1);
                    return;
                case "ArrowUp":
                    e.preventDefault();
                    setMemtionActiveIndex((index) => index - 1 < 0 ? memtionOptions.length - 1 : index - 1);
                    return;
                case "Enter":
                    e.preventDefault();
                    insertMemtion(memtionOptions[memtionActiveIndex]);
                    return;
            }
        }
        if (memtion$1?.length) {
            const matchedIndex = memtion$1.findIndex((m) => e.key === m.key);
            if (matchedIndex >= 0) {
                rememberSelection();
                memtionTriggerRangeRef.current =
                    selectionRef.current?.cloneRange() ?? null;
                pendingMemtionRef.current = true;
                activeMemtionIndexRef.current = matchedIndex;
                setActiveMemtionIndex(matchedIndex);
            }
        }
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                controls.exec(isRichMode ? "insertHTML" : "insertText", false, isRichMode ? "&#09;" : "\t");
                break;
            case "Enter":
                if (e.shiftKey) {
                    break;
                }
                if (!onEnter)
                    break;
                e.preventDefault();
                onEnter(e);
                break;
        }
    };
    react.useEffect(() => {
        if (!editorRef.current)
            return;
        const nextValue = sanitizeValue(value);
        if (getEditorValue(true) === nextValue)
            return;
        setEditorValue(nextValue);
        syncEditorState();
        syncHeight();
    }, [autosize, mode, value]);
    react.useEffect(() => {
        if (!memtionOptions.length) {
            setMemtionActiveIndex(0);
            return;
        }
        setMemtionActiveIndex((index) => index >= memtionOptions.length ? 0 : index);
    }, [memtionOptions]);
    const handleInput = (e) => {
        const rawValue = getEditorValue();
        let nextValue = sanitizeValue(rawValue);
        if (isPlaintextOnMemtionMode &&
            rawValue !== nextValue &&
            editorRef.current) {
            setEditorValue(nextValue);
        }
        if (!nextValue && rawValue && editorRef.current) {
            nextValue = "";
            setEditorValue(nextValue);
        }
        rememberSelection();
        if (activeMemtionIndexRef.current >= 0 && (pendingMemtionRef.current || memtionVisible)) {
            const active = memtion$1?.[activeMemtionIndexRef.current];
            if (!active) {
                hideMemtion();
                return;
            }
            const memtionKey = active.key ?? "@";
            const memtionText = memtion.getMemtionText(memtionTriggerRangeRef.current, selectionRef.current);
            if (!memtionText.startsWith(memtionKey) || /\s/.test(memtionText)) {
                hideMemtion();
            }
            else {
                const keyword = memtionText.slice(memtionKey.length);
                pendingMemtionRef.current = false;
                setMemtionRect(memtion.getSelectionRect(selectionRef.current));
                setMemtionKeyword(keyword);
                setMemtionActiveIndex(0);
                setMemtionVisible(true);
            }
        }
        syncHeight();
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
    const handleRef = (node) => {
        editorRef.current = node;
        if (typeof ref === "function") {
            ref(node);
            return;
        }
        if (ref) {
            ref.current = node;
        }
    };
    const getSelection = react.useCallback(() => selectionRef.current?.cloneRange() ?? null, []);
    const controls$1 = react.useMemo(() => controls.default({
        controlBtnProps,
        addtionControls,
        getSelection,
    }), [addtionControls, getSelection]);
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-editor", className, {
            "i-editor-borderless": !border,
        }), style: {
            ...style,
            [autosize ? "minHeight" : "height"]: height,
            width,
        }, children: [!hideControl && (jsxRuntime.jsx("div", { className: "i-editor-controls", children: controls$1 })), memtion$1?.length && (jsxRuntime.jsx(memtion.default, { visible: memtionVisible, rect: memtionRect, options: memtionOptions, activeIndex: memtionActiveIndex, onActiveChange: setMemtionActiveIndex, onSelect: insertMemtion })), jsxRuntime.jsx("div", { ref: handleRef, className: "i-editor-content", "data-placeholder": placeholder, contentEditable: isPlaintextMode ? "plaintext-only" : true, onFocus: handleFocus, onBlur: handleBlur, onMouseUp: handleMouseUp, onPaste: handlePaste, onInput: handleInput, onKeyUp: handleKeyUp, onKeyDown: handleKeyDown, ...restProps })] }));
};

exports.default = Editor;
//# sourceMappingURL=editor.js.map
