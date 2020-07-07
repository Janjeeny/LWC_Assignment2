import { LightningElement, wire, track, api } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import { getRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { updateRecord } from "lightning/uiRecordApi";


import NAME_FIELD from "@salesforce/schema/Account.Name";
import PHONE_FIELD from "@salesforce/schema/Account.Phone";
import WEBSITE_FIELD from "@salesforce/schema/Account.Website";
import SITE_FIELD from "@salesforce/schema/Account.Site";
import ACCNUMBER_FIELD from "@salesforce/schema/Account.AccountNumber";
import ID_FIELD from "@salesforce/schema/Account.Id";

export default class LdsDetailComponent extends LightningElement {
    @api recordid;
    @track isViewMode = true;
    @track showLoading = false; //to load spinner.
    @track account;


    @wire(CurrentPageReference) pageRef;

    //Wire Adapter to get details of the record for the passed ID.
    @wire(getRecord, {
        recordId: "$recordid",
        fields: [
            NAME_FIELD,
            ID_FIELD,
            PHONE_FIELD,
            WEBSITE_FIELD,
            SITE_FIELD,
            ACCNUMBER_FIELD

        ]
    })
    accountRec(response) {
        
        this.account = response;
        this.showLoading = false;

    };

    //Handles the event fired from cardComponent and rootParent
    connectedCallback() {
        registerListener("eventdetails", this.fetchAccount, this);
        registerListener("closeLDSForm", this.closeForm, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    //method called by event handler to show detail of an Acocunt
    fetchAccount(AccId) {
        if (this.recordid != AccId) {
            this.showLoading = true;
            this.recordid = AccId;
            this.isViewMode = true;

        }


    }

    //method called by event handler to close the LdsForm
    closeForm() {
        this.account = '';
    }


    //function called on click of edit button
    updateAccount() {
        this.isViewMode = !this.isViewMode;
    }

    //function called on click of save button
    saveAccount() {
        
        this.showLoading = true;
        var fields = {};
        fields[ID_FIELD.fieldApiName] = this.account.data.fields.Id.value;
        fields[NAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='Name']").value;
        fields[PHONE_FIELD.fieldApiName] = this.template.querySelector("[data-field='Phone']").value;
        fields[WEBSITE_FIELD.fieldApiName] = this.template.querySelector("[data-field='Website']").value;
        fields[SITE_FIELD.fieldApiName] = this.template.querySelector("[data-field='Site']").value;
        fields[ACCNUMBER_FIELD.fieldApiName] = this.template.querySelector("[data-field='AccNumber']").value;

        var recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Success",
                        message: "Account updated",
                        variant: "success"
                    })
                );
                this.isViewMode = true;
                this.showLoading = false;    
                //firing the event to refresh the details on cardComponent
                fireEvent(this.pageRef, "updateSearchResults", '');

            })
            .catch((error) => {
                console.log(error);
                this.showLoading = false;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Error creating record",
                        message: error,
                        variant: "error"
                    })
                );
            });
    }

}