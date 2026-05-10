import { DriveFolderUploadOutlined, PlusSharp } from "@ricons/material";
import classNames from "classnames";
import { uid } from "radash";
import {
    ChangeEvent,
    CSSProperties,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import { SortableItem } from "react-easy-sort";
import usePreview from "../../js/usePreview";
import { TPreviewItem } from "../../js/usePreview/type";
import { arrayMove } from "../../js/utils";
import Button from "../button";
import Icon from "../icon";
import InputContainer from "../input/container";
import Dropbox from "./dropbox";
import "./index.css";
import FileListItem, { ListContainer } from "./renderFile";
import { IFile, IUpload } from "./type";

const normalizeFiles = (files?: IFile[] | File[]) =>
    (files ?? []).map((item) => {
        const file = item as IFile;
        if (item instanceof File) {
            const src = file.src ?? URL.createObjectURL(item);
            Object.assign(item, {
                id: file.id ?? uid(7),
                src,
                url: file.url ?? src,
            });
            return item;
        }
        const src = file.src ?? file.name;
        return {
            ...(file as object),
            id: file.id ?? uid(7),
            src,
            url: file.url ?? src,
        } as IFile;
    });

const Upload = (props: IUpload) => {
    const {
        label,
        labelInline,
        value,
        files,
        placeholder,
        status = "normal",
        message,
        className,
        style,
        children,
        droppable,
        dropbox,
        defaultButtonProps,
        mode = "default",
        cardSize = "3.2em",
        disabled,
        sortable,
        limit = props.multiple ? Infinity : 1,
        multiple,
        renderItem,
        shouldUpload = () => true,
        uploader,
        onChange,
        onFilesChange,
        onUpload,
        onRemove,
        ...restProps
    } = props;

    const [internalFileList, setInternalFileList] = useState<IFile[]>([]);
    const isControlled = useMemo(
        () => value !== undefined || files !== undefined,
        [value, files],
    );
    const fileList = isControlled
        ? normalizeFiles(value ?? files ?? [])
        : internalFileList;

    const uploadMessage = message;
    const inputRef = useRef<HTMLInputElement>(null);
    const preview = usePreview();
    const defBtnProps = useMemo(
        () => ({
            children: (
                <>
                    <Icon icon={<DriveFolderUploadOutlined />} /> 上传
                </>
            ),
            ...defaultButtonProps,
        }),
        [defaultButtonProps],
    );

    const trigger = useMemo(() => {
        if (children) return children;

        switch (mode) {
            case "card":
                return (
                    <Button
                        className="i-upload-card-btn color-5"
                        square
                        flat
                        outline
                        disabled={disabled}
                    >
                        <Icon icon={<PlusSharp />} />
                    </Button>
                );
            default:
                return (
                    <Button
                        {...defBtnProps}
                        className={classNames(
                            "i-upload-btn",
                            defBtnProps.className,
                        )}
                        disabled={disabled}
                    />
                );
        }
    }, [mode, children, disabled, defBtnProps]);

    const handleUpload = useCallback(
        async (files: IFile[]) => {
            if (!uploader) return;

            const shouldUploadFiles = files.filter(shouldUpload);
            const result = await Promise.all(shouldUploadFiles.map(uploader));

            return onUpload?.(result);
        },
        [uploader, shouldUpload, onUpload],
    );

    const processFiles = useCallback(
        (inputFiles: IFile[]) => {
            const before = fileList;
            const changed: IFile[] = [];

            inputFiles.forEach((file) => {
                const { id, name, size, type } = file;
                const same = before.some(
                    (pf) =>
                        pf.name === name &&
                        pf.size === size &&
                        pf.type === type,
                );
                const src = URL.createObjectURL(file);

                Object.assign(file, {
                    id: id ?? uid(7),
                    src: src ?? file.name,
                    url: src ?? file.name,
                });
                if (!same) changed.push(file);
            });

            const after = [...before, ...changed];
            const last = after.at(-1);
            const nextFiles: IFile[] = multiple
                ? (after.slice(0, limit) as IFile[])
                : last
                  ? [last as IFile]
                  : [];

            return { nextFiles, changed };
        },
        [fileList, multiple, limit],
    );

    const applyFiles = useCallback(
        (
            nextFiles: IFile[],
            changed: IFile[],
            e?: ChangeEvent<HTMLInputElement>,
        ) => {
            if (!isControlled) setInternalFileList(nextFiles as IFile[]);
            onFilesChange?.(nextFiles as IFile[], changed as IFile[], e);
            onChange?.(nextFiles, e);
            handleUpload(changed);
        },
        [isControlled, onFilesChange, onChange, handleUpload],
    );

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const inputFiles = Array.from(e.target.files || []) as IFile[];
            const { nextFiles, changed } = processFiles(inputFiles);

            applyFiles(nextFiles, changed, e);
            if (inputRef.current) inputRef.current.value = "";
        },
        [processFiles, applyFiles],
    );

    const handleDropFiles = useCallback(
        (files: File[]) => {
            const { nextFiles, changed } = processFiles(files as IFile[]);
            applyFiles(nextFiles, changed);
        },
        [processFiles, applyFiles],
    );

    const handleRemove = useCallback(
        (i: number) => {
            const files = [...fileList];
            const changed = files.splice(i, 1);
            URL.revokeObjectURL((changed[0] as IFile)?.src || "");

            if (!isControlled) setInternalFileList(files as IFile[]);
            onFilesChange?.(files as IFile[], changed as IFile[]);
            onChange?.(files);
            onRemove?.(changed[0] as IFile);

            if (inputRef.current) inputRef.current.value = "";
        },
        [fileList, isControlled, onFilesChange, onChange, onRemove],
    );

    const handlePreview = useCallback(
        (i: number) => {
            preview({
                items: fileList as unknown as TPreviewItem[],
                initial: i,
            });
        },
        [fileList, preview],
    );

    const handleSortEnd = useCallback(
        (before: number, after: number) => {
            const files = [...fileList];
            const nextFiles = arrayMove(files, before, after);
            if (!isControlled) setInternalFileList(nextFiles);
            onFilesChange?.(nextFiles, []);
            onChange?.(nextFiles);
        },
        [fileList, isControlled, onFilesChange, onChange],
    );

    return (
        <InputContainer
            as="div"
            label={label}
            labelInline={labelInline}
            className={classNames("i-input-label-file", className)}
            style={style}
        >
            <div
                className={classNames("i-upload-inner", {
                    [`i-upload-${mode}`]: mode !== "default",
                })}
                style={{ ["--upload-card-size"]: cardSize } as CSSProperties}
            >
                <ListContainer sortable={sortable} onSortEnd={handleSortEnd}>
                    {fileList.map((file, i) => {
                        const f = file as IFile;
                        const key = f.id ?? i;
                        const node = (
                            <FileListItem
                                key={key}
                                index={i}
                                file={f}
                                mode={mode}
                                renderItem={renderItem}
                                onRemove={handleRemove}
                                onPreview={handlePreview}
                            />
                        );

                        if (!sortable) return node;

                        return <SortableItem key={key}>{node}</SortableItem>;
                    })}
                </ListContainer>

                {uploadMessage && (
                    <span className="i-upload-message">{uploadMessage}</span>
                )}

                {fileList.length < limit &&
                    (droppable ? (
                        <Dropbox
                            multiple={multiple}
                            accept={restProps.accept}
                            disabled={disabled}
                            onChange={handleChange}
                            onDropFiles={handleDropFiles}
                        >
                            {dropbox}
                        </Dropbox>
                    ) : (
                        <label>
                            <input
                                {...restProps}
                                disabled={disabled}
                                ref={inputRef}
                                type="file"
                                className="i-input-file-hidden"
                                multiple={multiple}
                                onChange={handleChange}
                            />
                            {trigger}
                        </label>
                    ))}
            </div>
        </InputContainer>
    );
};

export default Upload;
