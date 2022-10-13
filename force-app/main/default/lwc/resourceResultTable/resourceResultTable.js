import { LightningElement,api } from 'lwc';

export default class ResourceResultTable extends LightningElement {
    @api showResultChild=[];   
    @api childShowVertical;
    readMoreAction(event){
        //Now event.target.value holds the selected resource on readmore click.
        console.log('read more>>'+JSON.stringify(event.target.value));

        const showResourceDetailEvent = new CustomEvent('showresourcedetail', {
                                                detail: {
                                                    resRec:event.target.value
                                                }
                                                });                                                    
        this.dispatchEvent(showResourceDetailEvent);

        
    }
}