/**
 * @fileoverview This JS is part of the LWC BusinessDetailsPopup. For more context, 
 * see DTS Salesforce Team Jira issue FORCE-161. This file is grossly overcommented
 * because I am still learning JS and need the comments to help me understand functionality.
 * 
 * This component allows users to:
 * - Display a popup with detailed information about a selected business.
 * - Close the popup by clicking outside of it or on the X inside the popup.
 * - Open Google Maps with the business address in a new tab.
 * - Open URLs for the business website and social meadia accounts in a new tab.
 * 
 * Dependencies:
 * - LWC filterAccountsbyBusinessCategory
 *  
 * Usage:
 * - This component is used to show business details in a popup when a business name is clicked.
 * in the FilterAccountsByBusinessCategory component.
 * 
 * Limitations and Considerations:
 * - Ensure that the component is provided with valid business details to display.
 * 
 * Modification History:
 * - @version 1.0: Initial version by Ksenia Choate, 06/14/2024
 * - @version 1.1: Updated by Ksenia Choate to fix the issue with Google Maps link not working, 07/30/2024
 */

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
