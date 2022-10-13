public class FieldSetController 
{
    @AuraEnabled(cacheable=true)
    public static FieldSetForm getForm(Id recordId, String objectName, String fieldSetName) 
    {
        system.debug('rec' + recordId);
        FieldSetForm form = new FieldSetForm();        
        form.Fields = getFields(recordId, objectName, fieldSetName);
        System.debug('form>>> '+form);
        return form;
    }
    
    private static List<FormField> getFields(Id recordId, String objectName, String fieldSetName) 
    {
        Schema.SObjectType objectType = null;
        
        if (recordId != null || recordId != '') 
        {
            objectType = recordId.getSobjectType();
        }
        else if (String.isNotBlank(objectName)) 
        {
            objectType = Schema.getGlobalDescribe().get(objectName);
        }
        
        Schema.DescribeSObjectResult objectDescribe = objectType.getDescribe();
        Map<String, Schema.FieldSet> fieldSetMap = objectDescribe.fieldSets.getMap();
        Schema.FieldSet fieldSet = fieldSetMap.get(fieldSetName);
        List<Schema.FieldSetMember> fieldSetMembers = fieldSet.getFields();
        
        List<FormField> fields = new List<FormField>();
        for (Schema.FieldSetMember fsm : fieldSetMembers) 
        {
            FormField f = new FormField(fsm);
            fields.add(f);
        }
        
        return fields;
    }
    
    public class FieldSetForm 
    {
        @AuraEnabled
        public List<FormField> Fields { get; set; }
        
        public FieldSetForm() 
        {
            Fields = new List<FormField>();
        }
    }
    
    @AuraEnabled
    public static ReturnWP fetchFields(String recordId, String objectName, String fieldSetName) 
    {
        ReturnWP res = new ReturnWP();
        try {
            // Querying Name Field
            if(String.isBlank(recordId)) 
            {
                res.message = 'Invalid Id';
                return res;
            }
            List<sObject> objectList = Database.query('SELECT id, Name FROM ' + objectName + ' WHERE Id =: recordId');
            res.nameField = String.valueof(objectList[0].get('Name'));
            
            // Fetching Highlight Panel Field Set
            if(String.isBlank(fieldSetName)) 
            {
                res.message = 'Please provide a Field Set Name';
                return res;
            }
            Schema.FieldSet fieldSet = Schema.getGlobalDescribe().get(objectName).getDescribe().fieldSets.getMap().get(fieldSetName);
            if(fieldSet == null) 
            {
                res.message = 'Field Set provided is not Valid';
                return res;
            }
            res.fieldsAPI = new List<String>();
            for(Schema.FieldSetMember fieldSetMem:fieldSet.getFields())
            {
                res.fieldsAPI.add(fieldSetMem.getFieldPath());
            }
            return res;
        } 
        catch(Exception ex) 
        {
            throw new AuraHandledException(ex.getMessage());
        }
    }
    
    public class ReturnWP 
    {
        @AuraEnabled public String message;
        @AuraEnabled public String nameField;
        @AuraEnabled public List<String> fieldsAPI;
    }
    
    @AuraEnabled
  public static string updateAccountName(string SAid,string Sname, string Sind, integer Srev, string Sweb  )//SAid:this.recordId,Sname:this.Aname,Sind:this.AIndustry,Srev:this.ARevenue,Sweb:this.AWebsite
  {
    /*  system.debug('its working');
      list<Account> AccountList=[select id,Name from Account where id=:SAid];
      for(Account Aac:AccountList)
      { */
      account acc = new account();
      acc.id=SAid;
      acc.Name=Sname;
      acc.Industry = Sind;
      acc.AnnualRevenue = Srev;
      acc.Website = Sweb;
  
      update acc;
      return 'Successfully Saved';
      
  }
    
    @auraEnabled(cacheable=true)
    
    public static List<Account> getAccountrec(String accId) 
    {
        List<Account> accRec=[SELECT Id,Name,Industry,AnnualRevenue,Website from Account where  id=:accId];
        return accRec;
    }
    
    
    
}