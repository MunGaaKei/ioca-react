import { jsx, jsxs } from 'react/jsx-runtime';
import { SearchRound, CheckRound } from '@ricons/material';
import classNames from 'classnames';
import Icon from '../icon/icon.js';
import List from '../list/list.js';
import Tag from '../tag/tag.js';
import Empty from '../utils/empty/index.js';

const Options = (props) => {
    const { value: val, options, filter, filterPlaceholder, multiple, empty = jsx(Empty, {}), onSelect, onFilter, } = props;
    return (jsxs("div", { className: classNames("i-select-options", {
            "i-select-options-multiple": multiple,
        }), children: [filter && multiple && (jsxs("div", { className: 'i-select-filter', children: [jsx(Icon, { icon: jsx(SearchRound, {}), className: 'color-8 ml-8 my-auto', size: '1.2em' }), jsx("input", { type: 'text', className: 'i-input', placeholder: filterPlaceholder, onChange: onFilter })] })), options.length === 0 && empty, options.map((option, i) => {
                const { label, value, disabled } = option;
                const isActive = multiple
                    ? val?.includes(value)
                    : val === value;
                return (jsxs(List.Item, { active: isActive, type: 'option', onClick: () => onSelect?.(value, option), disabled: disabled, children: [multiple && (jsx(Icon, { icon: jsx(CheckRound, {}), className: 'i-select-option-check', size: '1em' })), label] }, value || i));
            })] }));
};
const activeOptions = (options = [], value = [], max = 3) => {
    const total = options.flatMap((opt) => value.includes(opt.value) ? [opt] : []);
    if (max >= total.length)
        return total;
    const rest = total.length - max;
    const after = total.slice(0, max);
    after.push(rest);
    return after;
};
const displayValue = (config) => {
    const { options, value, maxDisplay, multiple, onSelect } = config;
    if (multiple) {
        return activeOptions(options, value, maxDisplay).map((opt, i) => {
            if (typeof opt === "number")
                return jsxs(Tag, { children: ["+", opt] }, i);
            const { label, value } = opt;
            return (jsx(Tag, { hoverShowClose: true, onClose: (e) => {
                    e?.stopPropagation();
                    onSelect?.(value, opt);
                }, children: label }, value));
        });
    }
    return options.find((opt) => opt.value === value)?.label;
};

export { Options, activeOptions, displayValue };
//# sourceMappingURL=options.js.map
