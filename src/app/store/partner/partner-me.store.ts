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
import { HttpClient } from '@angular/common/http';
import { Pagination, QueryFilter, RequestApi } from '@model';
import { emptyPagination, Message } from '@utils';

export const PARTNER_ME_FEATURE_KEY = 'c58c1e7c-917c-46c8-ace6-600439643611';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: PARTNER_ME_FEATURE_KEY,
  events: {
    getById: props<{ id: string }>(),
    'get by id ok': props<{ data: PartnerMeUser }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}partner/me/`;
@Injectable()
export class PartnerMeEffects {
  getById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getById),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ id }) => {
        return this.httpClient.get<RequestApi<PartnerMeUser>>(`${url}users/${id}`).pipe(
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
export class PartnerMeUser {
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

export interface PartnerMeState {
  pagination: Pagination<PartnerMeUser>;
  data?: PartnerMeUser;
  listUser: PartnerMeUser[];
  query?: QueryFilter;
  isLoading: boolean;
  id: string | null;
  status: 'idle' | 'getById' | 'getByIdOk' | 'error' | string;
}

const initialState: PartnerMeState = {
  pagination: emptyPagination(),
  data: undefined,
  listUser: [],
  query: undefined,
  id: null,
  isLoading: false,
  status: 'idle',
};

export const partnerMeReducer = createReducer(
  initialState,
  on(_actions.getById, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getByIdOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'getByIdOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class PartnerMeFacade {
  select = createFeatureSelector<PartnerMeState>(PARTNER_ME_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));

  constructor(private store: Store) {}

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getById({ id }));

  id$ = this.store.select(createSelector(this.select, (state) => state.id));
}
