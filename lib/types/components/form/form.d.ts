import * as react_jsx_runtime from 'react/jsx-runtime';
import Field from './field.js';
import { IForm } from './type.js';
import useConfig from './useConfig.js';
import useForm from './useForm.js';

declare const Form: {
    (props: IForm): react_jsx_runtime.JSX.Element;
    useForm: typeof useForm;
    Field: typeof Field;
    useConfig: typeof useConfig;
};

export { Form as default };
