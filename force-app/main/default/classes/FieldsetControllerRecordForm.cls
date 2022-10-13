public class FieldsetControllerRecordForm {
    
    @AuraEnabled(cacheable=true)
    public static List<Field> getFields(String objectAPIName, String fieldSetAPIName) {
        system.debug('test' + objectAPIName);
        Map<String, Schema.FieldSet> fieldSetMap = Schema.getGlobalDescribe().get(objectAPIName).getDescribe().fieldSets.getMap();
        List<Schema.FieldSetMember> fieldSetMemberList = fieldSetMap.get(fieldSetAPIName).getFields();
        List<Field> fields = new List<Field>();
        for(Schema.FieldSetMember fieldSetMember : fieldSetMemberList) {
            
            
            //if(fieldSetMember.fieldPath != 'FirstName' && fieldSetMember.fieldPath != 'LastName'){
                Field f = new Field();
                f.fieldApiName = fieldSetMember.fieldPath;
                f.objectApiName = objectAPIName;
                f.fieldLabelName = fieldSetMember.label;
                
                fields.add(f);
           // }
            
            
            
        }
        return fields;
    }
    
   
    
     @AuraEnabled(cacheable=true)
    public static List<Field> getFields1(String objectAPIName, String fieldSetAPIName) {
        Map<String, Schema.FieldSet> fieldSetMap = Schema.getGlobalDescribe().get(objectAPIName).getDescribe().fieldSets.getMap();
        List<Schema.FieldSetMember> fieldSetMemberList = fieldSetMap.get(fieldSetAPIName).getFields();
        List<Field> fields = new List<Field>();
        for(Schema.FieldSetMember fieldSetMember : fieldSetMemberList) {
            Field f = new Field();
            f.objectApiName = objectAPIName;
            f.fieldApiName = fieldSetMember.fieldPath;
            
            fields.add(f);
        }
        return fields;
    }
     public class Field {
        @AuraEnabled
        public String objectApiName {get;set;}    
        @AuraEnabled
        public String fieldApiName {get;set;}  
        @AuraEnabled
        public String fieldLabelName {get;set;}    
        
    }
}