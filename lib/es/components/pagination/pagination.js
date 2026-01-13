import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { KeyboardArrowLeftRound, KeyboardArrowRightRound, MoreHorizRound } from '@ricons/material';
import classNames from 'classnames';
import { useState, useMemo, useEffect } from 'react';
import Icon from '../icon/icon.js';
import Page from './page.js';

const Pagination = (props) => {
    const { page: defaultPage = 1, size = 10, total = 0, sibling = 2, prev = jsx(Icon, { icon: jsx(KeyboardArrowLeftRound, {}) }), next = jsx(Icon, { icon: jsx(KeyboardArrowRightRound, {}) }), simple, jumper, className, renderEllipsis = () => (jsx(Icon, { icon: jsx(MoreHorizRound, {}), className: 'color-7' })), renderPage = (i) => i, onChange, ...restProps } = props;
    const [page, setPage] = useState(defaultPage);
    const [loading, setLoading] = useState(false);
    const totalPage = useMemo(() => Math.ceil(total / size), [size, total]);
    const [start, end, loop] = useMemo(() => {
        const start = Math.max(1, page - sibling);
        const end = Math.min(totalPage, page + sibling);
        return [
            start,
            end,
            Array.from({ length: end - start + 1 }).map((n, i) => start + i),
        ];
    }, [page, totalPage, sibling]);
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
    useEffect(() => setPage(defaultPage), [defaultPage]);
    if (totalPage <= page && page === 1)
        return jsx(Fragment, {});
    return (jsxs("div", { className: classNames("i-pagination", className), ...restProps, children: [prev && (jsx(Page, { page: page - 1 || 1, disabled: page === 1, onChange: handlePageChange, children: prev })), start > 1 && (jsx(Page, { page: 1, onChange: handlePageChange, children: renderPage(1) })), start > 2 && renderEllipsis(), loop.map((p) => {
                return (jsx(Page, { page: p, active: p === page, onChange: handlePageChange, children: renderPage(p) }, p));
            }), end < totalPage - 1 && renderEllipsis(), end < totalPage && (jsx(Page, { page: totalPage, onChange: handlePageChange, children: renderPage(totalPage) })), next && (jsx(Page, { page: page + 1, disabled: page === totalPage, onChange: handlePageChange, children: next }))] }));
};

export { Pagination as default };
//# sourceMappingURL=pagination.js.map
