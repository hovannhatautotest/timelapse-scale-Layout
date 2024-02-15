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
import { HttpClient } from '@angular/common/http';
import { RequestApi } from '@model';
import { Message } from '@utils';
import { environment } from '@src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

export const ME_FEATURE_KEY = '1fe7f0e1-86a1-48ad-9a20-eb693958a3b8';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: ME_FEATURE_KEY,
  events: {
    getInfo: emptyProps(),
    'getInfo ok': props<{ info: MeInfo }>(),

    getMonthlyStatistic: emptyProps(),
    'getMonthlyStatistic ok': props<{ monthlyStatistic: MeMonthlyStatistic[] }>(),

    getPackageStatistic: emptyProps(),
    'getPackageStatistic ok': props<{ packageStatistic: MePackageStatistic[] }>(),

    error: emptyProps(),
  },
});

// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}${environment.admin ? 'admin' : 'partner'}/me`;

@Injectable()
export class MeEffects {
  getinfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getInfo),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type }) =>
        this.httpClient.get<RequestApi<MeInfo>>(`${url}/info`).pipe(
          map((res) => _actions.getInfoOk({ info: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getMonthlyStatistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getMonthlyStatistic),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type }) =>
        this.httpClient.get<RequestApi<MeMonthlyStatistic[]>>(`${url}/monthly-statistic`).pipe(
          map((res) => _actions.getMonthlyStatisticOk({ monthlyStatistic: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getPackageStatistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getPackageStatistic),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type }) =>
        this.httpClient.get<RequestApi<MePackageStatistic[]>>(`${url}/package-statistic`).pipe(
          map((res) => _actions.getPackageStatisticOk({ packageStatistic: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  constructor(
    private actions$: Actions,
    private message: Message,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
  ) {}

  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
}

// ---------------------------------------------------------------------------------------------------------------------
export class MeInfo {
  constructor(
    public totalIncomeAmount: number,
    public totalCommissionAmount: number,
    public totalOffer: number,
    public totalProposal: number,
    public totalUser: number,
    public totalEmailVerifiedUser: number,
    public totalActiveUser: number,
    public totalProfile: number,
    public totalPurchasedProfile: number,
    public isAllowedVerifyProfile: boolean,
  ) {}
}
export class MeMonthlyStatistic {
  constructor(
    public year: number,
    public month: number,
    public userCount: number,
    public commissionAmount: number,
    public proposalCount: number,
    public profileCount: number,
    public offerCount: number,
    public brokerCount: number,
  ) {}
}
export class MePackageStatistic {
  constructor(
    public name: string,
    public backgroundColor: string,
    public type: number,
    public count: number,
  ) {}
}

export interface MeState {
  info?: MeInfo;
  monthlyStatistic: MeMonthlyStatistic[];
  packageStatistic: MePackageStatistic[];
  isLoading: boolean;
  status:
    | 'idle'
    | 'error'
    | 'getInfo'
    | 'getInfoOk'
    | 'getMonthlyStatistic'
    | 'getMonthlyStatisticOk'
    | 'getPackageStatistic'
    | 'getPackageStatisticOk'
    | string;
}

const initialState: MeState = {
  info: undefined,
  monthlyStatistic: [],
  packageStatistic: [],
  isLoading: false,
  status: 'idle',
};

export const meReducer = createReducer(
  initialState,
  on(_actions.getInfo, (_state) => ({ ..._state, isLoading: true, status: 'getInfo' })),
  on(_actions.getInfoOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getInfoOk' })),

  on(_actions.getMonthlyStatistic, (_state) => ({ ..._state, isLoading: true, status: 'getMonthlyStatistic' })),
  on(_actions.getMonthlyStatisticOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'getMonthlyStatisticOk',
  })),

  on(_actions.getPackageStatistic, (_state) => ({ ..._state, isLoading: true, status: 'getPackageStatistic' })),
  on(_actions.getPackageStatisticOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'getPackageStatisticOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class MeFacade {
  select = createFeatureSelector<MeState>(ME_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  info$ = this.store.select(createSelector(this.select, (state) => state.info));
  getInfo = () => this.store.dispatch(_actions.getInfo());

  monthlyStatistic$ = this.store.select(createSelector(this.select, (state) => state.monthlyStatistic));
  getMonthlyStatistic = () => this.store.dispatch(_actions.getMonthlyStatistic());

  packageStatistic$ = this.store.select(createSelector(this.select, (state) => state.packageStatistic));
  getPackageStatistic = () => this.store.dispatch(_actions.getPackageStatistic());
}
