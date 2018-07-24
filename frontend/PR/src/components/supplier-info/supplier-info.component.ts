import { Component, OnInit, Inject } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { FormController } from '../../core/FormController';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'supplier-info.component',
    templateUrl: 'supplier-info.component.html',
})

export class SupplierInfoComponent extends FormController implements OnInit {

    constructor(
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

    beforeSave() {

    }
    afterSave() {
    }

    afterRemove() {
    }
}
