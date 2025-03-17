import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useMemo } from 'react';

const Text = (props) => {
    const { as: Tag = "span", size, weight, decoration, gradient, wave, style, className, children, } = props;
    const gradients = useMemo(() => {
        if (!gradient || !Array.isArray(gradient))
            return {};
        return {
            backgroundImage: `-webkit-linear-gradient(${gradient.join(",")})`,
            backgroundClip: "text",
        };
    }, [gradient]);
    return (jsx(Tag, { style: {
            fontSize: size,
            fontWeight: weight,
            textDecoration: decoration,
            ...gradients,
            ...style,
        }, className: classNames(className, {
            "i-text-gradient": gradient,
            "i-text-gradient-wave": wave,
        }), children: children }));
};

export { Text as default };
//# sourceMappingURL=text.js.map
