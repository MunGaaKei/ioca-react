import { jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { formatNumber, animate } from '../../js/utils.js';
import Text from './text.js';

function Number(props) {
    const { count, to, decimal, thousand = ",", duration = 2400, easing, ...restProps } = props;
    const [n, setN] = useState(count);
    const number = useMemo(() => {
        if (n === undefined)
            return;
        const z = n.toFixed(decimal);
        if (!thousand)
            return z;
        return formatNumber(n, { precision: decimal, thousand });
    }, [n, thousand]);
    useEffect(() => {
        if (count === undefined || to === undefined)
            return;
        animate(count, to, duration, (v) => setN(count + v), easing);
    }, [to]);
    useEffect(() => setN(count), [count]);
    return jsx(Text, { ...restProps, children: number });
}

export { Number as default };
//# sourceMappingURL=number.js.map
