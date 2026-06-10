import classNames from "classnames";
import { memo } from "react";
import Loading from "../loading";
import Tag from "../tag";
import "./index.css";
import type { ITagItemProps } from "./type";

const TagItem = memo(function TagItem(props: ITagItemProps) {
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

    return (
        <Tag
            {...tagProps}
            className={classNames("i-pill", tagProps?.className, { "i-pill-editing": isEditing })}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onClose={!isEditing && !isLoading && !readonly ? () => onClose(index) : undefined}
            onClick={isClickable ? (e) => onClick(e, index) : undefined}
            onBlur={isEditing ? () => onBlur(index) : undefined}
            onKeyDown={isEditing ? (e) => onKeyDown(e, index) : undefined}
        >
            {item}
            {isLoading && <Loading size=".86em" className="ml-4" />}
        </Tag>
    );
});

export default TagItem;
