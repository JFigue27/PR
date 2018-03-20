import { CRUDFactory } from './CRUDFactory';
import { IEntity } from './IEntity';
import { Observable } from 'rxjs/RX';
import alertify from 'alertifyjs';

interface IConfigListController {
    service: CRUDFactory;
    paginate?: boolean;
    limit?: number;
    filters?: string;
}

export abstract class ListController {
    protected isLoading: boolean = false;
    protected baseList: Array<IEntity>;
    protected staticQueryParams: string='';

    constructor(public config: IConfigListController ) {
        this.config.paginate = config.paginate == undefined ? true: this.config.paginate;
        this.config.limit = config.limit || 0;
        this.config.filters = config.filters || '';
        if (config.paginate == false){
            this.config.limit = 0;
        }
    }

    //Start List Methods
    clearFilters() {
    }

    checkItem() {
    }

    createInstance() {
    }

    getSelected() {
    }

    getSelectedCount() {
    }

    load(staticQueryParams?) {
        this.staticQueryParams = staticQueryParams;
        this.updateList();   
    }

    makeQueryParameters() {
        let result = '?';
        result += this.staticQueryParams || '';
        return result;
    }

    openItem(oEntity) {
        var theArguments = Array.prototype.slice.call(arguments);
        this.onOpenItem.apply(this, theArguments);
    }

    pageChanged() {
    }

    persistFilter() {
    }

    refresh() {
    }

    removeItem(user) {
        let self = this;
        alertify.confirm('Are you sure you want to delete this user ' + user.Value + ' ?',
            function () {
                self.config.service.removeEntity(user.UserKey).subscribe(results => {
                    alertify.success('User succesfully deleted');
                    self.afterRemove();
                }
                );
            },
            function () {
                alertify.error('Cancel');
            });

    }

    removeSelected() {
    }

    selectAll() {
    }

    setFilterOptions() {
        // this.load();
    }

    saveItem(item) {
        this.config.service.save(item).subscribe(oEntity => {
            alertify.success('SUCCESFULLY SAVED');
            return Observable.empty();
        });
    }

    save() {
    }

    undoItem() {
    }

    updateList() {
        this.isLoading = true;
        let queryParameters = this.makeQueryParameters();

        return this.config.service.getPage(this.config.limit, 1, queryParameters ).subscribe(oResult => {
            this.baseList = oResult.Result;
            this.afterLoad();
            this.isLoading = false;
        });
        
    }

    unSelectAll() {
    }
    //End List Methods


    //Start List Events
    on_input_change(oItem: IEntity) {
        oItem.editMode = true;
    }
    //End List Events


    //Start Hooks
    abstract afterLoad();

    abstract onOpenItem(oEntity);

    abstract afterRemove();

    abstract afterCreate();
    //End Hooks
}