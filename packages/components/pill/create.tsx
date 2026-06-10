import classNames from "classnames";
import { memo } from "react";
import Loading from "../loading";
import Tag from "../tag";
import "./index.css";
import type { ICreateTagProps } from "./type";

const CreateTag = memo(function CreateTag(props: ICreateTagProps) {
    const { isEditing, isLoading, createTagProps, tagProps, onBlur, onKeyDown, onStartCreate } = props;

    if (isEditing) {
        return (
            <Tag
                key="pill-editing"
                {...createTagProps}
                className={classNames("i-pill", tagProps?.className, "i-pill-editing")}
                contentEditable
                suppressContentEditableWarning
                onBlur={() => onBlur(-1)}
                onKeyDown={(e) => onKeyDown(e, -1)}
            >
                {isLoading && <Loading size=".86em" className="ml-4" />}
            </Tag>
        );
    }

    return (
        <Tag
            key="pill-create"
            {...createTagProps}
            className={classNames("i-pill", tagProps?.className, "i-pill-create")}
            onClick={onStartCreate}
        >
            <b>＋</b>
        </Tag>
    );
});

export default CreateTag;
