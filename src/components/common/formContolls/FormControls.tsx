import React, { ReactNode } from 'react';
import s from './FormControls.module.css'
import { Field } from 'redux-form';

type  TextareaProps = {
  input: {
    name: string;
    value: string;
  };
  meta: {
    active: boolean;
    asyncValidating: boolean;
    autofilled: boolean;
    dirty: boolean;
    error: string | undefined; // ошибку может и не быть, поэтому используем | undefined
    form: string;
    invalid: boolean;
    pristine: boolean;
    submitting: boolean;
    submitFailed: boolean;
    touched: boolean;
    valid: boolean;
    visited: boolean;
  };
  type: string;
  placeholder: string;
}

type ChildrenType = {
  children: ReactNode;
}

type CommonInputType = TextareaProps & ChildrenType


const FormControl = ({input, meta, children}: CommonInputType) => {

  return (
    <div>
      <div className={meta.error && meta.touched ? s.error : ''}>
        {children} {/* в качестве children придет textarea или Input */}
      </div>
      <div className={s.spanWrapper}>
        {meta.error && meta.touched && <span>{meta.error}</span> } {/* показывать только если есть ошибка и поле было посещено */}
      </div>
    </div>

  );

}

export const Textarea = (props: TextareaProps) => {
  const {input, meta, ...restProps} = props;

  return (
    <FormControl {...props}><textarea {...input} {...restProps}/></FormControl>

  );
};

export const Input = (props: TextareaProps) => {
  const {input, meta, ...restProps} = props;

  return (
    <FormControl {...props}> <input {...input} {...restProps}/>{/*  таким образом мы передадим все, кроме meta */}</FormControl>

  );
}

export const createField = (props: CreateFieldProps)=> {
  return (
  <div><Field type={props.type} placeholder={props.placeholder} name={props.name} component={props.component} validate={props.validators}/>{props.text}</div>)
}

type Validator = ((value:string) => string | undefined) | undefined

type Validators = Validator[] | undefined


type CreateFieldProps = {
  type: string,
  placeholder?: string,
  name: string,
  component: React.ComponentType<CommonInputType>,
  validators?: Validators,
  text?: string,
}









//первоначальные варианты

export const _Textarea = (props: TextareaProps) => {
  const {input, meta, ...restProps} = props;

  return (
    <div>
      <div className={meta.error && meta.touched ? s.error : ''}>
        <textarea {...input} {...restProps}/>{/*  таким образом мы передадим все, кроме meta */}
    </div>
    <div className={s.spanWrapper}>
      {meta.error && meta.touched && <span>{meta.error}</span> } {/* показывать только если есть ошибка и поле было посещено */}
    </div>

    </div>

  );
};


export const _Input = (props: TextareaProps) => {
  const {input, meta, ...restProps} = props;

  return (
    <div>
      <div className={meta.error && meta.touched ? s.error : ''}>
        <input {...input} {...restProps}/>{/*  таким образом мы передадим все, кроме meta */}
    </div>
    <div className={s.spanWrapper}>
      {meta.error && meta.touched && <span>{meta.error}</span> } {/* показывать только если есть ошибка и поле было посещено */}
    </div>

    </div>

  );
};
