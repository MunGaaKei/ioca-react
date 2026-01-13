import { jsx } from 'react/jsx-runtime';
import { useMemo } from 'react';
import { formatTime } from '../../js/utils.js';
import Text from './text.js';

function Number(props) {
    const { seconds, zero, units, ...restProps } = props;
    const text = useMemo(() => {
        if (seconds === undefined)
            return "";
        return formatTime(seconds, {
            zero,
            units,
        });
    }, [seconds]);
    return jsx(Text, { ...restProps, children: text });
}

export { Number as default };
//# sourceMappingURL=time.js.map
