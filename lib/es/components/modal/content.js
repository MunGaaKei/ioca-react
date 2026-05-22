import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { memo, useState, useMemo } from 'react';
import Button from '../button/button.js';
import Helpericon from '../utils/helpericon/helpericon.js';

const Content = (props) => {
    const { title, footer, hideCloseButton, footerLeft, okButtonProps, cancelButtonProps, children, onOk, onClose, } = props;
    const showHeader = title || !hideCloseButton;
    const [loading, setLoading] = useState(false);
    const handleOk = async () => {
        setLoading(true);
        try {
            const ret = await onOk?.();
            if (ret === false)
                return;
            onClose?.();
        }
        finally {
            setLoading(false);
        }
    };
    const renderFooter = useMemo(() => {
        if (footer || footer === null)
            return footer;
        const propsOk = Object.assign({
            children: "确定",
            onClick: handleOk,
        }, okButtonProps, { loading });
        const propsCancel = Object.assign({
            secondary: true,
            children: "关闭",
            onClick: onClose,
        }, cancelButtonProps);
        return (jsxs(Fragment, { children: [footerLeft, jsx(Button, { ...propsOk }), jsx(Button, { ...propsCancel })] }));
    }, [footer, okButtonProps, cancelButtonProps, loading]);
    return (jsxs(Fragment, { children: [showHeader && (jsxs("header", { className: 'i-modal-header', children: [title && jsx("b", { children: title }), jsx(Helpericon, { active: !hideCloseButton, className: 'i-modal-close', onClick: onClose })] })), jsx("div", { className: 'i-modal-content', children: children }), jsx("footer", { className: 'i-modal-footer', children: renderFooter })] }));
};
var Content$1 = memo(Content);

export { Content$1 as default };
//# sourceMappingURL=content.js.map
