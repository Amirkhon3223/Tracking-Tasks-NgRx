import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { tasksReducer } from './tasks/tasks.reducer';
import { usersReducer } from './users/users.reducer';
import { TasksEffects } from './tasks/tasks.effects';
import { UsersEffects } from './users/users.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('tasks', tasksReducer),
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([TasksEffects, UsersEffects])
  ],
  declarations: []
})
export class FeatureStoreModule {
}
