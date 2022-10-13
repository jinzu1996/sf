import { LightningElement,api,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFields from '@salesforce/apex/FieldsetControllerRecordForm.getFields1';
export default class Customdetailpage extends LightningElement 
{
    @api objectName;//Pass
    @api fg;
    @api sf;
    @api recordId = '0015i000006x6ylAAA';
    @api fieldSet; //Pass
    fields = [];
    @api column;  //Pass
    isReadOnly = true;

   // recordId = '0015i000006x6ylAAA';
   handleEditField(event)
   {
    event.preventDefault();
    this.isReadOnly = false;
   }

    handleSuccess(event)
    {
        this.isReadOnly = true;
    }

    connectedCallback()
    {
        getFields({ objectAPIName:this.fg, fieldSetAPIName:this.sf})
        .then(result => {
            if (result) {
                this.fields = result;
                this.error = undefined;
            }
        }) .catch(error => {
            console.log(error);
            this.error = error;
        }); 
    }
    renderedCallback() 
    {
        this.sizeClass = `slds-size_1-of-${this.column}`;
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