import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

function Items(props) {
    const { items = [], active, renderItem, unit, onClick } = props;
    return items.map((n) => {
        const isActive = n === active;
        return (jsx("a", { className: classNames("i-timepicker-item", {
                "i-timepicker-item-active": isActive,
            }), onClick: () => onClick(n), children: renderItem?.(n, isActive, unit) ?? (n < 10 ? `0${n}` : n) }, n));
    });
}

export { Items as default };
//# sourceMappingURL=item.js.map
