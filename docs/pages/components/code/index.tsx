import { useTheme } from "@/packages";
import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
    atomOneDark,
    atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./index.css";

// https://www.npmjs.com/package/react-syntax-highlighter

export default function CodeView(props) {
    const { lang = "Javascript", children } = props;
    const { theme } = useTheme({ listenStorageChange: true });
    const [prefersDark, setPrefersDark] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;

        const mediaQueryList = window.matchMedia(
            "(prefers-color-scheme: dark)",
        );
        const onChange = (event: MediaQueryListEvent) => {
            setPrefersDark(event.matches);
        };

        setPrefersDark(mediaQueryList.matches);

        if (mediaQueryList.addEventListener) {
            mediaQueryList.addEventListener("change", onChange);
            return () => mediaQueryList.removeEventListener("change", onChange);
        }

        const legacyMediaQueryList = mediaQueryList as unknown as {
            addListener?: (
                callback: (event: MediaQueryListEvent) => void,
            ) => void;
            removeListener?: (
                callback: (event: MediaQueryListEvent) => void,
            ) => void;
        };

        legacyMediaQueryList.addListener?.(onChange);
        return () => legacyMediaQueryList.removeListener?.(onChange);
    }, []);

    const isDarkMode =
        theme === "theme-dark" || (prefersDark && theme === "theme-auto");

    return (
        <SyntaxHighlighter
            language={lang}
            style={isDarkMode ? atomOneDark : atomOneLight}
            children={children}
            className="demo-codes"
        />
    );
}
