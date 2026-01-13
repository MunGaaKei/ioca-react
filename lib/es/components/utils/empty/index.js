import { jsx } from 'react/jsx-runtime';
import { InboxTwotone } from '@ricons/material';
import classNames from 'classnames';

function Empty(props) {
    const { className, ...restProps } = props;
    return (jsx(InboxTwotone, { className: classNames("i-empty", className), ...restProps }));
}

export { Empty as default };
//# sourceMappingURL=index.js.map
