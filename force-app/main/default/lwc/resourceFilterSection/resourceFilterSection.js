import { LightningElement,wire,api } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import RESOURCE_OBJECT from '@salesforce/schema/Resource__c';
import CATEGORY_FIELD from '@salesforce/schema/Resource__c.Category__c';
import SUBCATEGORY_FIELD from '@salesforce/schema/Resource__c.Sub_Category__c';

export default class ResourceFilterSection extends LightningElement {
    catSelectedValue = ''; 
    subCatSelectedValue = '';
    catPicklistOptions = [];
    subCatPicklistOptions = [];
    dependedntSubCatOps = [];
    @api childPhCategory;
    @api childPhSubCategory;
    @api childSubmitButtonLabel;
    @api childSubmitButtonColor;
    @api childResetButtonLabel;
    @api childResetButtonColor;
    @api childShowVertical;

    // to get the default record type id, if you dont' have any recordtypes then it will get master
    @wire(getObjectInfo, { objectApiName: RESOURCE_OBJECT })
    resourceMetadata;

    //to get picklist options of controlling field
    @wire(getPicklistValues, { recordTypeId: '$resourceMetadata.data.defaultRecordTypeId', fieldApiName: CATEGORY_FIELD })
    fetchCategoryPicklistValues({ error, data }){
        if (data) {
            try {
                console.log('childShowVertical>>'+this.childShowVertical );
                this.catPicklistOptions = data.values;
            } catch (error) {
                console.error('Could not able to fetch picklist values', error);
            }
        } else if (error) {
            console.error('Could not able to fetch picklist values', error);
        }        
    }

    //to get picklist options of dependent field
    @wire(getPicklistValues, { recordTypeId: '$resourceMetadata.data.defaultRecordTypeId', fieldApiName: SUBCATEGORY_FIELD })
    fetchSubCategoryPicklistValues({ error, data }){
        if (data) {
            try {
                //console.log('data1>>'+JSON.stringify(data) );
                this.subCatPicklistOptions = data.values;
            } catch (error) {
                console.error('Could not able to fetch picklist values1', error);
            }
        } else if (error) {
            console.error('Could not able to fetch picklist values1', error);
        }       
    }

    //to handle changed/selected controlling field value
    catChangeHandler(event) {
        //initialize to hold child values based on on-change controlling field value
        this.dependedntSubCatOps = [];

        //get the selected category value
        this.catSelectedValue = event.detail.value;

        //index of selected value in category picklist field (controlling field) value options
        let indexSelectedCat = '';
        indexSelectedCat = this.catPicklistOptions.findIndex(x => x.value == this.catSelectedValue);
       
        /*Looping over dependent picklist field value options to see if controlling field selected index 
        is listed/contains in the "validFor" tag*/
        for(let subCat of this.subCatPicklistOptions){
            
            if(subCat.validFor.includes(indexSelectedCat)){
                /*if selected controlling field value index in listed in validFor tag of dependent field 
                then add those values to dependent options*/  
                this.dependedntSubCatOps.push(subCat);
            }
        }

        //Only sending category now, as subcategory not selected yet.
        //Only in Horizontal view we need to search on change event.
        if(this.childShowVertical == false ){
            const searchEvent = new CustomEvent('getsearchvalue', {
                detail: {
                            cat:this.catSelectedValue,
                            subCat: ''
                        }
                });
            this.dispatchEvent(searchEvent);
        }
    }

    //to handle changed/selected dependent field value
    subCatChangeHandler(event){
        //get the selected sub-category value
        this.subCatSelectedValue = event.detail.value;
        
        //Only in Horizontal view we need to search on change event.
        if(this.childShowVertical == false ){
            const searchEvent = new CustomEvent('getsearchvalue', {
                detail: {
                            cat:this.catSelectedValue, 
                            subCat: this.subCatSelectedValue
                        }
                });
            this.dispatchEvent(searchEvent);
        }
        
    }

    handleSubmit(event){
        
        const searchEvent = new CustomEvent('getsearchvalue', {
                                    detail: {
                                                cat:this.catSelectedValue, 
                                                subCat: this.subCatSelectedValue
                                            }
                                    });
        this.dispatchEvent(searchEvent);

    }

    handleReset(event){
        console.log('In HandleReset>>');
        this.catSelectedValue = ''; 
        this.subCatSelectedValue = '';

        const resetEvent = new CustomEvent('resetevent', { detail: {} });
        this.dispatchEvent(resetEvent);
    }

}