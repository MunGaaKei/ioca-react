'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var utils = require('../../js/utils.js');
var text = require('./text.js');

function Number(props) {
    const { seconds, zero, units, ...restProps } = props;
    const text$1 = react.useMemo(() => {
        if (seconds === undefined)
            return "";
        return utils.formatTime(seconds, {
            zero,
            units,
        });
    }, [seconds]);
    return jsxRuntime.jsx(text.default, { ...restProps, children: text$1 });
}

exports.default = Number;
//# sourceMappingURL=time.js.map
