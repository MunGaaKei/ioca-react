import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useRef, useState, useEffect } from 'react';

const Scroll = (props) => {
    const { style, className, draggable, onScroll, children, ...restProps } = props;
    const scrollRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const dragState = useRef({ down: false, startX: 0, scrollLeft: 0 });
    useEffect(() => {
        const el = scrollRef.current;
        if (!el)
            return;
        const onWheel = (e) => {
            const canScroll = el.scrollWidth > el.clientWidth + 1;
            if (!canScroll)
                return;
            e.preventDefault();
            e.stopPropagation();
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY)
                ? e.deltaX
                : e.deltaY;
            el.scrollLeft += delta;
        };
        const opts = {
            passive: false,
            capture: true,
        };
        el.addEventListener("wheel", onWheel, opts);
        return () => el.removeEventListener("wheel", onWheel, opts);
    }, []);
    useEffect(() => {
        if (!draggable)
            return;
        const handleMouseMove = (e) => {
            if (!dragState.current.down || !scrollRef.current)
                return;
            const x = e.clientX - dragState.current.startX;
            scrollRef.current.scrollLeft =
                dragState.current.scrollLeft - x;
        };
        const handleMouseUp = () => {
            dragState.current.down = false;
            setDragging(false);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [draggable]);
    const handleMouseDown = (e) => {
        if (!draggable || !scrollRef.current)
            return;
        setDragging(true);
        dragState.current = {
            down: true,
            startX: e.clientX,
            scrollLeft: scrollRef.current.scrollLeft,
        };
    };
    return (jsx("div", { ref: scrollRef, className: classNames("i-scroll", className, {
            "i-scroll-draggable": draggable,
            "i-scroll-dragging": dragging,
        }), style: style, onScroll: onScroll, onMouseDown: handleMouseDown, ...restProps, children: children }));
};

export { Scroll as default };
