import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxEchartsModule } from 'ngx-echarts';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzInputModule } from 'ng-zorro-antd/input';

import { SwiperDirective } from '@directive';
import { AdminLayout } from '@layouts';
import { FormatCurrencyPipe, FormatDatePipe, FullTextSearchPipe } from '@pipes';
import {
  GButtonModule,
  GDatatableModule,
  GFormModule,
  GGanttModule,
  GModalFormModule,
  GModalModule,
  GPaginationModule,
  GUploadModule,
} from '@core';
import {
  DashboardComponent,
  PostsComponent,
  EditCategoryPostComponent,
  EditPostComponent,
  NavigationComponent,
  ParameterComponent,
  DataComponent,
  EditDataComponent,
  EditTypeDataComponent,
  CodeTypesComponent,
  EditCodeTypeComponent,
  EditProfileComponent,
  UserComponent,
  EditUserComponent,
  PasswordUserComponent,
  DetailUserComponent,
  LevelUserComponent,
  TransferProfileUserComponent,
  StationComponent,
  DetailStationComponent,
  TransactionComponent,
} from '@pages';

import {
  POSTS_FEATURE_KEY,
  PostsEffects,
  postsReducer,
  POST_CATEGORIES_FEATURE_KEY,
  PostCategoriesEffects,
  postCategoriesReducer,
  DATAS_FEATURE_KEY,
  DatasEffects,
  datasReducer,
  DATA_TYPES_FEATURE_KEY,
  TYPES_CODE_TYPE_FEATURE_KEY,
  DataTypesEffects,
  dataTypesReducer,
  NAVIGATION_FEATURE_KEY,
  NavigationEffects,
  navigationReducer,
  UPLOAD_FEATURE_KEY,
  UploadEffects,
  uploadReducer,
  ADDRESS_FEATURE_KEY,
  AddressEffects,
  addressReducer,
  ROLE_FEATURE_KEY,
  RoleEffects,
  roleReducer,
  CODE_TYPES_FEATURE_KEY,
  CodeTypesEffects,
  codeTypesReducer,
  USER_FEATURE_KEY,
  UserEffects,
  userReducer,
  typesCodeTypeReducer,
  TypesCodeTypeEffects,
  CodeTypeEffects,
  codeTypeReducer,
  CODE_TYPE_FEATURE_KEY,
  PARAMETERS_FEATURE_KEY,
  parametersReducer,
  ParametersEffects,
  ME_FEATURE_KEY,
  meReducer,
  MeEffects,
  PARTNER_ME_FEATURE_KEY,
  PartnerMeEffects,
  partnerMeReducer,
  StationEffects,
  STATION_FEATURE_KEY,
  stationReducer,
  TransactionsEffects,
  TRANSACTIONS_FEATURE_KEY,
  transactionsReducer,
  CustomersEffects,
  customersReducer,
  CUSTOMERS_FEATURE_KEY,
  TransactionReportsEffects,
  TRANSACTION_REPORTS_FEATURE_KEY,
  transactionReportsReducer,
  ItemsEffects,
  ITEMS_FEATURE_KEY,
  itemsReducer,
  FileLogEffects,
  FILELOG_FEATURE_KEY,
  fileLogReducer,
} from '@store';
import { environment } from '@src/environments/environment';
import { AdminRouting } from './admin.routing';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminLayout,
    SwiperDirective,
    FormatDatePipe,
    FormatCurrencyPipe,
    FullTextSearchPipe,
    NavigationComponent,
    ParameterComponent,
    PostsComponent,
    DataComponent,
    EditCategoryPostComponent,
    EditPostComponent,
    EditDataComponent,
    EditTypeDataComponent,
    EditCodeTypeComponent,
    CodeTypesComponent,
    EditProfileComponent,
    EditCodeTypeComponent,
    CodeTypesComponent,
    UserComponent,
    EditUserComponent,
    PasswordUserComponent,
    DetailUserComponent,
    LevelUserComponent,
    TransferProfileUserComponent,
    StationComponent,
    DetailStationComponent,
    TransactionComponent,
  ],
  imports: [
    CommonModule,
    AdminRouting,
    FormsModule,
    ReactiveFormsModule,
    GButtonModule,
    GDatatableModule,
    GFormModule,
    GPaginationModule,
    GUploadModule,
    GModalModule,
    GModalFormModule,
    GGanttModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),

    TranslateModule.forRoot({
      defaultLanguage: localStorage.getItem('ng-language') || environment.language,
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
          return new TranslateHttpLoader(http, 'assets/translations/');
        },
        deps: [HttpClient],
      },
    }),
    NzSpinModule,
    NzPopoverModule,
    NzSelectModule,
    NzDropDownModule,
    NzRadioModule,
    NzTreeModule,
    NzTransferModule,
    NzFormModule,
    NzPopconfirmModule,
    NzTabsModule,
    NzTreeSelectModule,
    NzSwitchModule,
    NzDatePickerModule,
    NzPaginationModule,
    NzCollapseModule,
    NzDescriptionsModule,
    NzCardModule,
    NzUploadModule,
    NzInputModule,
    EffectsModule.forFeature([
      PostsEffects,
      PostCategoriesEffects,
      DatasEffects,
      DataTypesEffects,
      NavigationEffects,
      UploadEffects,
      AddressEffects,
      CodeTypesEffects,
      RoleEffects,
      UserEffects,
      TypesCodeTypeEffects,
      CodeTypesEffects,
      CodeTypeEffects,
      ParametersEffects,
      MeEffects,
      PartnerMeEffects,
      StationEffects,
      TransactionsEffects,
      CustomersEffects,
      TransactionReportsEffects,
      ItemsEffects,
      FileLogEffects,
    ]),
    StoreModule.forFeature(POSTS_FEATURE_KEY, postsReducer),
    StoreModule.forFeature(POST_CATEGORIES_FEATURE_KEY, postCategoriesReducer),
    StoreModule.forFeature(DATAS_FEATURE_KEY, datasReducer),
    StoreModule.forFeature(DATA_TYPES_FEATURE_KEY, dataTypesReducer),
    StoreModule.forFeature(NAVIGATION_FEATURE_KEY, navigationReducer),
    StoreModule.forFeature(UPLOAD_FEATURE_KEY, uploadReducer),
    StoreModule.forFeature(ADDRESS_FEATURE_KEY, addressReducer),
    StoreModule.forFeature(CODE_TYPES_FEATURE_KEY, codeTypesReducer),
    StoreModule.forFeature(ROLE_FEATURE_KEY, roleReducer),
    StoreModule.forFeature(USER_FEATURE_KEY, userReducer),
    StoreModule.forFeature(TYPES_CODE_TYPE_FEATURE_KEY, typesCodeTypeReducer),
    StoreModule.forFeature(CODE_TYPE_FEATURE_KEY, codeTypeReducer),
    StoreModule.forFeature(PARAMETERS_FEATURE_KEY, parametersReducer),
    StoreModule.forFeature(ME_FEATURE_KEY, meReducer),
    StoreModule.forFeature(PARTNER_ME_FEATURE_KEY, partnerMeReducer),
    StoreModule.forFeature(STATION_FEATURE_KEY, stationReducer),
    StoreModule.forFeature(TRANSACTIONS_FEATURE_KEY, transactionsReducer),
    StoreModule.forFeature(CUSTOMERS_FEATURE_KEY, customersReducer),
    StoreModule.forFeature(TRANSACTION_REPORTS_FEATURE_KEY, transactionReportsReducer),
    StoreModule.forFeature(ITEMS_FEATURE_KEY, itemsReducer),
    StoreModule.forFeature(FILELOG_FEATURE_KEY, fileLogReducer),
  ],
})
export class AdminModule {}
