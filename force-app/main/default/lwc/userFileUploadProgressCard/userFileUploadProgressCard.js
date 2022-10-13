import { LightningElement,api} from 'lwc';

export default class UserFileUploadProgressCard extends LightningElement {
@api progresstext;
@api progressring;
@api fileuploadprogress;
@api fileextension;

get iconName() {
    if (this.fileextension) {
      if (this.fileextension === "pdf") {
        return "doctype:pdf";
      }
      if (this.fileextension === "ppt") {
        return "doctype:ppt";
      }
      if (this.fileextension === "xls") {
        return "doctype:excel";
      }
      if (this.fileextension === "csv") {
        return "doctype:csv";
      }
      if (this.fileextension === "txt") {
        return "doctype:txt";
      }
      if (this.fileextension === "xml") {
        return "doctype:xml";
      }
      if (this.fileextension === "doc") {
        return "doctype:word";
      }
      if (this.fileextension === "zip") {
        return "doctype:zip";
      }
      if (this.fileextension === "rtf") {
        return "doctype:rtf";
      }
      if (this.fileextension === "psd") {
        return "doctype:psd";
      }
      if (this.fileextension === "html") {
        return "doctype:html";
      }
      if (this.fileextension === "gdoc") {
        return "doctype:gdoc";
      }
    }
    return "doctype:image";
  }

  handleClose(event){
    event.preventDefault();
    console.log('In handleClose>>');
    const closeEvent = new CustomEvent('fileuploadcardclose');
    this.dispatchEvent(closeEvent);
}


}