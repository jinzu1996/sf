@istest
public class TestErrorHandling {

    @isTest
    static void errorMethod(){        
        try{
            account acc = new account();
            insert acc;
        }
        catch(Exception e)
        {       
        ErrorHandling.storeError(e , 'test');         
        }
    }
}