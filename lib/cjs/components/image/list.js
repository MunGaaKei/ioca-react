'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var index = require('../../js/usePreview/index.js');
var utils = require('../../js/utils.js');
var flex = require('../flex/flex.js');
var image = require('./image.js');

function List(props) {
    const { items = [], gap = 8, columns, wrap, direction, usePreview: previewable, onClick, ...restProps } = props;
    const preview = index.default();
    const files = react.useMemo(() => {
        return items.map((item) => {
            const o = {
                src: "",
            };
            if (typeof item === "string") {
                o.src = item;
            }
            else {
                Object.assign(o, item);
            }
            o.suffix = utils.getSuffixByUrl(o.src) || "";
            o.type = utils.getFileType(o.suffix, item["type"]);
            return o;
        });
    }, [items]);
    const handleClick = (e, i) => {
        onClick?.(e);
        previewable &&
            preview({
                items: files,
                initial: i,
            });
    };
    if (!files.length)
        return "";
    return (jsxRuntime.jsx(flex.default, { className: 'i-image-list', gap: gap, columns: columns, wrap: wrap, direction: direction, children: files.map((img, i) => {
            return (jsxRuntime.jsx(image.default, { src: img.src, usePreview: false, onClick: (e) => handleClick(e, i), ...restProps }, i));
        }) }));
}

exports.default = List;
//# sourceMappingURL=list.js.map
