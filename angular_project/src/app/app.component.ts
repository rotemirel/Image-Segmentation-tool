//The app.component.ts is the actual Angular code that drives the functionality of the application.

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({  
  selector: 'app-background',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title = 'Image Segmentation Project';


}
