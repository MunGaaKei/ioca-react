import * as ahooks_lib_createUseStorageState from 'D:\\codes\\ioca-react\\node_modules\\ahooks\\lib\\createUseStorageState\\index.d.ts';
import { ITheme } from './type.js';

declare const useTheme: (props?: ITheme) => {
    theme: string | undefined;
    setTheme: (value?: ahooks_lib_createUseStorageState.SetState<string> | undefined) => void;
};

export { useTheme as default };
