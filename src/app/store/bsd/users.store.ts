import {
  createActionGroup,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
  Store,
  emptyProps,
} from '@ngrx/store';
import { environment } from '@src/environments/environment';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EStatusState, Pagination, QueryFilter, RequestApi } from '@model';
import { emptyPagination, Message } from '@utils';

export const USER_FEATURE_KEY = '8513184f-389f-4977-b4db-8782d86ffdbf';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: USER_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<User> }>(),

    getListUser: props<QueryFilter>(),
    'getListUser ok': props<{ listUser: User[] }>(),

    getById: props<{ id: string }>(),
    'get by id ok': props<{ data: User }>(),

    post: props<{ data: User }>(),
    'post ok': props<{ data: User }>(),

    put: props<{ id: string; data: User }>(),
    'put ok': emptyProps(),

    delete: props<{ id: string }>(),
    'delete ok': emptyProps(),

    putLock: props<{ id: string }>(),
    'putLock ok': emptyProps(),

    putUnlock: props<{ id: string }>(),
    'putUnlock ok': emptyProps(),

    putPassword: props<{ id: string; password: string }>(),
    'putPassword ok': emptyProps(),

    putRole: props<{ id: string; roleCode: string; brokerExpiresAt: string; brokerNote: string }>(),
    'putRole ok': emptyProps(),

    putDowngradeBroker: props<{ id: string }>(),
    'putDowngradeBroker ok': emptyProps(),

    putTransferProfile: props<{ id: string; destUserId: string; option: string }>(),
    'putTransferProfile ok': emptyProps(),

    putAssignRole: props<{ id: string; listRole: string[] }>(),
    'putAssignRole ok': emptyProps(),

    'set id': props<{ id: string | null }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}idm/users`;
@Injectable()
export class UserEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<User>>>(`${url}`, { params }).pipe(
          map((res) =>
            _actions.getOk({
              pagination: {
                ...res.data,
                content: res.data.content.map((item) => ({
                  ...item,
                  role: item.listRole?.length ? item.listRole[0].name : '',
                  roleCode: item.listRole?.length ? item.listRole[0].code : '',
                })),
              },
            }),
          ),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  getListUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getListUser),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<User>>>(`${url}`, { params }).pipe(
          map((res) =>
            _actions.getListUserOk({
              listUser: res.data.content.map((item) => ({ ...item, value: item.id, label: item.name })),
            }),
          ),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  getById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getById),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) => {
        return this.httpClient.get<RequestApi<User>>(`${url}/${id}`).pipe(
          map((res) => {
            return _actions.getByIdOk({
              data: {
                ...res.data,
                role: res.data.listRole?.length ? res.data.listRole[0].code : '',
              },
            });
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  post$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.post),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.post<RequestApi<User>>(`${url}`, query.data).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  put$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.put),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${query.id}`, query.data).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.delete),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.delete<RequestApi<User>>(`${url}/${query.id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  lock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putLock),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${query.id}/lock`, '').pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putLockOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  unlock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putUnlock),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${query.id}/unlock`, '').pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putUnlockOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putPassword),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient
          .put<RequestApi<User>>(`${url}/${query.id}/changepassword/non-verified?password=` + query.password, {})
          .pipe(
            map((res) => {
              this.message.success(res.message);
              return _actions.putPasswordOk();
            }),
            catchError(async ({ error }) => this.error(error)),
          );
      }),
    ),
  );

  changeRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putRole),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, ...query }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${id}/change-role`, query).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putRoleOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  downgradeBroker$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putDowngradeBroker),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${query.id}/downgrade-broker`, '').pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putDowngradeBrokerOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  putTransferProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putTransferProfile),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, ...query }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${id}/transfer-profile`, query).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putTransferProfileOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  putAssignRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putAssignRole),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, ...body }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${id}/assign-role`, body).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putAssignRoleOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private message: Message,
  ) {}
  error = (error: RequestApi) => {
    if (error?.message) this.message.error(error.message);
    return _actions.error();
  };
}

// ---------------------------------------------------------------------------------------------------------------------
export class User {
  constructor(
    public listRole?: {
      id?: string;
      code?: string;
      name?: string;
      isSystem?: boolean;
      level?: number;
    }[],
    public id?: string,
    public userName?: string,
    public name?: string,
    public phoneNumber?: string,
    public countryCode?: string,
    public gender?: string,
    public email?: string,
    public avatarUrl?: string,
    public bankAccountNo?: string,
    public bankName?: string,
    public bankUsername?: string,
    public birthdate?: string,
    public lastActivityDate?: string,
    public isLockedOut?: boolean,
    public isActive?: boolean,
    public activeDate?: string,
    public level?: number,
    public facebookUserId?: string,
    public googleUserId?: string,
    public emailVerifyToken?: string,
    public roleListCode?: string[],
    public profileType?: string,
    public createdOnDate?: string,
    public isEmailVerified?: boolean,
    public role?: string,
    public roleCode?: string,
    public changePartnerHistory?: {
      CreatedOnDate?: string;
      CreatedByUser?: string;
      PartnerBefor?: { Name: string };
      PartnerAfter?: { Name: string };
    }[],
    public brokerNoteHistory?: {
      BrokerExpiresAt?: string;
      BrokerNote?: string;
      Type?: string;
      CreatedOnDate?: string;
    }[],
  ) {}
}
export enum EStatusUser {
  getListUser = 'getListUser',
  getListUserOk = 'getListUserOk',
  putLock = 'putLock',
  putLockOk = 'putLockOk',
  putUnlock = 'putUnlock',
  putUnlockOk = 'putUnlockOk',
  putPassword = 'putPassword',
  putPasswordOk = 'putPasswordOk',
  putRole = 'putRole',
  putRoleOk = 'putRoleOk',
  putDowngradeBroker = 'putDowngradeBroker',
  putDowngradeBrokerOk = 'putDowngradeBrokerOk',
  putTransferProfile = 'putTransferProfile',
  putTransferProfileOk = 'putTransferProfileOk',
  putAssignRole = 'putAssignRole',
  putAssignRoleOk = 'putAssignRoleOk',
}
export interface UserState {
  pagination: Pagination<User>;
  data?: User;
  listUser: User[];
  query?: QueryFilter;
  isLoading: boolean;
  id: string | null;
  status: EStatusState | EStatusUser;
}

const initialState: UserState = {
  pagination: emptyPagination(),
  data: undefined,
  listUser: [],
  query: undefined,
  id: null,
  isLoading: false,
  status: EStatusState.idle,
};

export const userReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, data) => ({ ..._state, ...data, status: EStatusState.setId })),

  on(_actions.get, (_state, query) => ({ ..._state, query, isLoading: true, status: EStatusState.get })),
  on(_actions.getOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: EStatusState.getOk })),

  on(_actions.getListUser, (_state) => ({ ..._state, isLoading: true, status: EStatusUser.getListUser })),
  on(_actions.getListUserOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: EStatusUser.getListUserOk,
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
  on(_actions.putOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: EStatusState.putOk,
  })),

  on(_actions.delete, (_state) => ({ ..._state, isLoading: true, status: EStatusState.delete })),
  on(_actions.deleteOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: EStatusState.deleteOk,
  })),

  on(_actions.putLock, (_state) => ({ ..._state, isLoading: true, status: EStatusUser.putLock })),
  on(_actions.putLockOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: EStatusUser.putLockOk,
  })),

  on(_actions.putUnlock, (_state) => ({ ..._state, isLoading: true, status: EStatusUser.putUnlock })),
  on(_actions.putUnlockOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: EStatusUser.putUnlockOk,
  })),

  on(_actions.putPassword, (_state) => ({ ..._state, isLoading: true, status: EStatusUser.putPassword })),
  on(_actions.putPasswordOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: EStatusUser.putPasswordOk,
  })),
  on(_actions.putRole, (_state) => ({ ..._state, isLoading: true, status: EStatusUser.putRole })),
  on(_actions.putRoleOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: EStatusUser.putRoleOk,
  })),
  on(_actions.putDowngradeBroker, (_state) => ({ ..._state, isLoading: true, status: EStatusUser.putDowngradeBroker })),
  on(_actions.putDowngradeBrokerOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: EStatusUser.putDowngradeBrokerOk,
  })),
  on(_actions.putTransferProfile, (_state) => ({ ..._state, isLoading: true, status: EStatusUser.putTransferProfile })),
  on(_actions.putTransferProfileOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: EStatusUser.putTransferProfileOk,
  })),
  on(_actions.putAssignRole, (_state) => ({ ..._state, isLoading: true, status: EStatusUser.putAssignRole })),
  on(_actions.putAssignRoleOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: EStatusUser.putAssignRoleOk,
  })),
  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: EStatusState.error })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class UserFacade {
  select = createFeatureSelector<UserState>(USER_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  getList = (query: QueryFilter) => this.store.dispatch(_actions.get(query));
  listUser$ = this.store.select(createSelector(this.select, (state) => state.listUser));
  getListUser = (query: QueryFilter) => this.store.dispatch(_actions.getListUser(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getById({ id }));
  post = (data: User) => this.store.dispatch(_actions.post({ data }));

  put = (id: string, data: User) => this.store.dispatch(_actions.put({ id, data }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));
  putLock = (id: string) => this.store.dispatch(_actions.putLock({ id }));
  putUnlock = (id: string) => this.store.dispatch(_actions.putUnlock({ id }));
  putPassword = (id: string, password: string) => this.store.dispatch(_actions.putPassword({ id, password }));
  putRole = (data: { id: string; roleCode: string; brokerExpiresAt: string; brokerNote: string }) =>
    this.store.dispatch(_actions.putRole(data));
  putDowngradeBroker = (id: string) => this.store.dispatch(_actions.putDowngradeBroker({ id }));
  putTransferProfile = (data: { id: string; destUserId: string; option: string }) =>
    this.store.dispatch(_actions.putTransferProfile(data));
  putAssignRole = (id: string, listRole: string[]) => this.store.dispatch(_actions.putAssignRole({ id, listRole }));
  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));
}
