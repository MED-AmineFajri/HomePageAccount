import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'ASAIDPRS', fieldName: 'ASAIDPRS__c' },
    { label: 'BIL_ID', fieldName: 'BIL_ID__c' },
    { label: 'RC', fieldName: 'RC__c' },
    { label: 'ICE', fieldName: 'ICE__c' },
    { label: 'Record Type', fieldName: 'RecordTypeName' }
];

export default class AccountTable extends LightningElement {
    pageSizeOptions = [5, 10, 25, 50, 75, 100];
    totalRecords = 0;
    pageSize;
    totalPages =1;
    pageNumber = 1;
    accounts = [];
    filteredAccounts = [];
    newData = [];

    columns = columns;

    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            data.forEach(element => {
                let rec = {
                    RecordTypeName: element.RecordType.Name,
                };                
                let acc = Object.assign(rec,element);
                console.log(JSON.parse(JSON.stringify(acc)));
                this.newData.push(JSON.parse(JSON.stringify(acc)));
            });
            this.accounts = this.newData;
            this.filteredAccounts = this.newData;
        } else if (error) {
            console.error(error);
        }
    }
    get pageDisableFirst() {
        return this.pageNumber == 1;
    }
    get pageDisableLast() {
        return this.pageNumber == this.totalPages;
    }
    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
     paginationHelper() {
        this.recordsToDisplay = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }
    }

    handleFilterChangeName(event) {
        const filter = event.target.value.toLowerCase();
        this.filteredAccounts = this.accounts.filter(account => 
            account.Name.toLowerCase().includes(filter)
        );
    }
    handleFilterChangeAsa(event) {
        const filter = event.target.value.toLowerCase();
        this.filteredAccounts = this.accounts.filter(account => 
            account.ASAIDPRS__c.toLowerCase().includes(filter)
        );
    }
    handleFilterChangeBil(event) {
        const filter = event.target.value.toLowerCase();
        this.filteredAccounts = this.accounts.filter(account => 
            account.BIL_ID__c.toLowerCase().includes(filter)
        );
    }
    handleFilterChangeRc(event) {
        const filter = event.target.value.toLowerCase();
        this.filteredAccounts = this.accounts.filter(account => 
            account.RC__c.toLowerCase().includes(filter)
        );
    }
    handleFilterChangeIce(event) {
        const filter = event.target.value.toLowerCase();
        this.filteredAccounts = this.accounts.filter(account => 
            account.ICE__c.toLowerCase().includes(filter)
        );
    }
    handleFilterChangeRecordtype(event) {
        const filter = event.target.value.toLowerCase();
        this.filteredAccounts = this.accounts.filter(account => 
            account.RecordType.Name.toLowerCase().includes(filter)
        );
    }
}