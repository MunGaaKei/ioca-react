import { FilePresentOutlined } from "@ricons/material";
import { memo, MouseEvent, RefObject, useCallback, useMemo } from "react";
import SortableContainer from "react-easy-sort";
import { TFileType } from "../../js/usePreview/type";
import { formatBytes, getFileType } from "../../js/utils";
import Icon from "../icon";
import Image from "../image";
import Helpericon from "../utils/helpericon";
import { IUploadItem } from "./type";

interface ListContainerProps {
    sortable?: boolean;
    onSortEnd: (oldIndex: number, newIndex: number) => void;
    [key: string]: any;
}

export const ListContainer = memo((props: ListContainerProps) => {
    const { sortable, onSortEnd, children, ...restProps } = props;

    if (!sortable) {
        return (
            <div
                className="i-upload-list"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                {...restProps}
            >
                {children}
            </div>
        );
    }
    return (
        <SortableContainer
            draggedItemClassName="i-upload-item-dragged"
            onSortEnd={onSortEnd}
            className="i-upload-list"
            {...restProps}
        >
            {children}
        </SortableContainer>
    );
});

const CloseBtn = memo(
    ({ index, onRemove }: { index: number; onRemove: (i: number) => void }) => (
        <Helpericon
            active
            className="i-upload-delete"
            onClick={(e: MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                e.preventDefault();
                onRemove(index);
            }}
        />
    ),
);

const FileListItem = memo(
    (props: IUploadItem & { ref?: RefObject<HTMLDivElement | null> }) => {
        const { ref, mode, index, file, renderItem, onRemove, onPreview } =
            props;

        if (!file) return null;

        const { name, size, url, src } = file;
        const type = getFileType(name, file.type);

        const handleClick = useCallback(() => {
            onPreview?.(index);
        }, [onPreview, index]);

        if (renderItem) {
            return renderItem(file, index);
        }

        const node = useMemo(() => {
            switch (type) {
                case TFileType.IMAGE:
                    return (
                        <Image
                            lazyload
                            src={url || src}
                            fit="cover"
                            onMouseDown={(e: MouseEvent<HTMLImageElement>) =>
                                e.preventDefault()
                            }
                        />
                    );
                case TFileType.VIDEO:
                    return <video src={url || src} preload="none" />;
                default:
                    return (
                        <>
                            <Icon icon={<FilePresentOutlined />} size="1.5em" />
                            <span className="i-upload-file-name">{name}</span>
                        </>
                    );
            }
        }, [type, url, src, name]);

        switch (mode) {
            case "card":
                return (
                    <div
                        ref={ref}
                        className="i-upload-item-card"
                        onClick={handleClick}
                    >
                        {node}
                        <CloseBtn index={index} onRemove={onRemove} />
                        {name && (
                            <span className="px-12 py-8 i-upload-tip">
                                {name}
                            </span>
                        )}
                    </div>
                );
            default:
                return (
                    <div
                        ref={ref}
                        className="i-upload-item"
                        onClick={handleClick}
                    >
                        <span>{name}</span>
                        <i className="i-upload-size">
                            {formatBytes(size ?? 0)}
                        </i>
                        <CloseBtn index={index} onRemove={onRemove} />
                    </div>
                );
        }
    },
);

export default FileListItem;
