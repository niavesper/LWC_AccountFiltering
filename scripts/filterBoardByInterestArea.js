import { LightningElement, wire, track, api } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import filteredBoards from '@salesforce/apex/getBoardsByInterestArea.filteredBoards';
import BOARD_OBJECT from '@salesforce/schema/Board__c';
import INTEREST_FIELD from '@salesforce/schema/Board__c.Interest_Area__c';
import { NavigationMixin } from 'lightning/navigation';

export default class FilterBoardByInterestArea extends NavigationMixin(LightningElement) {
    
    searchKey = '';
    showData = false;
    newOptions;
    interestAreas = [];
    data = [];
    @track boards;
    defaultValues = [];
    options;
    hasRendered = false;

    /**
     * @method interestAreaOptions
     * @param {object} param0 - The response object containing error and data
     * @description Retrieves the picklist values for the interest area field
     */
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: INTEREST_FIELD })
    interestAreaOptions({ error, data }) {
        if (data) {
            this.options = data.values;
            this.error = undefined;
            let newOptions = [];
            let defaultVal = [];

            // Loop through the picklist values and create options
            for (let i = 0, l = this.options.length; i < l; i++) {
                let option = {};
                option.label = this.options[i].label;
                option.value = this.options[i].value;
                console.log(option.label);
                console.log(option.value);
                defaultVal.push(option.value);
                newOptions.push(option);
            }
            this.options = newOptions;
            this.defaultValues = defaultVal;

            console.log(this.options);
            console.log(this.defaultValues);
        } else if (error) {
            this.error = error;
            this.data = undefined;
            console.log(error);
        }
    }

    /**
     * @method renderedCallback
     * @description Callback function that is called after the component is rendered
     */
    renderedCallback() {
        if (this.hasRendered == false) {
            // Call the filteredBoards Apex method to retrieve the filtered boards
            filteredBoards({ searchkey: this.searchKey })
                .then((result) => {
                    console.log('111' + result);
                    this.boards = result;

                    this.showData = true;
                    console.log(this.boards);
                })
                .catch((error) => {
                    // Display an error toast if the filter cannot be applied
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Unable to apply filter',
                            message: error.body.message,
                            variant: 'error',
                        }),
                    );
                });
            this.hasRendered = true;
        }
    }

    /**
     * @method handleFilterChange
     * @param {object} event - The event object containing the filter change information
     * @description Handles the change event of the filter inputs
     */
    handleFilterChange(event) {
        if (event.target.dataset.type === "searchBar") {
            this.searchKey = event.target.value;
        } else if (event.target.dataset.type = "filter") {
            this.interestAreas = event.detail.value;
        }

        console.log(this.interestAreas);
        // Call the filteredBoards Apex method with the updated search key and filter areas
        filteredBoards({ searchkey: this.searchKey, filterAreas: this.interestAreas })
            .then((result) => {
                console.log('111' + result);
                this.boards = result;

                this.showData = true;
                console.log(this.boards);
            })
            .catch((error) => {
                // Display an error toast if the filter cannot be applied
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Unable to apply filter',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

    /**
     * @method selectAll
     * @param {object} event - The event object
     * @description Selects all interest areas
     */
    selectAll(event) {
        this.interestAreas = this.defaultValues;
        // Call the filteredBoards Apex method with the updated search key and filter areas
        filteredBoards({ searchkey: this.searchKey, filterAreas: this.interestAreas })
            .then((result) => {
                console.log('111' + result);
                this.boards = result;

                this.showData = true;
                console.log(this.boards);
            })
            .catch((error) => {
                // Display an error toast if the filter cannot be applied
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Unable to apply filter',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
        console.log(this.interestAreas);
    }

    /**
     * @method clearAll
     * @param {object} event - The event object
     * @description Clears all selected interest areas
     */
    clearAll(event) {
        this.interestAreas = [];
        // Call the filteredBoards Apex method with the updated search key and filter areas
        filteredBoards({ searchkey: this.searchKey, filterAreas: this.interestAreas })
            .then((result) => {
                console.log('111' + result);
                this.boards = result;

                this.showData = true;
                console.log(this.boards);
            })
            .catch((error) => {
                // Display an error toast if the filter cannot be applied
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Unable to apply filter',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

    /**
     * @method navigateToBoard
     * @param {object} event - The event object
     * @description Navigates to the selected board record page
     */
    navigateToBoard(event) {
        console.log(event.target.dataset.type);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.type,
                objectApiName: BOARD_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }
}