global class C84_NavigationMenuItemsController 
{
    public C84_NavigationMenuItemsController() {}
    
    @AuraEnabled(cacheable=true)
    public static Map<String,Object> getNavigationMenuItems(String menuName, Integer maxMenuItems) {
        System.debug('maxMenuItems>>>> '+maxMenuItems);
        Map<String,Object> mapObjects = new Map<String,Object>();
        /*List<NavigationMenuItemDTO> navigationMenuItems = new List<NavigationMenuItemDTO>();
for(Navigation_Menu_Item__c navigationMenuItem : [SELECT Id, Name, Position__c, Page_URL__c, (SELECT Id, Name, Page_URL__c FROM Sub_Navigation_Menu_Items__r WHERE Sub_Navigation_Menu_Item__c = true ORDER BY Position__c ASC) 
FROM Navigation_Menu_Item__c WHERE Navigation_Menu__c =: menuName AND Sub_Navigation_Menu_Item__c = false ORDER BY Position__c ASC]) {
NavigationMenuItemDTO navigationItemDTO = new NavigationMenuItemDTO();
navigationItemDTO.navigationMenuItem = navigationMenuItem;
navigationItemDTO.displayMoreMenu = navigationMenuItem.Position__c > maxMenuItems ? true : false;
navigationMenuItems.add(navigationItemDTO);
}
return navigationMenuItems;*/
        List<Navigation_Menu_Item__c> listNavigationMenuItems = [SELECT Id, Name, Position__c, Page_URL__c, Open_in_new_window__c, (SELECT Id, Name, Page_URL__c, Open_in_new_window__c FROM Sub_Navigation_Menu_Items__r WHERE Sub_Navigation_Menu_Item__c = true ORDER BY Position__c ASC) 
                                                                 FROM Navigation_Menu_Item__c WHERE Navigation_Menu__c =: menuName AND Sub_Navigation_Menu_Item__c = false ORDER BY Position__c ASC];
        
        List<NavigationMenuItem> listNavigationMenuItemsDTO = new List<NavigationMenuItem>();
        List<MoreNavigationMenuItem> listMoreNavigationMenuItemsDTO = new List<MoreNavigationMenuItem>();
        for(Navigation_Menu_Item__c navigationMenuItem : listNavigationMenuItems) {
            NavigationMenuItem navigationMenuItemDTO = new NavigationMenuItem();
            if(navigationMenuItem.Position__c <= maxMenuItems) {
                navigationMenuItemDTO.label = navigationMenuItem.Name;
                navigationMenuItemDTO.id = navigationMenuItem.Id;
                navigationMenuItemDTO.pageURL = navigationMenuItem.Page_URL__c;
                navigationMenuItemDTO.target = navigationMenuItem.Open_in_new_window__c ? '_blank' : '_self';
                if(navigationMenuItem.Sub_Navigation_Menu_Items__r.size() > 0) {
                    List<SubNavigationMenuItem> listSubNavigationMenuItemsDTO = new List<SubNavigationMenuItem>();
                    for(Navigation_Menu_Item__c subNavigationMenuItem : navigationMenuItem.Sub_Navigation_Menu_Items__r) {
                        SubNavigationMenuItem subNavigationMenuItemDTO = new SubNavigationMenuItem();
                        subNavigationMenuItemDTO.label = subNavigationMenuItem.Name;
                        subNavigationMenuItemDTO.id = subNavigationMenuItem.Id;
                        subNavigationMenuItemDTO.pageURL = subNavigationMenuItem.Page_URL__c;
                        subNavigationMenuItemDTO.target = subNavigationMenuItem.Open_in_new_window__c ? '_blank' : '_self';
                        listSubNavigationMenuItemsDTO.add(subNavigationMenuItemDTO);
                    }
                    navigationMenuItemDTO.subNavigationMenuItems = listSubNavigationMenuItemsDTO;
                }
                listNavigationMenuItemsDTO.add(navigationMenuItemDTO);
            }
            if(navigationMenuItem.Position__c > maxMenuItems) {
                MoreNavigationMenuItem moreNavigationMenuItemDTO = new MoreNavigationMenuItem();
                moreNavigationMenuItemDTO.label = navigationMenuItem.Name;
                moreNavigationMenuItemDTO.id = navigationMenuItem.Id;
                moreNavigationMenuItemDTO.pageURL = navigationMenuItem.Page_URL__c;
                moreNavigationMenuItemDTO.target = navigationMenuItem.Open_in_new_window__c ? '_blank' : '_self';
                if(navigationMenuItem.Sub_Navigation_Menu_Items__r.size() > 0) {
                    List<SubNavigationMenuItem> listSubNavigationMenuItemsDTO = new List<SubNavigationMenuItem>();
                    for(Navigation_Menu_Item__c subNavigationMenuItem : navigationMenuItem.Sub_Navigation_Menu_Items__r) {
                        SubNavigationMenuItem subNavigationMenuItemDTO = new SubNavigationMenuItem();
                        subNavigationMenuItemDTO.label = subNavigationMenuItem.Name;
                        subNavigationMenuItemDTO.id = subNavigationMenuItem.Id;
                        subNavigationMenuItemDTO.pageURL = subNavigationMenuItem.Page_URL__c;
                        subNavigationMenuItemDTO.target = subNavigationMenuItem.Open_in_new_window__c ? '_blank' : '_self';
                        listSubNavigationMenuItemsDTO.add(subNavigationMenuItemDTO);
                    }
                    moreNavigationMenuItemDTO.subNavigationMenuItems = listSubNavigationMenuItemsDTO;
                }
                listMoreNavigationMenuItemsDTO.add(moreNavigationMenuItemDTO);
            }
        }
        
        if(listMoreNavigationMenuItemsDTO.size() > 0) {
            NavigationMenuItem moreNavigationMenuItemDTO = new NavigationMenuItem();
            moreNavigationMenuItemDTO.label = 'More';
            moreNavigationMenuItemDTO.moreNavigationMenuItems = listMoreNavigationMenuItemsDTO;
            listNavigationMenuItemsDTO.add(moreNavigationMenuItemDTO);
        }
        //mapObjects.put('NavigationMenuItemsDTO', listNavigationMenuItemsDTO);
        
        mapObjects.put('NavigationMenuItems', listNavigationMenuItemsDTO);
        
        Map<Id,Navigation_Menu_Item__c> mapNavigationMenuItems = new Map<Id,Navigation_Menu_Item__c>([SELECT Id, Page_URL__c, Open_in_new_window__c FROM Navigation_Menu_Item__c WHERE Navigation_Menu__c =: menuName]);
		mapObjects.put('NavigationMenuItemsMap', mapNavigationMenuItems);
        
        return mapObjects;
    }
    
    public class NavigationMenuItem {
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String pageURL;
        @AuraEnabled
        public String target;
        @AuraEnabled
        public List<SubNavigationMenuItem> subNavigationMenuItems;
        @AuraEnabled
        public List<MoreNavigationMenuItem> moreNavigationMenuItems;
    }
    
    public class MoreNavigationMenuItem {
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String pageURL;
        @AuraEnabled
        public String target;
        @AuraEnabled
        public List<SubNavigationMenuItem> subNavigationMenuItems;
    }
    
    public class SubNavigationMenuItem {
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String pageURL;
        @AuraEnabled
        public String target;
    }
}