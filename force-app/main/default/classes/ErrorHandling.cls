//Catching the errors of all the try catch methods and storing to custom object.
public class ErrorHandling{ 
//Parameter from catch of the class. 
    Public static void storeError(Exception e , string className){
        Apex_Error__c apexError = new Apex_Error__c();
        apexError.Name = className;
        apexError.Error_Message__c = e.getMessage();
        apexError.Error_Line_Number__c = e.getLineNumber();
        apexError.Triggered_Date__c = system.today();
        apexError.Triggered_User_Name__c = UserInfo.getUserId();        
        insert apexError;
    } 
}