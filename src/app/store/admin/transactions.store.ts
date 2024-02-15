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

export const TRANSACTIONS_FEATURE_KEY = '5c0f7415-58a8-42b2-8dd3-3e443a4ca8ec';
// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: TRANSACTIONS_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<TransactionModel> }>(),

    getByTransactionId: props<{ transactionId: string }>(),
    'getByTransactionId ok': props<{ data: TransactionModel }>(),

    getAutoScaleNumbersChart: props<{ id: string }>(),
    'getAutoScaleNumbersChart ok': props<{ dataAutoScaleNumbersChart: Record<string, ScaleNumbersChartModel[]> }>(),

    getByRecordId: props<{ recordId: string; transactionIdPart: string }>(),
    'getByRecordId ok': props<{ dataByRecordId: any }>(),

    getExcel: props<{ param: RequestExcelExportModel }>(),
    'getExcel ok': emptyProps(),

    getAttachmentsTemplate: props<{ id: string }>(),
    'getAttachmentsTemplate ok': props<{ listAttachmentsTemplate: AttachmentTemplateModel[] }>(),

    postAttachmentMany: props<{ id: string; data: AttachmentTemplateModel[] }>(),
    'postAttachmentMany ok': emptyProps(),

    getAttachments: props<{ id: string }>(),
    'getAttachments ok': props<{ listAttachments: AttachmentTemplateModel[] }>(),

    deleteAttachments_ByAttachmentId: props<{ id: string; attachmentId: string }>(),
    'deleteAttachments_ByAttachmentId ok': emptyProps(),

    postImportExcel: props<{ filePath: string; stationId: string }>(),
    'postImportExcel ok': emptyProps(),

    deleteImportExcel: props<{ transactionId: string }>(),
    'deleteImportExcel ok': emptyProps(),

    getImportTemplate: emptyProps(),
    'getImportTemplate ok': emptyProps(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}transactions`;

@Injectable()
export class TransactionsEffects {
  constructor(
    private actions$: Actions,
    private message: Message,
    private http: HttpClient,
  ) {}

  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.http.get<RequestApi<Pagination<TransactionModel>>>(url, { params }).pipe(
          map((res) => _actions.getOk({ pagination: res.data })),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  getByTransactionId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getByTransactionId),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, transactionId }) =>
        this.http.get<RequestApi<TransactionModel>>(`${url}/${transactionId}`).pipe(
          map((res) => _actions.getByTransactionIdOk({ data: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getAutoScaleNumbersChart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getAutoScaleNumbersChart),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.http
          .get<RequestApi<Record<string, ScaleNumbersChartModel[]>>>(`${url}/${id}/auto-scale-numbers-chart`)
          .pipe(
            map((res) => _actions.getAutoScaleNumbersChartOk({ dataAutoScaleNumbersChart: res.data })),
            catchError(async ({ error }) => this.error(error)),
          ),
      ),
    ),
  );
  getExcel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getExcel),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, param }) => {
        const params = new HttpParams().appendAll({ ...param, type: param._type });
        return this.http.get(`${url}/excel/export`, { params, observe: 'response', responseType: 'blob' }).pipe(
          map((res) => {
            const path = window.URL.createObjectURL(new Blob([res.body], { type: res.body.type }));
            const link = document.createElement('a');
            link.href = path;
            link.target = '_blank';
            link.download = res.headers.get('content-disposition').split(';')[1].split('=')[1].replace(/\"/g, '');
            link.click();
            return _actions.getExcelOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  getAttachmentsTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getAttachmentsTemplate),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.http.get<AttachmentTemplateModel[]>(`${url}/${id}/attachments/template`).pipe(
          map((res) => _actions.getAttachmentsTemplateOk({ listAttachmentsTemplate: res })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  postAttachmentsMany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.postAttachmentMany),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, data }) =>
        this.http.post<RequestApi>(`${url}/${id}/attachments/many`, data).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postAttachmentManyOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getAttachments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getAttachments),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.http.get<RequestApi<AttachmentTemplateModel[]>>(`${url}/${id}/attachments`).pipe(
          map((res) => _actions.getAttachmentsOk({ listAttachments: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  deleteAttachments_ByAttachmentId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.deleteAttachments_ByAttachmentId),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, attachmentId }) =>
        this.http.delete<RequestApi<AttachmentTemplateModel[]>>(`${url}/${id}/attachments/${attachmentId}`).pipe(
          map((res) => {
            this.message.success("Xoá hình ảnh thành công");
            return _actions.deleteAttachments_ByAttachmentIdOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  postImportExcel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.postImportExcel),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, filePath, stationId }) => {
        return this.http.post<RequestApi<any>>(`${url}/import-excel`, { filePath, stationId}).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postImportExcelOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  deleteImportExcel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.deleteImportExcel),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, transactionId }) =>
        this.http.delete<RequestApi<AttachmentTemplateModel[]>>(`${url}/${transactionId}/import`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteImportExcelOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getImportTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getImportTemplate),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type }) =>
        this.http.get(`${url}/import-template`, { observe: 'response', responseType: 'blob' }).pipe(
          map((res) => {
            const path = window.URL.createObjectURL(new Blob([res.body], { type: res.body.type }));
            const link = document.createElement('a');
            link.href = path;
            link.target = '_blank';
            link.download = 'ExcelImportTemplate.xlsx';
            link.click();
            return _actions.getImportTemplateOk();
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
// ---------------------------------------------------------------------------------------------------------------------
export interface RequestExcelExportModel {
  stationId?: string;
  fromDate?: string;
  toDate?: string;
  itemName?: string;
  buyerName?: string;
  sellerName?: string;
  excelType?: string;
  customerCode?: string;
  partnerCode?: string;
  itemCode?: string;
  _type?: number;
}

export interface AttachmentTemplateModel {
  description?: string;
  docType?: string;
  docTypeName?: string;
  entityType?: string;
  file?: string;
  prefix?: string;
  name?: string;
  createdByUserId?: string;
  createdOnDate?: string;
}

export interface ScaleNumbersChartModel {
  balanceTime: number;
  stage: number;
  startAt: string;
  weightTimeSecond: number;
  weightValue: number;
}

export interface TransactionModifiedModel {
  id: string;
  recordId: string;
  modifiedByUser: string;
  modifiedOnDate: string;
  oldFirstWeight: number;
  oldFirstWeighTime: string;
  oldSecondWeight: number;
  oldSecondWeighTime: string;
  oldGroupId: string;
  newFirstWeight: number;
  newFirstWeighTime: string;
  newSecondWeight: number;
  newSecondWeighTime: string;
  newGroupId: string;
}

export interface TransactionModel {
  transactionId: string;
  recordId: string;
  seller: string;
  buyer: string;
  plateNumber: string;
  plateNumber2: string;
  itemName: string;
  unitPrice: number;
  netPrice: number;
  oversizePrice: number;
  note: string;
  type: number;
  firstWeight: number;
  secondWeight: number;
  netWeight: number;
  impurityWeight: number;
  firstWeighTime: string;
  secondWeighTime: string;
  createdDate: string;
  syncStatus: number;
  printCount: number;
  plateImageIn: string;
  plateImageOut: string;
  trunkImageIn: string;
  trunkImageOut: string;
  backImageIn: string;
  backImageOut: string;
  overviewImageIn: string;
  overviewImageOut: string;
  doNumber: number;
  unitPriceType: number;
  realWeight: number;
  paymentStatus: number;
  paymentDate: string;
  subtractWeight: number;
  subsidyPrice: number;
  firstWeighStationName: string;
  secondWeighStationName: string;
  firstWeighUserName: string;
  secondWeighUserName: string;
  importQualityRuleId: string;
  minHumidityPercent: number;
  maxHumidityPercent: number;
  actualHumidityPercent: number;
  minImpurityPercent: number;
  maxImpurityPercent: number;
  actualImpurityPercent: number;
  minBannedMaterialPercent: number;
  maxBannedMaterialPercent: number;
  actualBannedMaterialPercent: number;
  totalReduceWeight: number;
  hasAttachment: boolean;
  hasQualityRating: boolean;
  stationName: string;
  quantity: number;
  averageWeight: number;
  groupId: string;
  buyerAddress: string;
  isError: boolean;
  inValid: boolean;
  lastModifiedByUser: string;
  statusCode: string;
  isImport: boolean;
  historyModifiedData?: TransactionModifiedModel[];
  firstAutomatedWeighTime: string;
  secondAutomatedWeighTime: string;
  paymentStatusDisplay: string;
  unitPriceDisplay: string;
  realWeightDisplay: string;
  netPriceDisplay: string;
  firstWeightDisplay: string;
  secondWeightDisplay: string;
  netWeightDisplay: string;
}

export enum EStatusTransactions {
  idle = 'idle',
  get = 'get',
  getOk = 'getOk',
  getByTransactionId = 'getByTransactionId',
  getByTransactionIdOk = 'getByTransactionIdOk',
  getAutoScaleNumbersChart = 'getAutoScaleNumbersChart',
  getAutoScaleNumbersChartOk = 'getAutoScaleNumbersChartOk',
  getByRecordId = 'getByRecordId',
  getByRecordIdOk = 'getByRecordIdOk',
  getExcel = 'getExcel',
  getExcelOk = 'getExcelOk',
  getAttachmentsTemplate = 'getAttachmentsTemplate',
  getAttachmentsTemplateOk = 'getAttachmentsTemplateOk',
  postAttachmentMany = 'postAttachmentMany',
  postAttachmentManyOk = 'postAttachmentManyOk',
  getAttachments = 'getAttachments',
  getAttachmentsOk = 'getAttachmentsOk',
  deleteAttachments_ByAttachmentId = 'deleteAttachments_ByAttachmentId',
  deleteAttachments_ByAttachmentIdOk = 'deleteAttachments_ByAttachmentIdOk',
  postImportExcel = 'postImportExcel',
  postImportExcelOk = 'postImportExcelOk',
  deleteImportExcel = 'deleteImportExcel',
  deleteImportExcelOk = 'deleteImportExcelOk',
  getImportTemplate = 'getImportTemplate',
  getImportTemplateOk = 'getImportTemplateOk',
  error = 'error',
}
// ---------------------------------------------------------------------------------------------------------------------
export interface TransactionsState {
  pagination: Pagination<TransactionModel>;
  data?: TransactionModel;
  dataAutoScaleNumbersChart?: Record<string, ScaleNumbersChartModel[]>;
  dataByRecordId: any;
  listAttachmentsTemplate: AttachmentTemplateModel[];
  listAttachments: AttachmentTemplateModel[];
  isLoading: boolean;
  status: EStatusTransactions;
}

const initialState: TransactionsState = {
  pagination: emptyPagination(),
  data: undefined,
  dataAutoScaleNumbersChart: undefined,
  dataByRecordId: undefined,
  listAttachmentsTemplate: [],
  listAttachments: [],
  isLoading: false,
  status: EStatusTransactions.idle,
};

export const transactionsReducer = createReducer(
  initialState,
  on(_actions.get, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.get })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: EStatusTransactions.getOk })),

  on(_actions.getByTransactionId, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.getByTransactionId })),
  on(_actions.getByTransactionIdOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: EStatusTransactions.getByTransactionIdOk })),

  on(_actions.getAutoScaleNumbersChart, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.getAutoScaleNumbersChart })),
  on(_actions.getAutoScaleNumbersChartOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: EStatusTransactions.getAutoScaleNumbersChartOk })),

  on(_actions.getByRecordId, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.getByRecordId })),
  on(_actions.getByRecordIdOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: EStatusTransactions.getByRecordIdOk })),

  on(_actions.getExcel, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.getExcel })),
  on(_actions.getExcelOk, (_state) => ({ ..._state, isLoading: false, status: EStatusTransactions.getExcelOk })),

  on(_actions.getAttachmentsTemplate, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.getAttachmentsTemplate })),
  on(_actions.getAttachmentsTemplateOk, (_state, list) => ({ ..._state, ...list, isLoading: false, status: EStatusTransactions.getAttachmentsTemplateOk })),

  on(_actions.postAttachmentMany, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.postAttachmentMany })),
  on(_actions.postAttachmentManyOk, (_state) => ({ ..._state, isLoading: false, status: EStatusTransactions.postAttachmentManyOk })),

  on(_actions.getAttachments, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.getAttachments })),
  on(_actions.getAttachmentsOk, (_state, list) => ({ ..._state, ...list, isLoading: false, status: EStatusTransactions.getAttachmentsOk })),

  on(_actions.deleteAttachments_ByAttachmentId, (_state) => ({ ..._state,  isLoading: true, status: EStatusTransactions.deleteAttachments_ByAttachmentId })),
  on(_actions.deleteAttachments_ByAttachmentIdOk, (_state) => ({ ..._state, isLoading: false, status: EStatusTransactions.deleteAttachments_ByAttachmentIdOk })),

  on(_actions.postImportExcel, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.postImportExcel })),
  on(_actions.postImportExcelOk, (_state) => ({ ..._state, isLoading: false, status: EStatusTransactions.postImportExcelOk })),

  on(_actions.deleteImportExcel, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.deleteImportExcel })),
  on(_actions.deleteImportExcelOk, (_state) => ({ ..._state, isLoading: false, status: EStatusTransactions.deleteImportExcelOk })),

  on(_actions.getImportTemplate, (_state) => ({ ..._state, isLoading: true, status: EStatusTransactions.getImportTemplate })),
  on(_actions.getImportTemplateOk, (_state) => ({ ..._state, isLoading: false, status: EStatusTransactions.getImportTemplateOk })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: EStatusTransactions.error })),
);
// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class TransactionsFacade {
  select = createFeatureSelector<TransactionsState>(TRANSACTIONS_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getByTransactionId = (transactionId: string) => this.store.dispatch(_actions.getByTransactionId({ transactionId }));

  dataAutoScaleNumbersChart$ = this.store.select(createSelector(this.select, (state) => state.dataAutoScaleNumbersChart));
  getAutoScaleNumbersChart = (id: string) => this.store.dispatch(_actions.getAutoScaleNumbersChart({ id }));

  dataByRecordId$ = this.store.select(createSelector(this.select, (state) => state.dataByRecordId));
  getByRecordId = (recordId: string, transactionIdPart: string) => this.store.dispatch(_actions.getByRecordId({ recordId, transactionIdPart }));

  getExcel = (param: RequestExcelExportModel) => this.store.dispatch(_actions.getExcel({ param }));

  listAttachmentsTemplate$ = this.store.select(createSelector(this.select, (state) => state.listAttachmentsTemplate));
  getAttachmentsTemplate = (id: string) => this.store.dispatch(_actions.getAttachmentsTemplate({ id }));

  postAttachmentMany = (id: string, data: AttachmentTemplateModel[]) => this.store.dispatch(_actions.postAttachmentMany({ id, data }));

  listAttachments$ = this.store.select(createSelector(this.select, (state) => state.listAttachments));
  getAttachments = (id: string) => this.store.dispatch(_actions.getAttachments({ id }));

  deleteAttachments_ByAttachmentId = (id: string, attachmentId: string) => this.store.dispatch(_actions.deleteAttachments_ByAttachmentId({ id, attachmentId }));
  postImportExcel = (filePath: string, stationId: string) => this.store.dispatch(_actions.postImportExcel({ filePath, stationId }));
  deleteImportExcel = (transactionId: string) => this.store.dispatch(_actions.deleteImportExcel({ transactionId }));
  getImportTemplate = () => this.store.dispatch(_actions.getImportTemplate());
}
