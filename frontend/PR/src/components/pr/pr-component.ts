import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { FormController } from '../../services/FormController';
import { PRServiceProvider } from '../../providers/pr-service';
import { UserServiceProvider } from '../../providers/user-service';
import { SupplierServiceProvider } from '../../providers/supplier-service';
import { DepartmentServiceProvider } from '../../providers/department-service';
import { AccountServiceProvider } from '../../providers/account-service';
import { MatDialog } from '@angular/material';
import { ApprovalFormComponent } from '../approval-form/approval-form-component';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { SupplierFormComponent } from '../supplier-form/supplier-form-component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'pr-component',
  templateUrl: 'pr-component.html'
})
export class PRComponent extends FormController implements OnInit {
  private accounts = [];
  private departments = [];
  private suppliers:any=[]; 
  private users = [];
  private approval: any;
  public progress: 20;
  public userRole: string;
  public itemsSource: any;
  public currencies = ['Dlls', 'Mxn'];
  myControl: FormControl = new FormControl();

  constructor (
                public dialog: MatDialog,
                private params: NavParams,
                public userService: UserServiceProvider,
                public PRService: PRServiceProvider,
                private departmentService: DepartmentServiceProvider,
                private accountService: AccountServiceProvider,
                private supplierService: SupplierServiceProvider,
                public modal: ModalController
              ) {
                super({ service: PRService });
            }

  ngOnInit() {
    
    this.load(this.params.get('oEntityOrId'));
  
    this.departmentService.loadEntities().subscribe(oResult => {
      this.departments = oResult.Result;
    });

    this.accountService.loadEntities().subscribe(oResult => {
      this.accounts = oResult.Result;
    });

    this.userService.getPage(0, 1,'?Role=Department Manager&Role=General Manager').subscribe(oResult => {
      this.users = oResult.Result;
    });

    this.supplierService.loadEntities().subscribe(oResult => {
      this.suppliers = oResult.Result;
    });

    let PurchaseRequestKey: number;
      if (this.params.get('oEntityOrId') > 0) {
        PurchaseRequestKey = this.params.get('oEntityOrId');
      } else {
        PurchaseRequestKey = this.params.get('oEntityOrId').id;
      }
    // this.suppliers = this.myControl.valueChanges.pipe(
    //     startWith(''), map(val => this.filter(val))
    //   );
    }
  // filter(val: string): string[] {
  //   return this.suppliers.filter(option =>
  //     option.toLowerCase().includes(val.toLowerCase()));
  // }
   
  displayStatusBar(status:string){
    switch (status) {
      case "Created":
        return 10
      case "Pending":
        return 20;
      case "DM Quote":
      case "GM Quote":
        return 40;
      case "MRO Quoted":
        return 60;
      case "PM Approved":
        return 70;
      case "DM Approved":
      case "GM Approved":
        return 90;
      case "DM Rejected":
      case "GM Rejected":
        return 90;
      case "Finalized":
        return 100;
      default:
        return 0;
    }
  }


  getSupplier1Sum() {
    if (this.baseEntity && this.baseEntity.PRLines) {
      return this.baseEntity.PRLines.reduce(function (currentValue, item) {
        if (item.PriceEach && item.Qty) {
          return currentValue + (item.PriceEach * item.Qty);
        } else {
          return currentValue;
        }
      }, 0);
    } else {
      return 0;
    }
  }

  getSupplier2Sum() {
    if (this.baseEntity && this.baseEntity.PRLines) {
      return this.baseEntity.PRLines.reduce(function (currentValue, item) {
        if (item.PriceEach2 && item.Qty) {
          return currentValue + (item.PriceEach2 * item.Qty);
        } else {
          return currentValue;
        }
      }, 0);
    } else {
      return 0;
    }
  }

  getSupplier3Sum() {
    if (this.baseEntity && this.baseEntity.PRLines) {
      return this.baseEntity.PRLines.reduce(function (currentValue, item) {
        if (item.PriceEach3 && item.Qty) {
          return currentValue + (item.PriceEach3 * item.Qty);
        } else {
          return currentValue;
        }
      }, 0);
    } else {
      return 0;
    }
  }

  getCurrentRole() {
    return this.userService.LoggedUser.Roles;
  }

  getLockedStatus() {
    
    let status = this.baseEntity.ApprovalStatus;
    let role = this.userService.LoggedUser.Roles;
    if (status == "Created" || status == "Pending" || status == "Rejected") return false;
    
    switch(role) {
      // User takes validation above
      case "User":
        if (status == "Created" || status == "Pending" || status == "DM Rejected" || status == "GM Rejected" ) return false;
        break;
      case "MRO":
        if (status == "MRO Quote" || status == "PM Rejected" || status == "DM Quote"
         || status == "GM Quote" || status == "DM Quote Approved" || status == "GM Quote Approved") return false;
        break;
      case "Purchasing Manager":
        if (status == "MRO Quoted" || status == "PM Approved" || status == "DM Quote Rejected" || status == "GM Quote Rejected") return false;
        break;
      case "Department Manager":
        if (status == "Pending" || status == "Quoted" || status == "DM Rejected" || status == "GM Rejected" || status == "PM Approved") return false;
        break;
      case "General Manager":
        if (status == "Pending" || status == "GM Quote" || status == "GM Rejected" || status == "PM Approved") return false;
        break;
      case "Project Manager":
        if (status == "DM Approved" || status == "Project Manager Rejected") return false;
        break;
      case "Administrator":
        return false;
      }  
    return true;
  }
  
  getSupplier1Style() {
    if (this.baseEntity.SupplierSelectedKey && this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier1Key) {
      return 'SupplierSelected';
    }
  }

  getSupplier2Style() {
    if (this.baseEntity.SupplierSelectedKey && this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier2Key) {
      return 'SupplierSelected';
    }
  }

  getSupplier3Style() {
    if (this.baseEntity.SupplierSelectedKey && this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier3Key) {
      return 'SupplierSelected';
    }
  }

  handleDynamicRows(arrRows: Array<any>) {
    if (arrRows.length > 0) {
      let atLeastOneCellFilled = false;
      let lastRow = arrRows[arrRows.length - 1];
      for (let prop in lastRow) {
        if (lastRow.hasOwnProperty(prop)) {
          if (prop == 'id') {
            continue;
          }
          if (lastRow[prop] !== null && lastRow[prop] !== undefined && (lastRow[prop] > 0 || lastRow[prop].length > 0)) {
            atLeastOneCellFilled = true;
            break;
          }
        }
      }
      if (!atLeastOneCellFilled) {
        return;
      }
    }
    arrRows.push({});
  };

  on_supplier_select() {
    this.baseEntity.editMode = true;
    this.baseEntity.SupplierSelectedKey = null;
  }

  on_department_change(departmentKey) {
    let department = this.departments.find(d => d.id == this.baseEntity.DepartmentKey);
    this.baseEntity.DepartmentManagerKey = department.ManagerKey;
    this.baseEntity.DepartmentKey = department.id;
  }

  openModal() {
    let currentDepartment = this.departments.find(d => d.id == this.baseEntity.DepartmentKey);
    let price = 0;
    if (this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier1Key) {
      price = this.getSupplier1Sum();
    } else if (this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier2Key) {
      price = this.getSupplier2Sum();
    } else if (this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier3Key) {
      price = this.getSupplier3Sum();
    }

    if (currentDepartment && currentDepartment.Budget && currentDepartment.Budget >= price) {
      this.dialog.open(ApprovalFormComponent, {
        data: {
          oEntityOrId: this.approval ? this.approval.id : { PurchaseRequestKey: this.baseEntity.id },
          PurchaseRequestKey: this.baseEntity.id,
          ManagerAssigned: this.baseEntity.DepartmentManagerKey
        }, width: '700px'
      });
    } else {
      this.dialog.open(ApprovalFormComponent, {
        data: {
          oEntityOrId: this.approval ? this.approval.id : { PurchaseRequestKey: this.baseEntity.id },
          PurchaseRequestKey: this.baseEntity.id,
          ManagerAssigned: this.baseEntity.GeneralManagerKey
        }
      });
    }
  }

  getApprover() {
    let currentDepartment = this.departments.find(d => d.id == this.baseEntity.DepartmentKey);
    let price = 0; 

    if ( this.baseEntity.Requisitor && this.baseEntity.Requisitor.Role && this.baseEntity.Requisitor.Role == "Department Manager"){
        return this.baseEntity.GeneralManagerKey;
    }
 

    if (this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier1Key) {
      price = this.getSupplier1Sum();
    } else if (this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier2Key) {
      price = this.getSupplier2Sum();
    } else if (this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier3Key) {
      price = this.getSupplier3Sum();
    }

    if (currentDepartment && currentDepartment.Budget && currentDepartment.Budget >= price) {
      return this.baseEntity.DepartmentManagerKey;
    } else {
      return this.baseEntity.GeneralManagerKey
    }
  }

  getApproverByKey(id:number){
    return this.users.find(u => u.UserKey == id);
  }

  newSupplier() {
    let dialog = this.dialog.open(SupplierFormComponent, {
      data: { oEntityOrId: null }
    });

    dialog.afterClosed().subscribe(result => {
      this.supplierService.loadEntities().subscribe(oResult => {
        this.suppliers = oResult.Result;
      });
    });
  }

  print() {
    window.open("reports/purchase-request.html");
  }

  removeItemLocally = function (index) {
    this.baseEntity.PRLines.splice(index, 1);
  }

  selectSupplier1() {
    this.baseEntity.editMode = true;
    this.baseEntity.SupplierSelectedKey = this.baseEntity.Supplier1Key;
  }

  selectSupplier2() {
    this.baseEntity.editMode = true;
    this.baseEntity.SupplierSelectedKey = this.baseEntity.Supplier2Key;
  }

  selectSupplier3() {
    this.baseEntity.editMode = true;
    this.baseEntity.SupplierSelectedKey = this.baseEntity.Supplier3Key;
  }

  afterLoad() {
    if (this.baseEntity) {
      this.handleDynamicRows(this.baseEntity.PRLines);
    }
    if (!this.baseEntity.ConvertedDateDepartmentManager){
      this.baseEntity.ConvertedDateDepartmentManager = new Date();
    }
  }

  afterCreate() {
    if (this.baseEntity) {
      this.handleDynamicRows(this.baseEntity.PRLines);
    }
    this.baseEntity.RequisitionName = this.userService.LoggedUser.UserName;
    this.baseEntity.ConvertedDateDepartmentManager = new Date();
  }

  afterRemove() {
  }

  beforeSave(){
    
  }

  afterSave() {
    this.handleDynamicRows(this.baseEntity.PRLines);
  }

  save() {
      return this.baseEntity.api_attachments.uploadFiles().then(response => {
        return super.save();
      });
  }


}

