import { LightningElement, api, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/SearchAccounts.getAccounts';
import { registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import { refreshApex } from '@salesforce/apex';

export default class SearchResults extends LightningElement {
    @track showLoading;
    @track message;
    @api selectedPicklist;
    @wire(CurrentPageReference) pageRef;
    AccountList;

    //calling the Apex to fetch the accounts for selected pick val
    @wire(getAccounts, { searchTerm: '$selectedPicklist' }) AccountsListCallback(result) {
        
        this.message = result.data && result.data.length <= 0 ? 'No Records to display' : result.error;
        this.AccountList = result.data && result.data.length > 0 ? result : '';
        this.showLoading = false;
    };

    //to show the loading symbol while waiting for server response.
    @api Loading() {
        this.showLoading = true;
        this.AccountList = '';
        this.message = '';
    }

    connectedCallback() {
        //handling the Event fired from the componet ldsDetailComponet
        registerListener("updateSearchResults", this.updateSearchResults, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    //to refresh the Apex results
    updateSearchResults(event) {
        return refreshApex(this.AccountList);
    }

}