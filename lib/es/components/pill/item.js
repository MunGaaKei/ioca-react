import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { memo } from 'react';
import Loading from '../loading/loading.js';
import Tag from '../tag/tag.js';

const TagItem = memo(function TagItem(props) {
    const { item, index, isEditing, isLoading, tagProps, editable, readonly, renderItem, onClose, onClick, onBlur, onKeyDown } = props;
    const isClickable = !isEditing && editable && !readonly;
    if (renderItem) {
        return renderItem({
            value: item,
            index,
            editing: isEditing,
            loading: isLoading,
            readonly: !!readonly,
            remove: () => onClose(index),
        });
    }
    return (jsxs(Tag, { ...tagProps, className: classNames("i-pill", tagProps?.className, { "i-pill-editing": isEditing }), contentEditable: isEditing, suppressContentEditableWarning: true, onClose: !isEditing && !isLoading && !readonly ? () => onClose(index) : undefined, onClick: isClickable ? (e) => onClick(e, index) : undefined, onBlur: isEditing ? () => onBlur(index) : undefined, onKeyDown: isEditing ? (e) => onKeyDown(e, index) : undefined, children: [item, isLoading && jsx(Loading, { size: ".86em", className: "ml-4" })] }));
});

export { TagItem as default };
