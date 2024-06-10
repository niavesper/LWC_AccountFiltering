import { LightningElement, api, track } from 'lwc';

export default class BusinessDetailsPopup extends LightningElement {
    @track isVisible = false;
    @track business = {};

    @api
    show(business) {
        this.business = business;
        this.isVisible = true;
    }

    closePopup() {
        this.isVisible = false;
    }
}