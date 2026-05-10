import { MoveToInboxTwotone, OutboxTwotone } from "@ricons/material";
import classNames from "classnames";
import { DragEvent, useRef, useState } from "react";
import Icon from "../icon";
import { IDropboxProps } from "./type";

const Dropbox = (props: IDropboxProps) => {
    const { multiple, accept, disabled, children, onChange, onDropFiles } =
        props;
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (disabled) return;
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onDropFiles(files);
    };

    const handleClick = () => {
        if (!disabled) inputRef.current?.click();
    };

    return (
        <div
            className={classNames(
                "i-upload-dropbox",
                dragging && "i-upload-dropbox-active",
            )}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={inputRef}
                type="file"
                className="i-input-file-hidden"
                multiple={multiple}
                accept={accept}
                disabled={disabled}
                onChange={onChange}
            />
            {typeof children === "function"
                ? children(dragging)
                : children || (
                      <Icon
                          icon={
                              dragging ? (
                                  <MoveToInboxTwotone />
                              ) : (
                                  <OutboxTwotone />
                              )
                          }
                          size="2em"
                      />
                  )}
        </div>
    );
};

export default Dropbox;
