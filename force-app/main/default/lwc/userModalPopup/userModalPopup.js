import { LightningElement, api } from 'lwc';

export default class UserModalPopup extends LightningElement {
    @api ismodalopen ;
    @api deletefilename;
    @api ismodalmultipleopen;
    @api isduplicatefilemodalopen;
    @api duplicatefilename;
    
    closeModal() {
        
        this.dispatchEvent(new CustomEvent('closemodal'));
    }
    deleteFile() {
        
            this.dispatchEvent(new CustomEvent('deletefile'));
       
        
    }
    replaceFile(){
        this.dispatchEvent(new CustomEvent('replacefile'));

    }
    
    
}