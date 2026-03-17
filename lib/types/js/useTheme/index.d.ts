import { ITheme } from './type.js';

declare const useTheme: (props?: ITheme) => {
    theme: string;
    setTheme: (value: string | ((prev: string) => string)) => void;
};

export { useTheme as default };
