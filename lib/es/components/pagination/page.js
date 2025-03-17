import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useState } from 'react';
import Loading from '../loading/loading.js';

const Page = (props) => {
    const { page, active, children, onChange } = props;
    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
        if (active || loading)
            return;
        setLoading(true);
        await onChange?.(page);
        setLoading(false);
    };
    return (jsxs("a", { className: classNames("i-page", {
            "i-page-active": active,
            "i-page-loading": loading,
            "i-page-disabled": false,
        }), "data-page": page, onClick: handleClick, children: [loading && jsx(Loading, {}), children] }));
};

export { Page as default };
//# sourceMappingURL=page.js.map
