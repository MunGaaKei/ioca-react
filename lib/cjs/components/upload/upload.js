'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var SortableContainer = require('react-easy-sort');
var reactDom = require('react-dom');
var index = require('../../js/usePreview/index.js');
var utils = require('../../js/utils.js');
var button = require('../button/button.js');
var icon = require('../icon/icon.js');
var container = require('../input/container.js');
var dropbox = require('./dropbox.js');
var renderFile = require('./renderFile.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const normalizeFiles = (files) => (files ?? []).map((item) => {
    const file = item;
    if (item instanceof File) {
        const src = file.src ?? URL.createObjectURL(item);
        Object.assign(item, {
            id: file.id ?? radash.uid(7),
            src,
            url: file.url ?? src,
        });
        return item;
    }
    const src = file.src ?? file.name;
    return {
        ...file,
        id: file.id ?? radash.uid(7),
        src,
        url: file.url ?? src,
    };
});
const Upload = (props) => {
    const { label, labelInline, value, files, placeholder, status = "normal", message, className, style, children, droppable, dropbox: dropbox$1, getDropboxContainer, defaultButtonProps, mode = "default", cardSize = "3.2em", disabled, sortable, limit = props.multiple ? Infinity : 1, multiple, renderItem, shouldUpload = () => true, uploader, onChange, onFilesChange, onUpload, onRemove, ...restProps } = props;
    const [internalFileList, setInternalFileList] = react.useState([]);
    const isControlled = react.useMemo(() => value !== undefined || files !== undefined, [value, files]);
    const fileList = isControlled
        ? normalizeFiles(value ?? files ?? [])
        : internalFileList;
    const uploadMessage = message;
    const inputRef = react.useRef(null);
    const preview = index.default();
    const defBtnProps = react.useMemo(() => ({
        children: (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.DriveFolderUploadOutlined, {}) }), " \u4E0A\u4F20"] })),
        ...defaultButtonProps,
    }), [defaultButtonProps]);
    const trigger = react.useMemo(() => {
        if (children)
            return children;
        switch (mode) {
            case "card":
                return (jsxRuntime.jsx(button.default, { className: "i-upload-card-btn color-5", square: true, flat: true, outline: true, disabled: disabled, children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.PlusSharp, {}) }) }));
            default:
                return (jsxRuntime.jsx(button.default, { ...defBtnProps, className: classNames__default("i-upload-btn", defBtnProps.className), disabled: disabled }));
        }
    }, [mode, children, disabled, defBtnProps]);
    const handleUpload = react.useCallback(async (files) => {
        if (!uploader)
            return;
        const shouldUploadFiles = files.filter(shouldUpload);
        const result = await Promise.all(shouldUploadFiles.map(uploader));
        return onUpload?.(result);
    }, [uploader, shouldUpload, onUpload]);
    const processFiles = react.useCallback((inputFiles) => {
        const before = fileList;
        const changed = [];
        inputFiles.forEach((file) => {
            const { id, name, size, type } = file;
            const same = before.some((pf) => pf.name === name &&
                pf.size === size &&
                pf.type === type);
            const src = URL.createObjectURL(file);
            Object.assign(file, {
                id: id ?? radash.uid(7),
                src: src ?? file.name,
                url: src ?? file.name,
            });
            if (!same)
                changed.push(file);
        });
        const after = [...before, ...changed];
        const last = after.at(-1);
        const nextFiles = multiple
            ? after.slice(0, limit)
            : last
                ? [last]
                : [];
        return { nextFiles, changed };
    }, [fileList, multiple, limit]);
    const applyFiles = react.useCallback((nextFiles, changed, e) => {
        if (!isControlled)
            setInternalFileList(nextFiles);
        onFilesChange?.(nextFiles, changed, e);
        onChange?.(nextFiles, e);
        handleUpload(changed);
    }, [isControlled, onFilesChange, onChange, handleUpload]);
    const handleChange = react.useCallback((e) => {
        const inputFiles = Array.from(e.target.files || []);
        const { nextFiles, changed } = processFiles(inputFiles);
        applyFiles(nextFiles, changed, e);
        if (inputRef.current)
            inputRef.current.value = "";
    }, [processFiles, applyFiles]);
    const handleDropFiles = react.useCallback((files) => {
        const { nextFiles, changed } = processFiles(files);
        applyFiles(nextFiles, changed);
    }, [processFiles, applyFiles]);
    const handleRemove = react.useCallback((i) => {
        const files = [...fileList];
        const changed = files.splice(i, 1);
        URL.revokeObjectURL(changed[0]?.src || "");
        if (!isControlled)
            setInternalFileList(files);
        onFilesChange?.(files, changed);
        onChange?.(files);
        onRemove?.(changed[0]);
        if (inputRef.current)
            inputRef.current.value = "";
    }, [fileList, isControlled, onFilesChange, onChange, onRemove]);
    const handlePreview = react.useCallback((i) => {
        preview({
            items: fileList,
            initial: i,
        });
    }, [fileList, preview]);
    const handleSortEnd = react.useCallback((before, after) => {
        const files = [...fileList];
        const nextFiles = utils.arrayMove(files, before, after);
        if (!isControlled)
            setInternalFileList(nextFiles);
        onFilesChange?.(nextFiles, []);
        onChange?.(nextFiles);
    }, [fileList, isControlled, onFilesChange, onChange]);
    return (jsxRuntime.jsx(container.default, { as: "div", label: label, labelInline: labelInline, className: classNames__default("i-input-label-file", className), style: style, children: jsxRuntime.jsxs("div", { className: classNames__default("i-upload-inner", {
                [`i-upload-${mode}`]: mode !== "default",
            }), style: { ["--upload-card-size"]: cardSize }, children: [jsxRuntime.jsx(renderFile.ListContainer, { sortable: sortable, onSortEnd: handleSortEnd, children: fileList.map((file, i) => {
                        const f = file;
                        const key = f.id ?? i;
                        const node = (jsxRuntime.jsx(renderFile.default, { index: i, file: f, mode: mode, renderItem: renderItem, onRemove: handleRemove, onPreview: handlePreview }, key));
                        if (!sortable)
                            return node;
                        return jsxRuntime.jsx(SortableContainer.SortableItem, { children: node }, key);
                    }) }), uploadMessage && (jsxRuntime.jsx("span", { className: "i-upload-message", children: uploadMessage })), fileList.length < limit &&
                    (droppable ? ((() => {
                        const node = (jsxRuntime.jsx(dropbox.default, { multiple: multiple, accept: restProps.accept, disabled: disabled, onChange: handleChange, onDropFiles: handleDropFiles, children: dropbox$1 }));
                        return getDropboxContainer
                            ? reactDom.createPortal(node, getDropboxContainer())
                            : node;
                    })()) : (jsxRuntime.jsxs("label", { children: [jsxRuntime.jsx("input", { ...restProps, disabled: disabled, ref: inputRef, type: "file", className: "i-input-file-hidden", multiple: multiple, onChange: handleChange }), trigger] })))] }) }));
};

exports.default = Upload;
//# sourceMappingURL=upload.js.map
