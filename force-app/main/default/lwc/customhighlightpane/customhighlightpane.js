import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchFields from '@salesforce/apex/FieldSetController.fetchFields';
import { loadStyle } from 'lightning/platformResourceLoader';
import CommunityProductCSS from '@salesforce/resourceUrl/CommunityProductCSS';

export default class Customhighlightpane extends LightningElement {
 
    @api recordId;
    @api objectApiName;
    @api fieldSet;
    @api bgColour;
    @api bgColor1;
    @api menuLabelSize1;
    @api menuLabelBold1;
    @api menuLabelColor;
    @api menuLabelColor1;
    @api fontFamily = "Salesforce Sans";

    nameField = '';
    fieldList = [];

    renderedCallback()
    {
        this.template.querySelector('[data-id="navMenu"]').style.backgroundColor = this.bgColour;
        this.template.querySelector('[data-id="navMenu1"]').style.backgroundColor = this.bgColor1;
        // this.template.querySelector('[data-id="menuLabelColor"]').style.Color = this.menuLabelColor;

        this.template.querySelectorAll('.menuLabelColo').forEach(element => {
             element.style.fontFamily = this.fontFamily;
            element.style.color = this.menuLabelColor;
             element.style.fontSize = `${this.menuLabelSize1}px`;
            
            // if(this.menuLabelBold1) 
            // {
            //     element.style.fontWeight = 'bold';
            // }
        });

        this.template.querySelectorAll('.menuLabelColo1').forEach(element => {
             element.style.fontFamily = this.fontFamily;
           element.style.color = this.menuLabelColor1;
        //     element.style.fontSize = `${this.menuLabelSize1}px`;
           
           if(this.menuLabelBold1) 
           {
               element.style.fontWeight = 'bold';
           }
       });

        // this.template.querySelector('[data-id="navMenu"]').style.borderBottom = `2px solid ${this.borderColor}`;
    }

    constructor() {
        super();
        Promise.all([
            loadStyle(this, CommunityProductCSS)
            ]).then(() => {
                //this.isStyleLoaded = true;
            })
            .catch(error => {
                console.log(error.body.message);
        });
    }
 
    connectedCallback() {
        fetchFields({
            recordId : this.recordId,
            objectName : this.objectApiName,
            fieldSetName : this.fieldSet
        }).then(result => {
            if(result) {
                console.log(result);
                if(result.message != undefined) {
                    this.showToast('Error', 'error', result.message);
                    return;
                }
                this.nameField = result.nameField;
                this.fieldList = result.fieldsAPI;
            }
        }).catch(error => {
            if(error && error.body && error.body.message) {
                this.showToast('Error', 'error', error.body.message);
            }
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