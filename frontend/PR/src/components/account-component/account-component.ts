import { Component } from '@angular/core';

@Component({
  selector: 'account-component',
  templateUrl: 'account-component.html'
})
export class AccountComponent {

  text: string;

  constructor() {
    console.log('Hello AccountcomponentComponent Component');
    this.text = 'Hello World';
  }

}
