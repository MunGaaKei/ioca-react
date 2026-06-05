'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var reactWindow = require('react-window');
var hooks = require('../../js/hooks.js');
var item = require('./item.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function VirtualTree(props) {
    const { flatNodes, onExpand, selected, checkedSet, partofs = {}, checkable, nodeProps, renderExtra, loadingKeys, height, useVirtual, className, style, onItemClick, onItemSelect, onItemCheck, } = props;
    const listRef = react.useRef(null);
    const wrapRef = react.useRef(null);
    const ro = hooks.useResizeObserver();
    const [viewportHeight, setViewportHeight] = react.useState(0);
    react.useEffect(() => {
        const el = wrapRef.current;
        if (!el)
            return;
        const update = () => {
            const r = el.getBoundingClientRect();
            setViewportHeight((prev) => (prev === r.height ? prev : r.height));
        };
        update();
        ro.observe?.(el, update);
        return () => ro.unobserve?.(el);
    }, [ro]);
    const listHeight = Math.max(0, (typeof height === "number" ? height : viewportHeight || 360));
    const propsRef = react.useRef(props);
    propsRef.current = props;
    const rowComponent = react.useCallback(({ index, style, }) => {
        const p = propsRef.current;
        const flatNode = p.flatNodes[index];
        if (!flatNode)
            return null;
        return (jsxRuntime.jsx(item.TreeRow, { flatNode: flatNode, wrapperStyle: style, virtualMode: true, selected: p.selected, checkedSet: p.checkedSet, partofs: p.partofs, checkable: p.checkable, nodeProps: p.nodeProps, renderExtra: p.renderExtra, loadingKeys: p.loadingKeys, onExpand: p.onExpand, onItemClick: p.onItemClick, onItemSelect: p.onItemSelect, onItemCheck: p.onItemCheck }));
    }, []);
    return (jsxRuntime.jsx("div", { ref: wrapRef, className: classNames__default("i-tree", className), style: { display: "block", width: "100%", height: "100%", ...style }, children: jsxRuntime.jsx(reactWindow.List, { listRef: listRef, rowCount: flatNodes.length, rowHeight: useVirtual.rowHeight, overscanCount: Math.max(3, useVirtual.threshold ?? 8), rowProps: {}, style: {
                width: "100%",
                height: listHeight,
                overflow: "auto",
            }, rowComponent: rowComponent }) }));
}

exports.default = VirtualTree;
//# sourceMappingURL=virtual.js.map
