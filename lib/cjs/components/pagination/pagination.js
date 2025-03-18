'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var react = require('react');
var icon = require('../icon/icon.js');
var page = require('./page.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Pagination = (props) => {
    const { page: defaultPage = 1, size = 10, total = 0, sibling = 2, prev = jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowLeftRound, {}) }), next = jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowRightRound, {}) }), simple, jumper, className, renderEllipsis = () => (jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.MoreHorizRound, {}), className: 'color-7' })), renderPage = (i) => i, onChange, ...restProps } = props;
    const [page$1, setPage] = react.useState(defaultPage);
    const [loading, setLoading] = react.useState(false);
    const totalPage = react.useMemo(() => Math.ceil(total / size), [size, total]);
    const [start, end, loop] = react.useMemo(() => {
        const start = Math.max(1, page$1 - sibling);
        const end = Math.min(totalPage, page$1 + sibling);
        return [
            start,
            end,
            Array.from({ length: end - start + 1 }).map((n, i) => start + i),
        ];
    }, [page$1, totalPage, sibling]);
    if (totalPage <= page$1 && page$1 === 1)
        return jsxRuntime.jsx(jsxRuntime.Fragment, {});
    const handlePageChange = async (p) => {
        if (!onChange || loading)
            return;
        setLoading(true);
        return new Promise(async (resolve) => {
            if (p === undefined)
                return;
            await onChange(p);
            setPage(p);
            setLoading(false);
            resolve();
        });
    };
    react.useEffect(() => setPage(defaultPage), [defaultPage]);
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-pagination", className), ...restProps, children: [prev && (jsxRuntime.jsx(page.default, { page: page$1 - 1 || 1, onChange: handlePageChange, children: prev })), start > 1 && (jsxRuntime.jsx(page.default, { page: 1, onChange: handlePageChange, children: renderPage(1) })), start > 2 && renderEllipsis(), loop.map((p) => {
                return (jsxRuntime.jsx(page.default, { page: p, active: p === page$1, onChange: handlePageChange, children: renderPage(p) }, p));
            }), end < totalPage - 1 && renderEllipsis(), end < totalPage && (jsxRuntime.jsx(page.default, { page: totalPage, onChange: handlePageChange, children: renderPage(totalPage) })), next && (jsxRuntime.jsx(page.default, { page: page$1 + 1, onChange: handlePageChange, children: next }))] }));
};

exports.default = Pagination;
//# sourceMappingURL=pagination.js.map
