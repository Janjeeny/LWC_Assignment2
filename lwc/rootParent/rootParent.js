import { LightningElement, track, wire } from 'lwc';
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from 'lightning/navigation';

export default class RootParent extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track selectedVal;
    oldval;
    //handles the event 'selectvaluechange' fired from picklistSearch comp
    handleSelectValueChange(event) {
        this.selectedVal = event.detail;

        //calling the child method to load spinner while waiting for server results.
        if (this.oldval != this.selectedVal) {
            this.template.querySelector('c-search-results').Loading();
            this.oldval = this.selectedVal;


            //to close ldsDetailComponent 
            fireEvent(this.pageRef, "closeLDSForm", '');
        }
    }

}