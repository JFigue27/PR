import { Component, OnInit, Inject } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { FormController } from '../../core/FormController';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'supplier-form-component',
  templateUrl: 'supplier-form-component.html'
})
export class SupplierFormComponent extends FormController implements OnInit { 
  errorMessage: string;

  constructor (
                @Inject(MAT_DIALOG_DATA) public data: any,
                public supplierService: SupplierService
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

  beforeSave(){
    
  }
  afterSave() {
  }
  
  afterRemove() {
  }
}
