import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getUserImageUrl from '@salesforce/apex/UserProfileController.getUserImageUrl';
import updateUserProfilePic from '@salesforce/apex/FilesController.updateUserProfilePic';
export default class C84UserProfileImage extends LightningElement {

    photoUrl;
    photoUrlresponse;
    imageData;
    profileImageLoading = false;

    @wire(getUserImageUrl)
    mediumphotourl(result) {
        this.photoUrlresponse = result;
        this.photoUrl = result.data;
    };

    openfileUploadedit(event) {
        event.preventDefault();
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {
            // you can use this method to get file and perform respective operations
            //const file = event.target.files[0];
            let file = input.files[0];
            console.log(file);
            var reader = new FileReader();
            var base64;
            reader.onload = () => {

                console.log('inside onload');
                base64 = reader.result.split(/,/)[1];
                //console.log(base64);
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
            refreshApex(this.photoUrl);
        };
        console.log("Before  click");
        input.click();
    }
}