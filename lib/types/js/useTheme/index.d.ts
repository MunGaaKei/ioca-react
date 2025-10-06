import * as ahooks_lib_createUseStorageState from '/Users/iann/codes/ioca-react/node_modules/ahooks/lib/createUseStorageState/index.d.ts';
import { ITheme } from './type.js';

declare const useTheme: (props?: ITheme) => {
    theme: string;
    setTheme: (value?: ahooks_lib_createUseStorageState.SetState<string>) => void;
};

export { useTheme as default };
