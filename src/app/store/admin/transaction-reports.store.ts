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
import { Message, emptyPagination } from '@utils';
import { catchError, exhaustMap, map } from 'rxjs';

export const TRANSACTION_REPORTS_FEATURE_KEY = 'a2d7706b-03f6-4571-b4c8-47d105d98ec3';

const _actions = createActionGroup({
  source: TRANSACTION_REPORTS_FEATURE_KEY,
  events: {
    getPartnerReport: props<{ _type: string; fromDate: string; toDate: string; stationId: string }>(),
    'getPartnerReport ok': props<{ partnerReports: PartnerReport[] }>(),

    getReport: props<{
      stationId: string;
      fromDate: string;
      toDate: string;
      itemCode: string;
      customerCode: string;
      partnerCode: string;
    }>(),
    'getReport ok': props<{ reports: Report[] }>(),

    error: emptyProps(),
  },
});

const url = `${environment.apiUrl}transaction-reports`;

@Injectable()
export class TransactionReportsEffects {
  constructor(
    private actions$: Actions,
    private message: Message,
    private http: HttpClient,
  ) {}

  getPartnerReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getPartnerReport),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.http.get<PartnerReport[]>(`${url}/partner/${query._type}`, { params }).pipe(
          map((res) => _actions.getPartnerReportOk({ partnerReports: res })),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  getReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getReport),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.http.get<Report[]>(`${url}/detail`, { params }).pipe(
          map((res) => _actions.getReportOk({ reports: res })),
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

export class PartnerReport {
  constructor(
    public name?: string,
    public totalGoodsWeight?: number,
    public totalImpurityWeight?: number,
  ) {}
}
export class Report {
  constructor(
    public date?: string,
    public totalVehicles?: number,
    public totalImportVehicles?: number,
    public totalExportVehicles?: number,
    public totalIncompletedVehicles?: number,
    public totalImportGoodsWeight?: number,
    public totalExportGoodsWeight?: number,
    public totalImpurityWeight?: number,
    public totalImportAmount?: number,
    public totalExportAmount?: number,
  ) {}
}

export enum EStatusTransactionReports {
  idle = 'idle',
  getPartnerReport = 'getPartnerReport',
  getPartnerReportOk = 'getPartnerReportOk',
  getReport = 'getReport',
  getReportOk = 'getReportOk',
  setQuery = 'setQuery',
  error = 'error',
}

export interface TransactionReportsState {
  query?: QueryFilter;
  isLoading: boolean;
  partnerReports?: PartnerReport[];
  reports?: Report[];
  status: EStatusTransactionReports;
}

const initialState: TransactionReportsState = {
  query: undefined,
  isLoading: false,
  partnerReports: [],
  reports: [],
  status: EStatusTransactionReports.idle,
};

export const transactionReportsReducer = createReducer(
  initialState,
  on(_actions.getPartnerReport, (_state) => ({
    ..._state,
    isLoading: true,
    status: EStatusTransactionReports.getPartnerReport,
  })),
  on(_actions.getPartnerReportOk, (_state, partners) => ({
    ..._state,
    ...partners,
    isLoading: false,
    status: EStatusTransactionReports.getPartnerReportOk,
  })),

  on(_actions.getReport, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactionReports.getReport })),
  on(_actions.getReportOk, (_state, reports) => ({
    ..._state,
    ...reports,
    isLoading: false,
    status: EStatusTransactionReports.getReportOk,
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: EStatusTransactionReports.error })),
);

@Injectable()
export class TransactionReportsFacade {
  select = createFeatureSelector<TransactionReportsState>(TRANSACTION_REPORTS_FEATURE_KEY);

  constructor(private store: Store) {}

  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));

  partnerReports$ = this.store.select(createSelector(this.select, (state) => state.partnerReports));
  getPartnerReport = (_type: string, fromDate: string, toDate: string, stationId: string) =>
    this.store.dispatch(_actions.getPartnerReport({ _type, fromDate, toDate, stationId }));

  reports$ = this.store.select(createSelector(this.select, (state) => state.reports));
  getReport = (
    stationId: string,
    fromDate: string,
    toDate: string,
    itemCode: string,
    customerCode: string,
    partnerCode: string,
  ) => this.store.dispatch(_actions.getReport({ stationId, fromDate, toDate, itemCode, customerCode, partnerCode }));
}
