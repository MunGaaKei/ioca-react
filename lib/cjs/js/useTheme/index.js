'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ahooks = require('ahooks');
var react = require('react');

const useTheme = (props) => {
    const { key = "ioca-react-theme", defaultValue = "theme-auto", listenStorageChange, } = props ?? {};
    const [mounted, setMounted] = react.useState(false);
    const [theme, setTheme] = ahooks.useLocalStorageState(key, {
        defaultValue,
        listenStorageChange,
    });
    react.useEffect(() => {
        setMounted(true);
    }, []);
    react.useEffect(() => {
        if (!mounted || !theme)
            return;
        const cls = document.documentElement.classList;
        const prev = Array.from(cls).find((n) => n.startsWith("theme-"));
        if (prev) {
            cls.replace(prev, theme);
        }
        else {
            cls.add(theme);
        }
    }, [theme, mounted]);
    return {
        theme: mounted ? theme : defaultValue,
        setTheme: mounted ? setTheme : () => { },
    };
};

exports.default = useTheme;
//# sourceMappingURL=index.js.map
