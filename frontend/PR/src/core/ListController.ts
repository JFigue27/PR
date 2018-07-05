import { CRUDFactory } from './CRUDFactory';
// import { IEntity } from './IEntity';
import { Observable } from 'rxjs/RX';
import alertify from 'alertifyjs';

interface IConfigListController {
    service: CRUDFactory;
    paginate?: boolean;
    limit?: number;
    filters?: string;
    filterName?: string;
    sortName?: string;
}

export abstract class ListController {
    protected isLoading: boolean = false;
    protected baseList: Array<any>;
    protected staticQueryParams: string='';
    protected filterOptions:any;
    protected sortOptions: any;
    private filterStorageKey:string;
    private sortStorageKey: string;

    constructor(public config: IConfigListController ) {
        this.config.paginate = config.paginate == undefined ? true: this.config.paginate;
        this.config.limit = config.limit || 20;
        this.config.filters = config.filters || '';
        if (config.paginate == false){
            this.config.limit = 0;
        }
        this.filterStorageKey = config.filterName || 'myFilter';
        this.sortStorageKey = config.sortName || 'mySort';

    }

    //Start List Methods *
    clearFilters() {
        this.filterOptions = { 
            limit: this.config.limit,
            page: 1,
            itemsCount: 0
        }
        this.persistFilter();
    }

    clearSorts() {
        this.sortOptions = {
        }
        this.persistSort();
    }

    checkItem() {
    }

    createInstance() {
        let theArguments = Array.prototype.slice.call(arguments);
        this.config.service.createInstance().subscribe( oNewEntity => {
            theArguments.unshift(oNewEntity);
            this.afterCreate.apply(this, theArguments);
        });
    }

    getSelected() {
    }

    getSelectedCount() {
    }

    load(staticQueryParams?) {
        this.isLoading = true;
        alertify.closeAll();
        this.staticQueryParams = staticQueryParams;
        this.setFilterOptions();
        this.setSortOptions();
        this.updateList();   
    }

    makeQueryParameters() {
        let result = '?';
        
        for(let prop in this.filterOptions){
            if(this.filterOptions.hasOwnProperty(prop)){
                result += prop + '=' + this.filterOptions[prop] + '&';
            }
        }

        for (let prop in this.sortOptions) {
            if (this.sortOptions.hasOwnProperty(prop)) {
                result += 'sort-'+ prop + '=' + this.sortOptions[prop] + '&';
            }
        }
        result += this.staticQueryParams || '';
        return result;
    }

    openItem(oEntity) {
        var theArguments = Array.prototype.slice.call(arguments);
        this.onOpenItem.apply(this, theArguments);
    }

    pageChanged(newPage:any, limit?:number) {
        this.filterOptions.page = newPage;
        if(limit > 0 ){
            this.filterOptions.limit = limit;
        }
        this.updateList();
    }

    //  *
    persistFilter() {
        localStorage.setItem(this.filterStorageKey, JSON.stringify(this.filterOptions));
    }

    persistSort() {
        localStorage.setItem(this.sortStorageKey, JSON.stringify(this.sortOptions));
    }

    //   *
    refresh() {
        if( !this.filterOptions || this.filterOptions.limit == undefined) {
            this.clearFilters();            
        } else {
            this.updateList();
        }
    }

    removeItem(user) {
        let self = this;
        alertify.confirm('Are you sure you want to delete this item ?',
            function () {
                console.log('here')
                self.config.service.removeEntity(user.id).subscribe(results => {
                    alertify.success('Succesfully deleted');
                    self.afterRemove();
                    self.updateList();
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

    
    //  *
    setFilterOptions() {
        this.filterOptions = localStorage.getItem(this.filterStorageKey);

        if (!this.filterOptions) {
            this.clearFilters();
        } else {
            this.filterOptions = JSON.parse(this.filterOptions);
        }
    }
    
    setSortOptions() {
        this.sortOptions = localStorage.getItem(this.sortStorageKey);

        if (!this.sortOptions || this.sortOptions == 'undefined') {
            this.clearSorts();
        } else {
            this.sortOptions = JSON.parse(this.sortOptions);
        }
    }

    saveItem(item) {
        this.config.service.save(item).then(oEntity => {
            alertify.success('SUCCESFULLY SAVED');
            return Observable.empty();
        });
    }

    save() {
    }

    undoItem() {
    }

    // *
    updateList() {
        this.isLoading = true;
        
        if (!this.config.paginate) {
            this.filterOptions.limit = 0;
            this.filterOptions.page = 1;
        }
        let page = this.filterOptions.page;
        let limit = this.filterOptions.limit;
        let queryParameters = this.makeQueryParameters();

        return this.config.service.getPage(limit, page, queryParameters ).subscribe(oResult => {
            this.baseList = oResult.Result;

            this.filterOptions.itemsCount = oResult.AdditionalData.total_filtered_items;
            this.filterOptions.totalItems = oResult.AdditionalData.total_items;
            this.persistFilter();
            this.persistSort();

            for (let i = 0; i < this.baseList.length; i++) {
                let element = this.baseList[i];
                element.itemIndex = (this.filterOptions.page -1) * this.filterOptions.limit + i + 1;
            }

            this.afterLoad();
            this.isLoading = false;
        });
        
    }

    unSelectAll() {
    }
    //End List Methods


    //Start List Events
    on_input_change(oItem: any) {
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