public class C84_FormFields {
    
    @AuraEnabled(cacheable=true)
    public static List<Field> getFields(String objectAPIName, String fieldSetAPIName, String requiredFields) {
        System.debug('requiredFields>>> '+requiredFields);
        Set<String> listRequiredFields = new Set<String>();
        if(requiredFields != '') {
            listRequiredFields.addAll(requiredFields.split(','));
        }
        Map<String, Schema.FieldSet> fieldSetMap = Schema.getGlobalDescribe().get(objectAPIName).getDescribe().fieldSets.getMap();
        List<Schema.FieldSetMember> fieldSetMemberList = fieldSetMap.get(fieldSetAPIName).getFields();
        List<Field> fields = new List<Field>();
        for(Schema.FieldSetMember fieldSetMember : fieldSetMemberList) {
            Field f = new Field();
            f.IsRequired = listRequiredFields.contains(fieldSetMember.fieldPath) ? true : false;
            f.APIName = fieldSetMember.fieldPath;
            f.Label = fieldSetMember.label;
            f.Required = fieldSetMember.required;
            f.Type = String.valueOf(fieldSetMember.getType());
            fields.add(f);
        }
        return fields;
    }
    
    public class Field {
        @AuraEnabled
        public Boolean IsRequired {get;set;}    
        @AuraEnabled
        public String APIName {get;set;}    
        @AuraEnabled
        public String Label {get;set;}    
        @AuraEnabled
        public Boolean Required {get;set;} 
        @AuraEnabled
        public String Type {get; set;}
    }
}