import { LightningElement, api, track } from 'lwc';

export default class BusinessDetailsPopup extends LightningElement {
    @track isVisible = false;
    @track business = {};

    @api
    show(business) {
        this.business = business;
        this.isVisible = true;
        this.template.querySelector('.popup').focus();
    }

    closePopup() {
        this.isVisible = false;
        this.business = {};
    }

    handleDocumentClick = (event) => {
        const popup = this.template.querySelector('.popup');
        if (this.isVisible && popup && !popup.contains(event.target)) {
            this.closePopup();
        }
    }

    connectedCallback() {
        document.addEventListener('click', this.handleDocumentClick, true);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.handleDocumentClick, true);
    }

    openGoogleMaps() {
        const address = encodeURIComponent(`${this.business.BillingStreet}, ${this.business.BillingCity}, ${this.business.BillingState}, ${this.business.BillingPostalCode}`);
        const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
        window.open(url, '_blank');
    }
}

