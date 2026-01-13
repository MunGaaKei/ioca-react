import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useRef, useImperativeHandle } from 'react';
import xss from 'xss';
import getControls, { xssOptions, exec } from './controls.js';

const Editor = (props) => {
    const { ref, width, height = "10em", placeholder, autosize, border = true, richPaste, controls = "simple", className, style, onInput, onPaste, onKeyDown, ...restProps } = props;
    const editorRef = useRef(null);
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
        exec("insertText", false, text);
    };
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                exec("insertHTML", false, "&#09;");
                break;
            case "Enter":
                e.preventDefault();
                exec("insertLineBreak");
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
    useImperativeHandle(ref, () => {
        return {
            input: editorRef.current,
            setValue(html) {
                if (!editorRef.current)
                    return;
                const safeHtml = xss(html, xssOptions);
                editorRef.current.innerHTML = safeHtml;
            },
            getSafeValue() {
                const html = editorRef.current?.innerHTML ?? "";
                return xss(html, xssOptions);
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
    return (jsxs("div", { className: classNames("i-editor", className, {
            "i-editor-borderless": !border,
        }), style: {
            ...style,
            [autosize ? "minHeight" : "height"]: height,
            width,
        }, children: [controls !== "none" && (jsx("div", { className: 'i-editor-controls', children: getControls(controls, {
                    controlBtnProps,
                }) })), jsx("div", { ref: editorRef, className: 'i-editor-content', "data-placeholder": placeholder, contentEditable: true, onPaste: handlePaste, onInput: handleInput, onKeyDown: handleKeyDown, ...restProps })] }));
};

export { Editor as default };
//# sourceMappingURL=editor.js.map
