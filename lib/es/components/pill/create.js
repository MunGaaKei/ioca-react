import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { memo } from 'react';
import Loading from '../loading/loading.js';
import Tag from '../tag/tag.js';

const CreateTag = memo(function CreateTag(props) {
    const { isEditing, isLoading, createTagProps, tagProps, onBlur, onKeyDown, onStartCreate } = props;
    if (isEditing) {
        return (jsx(Tag, { ...createTagProps, className: classNames("i-pill", tagProps?.className, "i-pill-editing"), contentEditable: true, suppressContentEditableWarning: true, onBlur: () => onBlur(-1), onKeyDown: (e) => onKeyDown(e, -1), children: isLoading && jsx(Loading, { size: ".86em", className: "ml-4" }) }, "pill-editing"));
    }
    return (jsx(Tag, { ...createTagProps, className: classNames("i-pill", tagProps?.className, "i-pill-create"), onClick: onStartCreate, children: jsx("b", { children: "\uFF0B" }) }, "pill-create"));
});

export { CreateTag as default };
