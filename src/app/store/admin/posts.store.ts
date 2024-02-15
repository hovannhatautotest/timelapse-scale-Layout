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
import { environment } from '@src/environments/environment';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { EStatusState, Pagination, QueryFilter, RequestApi } from '@model';
import { emptyPagination, Message } from '@utils';
import { Attachment, Editor, PostCategories } from '@store';

export const POSTS_FEATURE_KEY = '5b6be830-1b8d-4ce5-89cd-ccb57a63f5f7';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: POSTS_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<Posts> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: Posts }>(),

    post: props<{ data: Posts }>(),
    'post ok': props<{ data: Posts }>(),

    put: props<{ id: string; data: Posts }>(),
    'put ok': props<{ data: Posts }>(),

    delete: props<{ id: string }>(),
    'delete ok': props<{ data: Posts }>(),

    putStatus: props<{ id: string; status: 'APPROVED' | 'PUBLISHED' }>(),
    'putStatus ok': emptyProps(),

    'set id': props<{ id: string | null }>(),
    error: emptyProps(),
  },
});

// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}admin/posts`;
@Injectable()
export class PostsEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<Posts>>>(`${url}`, { params }).pipe(
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
        this.httpClient.get<RequestApi<Posts>>(`${url}/${id}`).pipe(
          map((res) => {
            return _actions.getByIdOk({ data: res.data });
          }),
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
        this.httpClient.post<RequestApi<Posts>>(`${url}`, data).pipe(
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
        this.httpClient.put<RequestApi<Posts>>(`${url}/${id}`, data).pipe(
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
        this.httpClient.delete<RequestApi<Posts>>(`${url}/${id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  putStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putStatus),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, status }) =>
        this.httpClient.put<RequestApi>(`${url}/${id}/publish/${status}`, {}).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putStatusOk();
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
export class Posts {
  constructor(
    public id?: string,
    public title?: string,
    public publishStatus?: string,
    public thumbnailUrl?: string,
    public coverUrl?: string,
    public editorFormat?: string,
    public isPinned?: boolean,
    public category?: PostCategories,
    public createdOnDate?: string,
    public partnerId?: string,
    public relatedPostListId?: string[],
    public translations?: {
      title?: string;
      unaccentTitle?: string;
      slug?: string;
      summary?: string;
      contentString?: Editor;
      language?: string;
      seoDescription?: string;
      seoKeywords?: string;
    }[],
    public attachments?: Attachment[],
  ) {}
}
export enum EStatusPosts {
  putStatus = 'putStatus',
  putStatusOk = 'putStatusOk',
}
export interface PostsState {
  pagination: Pagination<Posts>;
  query?: QueryFilter;
  data?: Posts;
  isLoading: boolean;
  id: string | null;
  status: EStatusState | EStatusPosts;
}

const initialState: PostsState = {
  pagination: emptyPagination(),
  data: undefined,
  isLoading: false,
  status: EStatusState.idle,
  query: undefined,
  id: null,
};

export const postsReducer = createReducer(
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
  on(_actions.getByIdOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: EStatusState.getByIdOk,
  })),

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

  on(_actions.putStatus, (_state) => ({ ..._state, isLoading: true, status: EStatusPosts.putStatus })),
  on(_actions.putStatusOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: EStatusPosts.putStatusOk,
  })),
  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: EStatusState.error })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class PostsFacade {
  select = createFeatureSelector<PostsState>(POSTS_FEATURE_KEY);
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getById({ id }));
  post = (data: PostCategories) => this.store.dispatch(_actions.post({ data }));
  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));

  put = (id: string, data: PostCategories) => this.store.dispatch(_actions.put({ id, data }));
  putStatus = (id: string, status: 'APPROVED' | 'PUBLISHED') => this.store.dispatch(_actions.putStatus({ id, status }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));
}
