import { LightningElement,wire, api} from 'lwc';
import getUserImageUrl from '@salesforce/apex/UserProfileController.getUserImageUrl';
import updateUserProfilePic from '@salesforce/apex/FilesController.updateUserProfilePic';
import userId from '@salesforce/user/Id';
import {NavigationMixin} from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import basePath from '@salesforce/community/basePath';
import getFields from '@salesforce/apex/FieldsetControllerRecordForm.getFields';
const FIELDS = ['User.FirstName', 'User.LastName'];
export default class UserProfile extends NavigationMixin(LightningElement) {
    @api profilelabel;
    @api fieldset;

    profileImageLoading = false;
    
    fields = [];
    isReadOnly = true;
    error;
    currUserId = userId;
    photoUrl;
    photoUrlresponse;
    imageData;
    communityHome = basePath;
    @wire(getUserImageUrl) 
    mediumphotourl(result){
        this.photoUrlresponse = result;
        this.photoUrl = result.data;
    };

    
    connectedCallback()
    {
        getFields({ objectAPIName:'User', fieldSetAPIName:this.fieldset})
        .then(result => {
            if (result) {
                this.fields = result;
                this.error = undefined;
             }
        }) .catch(error => {
            console.log(error);
            this.error = error;
        }); 
    }

    handleHome(event){
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'Home'
            },
        });

    }

    handleEditField(event){
        event.preventDefault();
        this.isReadOnly = false;
    }

    handleSuccess(event){
        this.isReadOnly = true;
    }

    

openfileUploadedit(event) {
    event.preventDefault();
    let input = document.createElement('input');
  input.type = 'file';
  input.onchange = _ => {
    // you can use this method to get file and perform respective operations
    //const file = event.target.files[0];
    let file =   input.files[0];
    console.log(file);
    var reader = new FileReader();
    var base64;
    reader.onload = () =>  {
        
        console.log('inside onload');
        base64 = reader.result.split(/,/)[1];
        //console.log(base64);
        this.imageData = base64;
        this.profileImageLoading = true;
        updateUserProfilePic({base64 : this.imageData}).then(result => {

            if (result) {
                console.log('image upload successful - openfileUploadedit');
                    this.profileImageLoading = false;
                    return refreshApex(this.photoUrlresponse);
                    }
        }) .catch(error => {
            console.log(error);
            this.error = error;
        }); 
          }
      reader.readAsDataURL(file);
      refreshApex(this.photoUrl);
            };
        console.log("Before  click");
  input.click();
    
    
}
}