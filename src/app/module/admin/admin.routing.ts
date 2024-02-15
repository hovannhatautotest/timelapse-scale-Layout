import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayout } from '@layouts';
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
  EditProfileComponent,
  EditCodeTypeComponent,
  UserComponent,
  PasswordUserComponent,
  EditUserComponent,
  DetailUserComponent,
  LevelUserComponent,
  TransferProfileUserComponent,
  StationComponent,
  DetailStationComponent,
  TransactionComponent,
} from '@pages';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'posts',
        component: PostsComponent,
      },
      {
        path: 'navigation',
        component: NavigationComponent,
      },
      {
        path: 'posts/:id/edit',
        component: EditPostComponent,
      },
      {
        path: 'posts/add',
        component: EditPostComponent,
      },
      {
        path: 'posts/categories/:id/edit',
        component: EditCategoryPostComponent,
      },
      {
        path: 'posts/categories/add',
        component: EditCategoryPostComponent,
      },
      {
        path: 'data',
        component: DataComponent,
      },
      {
        path: 'data/add',
        component: EditDataComponent,
      },
      {
        path: 'data/:id/edit',
        component: EditDataComponent,
      },
      {
        path: 'data/type/add',
        component: EditTypeDataComponent,
      },
      {
        path: 'data/type/:id/edit',
        component: EditTypeDataComponent,
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent,
      },
      {
        path: 'code-types',
        component: CodeTypesComponent,
      },
      {
        path: 'code-types/:type/add',
        component: EditCodeTypeComponent,
      },
      {
        path: 'code-types/:type/:id/edit',
        component: EditCodeTypeComponent,
      },
      {
        path: 'parameter',
        component: ParameterComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'user/add',
        component: EditUserComponent,
      },
      {
        path: 'user/:id',
        component: DetailUserComponent,
      },
      {
        path: 'user/:id/edit',
        component: EditUserComponent,
      },
      {
        path: 'user/:id/password',
        component: PasswordUserComponent,
      },
      {
        path: 'user/:id/level',
        component: LevelUserComponent,
      },
      {
        path: 'user/:id/transfer-profile',
        component: TransferProfileUserComponent,
      },
      {
        path: 'station',
        component: StationComponent,
      },
      {
        path: 'station/:id',
        component: DetailStationComponent,
      },
      {
        path: 'station/:id/transaction/:transactionId',
        component: TransactionComponent,
      },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRouting {}
