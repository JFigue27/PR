import { Component, OnInit } from '@angular/core';
import { FormController } from '../../core/FormController';
import { PRService } from '../../services/pr.service';
import { UserService } from '../../services/user.service';
import { SupplierService } from '../../services/supplier.service';
import { DepartmentService } from '../../services/department.service';
import { AccountService } from '../../services/account.service';
import { MatDialog } from '@angular/material';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { SupplierFormComponent } from '../supplier-form/supplier-form-component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OidcService } from '../../core/oidc.service';

@Component({
  selector: 'pr-component',
  templateUrl: 'pr-component.html'
})
export class PRComponent extends FormController implements OnInit {
  private accounts = [];
  private departments = [];
  private suppliers: any = [];
  private users = [];
  public progress: 20;
  public userRole: string;
  public itemsSource: any;
  public currencies = ['Dlls', 'Mxn'];
  myControl: FormControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public userService: UserService,
    public PRService: PRService,
    private departmentService: DepartmentService,
    private accountService: AccountService,
    private supplierService: SupplierService,
    public modal: ModalController,
    private oidc: OidcService
  ) {
    super({ service: PRService });

    this.oidc.onAuthenticationChange = (auth) => {
      if (auth) {
        this.userService.getByUserName(auth.Value).then(oResponse => {
          this.userService.LoggedUser = oResponse.Result;
          this.ngOnInit();
        });
      } else {
        this.userService.LoggedUser = {};
      }
    }

  }

  ngOnInit() {
    if (this.userService.LoggedUser.UserKey) {
      console.log('2018');
      console.log(this.route.snapshot.paramMap.get('id'));
      this.load(this.route.snapshot.paramMap.get('id'));

      this.departmentService.loadEntities().then(oResult => {
        this.departments = oResult.Result;
      });

      this.accountService.loadEntities().then(oResult => {
        this.accounts = oResult.Result;
      });

      this.userService.getPage(0, 1, '?Role=Department Manager&Role=General Manager').then(oResult => {
        this.users = oResult.Result;
      });

      this.supplierService.loadEntities().then(oResult => {
        this.suppliers = oResult.Result;
      });
    }
    // let PurchaseRequestKey: number;
    // if (this.params.get('oEntityOrId') > 0) {
    //   PurchaseRequestKey = this.params.get('oEntityOrId');
    // } else {
    //   PurchaseRequestKey = this.params.get('oEntityOrId').id;
    // }
  }

  displayStatusBar(status: string) {
    switch (status) {
      case "Created":
        return 10;
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
      return this.baseEntity.PRLines.reduce(function(currentValue, item) {
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
      return this.baseEntity.PRLines.reduce(function(currentValue, item) {
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
      return this.baseEntity.PRLines.reduce(function(currentValue, item) {
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
    return this.userService.LoggedUser.Role;
  }

  getLockedStatus() {

    let status = this.baseEntity.ApprovalStatus;
    let role = this.userService.LoggedUser.Role;
    if (status == "Created" || status == "Pending" || status == "Rejected") return false;

    switch (role) {
      // User takes validation above
      case "User":
        if (status == "Created" || status == "Pending" || status == "DM Rejected" || status == "GM Rejected") return false;
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
      case "Finance":
        return false;
      case "Administrator":
        return false;
    }
    return true;
  }

  getSupplierStyle(option: number) {
    if (this.baseEntity.SelectedOption == option) {
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

  // openModal() {
  //   let currentDepartment = this.departments.find(d => d.id == this.baseEntity.DepartmentKey);
  //   let price = 0;
  //   if (this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier1Key) {
  //     price = this.getSupplier1Sum();
  //   } else if (this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier2Key) {
  //     price = this.getSupplier2Sum();
  //   } else if (this.baseEntity.SupplierSelectedKey == this.baseEntity.Supplier3Key) {
  //     price = this.getSupplier3Sum();
  //   }

  //   if (currentDepartment && currentDepartment.Budget && currentDepartment.Budget >= price) {
  //     this.dialog.open(ApprovalFormComponent, {
  //       data: {
  //         oEntityOrId: this.approval ? this.approval.id : { PurchaseRequestKey: this.baseEntity.id },
  //         PurchaseRequestKey: this.baseEntity.id,
  //         ManagerAssigned: this.baseEntity.DepartmentManagerKey
  //       }, width: '700px'
  //     });
  //   } else {
  //     this.dialog.open(ApprovalFormComponent, {
  //       data: {
  //         oEntityOrId: this.approval ? this.approval.id : { PurchaseRequestKey: this.baseEntity.id },
  //         PurchaseRequestKey: this.baseEntity.id,
  //         ManagerAssigned: this.baseEntity.GeneralManagerKey
  //       }
  //     });
  //   }
  // }

  getApprover() {
    let currentDepartment = this.departments.find(d => d.id == this.baseEntity.DepartmentKey);
    let price = 0;

    if (this.baseEntity.Requisitor && this.baseEntity.Requisitor.Role && this.baseEntity.Requisitor.Role == "Department Manager") {
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

  getApproverByKey(id: number) {
    return this.users.find(u => u.UserKey == id);
  }

  newSupplier() {
    let dialog = this.dialog.open(SupplierFormComponent, {
      data: { oEntityOrId: null }
    });

    dialog.afterClosed().subscribe(result => {
      this.supplierService.loadEntities().then(oResult => {
        this.suppliers = oResult.Result;
      });
    });
  }

  print() {
    window.open("reports/purchase-request.html");
  }

  removeItemLocally = function(index) {
    this.baseEntity.PRLines.splice(index, 1);
  }

  selectSupplier(option: number) {
    this.baseEntity.editMode = true;
    this.baseEntity.SelectedOption = option;
  }

  afterLoad() {
    if (this.baseEntity) {
      this.handleDynamicRows(this.baseEntity.PRLines);
    }
    if (!this.baseEntity.ConvertedDateDepartmentManager) {
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

  beforeSave() {
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