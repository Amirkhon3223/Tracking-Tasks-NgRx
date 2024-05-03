import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { tasksReducer } from './tasks/tasks.reducer';
import { TasksEffects } from './tasks/tasks.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('tasks', tasksReducer),
    EffectsModule.forFeature([TasksEffects])
  ],
  declarations: []
})
export class FeatureStoreModule {
}
