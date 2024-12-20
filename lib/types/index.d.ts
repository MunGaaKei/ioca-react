import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { HTMLAttributes, ReactNode, CSSProperties, ForwardRefExoticComponent, RefAttributes, ButtonHTMLAttributes, AnchorHTMLAttributes, ChangeEvent, KeyboardEvent, InputHTMLAttributes, MouseEvent, TextareaHTMLAttributes, FC, Ref } from 'react';
import { LinkProps } from 'react-router-dom';
import { Dayjs } from 'dayjs';
import { ListProps } from 'rc-virtual-list';

interface IAffix extends HTMLAttributes<HTMLElement> {
    position?: "fixed" | "absolute" | "sticky" | "static";
    left?: string | number;
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    offset?: number;
    getContainer?: () => HTMLElement | null;
}

declare function ToTop(props: IAffix): react_jsx_runtime.JSX.Element;

declare const Affix: {
    (props: IAffix): JSX.Element;
    ToTop: typeof ToTop;
};

interface IBadge {
    content?: ReactNode;
    contentClass?: string;
    dot?: boolean;
    dotSize?: string | number;
    round?: boolean;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

declare const Badge: (props: IBadge) => JSX.Element;

declare function Group(props: IButtonGroup): react_jsx_runtime.JSX.Element;

declare function Toggle(props: IButtonToggle): react_jsx_runtime.JSX.Element;

interface BaseButtonProps {
    as?: "a" | "button" | ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>;
    children?: ReactNode | string;
    className?: string;
    loading?: boolean;
    flat?: boolean;
    outline?: boolean;
    square?: boolean;
    size?: "mini" | "small" | "normal" | "large" | "extreme";
    disabled?: boolean;
    block?: boolean;
    round?: boolean;
    ripple?: boolean;
    secondary?: boolean;
}
interface IButton extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLElement>, "type">, AnchorHTMLAttributes<HTMLElement> {
}
interface IButtonToggle extends IButton {
    active?: boolean;
    activeClass?: string;
    after?: ReactNode;
    disabled?: boolean;
    onToggle?: (active: boolean) => void;
}
interface IButtonGroup {
    children?: ReactNode;
    vertical?: boolean;
    className?: string;
    style?: CSSProperties;
}
interface CompositionButton extends ForwardRefExoticComponent<IButton & RefAttributes<HTMLElement>> {
    Toggle: typeof Toggle;
    Group: typeof Group;
}

declare const Button: CompositionButton;

interface ICard {
    shadow?: boolean;
    border?: boolean;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
}

declare const Card: {
    (props: ICard): JSX.Element;
    Header: any;
    Footer: any;
    Banner: any;
    Tailer: any;
};

type TStatus = "normal" | "success" | "warning" | "error";
type TOption = {
    label: ReactNode;
    value: any;
    disabled?: boolean;
};
type TOptions = (TOption | string | number)[];
type TValidate = {
    status?: TStatus;
    message?: ReactNode;
};
interface BaseInput extends TValidate {
    label?: ReactNode;
    value?: any;
    initValue?: any;
    labelInline?: boolean;
    clear?: boolean;
    border?: boolean;
    tip?: ReactNode;
    onChange?: (value: any, e?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onEnter?: (e: KeyboardEvent) => void;
}
type TPosition = "top" | "right" | "left" | "bottom";

interface ICheckbox extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">, TValidate {
    label?: ReactNode;
    options: TOption[] | (string | number)[];
    type?: "default" | "switch" | "button";
    optionInline?: boolean;
    labelInline?: boolean;
    onChange?: (value: any[], option: TOption, e: ChangeEvent<HTMLInputElement>) => void;
}
interface ICheckboxItem extends Omit<InputHTMLAttributes<HTMLElement>, "value" | "onChange">, TValidate {
    type?: "default" | "switch" | "button";
    label?: ReactNode;
    value?: boolean;
    partof?: boolean;
    onChange?: (value: boolean, e: ChangeEvent<HTMLInputElement>) => void;
}

declare function CheckboxItem(props: ICheckboxItem): react_jsx_runtime.JSX.Element;

declare function Checkbox(props: ICheckbox): react_jsx_runtime.JSX.Element;
declare namespace Checkbox {
    var Item: typeof CheckboxItem;
}

type TKey = string | number;
interface ICollapse extends HTMLAttributes<HTMLDivElement> {
    active?: TKey | TKey[];
    items?: ICollapseItem[];
    multiple?: boolean;
    border?: boolean;
    headerClickable?: boolean;
    renderToggle?: (active: boolean) => ReactNode;
    onCollapse?: (key: TKey, active: boolean) => void;
}
interface ICollapseItem {
    key?: TKey;
    title?: ReactNode;
    content?: ReactNode;
    disabled?: boolean;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

declare function Item$3(props: ICollapseItem): react_jsx_runtime.JSX.Element;

declare const Collapse: {
    (props: ICollapse): JSX.Element;
    Item: typeof Item$3;
};

type IData$1 = Record<string, any>;
interface IColumn {
    id: string;
    title?: ReactNode;
    sorter?: boolean;
    justify?: string;
    rowSpan?: number;
    colSpan?: number;
    width?: string;
    fixed?: "left" | "right";
    render?: (value?: any, data?: IData$1, index?: number) => ReactNode;
    renderHeader?: (column?: IColumn, index?: number) => ReactNode;
}
interface IDatagrid {
    data: IData$1[];
    columns?: IColumn[];
    border?: boolean;
    striped?: boolean;
    header?: boolean;
    resizable?: boolean;
    loading?: boolean;
    empty?: ReactNode;
    cellPadding?: string | number;
    cellEllipsis?: boolean;
    height?: number | string;
    style?: CSSProperties;
    className?: string;
    renderLoading?: () => ReactNode;
    onRowClick?: (data?: IData$1, row?: number) => void;
    onCellClick?: (data?: IData$1, column?: IColumn, row?: number, col?: number, e?: MouseEvent) => void;
    onCellDoubleClick?: (data?: IData$1, column?: IColumn, row?: number, col?: number, e?: MouseEvent) => void;
    onHeaderClick?: (column?: IColumn, e?: MouseEvent) => void;
    onSort?: (sortBy: string, sortType: string) => void;
    onScroll?: (e: MouseEvent) => void;
    onResize?: (column?: IColumn, width?: number) => void;
}

declare const Datagrid: (props: IDatagrid) => JSX.Element;

declare const Number$2: react.ForwardRefExoticComponent<IInputNumber & react.RefAttributes<HTMLInputElement>>;

declare const Range: (props: IInputRange) => react_jsx_runtime.JSX.Element;

declare const Textarea: react.ForwardRefExoticComponent<ITextarea & react.RefAttributes<HTMLTextAreaElement>>;

interface IInput extends BaseInput, Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
    prepend?: ReactNode;
    append?: ReactNode;
    hideVisible?: boolean;
}
interface ITextarea extends BaseInput, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange"> {
    autoSize?: boolean;
}
interface IInputNumber extends BaseInput, Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "defaultValue"> {
    value?: string | number;
    prepend?: ReactNode;
    append?: ReactNode;
    step?: number;
    min?: number;
    max?: number;
    thousand?: string;
    precision?: number;
    hideControl?: boolean;
}
interface IInputRange extends Omit<BaseInput, "value" | "onChange">, Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "placeholder" | "onChange"> {
    value?: (number | string | undefined)[];
    placeholder?: string[];
    min?: number;
    max?: number;
    prepend?: ReactNode;
    append?: ReactNode;
    step?: number;
    thousand?: string;
    precision?: number;
    hideControl?: boolean;
    onChange?: (value: (number | string | undefined)[], e?: ChangeEvent<HTMLInputElement> | MouseEvent<Element>) => void;
}
type CompositionInput = ForwardRefExoticComponent<IInput & RefAttributes<HTMLInputElement>> & {
    Textarea: typeof Textarea;
    Number: typeof Number$2;
    Range: typeof Range;
};

interface IPopup {
    visible?: boolean;
    content?: ReactNode;
    trigger?: "hover" | "click" | "focus" | "none" | "contextmenu";
    gap?: number;
    offset?: number;
    fixed?: boolean;
    position?: TPosition;
    arrow?: boolean;
    align?: "start" | "center" | "end";
    showDelay?: number;
    hideDelay?: number;
    touchable?: boolean;
    fitSize?: boolean;
    watchResize?: boolean;
    clickOutside?: boolean;
    disabled?: boolean;
    referToWindow?: boolean;
    style?: CSSProperties;
    children?: ReactNode;
    className?: string;
    getContainer?: (trigger?: HTMLElement) => HTMLElement;
    onVisibleChange?: (visible: boolean) => void;
}

interface IDatePicker extends BaseInput, IInput, Omit<IBaseDates, "value"> {
    popupProps?: IPopup;
}
interface IBaseDates {
    value?: any;
    format?: string;
    weeks?: ReactNode[];
    unitYear?: ReactNode;
    unitMonth?: ReactNode;
    renderDate?: (date: Dayjs) => ReactNode;
    renderMonth?: (month: number) => ReactNode;
    renderYear?: (year: number) => ReactNode;
    onDateClick?: (date: Dayjs) => void;
    disabledDate?: (date: Dayjs) => boolean;
}

declare const Datepicker: (props: IDatePicker) => JSX.Element;

type IData = {
    label: ReactNode;
    value: ReactNode;
    colSpan?: number;
    rowSpan?: number;
    hidden?: boolean;
    style?: CSSProperties;
};
interface IDescription {
    data: IData[];
    align?: string;
    colon?: ReactNode;
    gap?: string | number;
    equally?: boolean;
    columns?: number;
    vertical?: boolean;
    labelWidth?: string | number;
    labelAlign?: "left" | "right" | "center" | "justify";
    style?: CSSProperties;
    className?: string;
}

declare const Description: (props: IDescription) => JSX.Element;

interface IDrawer extends HTMLAttributes<HTMLDivElement> {
    visible?: boolean;
    position?: "top" | "left" | "right" | "bottom";
    header?: ReactNode;
    footer?: ReactNode;
    hideCloseButton?: boolean;
    backdropClosable?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    onClose?: () => void;
}

declare function Drawer(props: IDrawer): react.ReactPortal;

interface IList extends HTMLAttributes<HTMLUListElement> {
    label?: ReactNode | ((i: number) => ReactNode);
    type?: "option" | "default";
}
interface IListItem extends HTMLAttributes<HTMLLIElement>, Pick<IList, "type"> {
    active?: boolean;
    align?: string;
    disabled?: boolean;
    label?: ReactNode;
}
interface IVirtual extends Omit<ListProps<any>, "children"> {
    renderItem: (item: any, i: number) => ReactNode;
}

interface IDropdown extends IPopup {
    width?: string | number;
}
interface IDropItem extends IListItem {
    more?: ReactNode;
    moreProps?: IDropdown;
}

declare const Dropdown: {
    (props: IDropdown): JSX.Element;
    Item: (props: IDropItem) => react_jsx_runtime.JSX.Element;
};

interface IFlex {
    as?: keyof JSX.IntrinsicElements;
    align?: string;
    justify?: string;
    gap?: string | number;
    direction?: any;
    wrap?: any;
    columns?: string | number;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
}

declare const Flex: (props: IFlex) => JSX.Element;

declare class IFormInstance {
    readonly id?: string;
    data: Record<string, any>;
    cacheData: Record<string, any>;
    rules?: Pick<IForm, "rules">;
    constructor();
    get(field?: string): any;
    set(field: any, value?: any): void;
    delete(field: any): void;
    clear(): void;
    validate(field?: string): Promise<boolean | Record<string, any>>;
}
declare function useForm(form?: IFormInstance): IFormInstance;

type TValidator = (value: any, form: IFormInstance) => boolean;
type TRule = {
    validator: TValidator;
    message?: string;
};
interface IForm extends HTMLAttributes<HTMLFormElement> {
    form?: IFormInstance;
    rules?: {
        [key: string]: boolean | TValidator | TRule;
    };
    initialValues?: Record<string, any>;
    width?: string | number;
    onEnter?: (values: Record<string, any>, form: IFormInstance) => void;
}
interface IField {
    name?: string;
    children?: ReactNode;
    required?: boolean;
}

declare function Field(props: IField): react.ReactNode;

declare const Form: {
    (props: IForm): JSX.Element;
    useForm: typeof useForm;
    Field: typeof Field;
};

interface IIcon extends HTMLAttributes<HTMLElement> {
    icon: ReactNode;
    size?: string;
    rotate?: number;
    style?: CSSProperties;
    className?: string;
}

declare const Icon: react.ForwardRefExoticComponent<IIcon & react.RefAttributes<HTMLElement>>;

declare function List$1(props: IImageList): react_jsx_runtime.JSX.Element | "";

interface IImage extends HTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
    round?: boolean;
    size?: string | number;
    initSize?: string | number;
    lazyload?: boolean;
    fallback?: ReactNode;
    fit?: any;
    cover?: ReactNode;
    coverClass?: string;
    usePreview?: boolean;
}
interface IImageList extends Omit<IImage, "src" | "alt"> {
    items: string[] | IImage[];
    gap?: number | string;
    columns?: number | string;
    wrap?: any;
    direction?: any;
}
interface CompositionImage extends FC<IImage> {
    List: typeof List$1;
}

declare const _default$2: CompositionImage;

declare const Input: CompositionInput;

declare const List: {
    (props: IList): JSX.Element;
    Virtual: (props: IVirtual) => react_jsx_runtime.JSX.Element;
    Item: react.ForwardRefExoticComponent<IListItem & react.RefAttributes<HTMLLIElement>>;
};

interface ILoading extends HTMLAttributes<HTMLDivElement> {
    icon?: ReactNode;
    text?: ReactNode;
    size?: number | string;
    absolute?: boolean;
}

declare const Loading: (props: ILoading) => JSX.Element;

interface IMessage {
    id?: string;
    content?: ReactNode;
    active?: boolean;
    duration?: number;
    gap?: number;
    offset?: string;
    max?: number;
    align?: "center" | "left" | "right";
    unshift?: boolean;
    closable?: boolean;
    timer?: ReturnType<typeof setTimeout>;
    className?: string;
    onShow?: () => void;
    onHide?: () => void;
}

declare function message(config: IMessage | ReactNode): () => void;
declare namespace message {
    var error: (content: ReactNode) => () => void;
    var success: (content: ReactNode) => () => void;
    var warning: (content: ReactNode) => () => void;
}

declare function useModal(): {
    open: (props: IModal) => void;
    update: (props: IModal) => void;
};

interface IModal extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    visible?: boolean;
    title?: ReactNode;
    footer?: ReactNode;
    closable?: boolean;
    hideCloseButton?: boolean;
    hideBackdrop?: boolean;
    backdropClosable?: boolean;
    width?: string | number;
    height?: string | number;
    customized?: boolean;
    fixed?: boolean;
    shadow?: boolean;
    okButtonProps?: IButton;
    cancelButtonProps?: IButton;
    footerLeft?: ReactNode;
    onVisibleChange?: (visible: boolean) => void;
    onOk?: () => void;
    onClose?: () => void;
}
interface CompositionModal extends FC<IModal> {
    useModal: typeof useModal;
}

declare const _default$1: CompositionModal;

interface IPagination extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    page?: number;
    total?: number;
    sibling?: number;
    size?: number;
    sizeOptions?: number[];
    prev?: ReactNode;
    next?: ReactNode;
    simple?: boolean;
    jumper?: boolean;
    renderPage?: (i: number) => ReactNode;
    renderEllipsis?: () => ReactNode;
    onChange?: (page: number) => Promise<void> | void;
}

declare const Pagination: (props: IPagination) => JSX.Element;

interface IPopconfirm extends IPopup {
    icon?: ReactNode;
    okButtonProps?: IButton;
    cancelButtonProps?: IButton;
    extra?: ReactNode;
    onOk?: () => Promise<void> | void;
    onClose?: () => Promise<void> | void;
}

declare const Popconfirm: (props: IPopconfirm) => JSX.Element;

declare function Popup(props: IPopup): react_jsx_runtime.JSX.Element;

interface IProgress extends Omit<BaseInput, "value" | "hideClear" | "onChange"> {
    name?: string;
    value?: number;
    precision?: number;
    height?: number;
    size?: number;
    barClass?: string;
    draggable?: boolean;
    type?: "line" | "circle";
    className?: string;
    style?: CSSProperties;
    renderCursor?: (value: number) => ReactNode;
    onChange?: (value: number) => void;
}

declare const Progress: (props: IProgress) => JSX.Element;

interface IRadioItem extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    type?: "default" | "button";
    onChange?: (value: any, e: ChangeEvent) => void;
}
interface IRadio extends IRadioItem {
    label?: ReactNode;
    options: TOption[] | (number | string)[];
    optionInline?: boolean;
    labelInline?: boolean;
    status?: TStatus;
    message?: string;
}

declare function RadioItem(props: IRadioItem): react_jsx_runtime.JSX.Element;

declare function Radio(props: IRadio): react_jsx_runtime.JSX.Element;
declare namespace Radio {
    var Item: typeof RadioItem;
}

interface ISelect extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onSelect" | "onChange">, BaseInput {
    options: TOptions;
    multiple?: boolean;
    prepend?: ReactNode;
    append?: ReactNode;
    hideClear?: boolean;
    max?: number;
    maxDisplay?: number;
    filter?: boolean | (() => boolean);
    filterPlaceholder?: string;
    empty?: ReactNode;
    popupProps?: IPopup;
    onSelect?: (v: any, option?: TOption) => void;
    onChange?: (v: any) => void;
}

declare const Select: react.ForwardRefExoticComponent<ISelect & react.RefAttributes<HTMLInputElement>>;

interface IStep {
    active?: number;
    vertical?: boolean;
    style?: CSSProperties;
    className?: string;
    line?: ReactNode;
    children?: ReactNode;
    asList?: boolean;
    renderIcon?: (i: number, status: string) => ReactNode;
    onClick?: (i: number) => void;
}
interface IStepItem extends IStep {
    index?: number;
    title?: ReactNode;
}

declare function Item$2(props: IStepItem): react_jsx_runtime.JSX.Element;

declare const Step: {
    (props: IStep): JSX.Element;
    Item: typeof Item$2;
};

declare function Item$1(props: ISwiperItem): react_jsx_runtime.JSX.Element;

interface ISwiper {
    initial?: number;
    type?: "normal" | "fade" | "flow";
    display?: number;
    scroll?: number;
    loop?: boolean;
    gap?: number;
    duration?: number;
    interval?: number;
    draggable?: boolean;
    dragOffset?: number;
    reverse?: boolean;
    autoplay?: boolean;
    pauseOnHover?: boolean;
    indicator?: boolean;
    itemHeight?: number;
    vertical?: boolean;
    prev?: ReactNode;
    next?: ReactNode;
    arrow?: boolean;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
    renderIndicator?: (i: number) => ReactNode;
    onBeforeSwipe?: (before: number) => void;
    onAfterSwipe?: (after: number) => void;
}
interface ISwiperItem extends Pick<ISwiper, "gap" | "itemHeight" | "vertical" | "type"> {
    active?: boolean;
    index?: number;
    transition?: string;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
}
interface RefSwiper {
    swipeTo: (i: number) => void;
    swipeNext: () => void;
    swipePrev: () => void;
}
interface CompositionSwiper extends ForwardRefExoticComponent<ISwiper & RefAttributes<RefSwiper>> {
    Item: typeof Item$1;
}

declare const Swiper: CompositionSwiper;

declare const Item: (props: ITabItem) => react_jsx_runtime.JSX.Element;

type TTabKey = string | number;
interface ITabItem {
    key?: TTabKey;
    props?: any;
    title?: ReactNode;
    content?: ReactNode;
    closable?: boolean;
    keepDOM?: boolean;
    intersecting?: boolean;
    children?: ReactNode;
}
interface ITabs {
    active?: TTabKey;
    tabs?: ITabItem[] | TTabKey[];
    type?: "default" | "line" | "pane";
    prepend?: ReactNode;
    append?: ReactNode;
    vertical?: boolean;
    hideMore?: boolean;
    bar?: boolean;
    barClass?: string;
    toggable?: boolean;
    className?: string;
    children?: ReactNode;
    style?: CSSProperties;
    renderMore?: (moreTabs: ITabItem[]) => ReactNode;
    onTabChange?: (to?: TTabKey, from?: TTabKey) => void;
}
interface RefTabs {
    open: (key: TTabKey) => void;
    close: (key: TTabKey) => void;
    add: (tab: ITabItem, position?: number) => void;
    navs: Ref<HTMLDivElement>;
}
interface CompositionTabs extends ForwardRefExoticComponent<ITabs & RefAttributes<RefTabs>> {
    Item: typeof Item;
}

declare const Tabs: CompositionTabs;

interface ITag extends HTMLAttributes<HTMLSpanElement> {
    dot?: boolean;
    dotClass?: string;
    outline?: boolean;
    round?: boolean;
    size?: "small" | "normal" | "large" | "extreme";
    onClick?: (e: MouseEvent) => void;
    onClose?: (e: MouseEvent) => void;
}

declare const Tag: (props: ITag) => JSX.Element;

declare function Number$1(props: ITextNumber): react_jsx_runtime.JSX.Element;

declare function Number(props: ITextTime): react_jsx_runtime.JSX.Element;

interface IText {
    as?: keyof JSX.IntrinsicElements;
    size?: string | number;
    decoration?: string;
    weight?: string | number;
    gradient?: string[];
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
}
interface ITextNumber extends IText {
    count?: number;
    to?: number;
    decimal?: number;
    thousand?: string;
    duration?: number;
    easing?: (x: number) => number;
}
interface ITextTime extends IText {
    seconds?: number;
    zero?: boolean;
    units?: string[];
}
interface CompositionText extends FC<IText> {
    Number: typeof Number$1;
    Time: typeof Number;
}

declare const _default: CompositionText;

interface ITreeItem {
    as?: "a" | "button" | ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>;
    key?: string;
    type?: "item" | "title" | string;
    title: string | ReactNode;
    icon?: ReactNode;
    href?: string;
    children?: ITreeItem[];
    expanded?: boolean;
    disabled?: boolean;
    checked?: boolean;
    parent?: ITreeItem;
    [key: string]: any;
}
interface ITree {
    data: ITreeItem[];
    parent?: ITreeItem;
    depth?: number;
    nodeProps?: {
        key?: string;
        title?: string;
        children?: string;
    };
    selectable?: boolean;
    selected?: string;
    checkable?: boolean;
    checked?: string[];
    disabledRelated?: boolean;
    partofs?: Record<string, boolean>;
    round?: boolean;
    style?: CSSProperties;
    className?: string;
    renderExtra?: (item: ITreeItem) => ReactNode;
    onItemClick?: (item: ITreeItem, e: MouseEvent<HTMLElement>) => void;
    onItemSelect?: (key: string, item: ITreeItem) => void;
    onItemCheck?: (item: ITreeItem, checked: boolean, checkedKeys: string[]) => void;
}
interface RefTree {
    getChecked: () => [string[], ITreeItem[]];
    getSelected: () => [string?, ITreeItem?];
    getPartofs: () => [string[], ITreeItem[]];
}

declare const Tree: react.ForwardRefExoticComponent<ITree & react.RefAttributes<RefTree>>;

interface IUpload extends BaseInput, Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    files?: IFile[];
    accept?: string;
    multiple?: boolean;
    directory?: boolean;
    limit?: number;
    mode?: "default" | "card";
    droppable?: boolean;
    cardSize?: string;
    shouldUpload?: (file: IFile) => boolean;
    uploader?: (file: IFile) => Promise<IFile>;
    renderItem?: (file: IFile, i: number) => ReactNode;
    onFilesChange?: (files: IFile[], changed: IFile[], e?: ChangeEvent<HTMLInputElement>) => void;
    onRemove?: (file: IFile) => void;
    onUpload?: (file: IFile) => void;
}
interface IFile extends File {
    uid?: string;
    instance?: File;
    src?: string;
    [key: string]: any;
}
interface RefUpload {
    getFileList: () => IFile[];
}

declare const Upload: react.ForwardRefExoticComponent<IUpload & react.RefAttributes<RefUpload>>;

interface IVideo extends HTMLAttributes<HTMLVideoElement> {
    src?: string;
    hideControls?: boolean;
    autoplay?: boolean;
    muted?: boolean;
    volume?: number;
    height?: number | string;
    width?: number | string;
    useOriginControls?: boolean;
    timeProgressProps?: IProgress;
    volumeProgressProps?: IProgress;
    onFullScreenChange?: (fullscreen: boolean) => void;
}
interface RefVideo {
    play: () => void;
    pause: () => void;
    stop: () => void;
    fullscreen: (full?: boolean) => void;
    getVideo: () => HTMLVideoElement | null;
}

declare const Video: react.ForwardRefExoticComponent<IVideo & react.RefAttributes<RefVideo>>;

type TPreviewItem = {
    src: string;
    name?: ReactNode;
    thumb?: string;
    rotate?: number;
    zoom?: number;
    style?: CSSProperties;
    type?: TFileType;
    suffix?: string;
};
declare enum TFileType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    PDF = "PDF",
    EXCEL = "EXCEL",
    TXT = "TXT",
    UNKNOWN = "UNKNOWN"
}
interface IPreview {
    items: (TPreviewItem | string)[];
    initial?: number;
    controls?: boolean;
    loop?: boolean;
    className?: string;
    style?: CSSProperties;
    modalProps?: IModal;
    renderImage?: (file: TPreviewItem) => ReactNode;
    renderFile?: (file: TPreviewItem) => ReactNode;
    onClose?: () => void;
    onChange?: (after: number, before?: number) => void;
    onZoom?: (scale: number) => void;
    onRotate?: (deg: number) => void;
}

declare function usePreview(): (config: IPreview) => void;

export { Affix, Badge, Button, Card, Checkbox, Collapse, Datagrid, Datepicker, Description, Drawer, Dropdown, Flex, Form, Icon, _default$2 as Image, Input, List, Loading, message as Message, _default$1 as Modal, Pagination, Popconfirm, Popup, Progress, Radio, Select, Step, Swiper, Tabs, Tag, _default as Text, Tree, Upload, Video, usePreview };
