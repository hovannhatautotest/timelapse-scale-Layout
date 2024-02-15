import {
  createActionGroup,
  createFeatureSelector,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
  Store,
} from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { EStatusState, Pagination, QueryFilter, RequestApi } from '@model';
import { emptyPagination, Message } from '@utils';
import { environment } from '@src/environments/environment';
import { Attachment } from '@src/app/store';

export const DATAS_FEATURE_KEY = '1af73695-bc30-4c6e-b45b-4e80265548da';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: DATAS_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<Datas> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: Datas }>(),

    post: props<{ data: Datas }>(),
    'post ok': props<{ data: Datas }>(),

    put: props<{ id: string; data: Datas }>(),
    'put ok': props<{ data: Datas }>(),

    delete: props<{ id: string }>(),
    'delete ok': props<{ data: Datas }>(),

    'set id': props<{ id: string | null }>(),
    error: emptyProps(),
  },
});

// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}admin/data`;

@Injectable()
export class DatasEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<Datas>>>(`${url}`, { params }).pipe(
          map((res) => _actions.getOk({ pagination: res.data })),
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
        this.httpClient.get<RequestApi<Datas>>(`${url}/${id}`).pipe(
          map((res) => _actions.getByIdOk({ data: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  post$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.post),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, data }) =>
        this.httpClient.post<RequestApi<Datas>>(`${url}`, data).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  put$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.put),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, data }) =>
        this.httpClient.put<RequestApi<Datas>>(`${url}/${id}`, data).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putOk({ data: res.data });
          }),
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
        this.httpClient.delete<RequestApi<Datas>>(`${url}/${id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private message: Message,
    private httpClient: HttpClient,
  ) {}

  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
}

// ---------------------------------------------------------------------------------------------------------------------
export class Datas {
  constructor(
    public id: string,
    public type: string,
    public image: Attachment,
    public order: number,
    public teamCode: string,
    public team: {
      title: string;
      code: string;
    },
    public name: string,
    public description: string,
    public content: string,
    public isVisible: boolean,
    public attachments: Attachment[],
  ) {}
}
export interface DatasState {
  pagination: Pagination<Datas>;
  query?: QueryFilter;
  data?: Datas;
  isLoading: boolean;
  id: string | null;
  status: EStatusState;
}

const initialState: DatasState = {
  pagination: emptyPagination(),
  data: undefined,
  query: undefined,
  id: null,
  isLoading: false,
  status: EStatusState.idle,
};

export const datasReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, data) => ({ ..._state, ...data, isLoading: false, status: EStatusState.setId })),
  on(_actions.get, (_state, query) => ({ ..._state, isLoading: true, status: EStatusState.get, query })),
  on(_actions.getOk, (_state, pagination) => ({
    ..._state,
    ...pagination,
    isLoading: false,
    status: EStatusState.getOk,
  })),

  on(_actions.getById, (_state) => ({ ..._state, isLoading: true, status: EStatusState.getById })),
  on(_actions.getByIdOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: EStatusState.getByIdOk })),

  on(_actions.post, (_state) => ({ ..._state, isLoading: true, status: EStatusState.post })),
  on(_actions.postOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: EStatusState.postOk,
  })),
  on(_actions.put, (_state) => ({ ..._state, isLoading: true, status: EStatusState.put })),
  on(_actions.putOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: EStatusState.putOk,
  })),
  on(_actions.delete, (_state) => ({ ..._state, isLoading: true, status: EStatusState.delete })),
  on(_actions.deleteOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: EStatusState.deleteOk,
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: EStatusState.error })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class DatasFacade {
  select = createFeatureSelector<DatasState>(DATAS_FEATURE_KEY);
  status$ = this.store.select(createSelector(this.select, (state) => state.status));
  constructor(private store: Store) {}
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getById({ id }));
  post = (id: string, data: Datas) => this.store.dispatch(_actions.post({ data }));

  put = (id: string, data: Datas) => this.store.dispatch(_actions.put({ id, data }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));

  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));
}
