import { jsx, jsxs } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useRef, useMemo, Children, useLayoutEffect } from 'react';

const River = (props) => {
    const { children, className, speed = 1, pauseOnHover, ...restProps } = props;
    const trackRef = useRef(null);
    const state = useReactive({
        initialized: false,
        offset: 0,
        queue: [],
        paddingLeft: 0,
        pause: false,
    });
    const rafRef = useRef(null);
    const sizeRef = useRef([]);
    const [items, length] = useMemo(() => {
        const nodes = Children.toArray(children);
        return [nodes, nodes.length];
    }, [children]);
    const animate = () => {
        if (!trackRef.current)
            return;
        let next = state.offset - speed;
        const d = Math.abs(next);
        const [head, ...restQueue] = state.queue;
        const size = sizeRef.current.at(head % length) ?? 0;
        if (d > size) {
            const tail = state.queue.at(-1);
            const newQueue = [...restQueue, tail + 1];
            state.queue = newQueue;
            next += size;
        }
        state.offset = next;
        if (!state.pause) {
            rafRef.current = requestAnimationFrame(animate);
        }
    };
    const cancelRaf = () => {
        if (!rafRef.current)
            return;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    };
    const handleMouseOver = () => {
        if (!pauseOnHover)
            return;
        state.pause = true;
        cancelRaf();
    };
    const handleMouseLeave = () => {
        if (!pauseOnHover)
            return;
        state.pause = false;
        rafRef.current = requestAnimationFrame(animate);
    };
    useLayoutEffect(() => {
        if (!trackRef.current)
            return;
        const pa = trackRef.current.offsetParent;
        const parentWidth = pa.offsetWidth;
        const nodes = Array.from(trackRef.current.childNodes);
        const length = nodes.length;
        if (length < 2)
            return;
        let contentWidth = trackRef.current.scrollWidth;
        let count = 0;
        const tails = [];
        const sizes = nodes.map((node) => {
            return node.offsetWidth;
        });
        sizeRef.current = sizes;
        while (contentWidth < parentWidth) {
            const w = sizes.at(count % length) ?? 0;
            tails.push(length + count);
            contentWidth += w;
            count += 1;
        }
        state.offset = -1 * sizes.at(-1);
        state.queue = [-1, ...sizes.map((_, i) => i), ...tails];
        animate();
        state.initialized = true;
        return () => {
            state.queue = [];
            state.initialized = false;
            state.offset = 0;
            cancelRaf();
        };
    }, [children]);
    return (jsx("div", { ...restProps, className: classNames("i-river", {
            "i-river-initialized": state.initialized,
        }, className), children: jsxs("div", { ref: trackRef, className: 'i-river-track', style: {
                transform: `translate3d(${state.offset}px, 0, 0)`,
                paddingLeft: state.paddingLeft,
            }, onMouseOver: handleMouseOver, onMouseLeave: handleMouseLeave, children: [!state.initialized &&
                    Children.map(children, (item, i) => {
                        return (jsx("div", { className: 'i-river-item', children: item }, i));
                    }), state.initialized &&
                    state.queue.map((index) => {
                        return (jsx("div", { className: 'i-river-item', children: items.at(index % items.length) }, index));
                    })] }) }));
};

export { River as default };
//# sourceMappingURL=river.js.map
