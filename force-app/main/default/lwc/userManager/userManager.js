import { LightningElement, api} from 'lwc';
export default class UserManager extends LightningElement {
@api profileLabel;
@api filesLabel;
@api userFieldSet;
@api filesPerPage;
@api maxFileSize;

showprofile = true;
showfiles;

handleProfileCard(event){
    event.preventDefault();
    this.showprofile = true;
    this.showfiles = false;
}
handleFilesCard(event){
    event.preventDefault();
    this.showprofile = false;
    this.showfiles = true;
}
}