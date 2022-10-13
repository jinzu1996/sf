import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchFields from '@salesforce/apex/FieldSetController.fetchFields';
 
export default class CustomHighlightPanel extends LightningElement {
 
    @api recordId;
    @api objectApiName;
    @api fieldSet;
    nameField = '';
    fieldList = [];
 
    connectedCallback() {
        fetchFields({
            recordId : this.recordId,
            objectName : this.objectApiName,
            fieldSetName : this.fieldSet
        }).then(result => {
            if(result) {
                console.log(result);
                if(result.message != undefined) {
                    this.showToast('Error', 'error', result.message);
                    return;
                }
                this.nameField = result.nameField;
                this.fieldList = result.fieldsAPI;
            }
        }).catch(error => {
            if(error && error.body && error.body.message) {
                this.showToast('Error', 'error', error.body.message);
            }
        });
    }
 
    showToast(title, variant, message) {
        const event = new ShowToastEvent({
            title: title,
            variant: variant,
            message: message,
        });
        this.dispatchEvent(event);
    }
}