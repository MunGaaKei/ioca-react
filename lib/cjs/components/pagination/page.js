'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var loading = require('../loading/loading.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Page = (props) => {
    const { page, active, disabled, children, onChange } = props;
    const [loading$1, setLoading] = react.useState(false);
    const handleClick = async () => {
        if (active || loading$1 || disabled)
            return;
        setLoading(true);
        await onChange?.(page);
        setLoading(false);
    };
    return (jsxRuntime.jsxs("a", { className: classNames__default("i-page", {
            "i-page-active": active,
            "i-page-loading": loading$1,
            "i-page-disabled": disabled,
        }), "data-page": page, onClick: handleClick, children: [loading$1 && jsxRuntime.jsx(loading.default, { absolute: true }), children] }));
};

exports.default = Page;
//# sourceMappingURL=page.js.map
