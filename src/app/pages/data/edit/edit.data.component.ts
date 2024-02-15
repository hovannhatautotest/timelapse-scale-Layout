import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/form/form.component';
import { EStatusState, EFormRuleType, EFormType, FormModel } from '@model';

import { AttachmentTemplate, DatasFacade, DataTypesFacade, GlobalFacade, UploadFacade } from '@store';
import { getLanguage, Message } from '@utils';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-data',
  templateUrl: './edit.data.component.html',
  providers: [DatasFacade, DataTypesFacade, UploadFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditDataComponent implements OnInit, OnDestroy {
  constructor(
    protected message: Message,
    protected route: ActivatedRoute,
    protected router: Router,
    public datasFacade: DatasFacade,
    public dataTypesFacade: DataTypesFacade,
    private fb: FormBuilder,
    public globalFacade: GlobalFacade,
  ) {}
  language = getLanguage();
  formUpload!: FormGroup;
  templateUpload: AttachmentTemplate[] = [];

  buildForm() {
    this.formUpload = this.fb.group({ image: null });
  }

  private destroyed$ = new Subject<void>();
  id = '';
  isVisible = false;
  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/data',
      },
      {
        title: 'Quản lý dữ liệu',
        link: '/data',
      },
    ]);
    this.id = this.route.snapshot.params.id;
    this.dataTypesFacade.get({});
    this.buildForm();
    if (this.id) this.datasFacade.getById(this.id);
    else {
      this.datasFacade.setId(null);
    }
    this.datasFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (this.id) {
        this.isVisible = data?.isVisible;
        this.formUpload.reset(data);
        setTimeout(() => {
          document.getElementById('translations-vn-title')?.focus();
        }, 1000);
      }
    });
    this.datasFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case EStatusState.postOk:
        case EStatusState.putOk:
          this.handleBack();
      }
    });
    this.globalFacade.languages$.pipe(takeUntil(this.destroyed$)).subscribe((languages) => {
      this.columnsData = [
        {
          name: 'type',
          title: 'routes.admin.code_types.categories',
          formItem: {
            type: EFormType.select,
            facade: this.dataTypesFacade.list$,
            col: 6,
            rules: [{ type: EFormRuleType.required }],
          },
        },
        {
          name: 'order',
          title: 'routes.admin.Layout.Order',
          formItem: {
            col: 6,
            type: EFormType.number,
          },
        },
        {
          name: 'translations',
          title: 'routes.admin.code_types.translations',
          formItem: {
            type: EFormType.tab,
            tab: {
              label: 'language',
              value: 'language',
            },
            list: languages,
            columns: [
              {
                name: 'name',
                title: 'routes.admin.Layout.Name',
                formItem: {
                  rules: [{ type: EFormRuleType.required }],
                },
              },
              {
                name: 'description',
                title: 'routes.admin.Layout.Description',
                formItem: {
                  type: EFormType.textarea,
                },
              },
              {
                title: 'routes.admin.Layout.content',
                name: 'content',
                formItem: {
                  type: EFormType.markdown,
                },
              },
            ],
          },
        },
      ];
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  @ViewChild('formData') formData!: FormComponent;

  handelSubmit(validateForm: FormGroup) {
    const { controls: controlsD, value: valueData, valid: validData } = this.formData.validateForm;
    const { controls, value } = validateForm;
    if (validData) {
      const method$ = !this.id ? 'post' : 'put';
      valueData.isVisible = this.isVisible;
      this.datasFacade[method$](this.id, { ...valueData, ...value });
    } else {
      this.checkControls([controls, controlsD]);
    }
  }

  checkControls(controlsArray: Record<string, any>[]) {
    for (const controls of controlsArray) {
      for (const control of Object.values(controls)) {
        if (!control.controls) {
          control.markAsTouched();
          control.updateValueAndValidity();
        } else {
          this.checkControls([control.controls]);
        }
      }
    }
  }

  handleBack() {
    this.datasFacade.setId(this.route.snapshot.params.id);
    this.datasFacade.query$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((query) => {
      if (query) {
        const newSort: { [key: string]: string } = {};
        if (query.sort) {
          const arrSort = query.sort.split(/(?<=[+-])/);
          newSort[arrSort[1]] = arrSort[0] == '+' ? 'ascend' : 'descend';
        }

        this.router.navigate([this.language + '/data'], {
          relativeTo: this.route,
          queryParams: { ...query, sort: JSON.stringify(newSort) },
          queryParamsHandling: 'merge',
        });
      } else
        this.router.navigate([this.language + '/data'], {
          relativeTo: this.route,
          queryParams: query || {},
          queryParamsHandling: 'merge',
        });
    });
  }

  columnsData: FormModel[] = [];
}
