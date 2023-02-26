//this is like main - where the program starts.
/*responsible for loading all the relevant and necessary dependencies, 
  declaring which components will be used within your application, 
  to marking which is the main entry point component of your application. */
//Only import modules that are absolutely necessary for your app to load initially
//Only declare Angular components, directives, or pipes that you want globally available

import { IMAGE_LOADER } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UploadImageComponent } from './upload-image/upload-image.component';


@NgModule({
  declarations: [
    AppComponent,
    UploadImageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
