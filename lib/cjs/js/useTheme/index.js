'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ahooks = require('ahooks');
var react = require('react');

const useTheme = (props) => {
    const { key = "ioca-react-theme", defaultValue, listenStorageChange, } = props ?? {};
    const [theme, setTheme] = ahooks.useLocalStorageState(key, {
        defaultValue: defaultValue ?? "",
        listenStorageChange,
    });
    react.useEffect(() => {
        if (typeof document === "undefined")
            return;
        const cls = document.documentElement.classList;
        const cns = Array.from(cls);
        const pre = cns.find((n) => n.startsWith("theme-")) ?? "";
        if (pre) {
            cls.replace(pre, theme || "theme-auto");
            return;
        }
        theme && cls.add(theme);
    }, [theme]);
    return {
        theme,
        setTheme,
    };
};

exports.default = useTheme;
//# sourceMappingURL=index.js.map
