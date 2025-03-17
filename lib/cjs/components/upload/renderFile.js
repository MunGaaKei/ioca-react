'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var radash = require('radash');
var SortableContainer = require('react-easy-sort');
var type = require('../../js/usePreview/type.js');
var utils = require('../../js/utils.js');
var icon = require('../icon/icon.js');
require('../image/index.js');
var helpericon = require('../utils/helpericon/helpericon.js');
var image = require('../image/image.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var SortableContainer__default = /*#__PURE__*/_interopDefault(SortableContainer);

const ListContainer = (props) => {
    const { sortable, onSortEnd, itemProps, ...restProps } = props;
    const customProps = {
        className: "i-upload-list",
        onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
        },
    };
    if (!sortable) {
        return jsxRuntime.jsx("div", { ...customProps, ...restProps });
    }
    return (jsxRuntime.jsx(SortableContainer__default.default, { draggedItemClassName: 'i-upload-item-dragged', onSortEnd: onSortEnd, ...customProps, ...restProps }));
};
const FileListItem = (props) => {
    const { ref, mode, index, file, renderItem, onRemove, onPreview } = props;
    if (!file)
        return "";
    const { id, name, size, url, src } = file;
    const type$1 = utils.getFileType(name, file.type);
    if (renderItem) {
        return renderItem(file, index);
    }
    const CloseBtn = (jsxRuntime.jsx(helpericon.default, { active: true, className: 'i-upload-delete', onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove(index);
        } }));
    switch (mode) {
        case "card":
            let node = jsxRuntime.jsx(jsxRuntime.Fragment, {});
            switch (type$1) {
                case type.TFileType.IMAGE:
                    node = (jsxRuntime.jsx(image.default, { lazyload: true, src: url || src, fit: 'cover', onMouseDown: (e) => e.preventDefault() }));
                    break;
                case type.TFileType.VIDEO:
                    node = jsxRuntime.jsx("video", { src: url || src, preload: 'none' });
                    break;
                default:
                    node = (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.ListAltRound, {}) }), jsxRuntime.jsx("span", { className: 'i-upload-file-name', children: radash.title(name) })] }));
                    break;
            }
            return (jsxRuntime.jsxs("div", { ref: ref, title: name, className: 'i-upload-item-card', onClick: () => onPreview?.(index), children: [node, CloseBtn] }));
        default:
            return (jsxRuntime.jsxs("div", { ref: ref, className: 'i-upload-item', onClick: () => onPreview?.(index), children: [jsxRuntime.jsx("span", { children: name }), jsxRuntime.jsx("i", { className: 'i-upload-size', children: utils.formatBytes(size ?? 0) }), CloseBtn] }, id));
    }
};

exports.ListContainer = ListContainer;
exports.default = FileListItem;
//# sourceMappingURL=renderFile.js.map
