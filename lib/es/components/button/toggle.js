import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import Button from './button.js';

function Toggle(props) {
    const { ref, active, activeClass, after, disabled, children, className, toggable, onClick, onToggle, ...restProps } = props;
    const [isActive, setIsActive] = useState(active);
    const [done, setDone] = useState(true);
    const toggle = async () => {
        const hasAfter = !!after;
        const nextActive = !isActive;
        const canToggle = toggable ? await toggable() : true;
        if (!canToggle)
            return;
        setIsActive(nextActive);
        setDone(!hasAfter);
        onToggle?.(nextActive);
        if (!hasAfter)
            return;
        setTimeout(() => {
            setDone(true);
        }, 16);
    };
    const handleClick = (e) => {
        onClick?.(e);
        !disabled && toggle();
    };
    useEffect(() => {
        setIsActive(active);
        setDone(true);
    }, [active]);
    return (jsx(Button, { ref: ref, className: classNames(className, { [activeClass || ""]: isActive }, "i-btn-toggle"), ...restProps, onClick: handleClick, children: jsx("div", { className: classNames("i-btn-toggle-content", {
                "i-btn-toggle-active": done,
            }), children: isActive ? (after ?? children) : children }) }));
}

export { Toggle as default };
//# sourceMappingURL=toggle.js.map
