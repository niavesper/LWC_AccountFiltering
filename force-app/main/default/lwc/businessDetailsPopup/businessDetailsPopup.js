/**
 * @fileoverview This JS is part of the LWC BusinessDetailsPopup. For more context, 
 * see DTS Salesforce Team Jira issue FORCE-161. This file is grossly overcommented
 * because I am still learning JS and need the comments to help me understand functionality.
 * 
 * This component allows users to:
 * - Display a popup with detailed information about a selected business.
 * - Close the popup by clicking outside of it or on the X inside the popup.
 * - Open Google Maps with the business address in a new tab.
 * - Open URLs for the business website and social meadia accounts
 * 
 * Dependencies:
 * - LWC filterAccountsbyBusinessCategory
 * - Schema objects: Account
 * 
 * Usage:
 * - This component is used to show business details in a popup when a business name is clicked.
 * 
 * Limitations and Considerations:
 * - Ensure that the component is provided with valid business details to display.
 * 
 * Modification History:
 * - @version 1.0: Initial version by Ksenia Choate, 06/14/2024
 */

import { LightningElement, api, track } from 'lwc';

export default class BusinessDetailsPopup extends LightningElement {
    @track isVisible = false; // This property determines whether the popup is visible or not. It is initially set to false.
    @track business = {}; // This property holds the business details object. It is initially an empty object.

    /**
     * @method show
     * @description Displays the popup with the given business details.
     * @param {Object} business - The business object containing details to be displayed in the popup.
     * @returns {void}
     */
    
    @api // This decorator makes the show method a public method that can be called by parent components.
    show(business) {
        if (!business || !business.Name) {
            this.showErrorMessage('Invalid business details provided');
            this.isVisible = false;
            this.business = {};
            return;
        }
        
        this.business = business;
        this.isVisible = true; // Sets the isVisible property to true, making the popup visible.
        this.template.querySelector('.popup').focus(); // Sets the focus to the popup element for accessibility.
    }

    /**
     * @method closePopup
     * @description Hides the popup and clears the business details.
     * @returns {void}
     */
    closePopup() {
        this.isVisible = false; // Sets the isVisible property to false, hiding the popup.
        this.business = {}; // Resets the business property to an empty object.
    }

    /**
     * @method handleDocumentClick
     * @description Handles click events on the document. Closes the popup if the click is outside the popup.
     * @param {Event} event - The event object representing the click event.
     * @returns {void}
     */
    handleDocumentClick = (event) => { // This arrow function is assigned to handle document click events.
        const popup = this.template.querySelector('.popup'); // Selects the popup element.
        if (this.isVisible && popup && !popup.contains(event.target)) { // Checks if the popup is visible, if the popup element exists, and if the click event target is outside the popup.
            this.closePopup(); // Calls the closePopup method to close the popup if the conditions are met.
        }
    }

    /**
     * @method connectedCallback
     * @description Lifecycle hook that is called when the component is added to the DOM. Adds an event listener for document clicks.
     * @returns {void}
     */
    connectedCallback() { // This is a lifecycle hook that runs when the component is added to the DOM.
        document.addEventListener('click', this.handleDocumentClick, true); // Adds an event listener for click events on the document. The third parameter true indicates that the event is captured in the capturing phase.
    }

    /**
     * @method disconnectedCallback
     * @description Lifecycle hook that is called when the component is removed from the DOM. Removes the event listener for document clicks.
     * @returns {void}
     */
    disconnectedCallback() { // This is a lifecycle hook that runs when the component is removed from the DOM.
        document.removeEventListener('click', this.handleDocumentClick, true); // Removes the event listener for click events on the document to prevent memory leaks.
    }

    /**
     * @method openGoogleMaps
     * @description Opens Google Maps in a new tab with the business address.
     * @returns {void}
     */
    openGoogleMaps() { // This method is used to open Google Maps with the address of the business.
        const address = encodeURIComponent(`${this.business.BillingStreet}, ${this.business.BillingCity}, ${this.business.BillingState}, ${this.business.BillingPostalCode}`); // Constructs the address string using the business details and encodes it for use in a URL.
        const url = `https://www.google.com/maps/search/?api=1&query=${address}`; // Constructs the Google Maps search URL with the encoded address.
        window.open(url, '_blank'); // Opens the constructed URL in a new browser tab.
    }
}

