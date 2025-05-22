'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var utils = require('../../js/utils.js');
var text = require('./text.js');

function Number(props) {
    const { count, to, decimal, thousand = ",", duration = 2400, easing, ...restProps } = props;
    const [n, setN] = react.useState(count);
    const number = react.useMemo(() => {
        if (n === undefined)
            return;
        const z = n.toFixed(decimal);
        if (!thousand)
            return z;
        return utils.formatNumber(n, { precision: decimal, thousand });
    }, [n, thousand]);
    react.useEffect(() => {
        if (count === undefined || to === undefined)
            return;
        utils.animate(count, to, duration, (v) => setN(count + v), easing);
    }, [to]);
    react.useEffect(() => setN(count), [count]);
    return jsxRuntime.jsx(text.default, { ...restProps, children: number });
}

exports.default = Number;
//# sourceMappingURL=number.js.map
