import { jsx, Fragment } from 'react/jsx-runtime';
import { CloseRound } from '@ricons/material';
import classNames from 'classnames';
import { uid } from 'radash';
import { createElement } from 'react';
import Icon from '../../icon/icon.js';

const Helpericon = (props) => {
    const { as = "a", active, className, icon = jsx(CloseRound, {}), ...restProps } = props;
    if (!active)
        return jsx(Fragment, {});
    return createElement(as, {
        className: classNames("i-helpericon", className),
        ...restProps,
    }, [
        createElement(Icon, {
            key: uid(3),
            icon,
        }),
    ]);
};

export { Helpericon as default };
//# sourceMappingURL=helpericon.js.map
