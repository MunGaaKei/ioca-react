import { jsx } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useEffect } from 'react';
import Button from './button.js';

function Toggle(props) {
    const { ref, active, activeClass, after, disabled, children, className, toggable, onClick, onToggle, ...restProps } = props;
    const state = useReactive({
        active,
        done: true,
    });
    const toggle = async () => {
        const hasAfter = !!after;
        const nextActive = !state.active;
        const canToggle = toggable ? await toggable() : true;
        if (!canToggle)
            return;
        Object.assign(state, {
            active: nextActive,
            done: !hasAfter,
        });
        onToggle?.(nextActive);
        if (!hasAfter)
            return;
        setTimeout(() => {
            state.done = true;
        }, 16);
    };
    const handleClick = (e) => {
        onClick?.(e);
        !disabled && toggle();
    };
    useEffect(() => {
        Object.assign(state, {
            active,
            done: true,
        });
    }, [active]);
    return (jsx(Button, { ref: ref, className: classNames(className, { [activeClass || ""]: state.active }, "i-btn-toggle"), ...restProps, onClick: handleClick, children: jsx("div", { className: classNames("i-btn-toggle-content", {
                "i-btn-toggle-active": state.done,
            }), children: state.active ? after ?? children : children }) }));
}

export { Toggle as default };
//# sourceMappingURL=toggle.js.map
