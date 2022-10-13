public with sharing class FilesController {
    /*
       Apex Controller for methods to handing operations on Salesforce Files.

    */
    /*
   * @method uploadFile() 
   * @desc Creates a content version from a given file's base64 and name
   * 
   * @param {String} base64 - base64 string that represents the file
   * @param {String} filename - full file name with extension, i.e. 'products.csv'
   * @param {String} recordId - Id of the record you want to attach this file to
   * 
   * @return {ContentVersion} - returns the created ContentDocumentLink Id if the
   *   upload was successful, otherwise returns null
   */
   @AuraEnabled
   public static String uploadFile(String base64, String filename, String recordId) {
         ContentVersion cv = createContentVersion(base64, filename);
         ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
         if (cv == null || cdl == null) { return null; }
         return cdl.Id;
   }
   /*
    * @method createContentVersion() [private]
    * @desc Creates a content version from a given file's base64 and name
    * 
    * @param {String} base64 - base64 string that represents the file
    * @param {String} filename - full file name with extension, i.e. 'products.csv'
    * 
    * @return {ContentVersion} - returns the newly created ContentVersion, or null
    *   if there was an error inserting the record
    */
   private static ContentVersion createContentVersion(String base64, String filename) {
     ContentVersion cv = new ContentVersion();
     cv.VersionData = EncodingUtil.base64Decode(base64);
     cv.Title = filename;
     cv.PathOnClient = filename;
     
     try{
       insert cv;
       return cv;
     } catch(DMLException e) {
       System.debug(e);
       return null;
     }
    
   }
 
    /*
    * @method createContentLink() [private]
    * @desc Creates a content link for a given ContentVersion and record
    * 
    * @param {String} contentVersionId - Id of the ContentVersion of the file
    * @param {String} recordId - Id of the record you want to attach this file to
    * 
    * @return {ContentDocumentLink} - returns the newly created ContentDocumentLink, 
    *   or null if there was an error inserting the record
    */
   private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
               if (contentVersionId == null || recordId == null) { return null; }
     ContentDocumentLink cdl = new ContentDocumentLink();
     cdl.ContentDocumentId = [
       SELECT ContentDocumentId 
       FROM ContentVersion 
       WHERE Id =: contentVersionId
     ].ContentDocumentId;
     cdl.LinkedEntityId = recordId;
     // ShareType is either 'V', 'C', or 'I'
     // V = Viewer, C = Collaborator, I = Inferred
     cdl.ShareType = 'V';
     try {
       insert cdl;
       return cdl;
     } catch(DMLException e) {
       System.debug(e);
       return null;
     }
   }
   /*
    * @method deleteFile() [public]
    * @desc deletes the contentDocument of the contentversion
    * 
    * @param {String} contentDocumentId - ContentDocumentId of the ContentVersion of the file
    *    
    * @return void
    */
    @AuraEnabled
    public static void deleteFile(String contentDocumentId) {
       if(contentDocumentId != null){
        ContentDocument cd = new ContentDocument();
        cd.Id = contentDocumentId;
        try{
          delete cd;
        }
        catch(DMLException e) {
          system.debug(e);
        }
       }  
     }

    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getAllFiles() {
        String userId = UserInfo.getUserId();
        List<ContentVersion> docs = new List<ContentVersion>();
        docs = [SELECT ContentDocumentId, FileExtension, Title, OwnerId, CreatedDate, VersionNumber
                FROM ContentVersion WHERE ownerId = :userId
                WITH SECURITY_ENFORCED];
        return docs;        
    }

    /*
    * @method updateUserProfilePic() [public]
    * @desc updates the profile image of the current user
    * 
    * @param {String} base64 - Image Data
    *    
    * @return Boolean
    */

    @AuraEnabled
    public static Boolean updateUserProfilePic(String base64) {
      Boolean updateSuccessful = true;
      String userId = UserInfo.getUserId();
      String fileType = 'image/jpg';
      String fileName = 'profile.jpg';
      try{
          Blob blobImage = EncodingUtil.base64Decode(base64);
          ConnectApi.BinaryInput fileUpload = new ConnectApi.BinaryInput(blobImage, fileType, fileName);
          ConnectApi.Photo photoProfile = ConnectApi.UserProfiles.setPhoto(null, userId,  fileUpload);
          system.debug('Profile Image uploaded successfully');
      }
      catch(Exception exc){
          updateSuccessful = false;
          system.debug(exc);
      }
      
      return updateSuccessful;      
    }

    

}