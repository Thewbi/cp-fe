import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';  // npm install @ngrx/effects --save
import {StoreModule} from '@ngrx/store';      // npm install @ngrx/store

import {TemplateEffects} from './store/template.effects';
import {templateReducer} from './store/template.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('templates', {TemplateState: templateReducer}),
    EffectsModule.forFeature([TemplateEffects])
  ],
  exports: [],
  declarations: [],
  providers: []
})
export class TemplatesModule {
}
