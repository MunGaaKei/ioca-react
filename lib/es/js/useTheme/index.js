import { useLocalStorageState } from 'ahooks';
import { useEffect } from 'react';

const useTheme = (props) => {
    const { key = "ioca-react-theme", defaultValue, listenStorageChange, } = props ?? {};
    const [theme, setTheme] = useLocalStorageState(key, {
        defaultValue: defaultValue ?? "",
        listenStorageChange,
    });
    useEffect(() => {
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

export { useTheme as default };
//# sourceMappingURL=index.js.map
