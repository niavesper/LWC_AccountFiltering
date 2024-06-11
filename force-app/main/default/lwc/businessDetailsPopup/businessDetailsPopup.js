import { LightningElement, api, track } from 'lwc';

export default class BusinessDetailsPopup extends LightningElement {
    @track isVisible = false;
    @track business = {};


    @api
    show(business) {
        this.business = business;
        this.isVisible = true;
        document.addEventListener('click', this.handleDocumentClick);
    }

    closePopup() {
        this.isVisible = false;
        this.business = {};
    }


    handleDocumentClick = (event) => {
        // Close the popup if the click is outside the popup
        if (!this.template.querySelector('.popup').contains(event.target)) {
            this.closePopup();
        }
    }

    openGoogleMaps() {
        const address = encodeURIComponent(`${this.business.BillingStreet}, ${this.business.BillingCity}, ${this.business.BillingState}, ${this.business.BillingPostalCode}`);
        const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
        window.open(url, '_blank');
      }
}