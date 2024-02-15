import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorHtmlComponent } from './editor-html.component';
import { NgxSuneditorModule } from 'ngx-suneditor';

@NgModule({
  declarations: [EditorHtmlComponent],
  exports: [EditorHtmlComponent],
  imports: [CommonModule, NgxSuneditorModule],
})
export class GEditorHtmlModule {}
