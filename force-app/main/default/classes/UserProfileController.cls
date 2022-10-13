public with sharing class UserProfileController {
    @AuraEnabled(cacheable=true)
    public static String getBaseUrl() {
        return URL.getSalesforceBaseUrl().toExternalForm();     
    }

    @AuraEnabled(cacheable=true)
    public static String getUserImageUrl() {
        List<User> imgUrl = new List<User>();
        String usrId = UserInfo.getUserId();
        imgUrl = [select mediumphotourl from user where id = :usrId  WITH SECURITY_ENFORCED];
        return imgUrl[0].MediumPhotoUrl;     
    }
}