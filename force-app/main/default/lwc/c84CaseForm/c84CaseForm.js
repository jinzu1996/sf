import { LightningElement, api } from 'lwc';

export default class C84CaseForm extends LightningElement {
    @api title;
    @api titleColor;
    @api labelColor;

    renderedCallback() {
        this.template.querySelector('[data-id="title"]').style.color = this.titleColor;

        this.template.querySelectorAll('lightning-input-field').forEach(element => {
            element.style.color = this.labelColor;
        });
    }
}