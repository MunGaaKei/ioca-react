'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var SortableContainer = require('react-easy-sort');
var index = require('../../js/usePreview/index.js');
var utils = require('../../js/utils.js');
var button = require('../button/button.js');
var icon = require('../icon/icon.js');
var container = require('../input/container.js');
var renderFile = require('./renderFile.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Upload = (props) => {
    const { ref, label, labelInline, value, files = [], initialFiles, placeholder, status = "normal", message, className, style, children, defaultButtonProps, mode = "default", cardSize = "4em", disabled, sortable, limit = props.multiple ? Infinity : 1, multiple, renderItem, shouldUpload = () => true, uploader, onChange, onFilesChange, onUpload, ...restProps } = props;
    const [fileList, setFileListState] = react.useState(files);
    const [uploadMessage, setUploadMessage] = react.useState(message);
    const inputRef = react.useRef(null);
    const preview = index.default();
    const defBtnProps = Object.assign({
        children: (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.DriveFolderUploadOutlined, {}) }), " \u4E0A\u4F20"] })),
    }, defaultButtonProps);
    const trigger = react.useMemo(() => {
        if (children)
            return children;
        switch (mode) {
            case "card":
                return (jsxRuntime.jsx(button.default, { className: 'i-upload-card-btn color-5', square: true, flat: true, outline: true, disabled: disabled, children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.PlusSharp, {}) }) }));
            default:
                return (jsxRuntime.jsx(button.default, { ...defBtnProps, className: classNames__default("i-upload-btn", defBtnProps.className), disabled: disabled }));
        }
    }, [mode, children]);
    const handleChange = (e) => {
        const files = Array.from(e.target.files || []);
        const before = fileList;
        const changed = [];
        files.map((f) => {
            const { id, name, size, type } = f;
            const same = before.find((pf) => {
                const { name: n, size: s, type: t } = pf;
                return n === name && s === size && t === type;
            });
            const src = URL.createObjectURL(f);
            Object.assign(f, {
                id: id ?? radash.uid(7),
                src: src ?? f.name,
                url: src ?? f.name,
            });
            !same && changed.push(f);
        });
        const after = [...before, ...changed];
        const last = after.at(-1);
        const nextFiles = multiple ? after.slice(0, limit) : last ? [last] : [];
        setFileListState(nextFiles);
        setUploadMessage(message);
        onFilesChange?.(nextFiles, changed, e);
        onChange?.(nextFiles, e);
        handleUpload(changed);
        inputRef.current && (inputRef.current.value = "");
    };
    const handleRemove = (i) => {
        const [...files] = fileList;
        const changed = files.splice(i, 1);
        URL.revokeObjectURL(changed[0]?.src || "");
        setFileListState(files);
        onFilesChange?.(files, changed);
        onChange?.(files);
        inputRef.current && (inputRef.current.value = "");
    };
    const handleUpload = async (files) => {
        if (!uploader)
            return;
        const shouldUploadFiles = files.filter(shouldUpload);
        const result = Promise.all(shouldUploadFiles.map(uploader));
        return onUpload?.(result);
    };
    const handlePreview = (i) => {
        preview({ items: fileList, initial: i });
    };
    const setFileList = (files) => {
        if (!files)
            return;
        setFileListState(files.map((f) => {
            const file = f;
            return { ...file, id: file.id ?? radash.uid(7) };
        }));
    };
    const handleSortEnd = (before, after) => {
        const [...files] = fileList;
        const nextFiles = utils.arrayMove(files, before, after);
        setFileListState(nextFiles);
        onChange?.(nextFiles);
    };
    react.useEffect(() => {
        setUploadMessage(message);
    }, [status, message]);
    react.useEffect(() => {
        setFileListState(value?.filter?.((file) => !!file.id) ?? []);
    }, [value]);
    react.useEffect(() => {
        setFileList(initialFiles);
    }, []);
    react.useImperativeHandle(ref, () => ({
        getFileList: () => fileList,
        setFileList,
    }), [fileList]);
    return (jsxRuntime.jsx(container.default, { as: 'div', label: label, labelInline: labelInline, className: classNames__default("i-input-label-file", className), style: style, children: jsxRuntime.jsxs("div", { className: classNames__default("i-upload-inner", {
                [`i-upload-${mode}`]: mode !== "default",
            }), style: { ["--upload-card-size"]: cardSize }, children: [jsxRuntime.jsx(renderFile.ListContainer, { sortable: sortable, onSortEnd: handleSortEnd, children: fileList.map((file, i) => {
                        const node = (jsxRuntime.jsx(renderFile.default, { index: i, file: file, mode: mode, renderItem: renderItem, onRemove: handleRemove, onPreview: handlePreview }, i));
                        if (!sortable)
                            return node;
                        return jsxRuntime.jsx(SortableContainer.SortableItem, { children: node }, i);
                    }) }), uploadMessage && (jsxRuntime.jsx("span", { className: 'i-upload-message', children: uploadMessage })), fileList.length < limit && (jsxRuntime.jsxs("label", { children: [jsxRuntime.jsx("input", { ...restProps, disabled: disabled, ref: inputRef, type: 'file', className: 'i-input-file-hidden', multiple: multiple, onChange: handleChange }), trigger] }))] }) }));
};

exports.default = Upload;
//# sourceMappingURL=upload.js.map
