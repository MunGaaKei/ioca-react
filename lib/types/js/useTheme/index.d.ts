import { ITheme } from './type.js';

type TSetTheme = (value: string | undefined | ((prev: string) => string | undefined)) => void;
declare const useTheme: (props?: ITheme) => {
    theme: string;
    setTheme: TSetTheme;
};

export { useTheme as default };
