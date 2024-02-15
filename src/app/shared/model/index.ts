export * from './api.model';
export * from './language.model';
export * from './data-table.model';
export * from './form.model';
export enum EStatusState {
  idle = 'idle',
  get = 'get',
  getOk = 'getOk',
  getById = 'getById',
  getByIdOk = 'getByIdOk',
  post = 'post',
  postOk = 'postOk',
  put = 'put',
  putOk = 'putOk',
  delete = 'delete',
  deleteOk = 'deleteOk',
  setId = 'setId',
  error = 'error',
}
