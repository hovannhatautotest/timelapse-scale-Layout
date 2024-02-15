import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryFilter, RequestApi } from '@model';
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
import { Message } from '@utils';
import { catchError, exhaustMap, map } from 'rxjs';

export const CUSTOMERS_FEATURE_KEY = '7b188761-fd4b-43e4-9133-ff1801c60388';

const _actions = createActionGroup({
  source: CUSTOMERS_FEATURE_KEY,
  events: {
    getCustomerList: props<{ stationId: string; _type: string }>(),
    'getCustomerList ok': props<{ customers: Customer[] }>(),

    getPartnerList: props<{ stationId: string; _type: string }>(),
    'getPartnerList ok': props<{ partners: Customer[] }>(),
    error: emptyProps(),
  },
});

const url = `${environment.apiUrl}customers`;

@Injectable()
export class CustomersEffects {
  constructor(
    private actions$: Actions,
    private message: Message,
    private http: HttpClient,
  ) {}

  getCustomerList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getCustomerList),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        // const params = new HttpParams().appendAll(query);
        const params = new HttpParams().appendAll({ stationId: query.stationId, type: query._type });
        return this.http.get<RequestApi<Customer[]>>(`${url}`, { params }).pipe(
          map((res) => {
            return _actions.getCustomerListOk({ customers: [{ name: 'Tất cả Khách hàng', code: '' }, ...res.data] });
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  getPartnerList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getPartnerList),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        // const params = new HttpParams().appendAll(query);
        const params = new HttpParams().appendAll({ stationId: query.stationId, type: query._type });
        return this.http.get<RequestApi<Customer[]>>(`${url}`, { params }).pipe(
          map((res) => {
            return _actions.getPartnerListOk({ partners: [{ name: 'Tất cả Đối tác', code: '' }, ...res.data] });
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
}

export class Customer {
  constructor(
    public name?: string,
    public code?: string,
  ) {}
}

export enum EStatusCustomers {
  idle = 'idle',
  getCustomerList = 'getCustomerList',
  getCustomerListOk = 'getCustomerListOk',
  getPartnerList = 'getPartnerList',
  getPartnerListOk = 'getPartnerListOk',
  setQuery = 'setQuery',
  error = 'error',
}

export interface CustomersState {
  query?: QueryFilter;
  isLoading: boolean;
  customers?: Customer[];
  partners?: Customer[];
  status: EStatusCustomers;
}

const initialState: CustomersState = {
  query: undefined,
  isLoading: false,
  customers: [],
  partners: [],
  status: EStatusCustomers.idle,
};

export const customersReducer = createReducer(
  initialState,
  on(_actions.getCustomerList, (_state) => ({ ..._state, isLoading: true, status: EStatusCustomers.getCustomerList })),
  on(_actions.getCustomerListOk, (_state, customers) => ({
    ..._state,
    ...customers,
    isLoading: false,
    status: EStatusCustomers.getCustomerListOk,
  })),
  on(_actions.getPartnerList, (_state) => ({ ..._state, isLoading: true, status: EStatusCustomers.getPartnerList })),
  on(_actions.getPartnerListOk, (_state, partners) => ({
    ..._state,
    ...partners,
    isLoading: false,
    status: EStatusCustomers.getPartnerListOk,
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: EStatusCustomers.error })),
);

@Injectable()
export class CustomersFacade {
  select = createFeatureSelector<CustomersState>(CUSTOMERS_FEATURE_KEY);

  constructor(private store: Store) {}

  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  customers$ = this.store.select(createSelector(this.select, (state) => state.customers));
  getCustomerList = (stationId: string, _type: string) =>
    this.store.dispatch(_actions.getCustomerList({ stationId, _type }));

  partners$ = this.store.select(createSelector(this.select, (state) => state.partners));
  getPartnerList = (stationId: string, _type: string) =>
    this.store.dispatch(_actions.getPartnerList({ stationId, _type }));
}
