import { jsxs, jsx } from 'react/jsx-runtime';
import { MoveToInboxTwotone, OutboxTwotone } from '@ricons/material';
import classNames from 'classnames';
import { useState, useRef } from 'react';
import Icon from '../icon/icon.js';

const Dropbox = (props) => {
    const { multiple, accept, disabled, children, onChange, onDropFiles } = props;
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);
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
    return (jsxs("div", { className: classNames("i-upload-dropbox", dragging && "i-upload-dropbox-active"), onDragOver: handleDragOver, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDrop: handleDrop, onClick: handleClick, children: [jsx("input", { ref: inputRef, type: "file", className: "i-input-file-hidden", multiple: multiple, accept: accept, disabled: disabled, onChange: onChange }), typeof children === "function"
                ? children(dragging)
                : children || (jsx(Icon, { icon: dragging ? (jsx(MoveToInboxTwotone, {})) : (jsx(OutboxTwotone, {})), size: "2em" }))] }));
};

export { Dropbox as default };
//# sourceMappingURL=dropbox.js.map
