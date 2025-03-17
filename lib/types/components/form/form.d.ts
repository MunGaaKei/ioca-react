import * as react_jsx_runtime from 'react/jsx-runtime';
import Field from './field.js';
import { IForm } from './type.js';
import useForm from './useForm.js';

declare const Form: {
    (props: IForm): react_jsx_runtime.JSX.Element;
    useForm: typeof useForm;
    Field: typeof Field;
};

export { Form as default };
