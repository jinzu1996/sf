import { LightningElement,api,wire,track } from 'lwc';
import getForm from '@salesforce/apex/FieldSetController.getForm';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFields from '@salesforce/apex/FieldsetControllerRecordForm.getFields1';

export default class Test3 extends LightningElement 
{
    @api col;
    @api objectName;
    @api fontFamily;
    @api recordId = '0015i000006x6ylAAA';
    @api fieldSet;
    fields = [];
    @api column;
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
        getFields({ objectAPIName:this.objectName, fieldSetAPIName:this.fieldSet})
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

        this.template.querySelectorAll('.men').forEach(element => {
            element.style.fontFamily = this.fontFamily;
        //    element.style.color = this.menuLabelColor;
        //     element.style.fontSize = `${this.menuLabelSize1}px`;
           
           // if(this.menuLabelBold1) 
           // {
           //     element.style.fontWeight = 'bold';
           // }
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