import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import GetAnyAccountRT from '@salesforce/apex/SearchAccounts.GetAnyAccountRT';

import TYPE_FIELD from '@salesforce/schema/Account.Type';

export default class PicklistSearch extends LightningElement {
  
  //wire funcion to get the record type Id from Apex to avoid deployment Issue
  @wire(GetAnyAccountRT) AccRecTypeId;
  
  //wire function to get the picklist values.
  @wire(getPicklistValues, { recordTypeId: '$AccRecTypeId.data', fieldApiName: TYPE_FIELD }) picklistValues;
  currentVal = 'None';

  //called on change of picklist to get the currently selected value
  currentPickVal(event) {
    this.currentVal = event.target.value;
  }

  // function of the button click
  displayAccounts() {
    // Dispatches the event.
    this.dispatchEvent(new CustomEvent("selectvaluechange", {
      detail: this.currentVal
    }));
  }
}