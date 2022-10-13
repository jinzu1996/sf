import { LightningElement, wire,api } from 'lwc';
import { CurrentPageReference }  from 'lightning/navigation';
import getResourceDetail from '@salesforce/apex/resourceSearchController.getResourceDetails';

export default class ResourceDetailPage extends LightningElement {
    @api childSelResRec; //
    @api childresourceDetailNavagationToNewTab;
    resId;
    resourceDetail;
    PublishedDate;
    getHelpPage = false;// Helps to display gethelp form
    

    @wire(CurrentPageReference)
    currentPageReference;

    connectedCallback() { 
        this.resId = this.currentPageReference.state.resId;
        if(this.currentPageReference.state.newTab){
            this.childresourceDetailNavagationToNewTab = this.currentPageReference.state.newTab;
        }
        console.log('resId>>'+ this.resId);
        if (this.resId == null){
            this.resId = this.childSelResRec;
        }
        this.getResourceDetails();
    }

    getResourceDetails(){
        getResourceDetail({resourceId : this.resId})
            .then((result) => {
                console.log('getResourceDetail>>'+JSON.stringify(result));
                this.resourceDetail = result[0];
                //
                //this.resourceDetail.CreatedDate = this.resourceDetail.CreatedDate.split('T')[0];
                this.PublishedDate = this.resourceDetail.CreatedDate.split('T')[0];

            })
            .catch((error) => {
                console.log('getResourceDetail Failed>>'+JSON.stringify(error));
            });
    }

    goToResourcePage(){
        console.log('goToResourcePage');

        const showResourceMainPageEvent = new CustomEvent('showresourcemainpageevent');                                                    
        this.dispatchEvent(showResourceMainPageEvent);
    }

    getHelpHandler(){
        console.log('getHelpHandler Code, needs to be added.');
        this.getHelpPage = true;
        this.childresourceDetailNavagationToNewTab = '';
    }
}