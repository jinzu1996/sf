import { LightningElement, wire, api } from 'lwc';
import getUserImageUrl from '@salesforce/apex/UserProfileController.getUserImageUrl';
import updateUserProfilePic from '@salesforce/apex/FilesController.updateUserProfilePic';
import userId from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';
import basePath from '@salesforce/community/basePath';
import getFields from '@salesforce/apex/FieldsetControllerRecordForm.getFields';
export default class UserProfile extends LightningElement {
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
    mediumphotourl(result) {
        this.photoUrlresponse = result;
        this.photoUrl = result.data;
    };

    connectedCallback() {
        if (!this.profilelabel) {
            this.profilelabel = 'My Profile';
        }

        getFields({ objectAPIName: 'User', fieldSetAPIName: this.fieldset })
            .then(result => {
                if (result) {
                    this.fields = result;
                    this.error = undefined;
                }
            }).catch(error => {
                console.log(error);
                this.error = error;
            });
    }

    handleEditField(event) {
        event.preventDefault();
        console.log('>> handleEditField');
        this.isReadOnly = false;
    }

    handleSuccess(event) {
        this.isReadOnly = true;
    }

    openfileUploadedit(event) {
        event.preventDefault();
        console.log('>> openfileUploadedit');
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {

            let file = input.files[0];
            console.log(file);
            var reader = new FileReader();
            var base64;
            reader.onload = () => {

                console.log('reader.onload');
                base64 = reader.result.split(/,/)[1];
                this.imageData = base64;
                this.profileImageLoading = true;
                updateUserProfilePic({ base64: this.imageData }).then(result => {

                    if (result) {
                        console.log('image upload successful - openfileUploadedit');
                        this.profileImageLoading = false;
                        return refreshApex(this.photoUrlresponse);
                    }
                }).catch(error => {
                    console.log(error);
                    this.error = error;
                });
            }
            reader.readAsDataURL(file);
            
        };

        input.click();


    }
}