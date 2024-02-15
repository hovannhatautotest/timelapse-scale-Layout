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

import { QueryFilter, RequestApi } from '@model';
import { environment } from '@src/environments/environment';
import { Message } from '@utils';

export const ADDRESS_FEATURE_KEY = 'c2de5ff7-24c6-4acc-b844-2dcea6b0b46a';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: ADDRESS_FEATURE_KEY,
  events: {
    getProvinceList: props<QueryFilter>(),
    'getProvinceList ok': props<{ provinceList: Province[] }>(),

    getDistrictList: props<QueryFilter>(),
    'getDistrictList ok': props<{ districtList: District[] }>(),

    getCommuneList: props<QueryFilter>(),
    'getCommuneList ok': props<{ communeList: Commune[] }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class AddressEffects {
  getProvince$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getProvinceList),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Province[]>>(`${environment.apiUrl}tinh`, { params }).pipe(
          map((res) =>
            _actions.getProvinceListOk({
              provinceList: res.data.map((item) => ({ ...item, value: item.maTinh, label: item.tenTinh })),
            }),
          ),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  getDistrict$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getDistrictList),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<District[]>>(`${environment.apiUrl}huyen`, { params }).pipe(
          map((res) =>
            _actions.getDistrictListOk({
              districtList: res.data.map((item) => ({ ...item, value: item.districtCode, label: item.districtName })),
            }),
          ),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  getCommune$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getCommuneList),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Commune[]>>(`${environment.apiUrl}phuong`, { params }).pipe(
          map((res) =>
            _actions.getCommuneListOk({
              communeList: res.data.map((item) => ({ ...item, value: item.communeCode, label: item.communeName })),
            }),
          ),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
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
export interface Province {
  maTinh: number;
  tenTinh: string;
  totalDistrictShipDelay: number;
  totalDistrictShipStop: number;
  value: number;
  label: string;
}

export interface District {
  districtCode: number;
  districtName: string;
  description: string;
  provinceCode: number;
  districtFullName: string;
  value: number;
  label: string;
}

export interface Commune {
  communeCode: number;
  communeName: string;
  districtCode: number;
  communeFullName: string;
}
export enum EStatusAddress {
  idle = 'idle',
  getProvinceList = 'getProvinceList',
  getProvinceListOk = 'getProvinceListOk',
  getDistrictList = 'getDistrictList',
  getDistrictListOk = 'getDistrictListOk',
  getCommuneList = 'getCommuneList',
  getCommuneListOk = 'getCommuneListOk',
  error = 'error',
}
export interface AddressState {
  provinceList: Province[];
  districtList: District[];
  communeList: Commune[];
  isLoading: boolean;
  status: EStatusAddress;
}

const initialState: AddressState = {
  provinceList: [],
  districtList: [],
  communeList: [],
  isLoading: false,
  status: EStatusAddress.idle,
};

export const addressReducer = createReducer(
  initialState,
  on(_actions.getProvinceList, (_state) => ({ ..._state, isLoading: true, status: EStatusAddress.getProvinceList })),
  on(_actions.getProvinceListOk, (_state, provinceList) => ({
    ..._state,
    ...provinceList,
    isLoading: false,
    status: EStatusAddress.getProvinceListOk,
  })),

  on(_actions.getDistrictList, (_state) => ({ ..._state, isLoading: true, status: EStatusAddress.getDistrictList })),
  on(_actions.getDistrictListOk, (_state, districtList) => ({
    ..._state,
    ...districtList,
    isLoading: false,
    status: EStatusAddress.getDistrictListOk,
  })),

  on(_actions.getCommuneList, (_state) => ({ ..._state, isLoading: true, status: EStatusAddress.getCommuneList })),
  on(_actions.getCommuneListOk, (_state, communeList) => ({
    ..._state,
    ...communeList,
    isLoading: false,
    status: EStatusAddress.getCommuneListOk,
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: EStatusAddress.error })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class AddressFacade {
  select = createFeatureSelector<AddressState>(ADDRESS_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  provinceList$ = this.store.select(createSelector(this.select, (state) => state.provinceList));
  getProvinceList = (query: QueryFilter) => this.store.dispatch(_actions.getProvinceList(query));

  districtList$ = this.store.select(createSelector(this.select, (state) => state.districtList));
  getDistrictList = (query: QueryFilter) => this.store.dispatch(_actions.getDistrictList(query));

  communeList$ = this.store.select(createSelector(this.select, (state) => state.communeList));
  getCommuneList = (query: QueryFilter) => this.store.dispatch(_actions.getCommuneList(query));
}
