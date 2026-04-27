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
    const [memtionVisible, setMemtionVisible] = react.useState(false);
    const [memtionRect, setMemtionRect] = react.useState(null);
    const [memtionKeyword, setMemtionKeyword] = react.useState("");
    const [memtionActiveIndex, setMemtionActiveIndex] = react.useState(0);
    const memtionOptions = react.useMemo(() => memtion.filterMemtionOptions(memtion$1?.options ?? [], memtionKeyword), [memtion$1?.options, memtionKeyword]);
    const sanitizeValue = (nextValue) => {
        if (mode === "plaintext") {
            return nextValue === "\n" ? "" : nextValue;
        }
        const safeHtml = xss__default(nextValue, controls.xssOptions);
        return safeHtml === "<br>" ? "" : safeHtml;
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
        if (mode === "plaintext") {
            editorRef.current.textContent = safeValue;
            return;
        }
        editorRef.current.innerHTML = safeValue;
    };
    const getEditorValue = (sanitize = false) => {
        if (!editorRef.current)
            return "";
        const nextValue = mode === "plaintext"
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
    const insertMemtion = (option) => {
        const replaceRange = memtion.getMemtionReplaceRange(memtionTriggerRangeRef.current, selectionRef.current);
        const range = memtion.insertMemtionOption({
            editor: editorRef.current,
            range: replaceRange,
            mode,
            memtion: memtion$1,
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
        if (mode === "plaintext") {
            const text = e.clipboardData.getData("text/plain");
            controls.exec("insertText", false, text);
            return;
        }
        const html = e.clipboardData.getData("text/html");
        if (html) {
            controls.exec("insertHTML", false, sanitizeValue(html));
            return;
        }
        const text = e.clipboardData.getData("text/plain");
        controls.exec("insertText", false, text);
    };
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (mode === "rich" &&
            (e.key === "Backspace" || e.key === "Delete") &&
            memtion.removeAdjacentMemtionTag(editorRef.current, e.key)) {
            e.preventDefault();
            rememberSelection();
            editorRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }
        const memtionKey = memtion$1?.key ?? "@";
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
        if (memtion$1 && e.key === memtionKey) {
            rememberSelection();
            memtionTriggerRangeRef.current =
                selectionRef.current?.cloneRange() ?? null;
            pendingMemtionRef.current = true;
        }
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                controls.exec(mode === "plaintext" ? "insertText" : "insertHTML", false, mode === "plaintext" ? "\t" : "&#09;");
                break;
            case "Enter":
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
        if (autosize) {
            editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
        }
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
        if (!nextValue && rawValue && editorRef.current) {
            nextValue = "";
            setEditorValue(nextValue);
        }
        rememberSelection();
        if (memtion$1 && (pendingMemtionRef.current || memtionVisible)) {
            const memtionKey = memtion$1?.key ?? "@";
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
        }, children: [!hideControl && (jsxRuntime.jsx("div", { className: "i-editor-controls", children: controls$1 })), memtion$1 && (jsxRuntime.jsx(memtion.default, { visible: memtionVisible, rect: memtionRect, options: memtionOptions, activeIndex: memtionActiveIndex, onActiveChange: setMemtionActiveIndex, onSelect: insertMemtion })), jsxRuntime.jsx("div", { ref: handleRef, className: "i-editor-content", "data-placeholder": placeholder, contentEditable: mode === "plaintext" ? "plaintext-only" : true, onFocus: handleFocus, onBlur: handleBlur, onMouseUp: handleMouseUp, onPaste: handlePaste, onInput: handleInput, onKeyUp: handleKeyUp, onKeyDown: handleKeyDown, ...restProps })] }));
};

exports.default = Editor;
//# sourceMappingURL=editor.js.map
