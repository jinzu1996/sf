import { LightningElement, api } from 'lwc';

export default class ResourceHeader extends LightningElement {
    @api childPageHeader;
    @api childPageTitle;
    @api childShowVertical;
}