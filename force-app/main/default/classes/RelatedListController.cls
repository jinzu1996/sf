public with sharing class RelatedListController 
{
    @AuraEnabled(cacheable=true)
	public static RelatedListWrapper fetchRecords( String listValues )  
    { 

        system.debug( 'values are ' + listValues ); 
        List < String > strList = listValues.split( '-' ); 
        system.debug( 'values are ' + strList ); 
        RelatedListWrapper objWrap = new RelatedListWrapper();
         
         
            String recordId = '0015i000006x6ylAAA'; 
            String objectName = strList.get( 1 ); 
            String parentFieldAPIName = strList.get( 2 ); 
            String fieldName = strList.get( 3 ); 
            String fieldValue = strList.get( 4 ); 
            String filterType = strList.get( 5 ); 
            String operator = strList.get( 6 ); 
            String fieldsList = strList.get( 7 ); 
             
       /*     String strSOQL = 'SELECT Id';
            strSOQL += ',' + fieldsList;
            String filter = ' FROM ' + objectName + ' WHERE ' + parentFieldAPIName + ' = ' + recordId ; 
          /*  if ( filterType == 'String' )  
            {
                filter += fieldName + ' = ' + fieldValue; 
            }
            else if ( filterType == 'Boolean' )   
            {
                filter += fieldName + ' = ' + fieldValue; 
            }  
            else 
            {
                filter += fieldName + ' ' + operator + ' ' + fieldValue; 
            } 
           // String strCountSOQL = ' SELECT COUNT() ' + filter;
            String strCountSOQL = 'SELECT count() FROM Case ';
            objWrap.recordCount = Database.countQuery(strCountSOQL);
            strSOQL += filter + ' LIMIT 3';     
       // String query = 'Select '+fieldsList+' From '+objectName+' WHERE ' +parentFieldAPIName+ '= :recordId Limit :3';
       // return Database.query(String.escapeSingleQuotes(query));
           objWrap.listRecords = Database.query( 'SELECT Id,Subject FROM Case limit 3' );          
            
            return objWrap;          */
        String strSOQL = 'SELECT Id';
            strSOQL += ', ' + fieldsList;
        system.debug('fieldsList' + fieldsList);
            String filter = ' FROM ' + objectName + ' WHERE ' + parentFieldAPIName + ' =: recordId' ; 
           /* if ( filterType == 'String' )     
                filter += fieldName + ' = ” + fieldValue + ”'; 
            else if ( filterType == 'Boolean' )     
                filter += fieldName + ' = ' + fieldValue; 
            else 
                filter += fieldName + ' ' + operator + ' ' + fieldValue; */
            String strCountSOQL = ' SELECT COUNT() ' + filter;
            objWrap.recordCount = Database.countQuery( strCountSOQL );
            strSOQL += filter;     
            objWrap.listRecords = Database.query( strSOQL );
        return objWrap; 
    } 

    public class RelatedListWrapper 
    {

        @AuraEnabled
        public List <SObject> listRecords;
        @AuraEnabled
        public Integer recordCount;

    }
    
}