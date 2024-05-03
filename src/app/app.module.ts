import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { TaskFilterComponent } from './features/task-filter/task-filter.component';
import { HeaderComponent } from './shared/header/header.component';


// NgRx Imports
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Feature Module
import { FeatureStoreModule } from './store/store.module';

// Pipes
import { DatePipe } from './pipes/date.pipe';


// Angular Material
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskAddModalComponent } from './ui/modal/task-add/task-add-modal.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule
} from '@angular/material/table';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MAT_DATE_LOCALE, MatLine, MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { JsonPipe } from '@angular/common';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDrawer, MatDrawerContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatList, MatListItem } from '@angular/material/list';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatRadioButton } from '@angular/material/radio';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { MatChip } from '@angular/material/chips';
import { HomeComponent } from './pages/home/home.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskDetailsComponent,
    HomeComponent,
    TaskAddModalComponent,
    HeaderComponent,
    DatePipe,
    TaskFilterComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: isDevMode()}),
    FeatureStoreModule,

    //AngularMaterial
    MatDialogModule,
    MatFormField,
    MatDatepickerToggle,
    MatButton,
    MatDatepicker,
    MatInput,
    MatInputModule,
    MatDatepickerInput,
    MatTable,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatToolbarRow,
    MatIcon,
    MatToolbar,
    MatIconButton,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    JsonPipe,
    MatCheckbox,
    MatTableModule,
    MatCheckboxModule,
    MatDrawerContainer,
    MatDrawer,
    MatSidenavModule,
    MatList,
    MatListItem,
    MatLine,
    MatButtonModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatRadioButton,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatTooltip,
    MatChip,
    MatSnackBarModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-US'},
    provideAnimationsAsync()
  ],
  exports: [
    TaskListComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
