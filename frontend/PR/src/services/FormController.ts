import { CRUDFactory } from './CRUDFactory';
import { IEntity } from './IEntity';
import { Observable } from 'rxjs/RX';
import alertify from 'alertifyjs';

interface IConfigFormController {
	service: CRUDFactory;
}

export abstract class FormController {

	protected baseEntity: any = { id: 0, editMode: false };

	constructor(private config: IConfigFormController) {
	}
 
	//Start Form Methods
	createInstance(oEntity?) {
		return this.config.service.createInstance(oEntity).subscribe(oInstance => {
			this.baseEntity = oInstance;
			this.afterCreate();
			return this.baseEntity;
		});
	}

	load(oEntityOrID: any) {
		this.refresh(oEntityOrID);
	}

	refresh(oEntityOrID: any) {
		switch (true) {

			//Open by ID
			case oEntityOrID > 0:
				this.config.service.loadEntity(oEntityOrID)
					.subscribe(oResult => {
						this.baseEntity = oResult.Result
						this.afterLoad();
					});
				break;
			
			//Create instance
			case (!oEntityOrID || (oEntityOrID && (oEntityOrID instanceof Object || typeof (oEntityOrID) == 'object')
					&& !oEntityOrID.hasOwnProperty('id'))):
				this.createInstance(oEntityOrID);
				break;
			
			//Open by Object
			case oEntityOrID instanceof Object || typeof (oEntityOrID) == 'object':
				this.baseEntity = oEntityOrID;
				this.afterLoad();
				break;
			default:
				throw 'Invalid Form Init';
		}
	}

	remove() {
		this.config.service.remove().subscribe(this.afterRemove);
	}

	save() {	
		this.config.service.save(this.baseEntity).subscribe(oEntity => {
			this.afterSave();
			alertify.success('SUCCESFULLY SAVED');
			return Observable.empty();
		});
	}

	undo(id:any) {
		this.config.service.loadEntity(id).subscribe(oResult =>{
			this.baseEntity = oResult.Result;
		});
	}
	//End Form Methods


	//Start Form Events
	on_input_change() {
		this.baseEntity.editMode = true;
	}
	//End Form Events

	//Start Hooks
	abstract afterLoad();

	abstract afterCreate();

	abstract afterSave();

	abstract afterRemove();
	//End Hooks
}