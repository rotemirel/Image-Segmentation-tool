import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { UploadImageComponent } from './upload-image.component';

@NgModule({
  declarations: [
    UploadImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [UploadImageComponent]
})
export class AppModule { }
