import { Component, OnInit } from '@angular/core';
import { SupplierServiceProvider } from '../../providers/supplier-service';
import { FormController } from '../../services/FormController';
import { NavParams, NavController } from 'ionic-angular';

@Component({
  selector: 'supplier-form-component',
  templateUrl: 'supplier-form-component.html'
})

export class SupplierFormComponent extends FormController implements OnInit { 
  errorMessage: string;

  constructor(public supplierSerivceProvider: SupplierServiceProvider, private params: NavParams, private nav: NavController) {
    super({ service: supplierSerivceProvider });
  }

  ngOnInit() {
     this.load(this.params.get('oEntityOrId'));
  }

  close(){
    this.nav.pop();
  }

  afterCreate() {
  }

  afterLoad() {
  }

  afterSave(){
    this.nav.pop();
  }

  afterRemove() {
  }
}
