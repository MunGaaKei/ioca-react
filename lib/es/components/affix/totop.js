import { jsx } from 'react/jsx-runtime';
import { SkipPreviousRound } from '@ricons/material';
import classNames from 'classnames';
import '../button/index.js';
import Icon from '../icon/icon.js';
import Button from '../button/button.js';

function ToTop(props) {
    const { style, className, onClick } = props;
    return (jsx(Button, { square: true, className: classNames("i-affix-totop", className), style: { ...style }, onClick: onClick, children: jsx(Icon, { icon: jsx(SkipPreviousRound, {}), rotate: 90 }) }));
}

export { ToTop as default };
//# sourceMappingURL=totop.js.map
