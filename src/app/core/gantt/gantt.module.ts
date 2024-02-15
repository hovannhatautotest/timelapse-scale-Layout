import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent } from './gantt.component';

@NgModule({
  declarations: [GanttComponent],
  exports: [GanttComponent],
  imports: [CommonModule],
})
export class GGanttModule {}
