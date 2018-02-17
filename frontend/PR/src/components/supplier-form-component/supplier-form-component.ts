import { Component, OnInit } from '@angular/core';
import { SupplierServiceProvider } from '../../providers/supplier-service';
import { FormController } from '../../services/FormController';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'supplier-form-component',
  templateUrl: 'supplier-form-component.html'
})

export class SupplierFormComponent extends FormController implements OnInit { 
  errorMessage: string;

  constructor (
                public supplierService: SupplierServiceProvider,
                private params: NavParams
              ) {
                super({ service: supplierService });
              }

  ngOnInit() {
     this.load(this.params.get('oEntityOrId'));
  }

  close() {
  }

  afterCreate() {
  }

  afterLoad() {
  }

  afterSave() {
  }

  afterRemove() {
  }
}
