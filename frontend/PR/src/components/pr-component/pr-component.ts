import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { FormController } from '../../services/FormController';
import { PRServiceProvider } from '../../providers/pr-service';
import { UserServiceProvider } from '../../providers/user-service';
import { SupplierServiceProvider } from '../../providers/supplier-service';
import { DepartmentServiceProvider } from '../../providers/department-service';
import { AccountServiceProvider } from '../../providers/account-service';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { MatDialog } from '@angular/material';
import { ApprovalFormComponent } from '../approval-form-component/approval-form-component';
import { AccountFormComponent } from '../account-form-component/account-form-component';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { SupplierFormComponent } from '../supplier-form-component/supplier-form-component';

@Component({
  selector: 'pr-component',
  templateUrl: 'pr-component.html'
})
export class PRComponent extends FormController implements OnInit {
  accounts = [];
  departments = [];
  suppliers = [];
  users = [];
  approval: any;
  userRole: string;
  currencies = ['Dlls', 'Mxn'];

  constructor(
    public dialog: MatDialog,
    public listService: PRServiceProvider,
    private params: NavParams,
    public userService: UserServiceProvider,
    private departmentService: DepartmentServiceProvider,
    private accountService: AccountServiceProvider,
    private approvalService: ApprovalServiceProvider,
    private supplierService: SupplierServiceProvider,
    public modal: ModalController
  ) {
    super({ service: listService });
  }

  ngOnInit() {
    this.load(this.params.get('oEntityOrId'));

    this.departmentService.loadEntities().subscribe(oResult => {
      this.departments = oResult.Result;
    });

    this.accountService.loadEntities().subscribe(oResult => {
      this.accounts = oResult.Result;
    });

    this.userService.loadEntities().subscribe(oResult => {
      this.users = oResult.Result;
    });

    this.supplierService.loadEntities().subscribe(oResult => {
      this.suppliers = oResult.Result;
    });

    this.approvalService.getSingleWhere('PurchaseRequestKey', this.params.get('oEntityOrId'))
      .subscribe(oResponse => {
        this.approval = oResponse.Result;
      });

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
    this.save().subscribe(function () {

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
    });
  }

  getApprover() {
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
      return this.baseEntity.DepartmentManagerKey;
      
    } else {
        return  this.baseEntity.GeneralManagerKey
    }
  }

  newSupplier() {
    let dialog = this.dialog.open(SupplierFormComponent, {
      data: { oEntityOrId: null}
    });

    dialog.afterClosed().subscribe(result => {
      this.supplierService.loadEntities().subscribe(oResult => {
        this.suppliers = oResult.Result;
      });
    });
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

  afterSave() {
    this.handleDynamicRows(this.baseEntity.PRLines);
  }


}

