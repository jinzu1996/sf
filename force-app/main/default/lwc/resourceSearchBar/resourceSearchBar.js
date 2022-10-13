import { LightningElement, wire, api } from 'lwc';
import resourceSearch from '@salesforce/apex/resourceSearchController.resourceSearch';
const DELAY = 400;

export default class ResourceSearchBar extends LightningElement {

    @api childPhSearchBox;
    @api searchString = '';
    resourceList = [];
    objName = 'Lead';

    handleStringSearch(event){
        console.log('Event0>>');
        console.log('Event1>>'+event);
        console.log('Event2>>'+event.target);
        console.log('Event3>>'+event.target.value);
        window.clearTimeout(this.delayTimeout);        
        this.searchString = event.target.value;

        this.delayTimeout = setTimeout(() => {
            const searchEvent = new CustomEvent('getsearchvalue', { 
                                        detail: {userSearchInput:this.searchString} 
                                    });
            this.dispatchEvent(searchEvent);
        }, DELAY);

    }

   /* @wire(resourceSearch, { searchName: '$searchString' })
    wiredResorceList({error, data}) {
        if (data) {
            this.resourceList = data;
            console.log('Success>>'+JSON.stringify(data));
        }
        else if (error){
            console.log('Error');
        }
    }*/
}