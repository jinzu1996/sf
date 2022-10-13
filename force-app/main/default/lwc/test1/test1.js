import { LightningElement,api,wire,track } from 'lwc';
import getForm from '@salesforce/apex/FieldSetController.getForm';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFields from '@salesforce/apex/FieldsetControllerRecordForm.getFields1';

export default class Test1 extends LightningElement 
{
    @track contactColumns = [
        { label: 'CONTACT NAME', fieldName: 'LinkName', type: 'url', typeAttributes: { label: { fieldName: 'Name' }, target: '_top' } },
        { label: 'Title', fieldName: 'Title', type: 'text' },
        { label: 'Email', fieldName: 'Email', type: 'email' },
        { label: 'Phone', fieldName: 'Phone', type: "phone" }
    ];

    accountId = '0015i000006x6ylAAA';//0015i000006x6ylAAA
    customActions = [{ label: 'Custom action', name: 'custom_action' }]
    @api col;
    @api objectName = 'Account';
    @api fontFamily = 'Cursive';
    @api recordId = '0015i000006x6ylAAA';
    @api fieldSet = 'test';
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
    @api
    customHandler() {
        alert("It's a custom action!")
    }

    connectedCallback()
    {
        getFields({ objectAPIName:this.objectName, fieldSetAPIName:this.fieldSet})
        .then(result => {
            if (result) {
                this.fields = result;
                this.error = undefined;
                // alert(JSON.stringify(this.fields));
            }
        }) .catch(error => {
            console.log(error);
            this.error = error;
        }); 
    }
    renderedCallback() 
    {
      //  this.sizeClass = `slds-size_1-of-${this.column}`;
      this.sizeClass = `slds-size_1-of-2`;

        this.template.querySelectorAll('.men').forEach(element => {
            element.style.fontFamily = this.fontFamily;
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