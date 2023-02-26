import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

//https://www.simplilearn.com/tutorials/angular-tutorial/angular-hello-world
//The index.html file is responsible for deciding which files are to be loaded
//he main.ts file, identifies which Angular module is to be loaded when the application starts.

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
