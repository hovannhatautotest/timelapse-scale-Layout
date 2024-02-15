import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestApi } from '@model';
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

export const ITEMS_FEATURE_KEY = 'dff0792b-9df4-446a-be41-f2852cfc531f';

const _actions = createActionGroup({
  source: ITEMS_FEATURE_KEY,
  events: {
    getItem: props<{ stationId: string }>(),
    'getItem ok': props<{ items: Item[] }>(),

    error: emptyProps(),
  },
});

const url = `${environment.apiUrl}`;

@Injectable()
export class ItemsEffects {
  constructor(
    private actions$: Actions,
    private message: Message,
    private http: HttpClient,
  ) {}
  getItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getItem),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.http.get<Item[]>(`${url}items`, { params }).pipe(
          map((res) => {
            return _actions.getItemOk({ items: [{ name: 'Tất cả Mặt hàng', code: '' }, ...res] });
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

export class Item {
  constructor(
    public name?: string,
    public code?: string,
  ) {}
}

export enum EStatusItems {
  idle = 'idle',
  getItem = 'getItem',
  getItemOk = 'getItemOk',
  error = 'error',
}

export interface ItemsState {
  isLoading: boolean;
  items?: Item[];
  status: EStatusItems;
}

const initialState: ItemsState = {
  items: [],
  isLoading: false,
  status: EStatusItems.idle,
};

export const itemsReducer = createReducer(
  initialState,
  on(_actions.getItem, (_state) => ({ ..._state, isLoading: true, status: EStatusItems.getItem })),
  on(_actions.getItemOk, (_state, items) => ({
    ..._state,
    ...items,
    isLoading: false,
    status: EStatusItems.getItemOk,
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: EStatusItems.error })),
);

@Injectable()
export class ItemsFacade {
  select = createFeatureSelector<ItemsState>(ITEMS_FEATURE_KEY);

  constructor(private store: Store) {}

  items$ = this.store.select(createSelector(this.select, (state) => state.items));
  getItem = (stationId: string) => this.store.dispatch(_actions.getItem({ stationId }));
}
