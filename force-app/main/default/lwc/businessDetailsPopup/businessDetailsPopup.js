import { LightningElement, api, track } from 'lwc';

export default class BusinessDetailsPopup extends LightningElement {
    @track isVisible = false; 
    @track business = {}; 
    @track billingAddress = {}; 

    @api 
    show(business) {
        if (!business || !business.Name) {
            this.showErrorMessage('Invalid business details provided');
            this.isVisible = false;
            this.business = {};
            this.billingAddress = {};
            return;
        }

        console.log('Business Object:', JSON.stringify(business));
    
        this.business = business;
        this.billingAddress = {
            street: business.BillingStreet || '',
            city: business.BillingCity || '',
            state: business.BillingState || '',
            postalCode: business.BillingPostalCode || '',
            country: business.BillingCountry || ''
        };
        this.isVisible = true;
        this.template.querySelector('.popup').focus();
    }

    closePopup() {
        this.isVisible = false; 
        this.business = {}; 
        this.billingAddress = {};
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

    get googleMapsLink() {
        if (this.billingAddress) {
            const { street, city, state, postalCode, country } = this.billingAddress;
            const address = `${street}, ${city}, ${state} ${postalCode}, ${country}`;
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim().replace(/\s\s+/g, ' '))}`;
        }
        return '';
    }
}
