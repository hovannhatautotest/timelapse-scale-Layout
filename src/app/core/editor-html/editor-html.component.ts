import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SunEditorOptions } from 'suneditor/src/options';
import plugins from 'suneditor/src/plugins';
import { NgxSuneditorComponent } from 'ngx-suneditor';
import { environment } from '@src/environments/environment';
@Component({
  selector: 'g-editor-html',
  templateUrl: './editor-html.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorHtmlComponent),
      multi: true,
    },
  ],
})
export class EditorHtmlComponent {
  @Input() data?: string;
  public ngxSunEditor: NgxSuneditorComponent;

  constructor() {
    setTimeout(() => {
      document.querySelectorAll('.-intro-x').forEach((e) => e.classList.remove('-intro-x'));
    }, 500);
  }
  editorOptions: SunEditorOptions = {
    plugins: plugins,
    width: '100%',
    height: 'auto',
    minHeight: '192',
    fontSize: [12, 14, 16, 18, 20, 24, 30, 36],
    pasteTagsBlacklist: 'span|br',
    buttonList: [
      ['undo', 'redo'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['font', 'fontSize', 'formatBlock'],
      ['removeFormat', 'outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['table', 'link', 'image', 'video', 'audio'],
      ['fullScreen', 'showBlocks', 'codeView'],
    ],
  };

  imageElement: any;
  onEditorCreated(comp: NgxSuneditorComponent) {
    this.ngxSunEditor = comp;
  }
  async onImageUploadBefore({ files }: any) {
    const bodyFormData = new FormData();
    bodyFormData.append('file', files[0]);
    const res = await (
      await fetch(environment.apiUrl + `core/nodes/upload/physical/blob?destinationPhysicalPath=posts/8ebc5c9e`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem(environment.userData))?.tokenString,
        },
        body: bodyFormData,
      })
    ).json();
    if (this.imageElement) this.imageElement.src = environment.hostUrl + res.data.physicalPath;
  }
  onImageUpload({ targetElement }: any) {
    this.imageElement = targetElement;
  }
  onSave(e: any) {
    this.onChange(e);
  }
  get value() {
    return this.data;
  }
  set value(val) {
    this.data = val;
  }
  writeValue: any = (value: string) => {
    this.data = value;
    if (value) {
      setTimeout(() => this.ngxSunEditor.setContents(value));
    }
  };
  onChange: any;
  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }
  onTouch: any;
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
}
