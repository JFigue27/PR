import { Component } from '@angular/core';

@Component({
  selector: 'department-component',
  templateUrl: 'department-component.html'
})
export class DepartmentComponent {

  text: string;

  constructor() {
    console.log('Hello DepartmentcomponentComponent Component');
    this.text = 'Hello World';
  }

}
