export enum ETableAlign {
  left = 'left',
  right = 'right',
  center = 'center',
}
export enum ETableSort {
  ascend = 'ascend',
  descend = 'descend',
}
export enum ETableFilterType {
  search = 'search',
  checkbox = 'checkbox',
  radio = 'radio',
  date = 'date',
}

export class DataTableModel<T = any> {
  name = '';
  title?: string;
  tableItem?: TableItem<T>;
}
export class TableItem<T = any> {
  width?: string;
  align?: ETableAlign;
  sort?: ETableSort;
  onClick?: (data: T) => any;
  bgColor?: any;
  render?: (data: T, i: number) => any;
  renderTemplate?: any;
  filter?: TableItemFilter;
  actions?: TableItemActions<T>[];
}

export class TableItemFilter {
  type?: ETableFilterType;
  value?: string;
  visible?: boolean;
  list?: TableItemFilterList[];
}

export class TableItemFilterList {
  label?: string;
  value?: string;
}

export class TableItemActions<T = any> {
  text?: (data: T) => any;
  textConfirm?: (data: T) => any;
  icon?: (data: T) => any;
  onClick?: (data: T, index: number) => any;
  condition?: (data: T) => any;
  disabled?: (data: T) => any;
  confirm?: boolean;
  full?: boolean;
  type?: string;
  bgColor?: (data: T) => any;
  color?: (data: T) => any;
  templateDropdown?: any;
}
