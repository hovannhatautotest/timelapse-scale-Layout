import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, QueryFilter, RequestApi } from '@model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  Store,
  createActionGroup,
  createFeatureSelector,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';
import { environment } from '@src/environments/environment';
import { Message, emptyPagination } from '@utils';
import { catchError, exhaustMap, map } from 'rxjs';

export const FILELOG_FEATURE_KEY = 'd9a4c472-c9c0-45c0-8e4b-3d9f66aa17ac';

const _actions = createActionGroup({
  source: FILELOG_FEATURE_KEY,
  events: {
    get: props<{stationId: string, page: number, size: number}>(),
    'get ok': props<{ pagination: Pagination<FileLog> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: FileLog }>(),

    delete: props<{ id: string }>(),
    'delete ok': emptyProps(),

    error: emptyProps(),
  },
});

const url = `${environment.apiUrl}`;

@Injectable()
export class FileLogEffects {
  constructor(private actions$: Actions, private message: Message, private http: HttpClient) {}

  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.http.get<RequestApi<any>>(`${url}app/filelog`, { params }).pipe(
          map((res) => {
            return _actions.getOk({
              pagination: {
                ...res.data,
                content: res.data.data.map((item: any) => ({ ...item})),
              },
            });
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  getById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getById),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.http.get<RequestApi<FileLog>>(`${url}app/filelog/${id}`).pipe(
          map((res) => _actions.getByIdOk({ data: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.delete),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.http.delete<RequestApi<FileLog[]>>(`${url}app/filelog/${id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );

  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
}

export class FileLog {
  constructor(
    public id :string,
    public parentId :string,
    public hasChild :boolean,
    public fileName :string,
    public filePath :string,
    public content :[],
    public createdOnDate : string,
    public lastWriteOnDate : string,
    public subChild : any [] ,
  ) {}
}

export enum EStatusFileLog {
  idle = 'idle',
  get = 'get',
  getOk = 'getOk',
  getById = 'getById',
  getByIdOk = 'getByIdOk',
  delete = 'delete',
  deleteOk = 'deleteOk',
  error = 'error',
}

export interface FileLogState {
  pagination: Pagination<FileLog>;
  data: FileLog;
  query?: any;
  isLoading: boolean;
  status: EStatusFileLog
}

const initialState: FileLogState = {
  pagination: emptyPagination(),
  data: undefined,
  query: undefined,
  isLoading: false,
  status: EStatusFileLog.idle,
};

export const fileLogReducer = createReducer(
  initialState,
  on(_actions.get, (_state, query) => ({ ..._state, ...query, isLoading: true, status: EStatusFileLog.get })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: EStatusFileLog.getOk })),

  on(_actions.getById, (_state) => ({ ..._state, isLoading: true, status: EStatusFileLog.getById })),
  on(_actions.getByIdOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: EStatusFileLog.getByIdOk })),

  on(_actions.delete, (_state) => ({ ..._state, isLoading: true, status: EStatusFileLog.delete })),
  on(_actions.deleteOk, (_state) => ({ ..._state, isLoading: false, status: EStatusFileLog.deleteOk })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: EStatusFileLog.error })),
);

@Injectable()
export class FileLogFacade {
  select = createFeatureSelector<FileLogState>(FILELOG_FEATURE_KEY);

  constructor(private store: Store) {}

  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  list$ = this.store.select(createSelector(this.select, (state) => state.pagination.content));
  get = (stationId: string, page: number, size: number) => this.store.dispatch(_actions.get({stationId, page, size}));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getById({ id }));

  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));
}
