import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { EStatusState, EFormRuleType, EFormType, FormModel, Language } from '@model';
import { AttachmentTemplate, GlobalFacade, PostCategories, PostCategoriesFacade, Posts, PostsFacade } from '@store';
import { getLanguage, Message } from '@utils';
import { Subject, take, takeUntil, withLatestFrom } from 'rxjs';
import { FormComponent } from '@core/form/form.component';
import slug from 'slug';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-edit.post',
  templateUrl: './edit.post.component.html',
  providers: [PostsFacade, PostCategoriesFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPostComponent implements OnInit, OnDestroy {
  @ViewChild('postForm') postForm!: FormComponent;
  @ViewChild('extraForm') extraForm!: FormComponent;
  @ViewChild('titleSeo') titleSeo!: any;
  private destroyed$ = new Subject<void>();

  id?: string;
  editformat?: string;
  postData: any;
  validateForm!: FormGroup;
  templateUpload: AttachmentTemplate[] = [];
  data?: Posts;
  postColumns: FormModel[] = [];
  language = getLanguage();
  slug: any = [];
  categories: any = [];
  nameCategory = '';

  constructor(
    protected message: Message,
    protected route: ActivatedRoute,
    protected router: Router,
    public postsFacade: PostsFacade,
    public postCategoriesFacade: PostCategoriesFacade,
    private fb: FormBuilder,
    public globalFacade: GlobalFacade,
  ) {}

  buildForm() {
    const obj: any = {
      coverUrl: null,
      thumbnailUrl: null,
    };
    this.validateForm = this.fb.group(obj);
  }

  ngOnInit() {
    this.postCategoriesFacade.get({});
    this.id = this.route.snapshot.params.id;
    this.postsFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data && this.id) {
        this.data = JSON.parse(JSON.stringify(data));
        this.buildForm();
        if (this.data) {
          this.editformat = this.data.editorFormat;
          this.data.translations = this.data?.translations?.map((item: any) => {
            if (!item.content.blocks) {
              item.content.blocks = [
                {
                  id: 'sCHe389Xee',
                  type: 'paragraph',
                  data: {
                    text: '',
                  },
                },
              ];
              item.content.time = '1667209391241';
              item.content.version = '2.25.0';
            }
            return item;
          });
        }
        this.postData = {
          ...this.data,
          isPinned: this.data?.isPinned || false,
          categoryId: this.data?.category?.id,
        };
        this.data?.attachments?.forEach((subItem: any) => (this.postData[subItem.docType] = subItem));
        this.validateForm.reset(this.postData);
      }
    });
    this.postsFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case EStatusState.postOk:
        case EStatusState.putOk:
          this.handleBack();
      }
    });

    this.editformat = 'BLOCK';
    this.globalFacade.languages$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.postCategoriesFacade.list$))
      .subscribe(([languages, list]) => this.initData(languages, list));
    this.postCategoriesFacade.list$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.globalFacade.languages$))
      .subscribe(([list, languages]) => this.initData(languages, list));
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  initData(languages: Language[], list: PostCategories[]) {
    if (languages.length && list.length) {
      if (this.id) this.postsFacade.getById(this.id);
      else {
        this.data = {};
        this.postsFacade.setId(null);
      }
      this.buildForm();
      this.categories = list;
      this.postColumns = [
        // {
        //   name: 'editorFormat',
        //   title: 'routes.admin.post.editorFormat',
        //   formItem: {
        //     type: 'radio',
        //     list: [
        //       { label: 'Block', value: 'BLOCK' },
        //       // { label: 'Html', value: 'HTML' },
        //     ],
        //     value: 'BLOCK',
        //     autoSet: (value: any) => {
        //       this.editformat = value;
        //     },
        //   },
        // },
        {
          name: 'categoryId',
          title: 'routes.admin.post.categories',
          formItem: {
            type: EFormType.select,
            list: this.categories,
            rules: [{ type: EFormRuleType.required }],
            col: 4,
            autoSet: (value) => {
              this.categories?.map((item: any) => {
                if (item.value === value) {
                  this.nameCategory = item.label;
                  if (this.slug.length) {
                    const langActive = this.tabLangActive(languages);
                    const label = this.slug[0].label.split('/');
                    this.slug = [
                      {
                        label: langActive + '/' + label[label.length - 1],
                        value: langActive + '/' + label[label.length - 1],
                      },
                      {
                        label: label[label.length - 1],
                        value: label[label.length - 1],
                      },
                    ];
                    this.postColumns[this.postColumns.length - 1].formItem.columns[2].formItem.list = this.slug;
                  }
                }
              });
            },
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
                name: 'title',
                title: 'routes.admin.post.title',
                formItem: {
                  autoSet: (value, fors, formGroup) => {
                    const slugInput = formGroup?.get('slug');
                    if (value && !slugInput?.value) {
                      const text = slug(value);
                      slugInput?.setValue(text);
                      const permalinkInput = formGroup?.get('permalink');
                      if (!permalinkInput.value) {
                        this.slug = [];
                        const langActive = this.tabLangActive(languages);
                        if (this.nameCategory) {
                          this.slug.push({
                            label: langActive + '/' + text,
                            value: langActive + '/' + text,
                          });
                        }
                        this.slug.push({ label: text, value: text });
                        this.postColumns[this.postColumns.length - 1].formItem.columns[2].formItem.list = this.slug;
                      }
                    }
                  },
                },
              },
              {
                name: 'slug',
                title: 'routes.admin.post.seoUrl',
                formItem: {
                  autoSet: (value, fors, formGroup) => {
                    const permalinkInput = formGroup?.get('permalink');
                    if (!permalinkInput.value) {
                      this.slug = [];
                      const langActive = this.tabLangActive(languages);
                      if (this.nameCategory) {
                        this.slug.push({
                          label: langActive + '/' + value,
                          value: langActive + '/' + value,
                        });
                      }
                      this.slug.push({ label: value, value: value });
                      this.postColumns[this.postColumns.length - 1].formItem.columns[2].formItem.list = this.slug;
                    }
                  },
                },
              },
              {
                name: 'permalink',
                title: 'routes.admin.post.Permalink',
                formItem: {
                  type: EFormType.autocomplete,
                  list: [],
                },
              },
              {
                name: 'seoDescription',
                title: 'routes.admin.post.Description',
                formItem: {
                  type: EFormType.textarea,
                },
              },
              {
                name: 'summary',
                title: 'routes.admin.post.introduce',
                formItem: {
                  type: EFormType.textarea,
                  rows: 5,
                },
              },
              // {
              //   name: 'contentStringHtml',
              //   title: 'routes.admin.post.content',
              //   formItem: {
              //     type: 'html',
              //     rows: 8,
              //     condition: () => this?.editformat === 'HTML',
              //   },
              // },
              {
                name: 'content',
                title: 'routes.admin.post.content',
                formItem: {
                  type: EFormType.markdown,
                  rows: 8,
                  // condition: () => this?.editformat === 'BLOCK',
                },
              },
              {
                name: '',
                title: '',
                formItem: {
                  type: EFormType.onlyText,
                  render: this.titleSeo,
                },
              },
              {
                name: 'seoKeywords',
                title: 'routes.admin.post.keywords',
                formItem: {},
              },
              {
                name: 'seoDescription',
                title: 'routes.admin.post.description',
                formItem: {
                  type: EFormType.textarea,
                  rows: 5,
                },
              },
            ],
          },
        },
      ];
    }
  }

  handelSubmit() {
    const { controls, value, valid } = this.postForm.validateForm;
    const { controls: controlsF, value: valueF, valid: validF } = this.validateForm;
    const { controls: controlsE, value: valueE, valid: validE } = this.extraForm.validateForm;
    const { id } = this.route.snapshot.params;

    if (!valid || !validE || !validF) {
      this.checkControls([controls, controlsE, controlsF]);
      return;
    }
    value.translations.forEach((item: any) => {
      delete item[''];
      if (item.contentStringBlock && value.editorFormat === 'BLOCK') {
        item.content = item.content;
        delete item.content;
      }
      // if (item.contentStringHtml && value.editorFormat === 'HTML') {
      //   item.content = item.contentStringHtml;
      //   delete item.contentStringHtml;
      // }
    });
    const payload = {
      ...value,
      ...valueE,
      ...valueF,
      isPinned: valueE.isPinned || false,
      relatedPostListId: [],
    };
    delete payload['editorFormat'];
    if (id) {
      this.postsFacade.put(id, payload);
    } else {
      this.postsFacade.post(payload);
    }
  }

  title?: string;

  handleBack() {
    this.title = this.data?.category?.title;
    this.postsFacade.setId(this.route.snapshot.params.id);
    this.postsFacade.query$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((query) => {
      this.router.navigate([this.language + '/posts'], {
        relativeTo: this.route,
        queryParams: query || {},
        queryParamsHandling: 'merge',
      });
    });
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

  extraDataColumns: FormModel[] = [
    // {
    //   name: 'backGroundColor',
    //   title: 'Background Color',
    //   formItem: {
    //     type: 'color',
    //   },
    // },
    // {
    //   name: 'titleForeColor',
    //   title: 'Title Fore Color',
    //   formItem: {
    //     type: 'color',
    //   },
    // },
    // {
    //   name: 'isShowTitle',
    //   title: 'Show Title',
    //   formItem: {
    //     type: 'switch',
    //     col: 6,
    //   },
    // },
    {
      name: 'isPinned',
      title: 'Ghim',
      formItem: {
        type: EFormType.switch,
        col: 6,
      },
    },
    // {
    //   name: 'customCSSClass',
    //   title: 'Custom Class',
    //   formItem: {},
    // },
    // {
    //   name: 'customCSS',
    //   title: 'Custom CSS',
    //   formItem: {
    //     type: 'textarea',
    //     rows: 5,
    //   },
    // },
  ];
  handleNavigate(data: any) {
    let url;
    for (let i = 0; i < data?.translations?.length; i++) {
      url = environment.urlClient + this.language + '/' + data?.translations[i]?.slug;
      if (this.language.includes(data?.translations[i]?.language)) break;
    }
    window.open(url, '_blank');
  }
  tabLangActive(languages: Language[]) {
    let langActive = 'vn';
    const activeLanguage = languages.find(
      (language) => language.label === (document.querySelector('.ant-tabs-tab-active') as HTMLElement)?.innerText,
    );
    if (activeLanguage) langActive = activeLanguage.code;
    return '/' + langActive;
  }
}
