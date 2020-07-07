import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from "c/pubsub";

export default class CardComponent extends LightningElement {
    @api accRecord;
    @wire(CurrentPageReference) pageRef;

    //method to fire the PubSub event on button click
    displayRecord() {
        
        fireEvent(this.pageRef, "eventdetails", this.accRecord.Id);
    }



}