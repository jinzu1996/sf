/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 10-13-2022
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
global class C84_FieldSetPicklist extends VisualEditor.DynamicPickList {

    global override VisualEditor.DataRow getDefaultValue() {
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('C84 Community Form', 'C84_Community_Form');
        return defaultValue;
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPickListRows picklistValues = new VisualEditor.DynamicPickListRows();
        return null;
         
    }
    
    /*@AuraEnabled
    public static Map<String, Schema.FieldSet> getFieldSets(String objectAPIName) {
        Map<String, Schema.FieldSet> fieldSetMap = Schema.getGlobalDescribe().get(objectAPIName).getDescribe().fieldSets.getMap();
        return fieldSetMap;
    }*/
    
}