import { Component, OnInit, Inject } from '@angular/core';
import { SupplierServiceProvider } from '../../providers/supplier-service';
import { FormController } from '../../services/FormController';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'supplier-form-component',
  templateUrl: 'supplier-form-component.html'
})
export class SupplierFormComponent extends FormController implements OnInit { 
  errorMessage: string;

  constructor (
                @Inject(MAT_DIALOG_DATA) public data: any,
                public supplierService: SupplierServiceProvider
              ) {
                super({ service: supplierService });
              }

  ngOnInit() {
    this.load(this.data.oEntityOrId);
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
