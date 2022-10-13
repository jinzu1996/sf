global class C84_NavigationLinkSetPickList extends VisualEditor.DynamicPickList {
    
    global override VisualEditor.DataRow getDefaultValue() {
        Navigation_Menu__c defaultNavigationMenu = [SELECT Id, Name FROM Navigation_Menu__c WHERE Name = 'Default' AND Visible_in_Community__c = true];
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow(defaultNavigationMenu.Name, defaultNavigationMenu.Id + '');
        return defaultValue;
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPickListRows picklistValues = new VisualEditor.DynamicPickListRows();
        for(Navigation_Menu__c navigationMenu : [SELECT Id, Name FROM Navigation_Menu__c WHERE Visible_in_Community__c = true]) {
            VisualEditor.DataRow value = new VisualEditor.DataRow(navigationMenu.Name, navigationMenu.Id + '');
            picklistValues.addRow(value);
        }
        return picklistValues;
    }
}