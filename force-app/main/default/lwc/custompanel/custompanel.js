import { LightningElement,api,track,wire } from 'lwc';
import fetchRecords from '@salesforce/apex/RelatedListController.fetchRecords';
import { NavigationMixin } from 'lightning/navigation';
import {loadStyle} from 'lightning/platformResourceLoader';
import relatedListResource from '@salesforce/resourceUrl/relatedListResource';

export default class Custompanel extends LightningElement 
{
    accountId;
    @api objectApiName;
    @api relatedApiName;
    @api objectName;
    @api fieldSet;
    @api parentObjectName;
    @api fieldName;
    @api fieldValue;
    @api parentFieldAPIName;
    @api recordId;
    @api strTitle;
    @api filterType;
    @api operator;
    @api fieldsList;
    @api relationshipApiName;
    @track field1;
    @track field2;
    @track field3;
    @track field4;
    @track listRecords;
    @track titleWithCount;
    @track countBool = false;

    renderedCallback()
    {
        this.accountId = '0015i000006x6ylAAA';
    }

    connectedCallback() 
    {
        var listFields = this.fieldsList.split( ',' );
        this.field1 = listFields[ 0 ].trim();
        this.field2 = listFields[ 1 ].trim();
        this.field3 = listFields[ 2 ].trim();
        // this.field4 = listFields[ 3 ].trim();
    }

    @track columns = [{
        label: this.field1,
        fieldName: this.field1,
        type: 'text',
        sortable: true
    },
    {
        label: this.field2,
        fieldName: this.field2,
        type: 'text',
    },
    {
        label: this.field3,
        fieldName: this.field3,
        type: 'text',
    }];

    get vals() 
    { 
        return this.recordId + '-' + this.objectName + '-' +  
               this.parentFieldAPIName + '-' + this.fieldName + '-' +  
               this.fieldValue + '-' + this.filterType + '-' + this.operator + '-' + this.fieldsList; 

    } 
     
    @wire(fetchRecords, { listValues: '$vals' }) 
    accountData( { error, data } ) 
    {
        if(data) 
        {
          
            this.listRecords = data.listRecords;

            if ( data.recordCount ) 
            {
               
                if ( data.recordCount > 3 ) 
                {

                    this.titleWithCount = this.strTitle + '(3+)';
                    this.countBool = true;
               
                } 
                else 
                {

                    this.countBool = false;
                    this.titleWithCount = this.strTitle + '(' + data.recordCount + ')';

                }
            }

        }
    }
}