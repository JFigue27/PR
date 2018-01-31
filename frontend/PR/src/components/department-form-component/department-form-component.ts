import { Component } from '@angular/core';

@Component({
  selector: 'department-form-component',
  templateUrl: 'department-form-component.html'
})
export class DepartmentFormComponent {

  text: string;

  constructor() {
    console.log('Hello DepartmentFormComponent Component');
    this.text = 'Hello World';
  }

}
