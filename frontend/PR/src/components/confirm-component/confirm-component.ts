import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'confirm-component',
    templateUrl: 'confirm-component.html',
})
export class confirmComponent implements OnInit {
    private comment:string;
    constructor (
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }
    
    ngOnInit() {
        this.comment=this.data.response;
    }


}