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
	createInstance() {
		return this.config.service.createInstance().subscribe(oInstance => {
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
			case !oEntityOrID:
				this.createInstance();
				break;
			case oEntityOrID > 0:
				this.config.service.loadEntity(oEntityOrID)
					.subscribe(oResult => {
						this.baseEntity = oResult.Result
						this.afterLoad();
					});
				break;
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
		console.log('ENTRE');
		if (this.baseEntity.editMode) {
			return this.config.service.save(this.baseEntity).subscribe(oEntity => {
				this.baseEntity = oEntity;
				this.afterSave();
				alertify.success('Saved successfully');
			});
		}
		return Observable.empty();
	}

	undo() {
		this.baseEntity = this.config.service.getById(this.baseEntity.id);
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