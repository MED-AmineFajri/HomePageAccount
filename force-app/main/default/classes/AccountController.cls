public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [Select Id, Name, ASAIDPRS__c, BIL_ID__c, RC__c, ICE__c, Recordtype.Name FROM Account 
                WHERE ASAIDPRS__c LIKE '219%' AND BIL_ID__c != null AND RecordType.Name IN 
                ('Business Account', 'Prospect Entreprise', 'Client Entreprise')];
    }
}