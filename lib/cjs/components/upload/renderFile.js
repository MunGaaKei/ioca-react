'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var react = require('react');
var SortableContainer = require('react-easy-sort');
var type = require('../../js/usePreview/type.js');
var utils = require('../../js/utils.js');
var icon = require('../icon/icon.js');
var image = require('../image/image.js');
var helpericon = require('../utils/helpericon/helpericon.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var SortableContainer__default = /*#__PURE__*/_interopDefaultCompat(SortableContainer);

const ListContainer = react.memo((props) => {
    const { sortable, onSortEnd, children, ...restProps } = props;
    if (!sortable) {
        return (jsxRuntime.jsx("div", { className: "i-upload-list", onClick: (e) => {
                e.stopPropagation();
                e.preventDefault();
            }, ...restProps, children: children }));
    }
    return (jsxRuntime.jsx(SortableContainer__default, { draggedItemClassName: "i-upload-item-dragged", onSortEnd: onSortEnd, className: "i-upload-list", ...restProps, children: children }));
});
const CloseBtn = react.memo(({ index, onRemove }) => (jsxRuntime.jsx(helpericon.default, { active: true, className: "i-upload-delete", onClick: (e) => {
        e.stopPropagation();
        e.preventDefault();
        onRemove(index);
    } })));
const FileListItem = react.memo((props) => {
    const { ref, mode, index, file, renderItem, onRemove, onPreview } = props;
    if (!file)
        return null;
    const { name, size, url, src } = file;
    const type$1 = utils.getFileType(name, file.type);
    const handleClick = react.useCallback(() => {
        onPreview?.(index);
    }, [onPreview, index]);
    if (renderItem) {
        return renderItem(file, index);
    }
    const node = react.useMemo(() => {
        switch (type$1) {
            case type.TFileType.IMAGE:
                return (jsxRuntime.jsx(image.default, { lazyload: true, src: url || src, fit: "cover", onMouseDown: (e) => e.preventDefault() }));
            case type.TFileType.VIDEO:
                return jsxRuntime.jsx("video", { src: url || src, preload: "none" });
            default:
                return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.FilePresentOutlined, {}), size: "1.5em" }), jsxRuntime.jsx("span", { className: "i-upload-file-name", children: name })] }));
        }
    }, [type$1, url, src, name]);
    switch (mode) {
        case "card":
            return (jsxRuntime.jsxs("div", { ref: ref, className: "i-upload-item-card", onClick: handleClick, children: [node, jsxRuntime.jsx(CloseBtn, { index: index, onRemove: onRemove }), name && (jsxRuntime.jsx("span", { className: "px-12 py-8 i-upload-tip", children: name }))] }));
        default:
            return (jsxRuntime.jsxs("div", { ref: ref, className: "i-upload-item", onClick: handleClick, children: [jsxRuntime.jsx("span", { children: name }), jsxRuntime.jsx("i", { className: "i-upload-size", children: utils.formatBytes(size ?? 0) }), jsxRuntime.jsx(CloseBtn, { index: index, onRemove: onRemove })] }));
    }
});

exports.ListContainer = ListContainer;
exports.default = FileListItem;
//# sourceMappingURL=renderFile.js.map
