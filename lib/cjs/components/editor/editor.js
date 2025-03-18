'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var xss = require('xss');
var controls = require('./controls.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);
var xss__default = /*#__PURE__*/_interopDefaultCompat(xss);

const Editor = (props) => {
    const { ref, width, height = "10em", placeholder, autosize, border = true, richPaste, controls: controls$1 = "simple", className, style, onInput, onPaste, onKeyDown, ...restProps } = props;
    const editorRef = react.useRef(null);
    const controlBtnProps = {
        square: true,
        flat: true,
        size: "small",
    };
    const handlePaste = async (e) => {
        onPaste?.(e);
        if (richPaste)
            return;
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        controls.exec("insertText", false, text);
    };
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                controls.exec("insertHTML", false, "&#09;");
                break;
            case "Enter":
                e.preventDefault();
                controls.exec("insertLineBreak");
                if (!editorRef.current)
                    return;
                editorRef.current.scrollBy({
                    top: 20,
                    left: -1e3,
                });
                if (!autosize)
                    return;
                editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
                break;
        }
    };
    react.useImperativeHandle(ref, () => {
        return {
            setValue(html) {
                if (!editorRef.current)
                    return;
                const safeHtml = xss__default(html, controls.xssOptions);
                editorRef.current.innerHTML = safeHtml;
            },
            getSafeValue() {
                const html = editorRef.current?.innerHTML ?? "";
                return xss__default(html, controls.xssOptions);
            },
        };
    });
    const handleInput = (e) => {
        let html = editorRef.current?.innerHTML ?? "";
        if (["<br>", "\n"].includes(html) && editorRef.current) {
            html = "";
            editorRef.current.innerHTML = html;
        }
        onInput?.(html, e);
    };
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-editor", className, {
            "i-editor-borderless": !border,
        }), style: {
            ...style,
            [autosize ? "minHeight" : "height"]: height,
            width,
        }, children: [controls$1 !== "none" && (jsxRuntime.jsx("div", { className: 'i-editor-controls', children: controls.default(controls$1, {
                    controlBtnProps,
                }) })), jsxRuntime.jsx("div", { ref: editorRef, className: 'i-editor-content', "data-placeholder": placeholder, contentEditable: true, onPaste: handlePaste, onInput: handleInput, onKeyDown: handleKeyDown, ...restProps })] }));
};

exports.default = Editor;
//# sourceMappingURL=editor.js.map
