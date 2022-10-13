// import { LightningElement, api, wire, track } from 'lwc';
// import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
// import getNavigationMenuItems from '@salesforce/apex/C84_NavigationMenuItemsController.getNavigationMenuItems';
// import isGuestUser from '@salesforce/user/isGuest';
// import basePath from '@salesforce/community/basePath';
// import { loadStyle } from 'lightning/platformResourceLoader';
// import CommunityProductCSS from '@salesforce/resourceUrl/CommunityProductCSS';
// export default class Formdetail extends LightningElement 
// {
//     @api recordId;
//     @api objectApiName; 
//     @track Accounts;
//     @track Assesments;
//     @track CaseAssesment;
//     @track PatientTouchPoint;
    
//     //Passing Account Record Id
//     @wire(getAccountrec, {accId:'$recordId'})
//     WireAccountRecordsRecords(result)
//     {

//         if(result.data)
//         {
//             console.log('its working')
//             console.log(result.data);
//             //console.log(data.Id);
//             this.Accounts = result.data;

//             console.log('value is'+this.Accounts);
//             this.error = undefined;
//         }
//         else
//         {
//             this.error = result.error; 
//             this.Accounts = undefined;
//         }
//     }
    
// //Passing Account Id to Assessment Record

//     // @wire(getAssessments, {accId:'$recordId'})
//     // WireAssessmentsRecords(result){

//     //     if(result.data){
//     //         console.log('its working')
//     //         console.log(result.data);
//     //         //console.log(data.Id);
//     //         this.Assesments = result.data;

//     //         console.log('value is'+this.Assesments);
//     //         this.error = undefined;
//     //     }else{
//     //         this.error =result.error; 
//     //         this.Assesments =undefined;
//     //     }
//     // }
// }

import { LightningElement,api,wire,track } from 'lwc';
import getForm from '@salesforce/apex/FieldSetController.getForm';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DynamicPageGenerator extends LightningElement 
{
    @api objectName;
    @api recordId;
    @api fieldSet;
    @track fields;

    @track isShow = false;
    
    handleClick(event)
    {
        this.isShow=true;
    }
    handleCancel(event)
    {
        this.isShow = false;
     }

    connectedCallback()
    {
        getForm({ recordId: this.recordId,objectName:this.objectName, fieldSetName:this.fieldSet})
        .then(result => {
            console.log('Data:'+ JSON.stringify(result));
            if (result) {
                this.fields = result.Fields;
                this.error = undefined;
            }
        }) .catch(error => {
            console.log(error);
            this.error = error;
        }); 
    }

    saveClick(e)
    {
        const inputFields = e.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit(inputFields);
    }
    validateFields() {
        return [...this.template.querySelectorAll("lightning-input-field")].reduce((validSoFar, field) => {
            return (validSoFar && field.reportValidity());
        }, true);
    }
    handleSuccess(e)
    {
        this.showMessage('Record Saved Successfully','success');
    }
    handleError(e)
    {
        this.template.querySelector('[data-id="message"]').setError(e.detail.detail);
        e.preventDefault();
    }

    showMessage(message,variant)
    {
        const event = new ShowToastEvent({
            title: 'Record Save',
            variant: variant,
            mode: 'dismissable',
            message: message
        });
        this.dispatchEvent(event);
    }
}