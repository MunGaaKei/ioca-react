'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var react = require('react');
var icon = require('../icon/icon.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Dropbox = (props) => {
    const { multiple, accept, disabled, children, onChange, onDropFiles } = props;
    const [dragging, setDragging] = react.useState(false);
    const inputRef = react.useRef(null);
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled)
            setDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (disabled)
            return;
        const files = Array.from(e.dataTransfer.files);
        if (files.length)
            onDropFiles(files);
    };
    const handleClick = () => {
        if (!disabled)
            inputRef.current?.click();
    };
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-upload-dropbox", dragging && "i-upload-dropbox-active"), onDragOver: handleDragOver, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDrop: handleDrop, onClick: handleClick, children: [jsxRuntime.jsx("input", { ref: inputRef, type: "file", className: "i-input-file-hidden", multiple: multiple, accept: accept, disabled: disabled, onChange: onChange }), typeof children === "function"
                ? children(dragging)
                : children || (jsxRuntime.jsx(icon.default, { icon: dragging ? (jsxRuntime.jsx(material.MoveToInboxTwotone, {})) : (jsxRuntime.jsx(material.OutboxTwotone, {})), size: "2em" }))] }));
};

exports.default = Dropbox;
//# sourceMappingURL=dropbox.js.map
