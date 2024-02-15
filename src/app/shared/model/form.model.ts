import { TemplateRef } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzMarks } from 'ng-zorro-antd/slider/typings';

export enum ETypeFile {
  image = 'image',
  video = 'video',
}

export enum EFormType {
  markdown = 'markdown',
  number = 'number',
  mask = 'mask',
  password = 'password',
  textarea = 'textarea',
  autocomplete = 'autocomplete',
  date = 'date',
  date_range = 'date_range',
  checkbox = 'checkbox',
  color = 'color',
  radio = 'radio',
  select = 'select',
  treeSelect = 'treeSelect',
  upload = 'upload',
  switch = 'switch',
  slider = 'slider',
  onlyText = 'only-text',
  addable = 'addable',
  tab = 'tab',
  html = 'html',
}
export enum EFormModeSelect {
  multiple = 'multiple',
  tags = 'tags',
  default = 'default',
}
export enum EFormRuleType {
  required = 'required',
  email = 'email',
  maxlength = 'maxlength',
  minlength = 'minlength',
  min = 'min',
  max = 'max',
  custom = 'custom',
}

export class FormModel {
  name?: string;
  title?: string;
  formItem?: FormItem;
}

export class FormItem {
  type?: EFormType;
  title?: (value?: string) => any;
  value?: any;
  formatDate?: string;
  showTime?: boolean;
  disabledDate?: (current: Date) => boolean;
  tooltip?: string;
  confirm?: boolean;
  html?: string;
  mask?: string;
  maskPrefix?: string;
  number?: boolean;
  autoSet?: (value?: string, validateForm?: FormGroup, formGroup?: FormGroup) => void;
  onSearch?: (value?: string) => void;
  disabled?: boolean;
  show?: boolean;
  noLabel?: boolean;
  viewTable?: boolean;
  rules?: FormItemRule[];
  list?: FormItemList[];
  facade?: any;
  tab?: FormItemTab;
  addOnBefore?: TemplateRef<any> | null;
  addOnAfter?: TemplateRef<any> | null;
  placeholder?: string;
  addableText?: string;
  col?: number;
  condition?: (value?: string) => boolean;
  render?: TemplateRef<any> | null;
  columns?: FormModel[];
  listNode?: (NzTreeNodeOptions | NzTreeNode)[];
  customOptionContent?: (value?: FormItemList) => void;
  rows?: number;
  onPaste?: (event?: ClipboardEvent, name?: string, value?: any, index?: number) => void;
  widthTable?: string;
  modeSelect?: EFormModeSelect;
  min?: number;
  max?: number;
  sliderMarks?: NzMarks;
  formatMarks?: (value: number) => string;
  physicalPathUpload?: string;
  typeUpload?: ETypeFile;
}
export class FormItemList {
  label?: string;
  value: any;
  danger?: boolean;
  checked?: boolean;
}

export class FormItemRule {
  type?: EFormRuleType;
  message?: string;
  value?: any;
  validator?: ValidatorFn;
}

export class FormItemTab {
  label?: string;
  value: any;
  disabled?: boolean;
}
