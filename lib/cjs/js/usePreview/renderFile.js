'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var icon = require('../../components/icon/icon.js');
var video = require('../../components/video/video.js');
var material = require('@ricons/material');
var type = require('./type.js');

function renderFile(props) {
    const { name, suffix, type: type$1 } = props;
    switch (type$1) {
        case type.TFileType.IMAGE:
            return jsxRuntime.jsx("img", { src: props.src });
        case type.TFileType.VIDEO:
            return jsxRuntime.jsx(video.default, { ...props });
        default:
            return (jsxRuntime.jsxs("div", { className: 'i-preview-unknown', children: [jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.FeedOutlined, {}), size: '3em' }), jsxRuntime.jsx("h5", { className: 'mt-4', children: name || suffix || "?" })] }));
    }
}

exports.default = renderFile;
//# sourceMappingURL=renderFile.js.map
