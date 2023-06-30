import { LightningElement, wire } from 'lwc';
import ursusResources from '@salesforce/resourceUrl/ursus_park';
/** BearController.searchBears(searchTerm) Apex method */
import searchBears from '@salesforce/apex/BearController.searchBears';
import { publish, MessageContext } from 'lightning/messageService';
import BEAR_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/BearListUpdate__c';

import { NavigationMixin } from 'lightning/navigation';

export default class BearList extends NavigationMixin(LightningElement) {
    searchTerm = '';
    bears;
    @wire(MessageContext) messageContext;

    connectedCallback(){
        console.log('==========> Mess con <----');
        console.log(this.messageContext);
        console.log("+++++++++++++");
        console.log(BEAR_LIST_UPDATE_MESSAGE);
        console.log("_______________________");
    }

	@wire(searchBears, {searchTerm: '$searchTerm'})
	loadBears(result) {
        this.bears = result;
        if (result.data) {
          const message = {
            bears: result.data
          };
          
          publish(this.messageContext, BEAR_LIST_UPDATE_MESSAGE, message);
        }
    }
	appResources = {
		bearSilhouette: `${ursusResources}/standing-bear-silhouette.png`,
	};
    handleSearchTermChange(event) {
		// Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
	}
	get hasResults() {
		return (this.bears.data.length > 0);
	}

    handleBearView(event) {
		// Get bear record id from bearview event
		const bearId = event.detail;
		// Navigate to bear record page
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: bearId,
				objectApiName: 'Bear__c',
				actionName: 'view',
			},
		});
	}

}