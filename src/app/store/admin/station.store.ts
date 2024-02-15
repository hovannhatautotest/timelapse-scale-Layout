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

export const STATION_FEATURE_KEY = 'cc4a9905-cf7f-42f2-95d8-7c53f2f36d3c';

const _actions = createActionGroup({
  source: STATION_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<Station> }>(),

    'set transactionId': props<{ transactionId: string | null }>(),
    'set query': props<{ query: any }>(),

    getTransaction: props<QueryFilter>(),
    'getTransaction ok': props<{ transactionPagination: Pagination<Transaction> }>(),

    error: emptyProps(),
  },
});

const url = `${environment.apiUrl}`;

@Injectable()
export class StationEffects {
  constructor(private actions$: Actions, private message: Message, private http: HttpClient) {}

  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.http.get<RequestApi<any>>(`${url}stations`, { params }).pipe(
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

  getTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getTransaction),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.http.get<RequestApi<any>>(`${url}stations/${query.id}/transactions`, { params }).pipe(
          map((res) => {
            return _actions.getTransactionOk({
              transactionPagination: {
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

  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
}

export class Station {
  constructor(
    public id :string,
    public name :string,
    public code :string,
    public address :string,
    public avatar :string,
    public background :string,
    public order :number,
    public phone :string,
    public status :number,
    public createdOnDate :string,
    public stationIntId :number,
    public emails : string,
    public isOneTime : boolean,
  ) {}
}

class Transaction {
  constructor(
    public transactionId?: string,
    public recordId?: string,
    public buyer?: string,
    public seller?: string,
    public plateNumber?: string,
    public plateNumber2?: string,
    public itemName?: string,
    public unitPrice?: number,
    public netPrice?: number,
    public oversizePrice?: number,
    public note?: string,
    public type?: number,
    public firstWeight?: number,
    public secondWeight?: number,
    public netWeight?: number,
    public impurityWeight?: number,
    public firstWeighTime?: string,
    public secondWeighTime?: string,
    public createdDate?: string,

    public syncStatus?: number,
    public printCount?: number,
    public plateImageIn?: string,
    public plateImageOut?: string,
    public trunkImageIn?: string,
    public trunkImageOut?: string,
    public backImageIn?: string,
    public backImageOut?: string,

    public overviewImageIn?: string,
    public overviewImageOut?: string,
    public doNumber?: number,
    public unitPriceType?: number,
    public realWeight?: number,
    public paymentStatus?: number,
    public paymentDate?: string,

    public subtractWeight?: number,
    public subsidyPrice?: number,
    public firstWeighStationName?: string,
    public secondWeighStationName?: string,
    public firstWeighUserName?: string,
    public secondWeighUserName?: string,
    public importQualityRuleId?: string,

    public minHumidityPercent?: number,
    public maxHumidityPercent?: number,
    public actualHumidityPercent?: number,
    public minImpurityPercent?: number,
    public maxImpurityPercent?: number,
    public actualImpurityPercent?: number,
    public minBannedMaterialPercent?: number,
    public maxBannedMaterialPercent	?: number,
    public actualBannedMaterialPercent?: number,
    public totalReduceWeight?: number,
    public hasAttachment?: boolean,
    public hasQualityRating?: boolean,

    public stationName?: string,
    public quantity?: number,
    public averageWeight?: number,
    public groupId?: string,
    public buyerAddress?: string,
    public isError?: boolean,
    public inValid?: boolean,
    public lastModifiedByUser?: string,
    public statusCode?: string,
    public isImport?: boolean,
    public paymentStatusDisplay?: string,
    public unitPriceDisplay?: string,
    public realWeightDisplay?: string,
    public netPriceDisplay?: string,
    public firstWeightDisplay?: string,
    public secondWeightDisplay?: string,
    public netWeightDisplay?: string,
  ) {}
}

export enum EStatusStation {
  idle = 'idle',
  get = 'get',
  getOk = 'getOk',
  getTransaction = 'getTransaction',
  getTransactionOk = 'getTransactionOk',
  getItem = 'getItem',
  getItemOk = 'getItemOk',
  setQuery = 'setQuery',
  setTransactionId = 'setTransactionId',
  error = 'error',
}

export interface StationState {
  pagination: Pagination<Station>;
  transaction?: Transaction
  query?: any;
  transactionId: string | null;
  isLoading: boolean;
  transactionPagination?: Pagination<Transaction>;
  status: EStatusStation
}

const initialState: StationState = {
  pagination: emptyPagination(),
  transaction: undefined,
  query: undefined,
  transactionId: null,
  isLoading: false,
  transactionPagination: emptyPagination(),
  status: EStatusStation.idle,
};

export const stationReducer = createReducer(
  initialState,
  on(_actions.get, (_state, query) => ({ ..._state, ...query, isLoading: true, status: EStatusStation.get })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: EStatusStation.getOk })),

  on(_actions.setQuery, (_state, query) => ({ ..._state, ...query, isLoading: false, status: EStatusStation.setQuery })),

  on(_actions.setTransactionId, (_state, data) => ({ ..._state, ...data, status: EStatusStation.setTransactionId })),

  on(_actions.getTransaction, (_state) => ({ ..._state, isLoading: true, status: EStatusStation.getTransaction })),
  on(_actions.getTransactionOk, (_state, transactionPagination) => ({ ..._state, ...transactionPagination, isLoading: false, status: EStatusStation.getTransactionOk })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: EStatusStation.error })),
);

@Injectable()
export class StationFacade {
  select = createFeatureSelector<StationState>(STATION_FEATURE_KEY);

  constructor(private store: Store) {}

  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  list$ = this.store.select(createSelector(this.select, (state) => state.pagination.content));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));


  transactionId$ = this.store.select(createSelector(this.select, (state) => state.transactionId));
  setTransactionId = (transactionId: string | null) => this.store.dispatch(_actions.setTransactionId({ transactionId }));

  transactionPagination$ = this.store.select(createSelector(this.select, (state) => state.transactionPagination));
  transactions$ = this.store.select(createSelector(this.select, (state) => state.transactionPagination.content));
  getTransaction = (query: QueryFilter) => this.store.dispatch(_actions.getTransaction( query ));


  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  setQuery = (query: any) => this.store.dispatch(_actions.setQuery({ query }));
  getList = (query: QueryFilter) => this.store.dispatch(_actions.get(query));
}
