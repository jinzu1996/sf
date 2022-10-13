import { LightningElement, api, wire, track } from 'lwc';
import getFields from '@salesforce/apex/C84_FormFields.getFields';
import basePath from '@salesforce/community/basePath';
import successIcon from '@salesforce/resourceUrl/SuccessIcon';

export default class C84Form extends LightningElement {
    @api title;
    @api objectAPIName;
    @api fieldSetAPIName;
    @api requiredFields = '';
    @api column;
    @api submitButtonLabel;
    @api submitButtonColor;
    @api cancelButtonLabel;
    @api cancelButtonColor;

    @track fields;
    successIconURL = successIcon;
    isSuccess = false;

    formPageURL = basePath;

    sizeClass;
    submitButtonClass = 'slds-p-left_xx-small';
    cancelButtonClass = 'slds-p-right_xx-small';

    @wire(getFields, {objectAPIName : '$objectAPIName', fieldSetAPIName : '$fieldSetAPIName', requiredFields : '$requiredFields' })
    wiredFormFields({ error, data }) {
        if(data) {
            this.fields = data;
            console.log(JSON.stringify(this.fields))
        }
        else if(error) {
            this.fields = [];
            console.log(JSON.stringify(error))
        }
    }

    renderedCallback() {
        this.sizeClass = `slds-size_1-of-${this.column}`;
        this.template.querySelectorAll("lightning-button").forEach(element => {
            console.log(element.name)
            if(element.name == 'submit') {
                element.style.bgColor = this.submitButtonClass;
            }
            if(element.name == 'cancel') {
                element.style.bgColor = this.cancelButtonClass;
            }
        });
    }

    handleSuccess() {
        this.isSuccess = true;
    }
}