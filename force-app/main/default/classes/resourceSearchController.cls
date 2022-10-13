public with sharing class resourceSearchController {

    @AuraEnabled(cacheable = true)
    public static list<sObject> resourceSearch( String searchName, String category, String subCat){
        System.debug('searchName>>'+searchName);
        searchName = '%' + searchName + '%';
        System.debug('searchName>>'+searchName);
        System.debug('category>>'+category);
        System.debug('subCat>>'+subCat);
        String searchString = 'SELECT id, Name,Thumbnail__c,Type__c,Description__c,Resource_Link__c FROM Resource__c';

        if(!String.isEmpty(searchName) && String.isEmpty(category) && String.isEmpty(subCat)){
            searchString = searchString + ' WHERE Name like :searchName limit 50000';
            
        }
        else if(!String.isEmpty(searchName) && !String.isEmpty(category) && String.isEmpty(subCat)){
            searchString = searchString + ' WHERE Name like :searchName AND Category__c = :category limit 50000';
            
        }
        else if (!String.isEmpty(searchName) && !String.isEmpty(category) && !String.isEmpty(subCat)) {
            searchString = searchString + ' WHERE Name like :searchName AND Category__c = :category AND Sub_Category__c = :subCat limit 50000';
        }
        else if(String.isEmpty(searchName) && !String.isEmpty(category) && !String.isEmpty(subCat)){
            searchString = searchString + ' WHERE Category__c = :category AND Sub_Category__c = :subCat limit 50000';
        }
        else{
            return null;
        }

        System.debug('searchString>>'+searchString);
        return Database.query(searchString);
    }

    @AuraEnabled(cacheable = true)
    public static list<sObject> getResourceDetails(Id resourceId){
        String query = 'SELECT id, Name,Type__c,Thumbnail__c,CreatedDate,Description__c FROM Resource__c WHERE id =: resourceId';
        return Database.query(query);
    }

}