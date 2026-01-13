import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

const Arrow = (props) => (jsx("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', ...props, children: jsx("g", { fill: 'none', children: jsx("path", { d: 'M9 17.898c0 1.074 1.265 1.648 2.073.941l6.31-5.522a1.75 1.75 0 0 0 0-2.634l-6.31-5.522C10.265 4.454 9 5.028 9 6.102v11.796z', fill: 'currentColor' }) }) }));
function Sorter(props) {
    const { type } = props;
    return (jsxs("a", { className: classNames("i-datagrid-sorter", {
            [`i-datagrid-sorter-${type}`]: type,
        }), children: [jsx(Arrow, { className: 'i-datagrid-sorter-caret' }), jsx(Arrow, { className: 'i-datagrid-sorter-caret' })] }));
}

export { Sorter as default };
//# sourceMappingURL=sorter.js.map
