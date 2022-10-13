import { LightningElement,wire,api} from 'lwc';
import getAllFiles from '@salesforce/apex/FilesController.getAllFiles';
import getBaseUrl from '@salesforce/apex/UserProfileController.getBaseUrl';
import basePath from '@salesforce/community/basePath';
import deleteFile from '@salesforce/apex/FilesController.deleteFile';
//import replaceFile from '@salesforce/apex/FilesController.replaceFile';
import uploadFileIcon from '@salesforce/resourceUrl/UploadFileIcon';
import {NavigationMixin} from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/FilesController.uploadFile'
import CommunityProductCSS from '@salesforce/resourceUrl/CommunityProductCSS';

export default class UserFiles extends NavigationMixin(LightningElement) {
    @api fileslabel;
    @api filesperpage;
    @api maxfilesize;
    
    columns = [
        { label: 'Title', fieldName: 'Title'},
        { label: 'CreatedDate', fieldName: 'CreatedDate',type: 'Date' ,
        typeAttributes: {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        }},
        //{ label: 'VersionNumber', fieldName: 'VersionNumber'},
        {
            //label: 'Download',
            type: 'button-icon',
            typeAttributes: {
                iconName: 'utility:download',
                name: 'downloadRecord',
                title: 'Download',
                variant: 'border-filled',
                disabled: false
            }
        },
        {
            //label: 'Delete',
            type: 'button-icon',
            typeAttributes: {
                iconName: 'utility:delete',
                name: 'deleteRecord',
                title: 'Delete',
                variant: 'border-filled',
                disabled: false
            }
        }
        
    ];
    data;
    error;
    refreshTable;
    actionName;
    row;
    recordId;
    isModalOpen;
    basePathDownload;
    homePage = basePath;
    spinner = false;
    fileData;
    fileError;
    startingRecord = 1;
    page = 1;
    endingRecord = 0; 
    pageSize = 5; 
    totalRecountCount = 0;
    totalPage = 0;
    items = [];
    pageList = [];
    loader;
    fileUploadProgress;
    progressText;
    dragZoneActive = false;
    eventListenersAdded;
    uploadFileIconUrl = uploadFileIcon;
    selectedFile;
    progressRing = false;
    fileExtension;
    loadPaginator = false;
    modalOpen = false;
    deleteModalOpen = false;
    duplicateFileModalOpen = false;
    rowFilename;
    filename = [];
    currentFile;

    //filename;
    //i;

    @wire(getBaseUrl) 
    baseurl(result){
        this.basePathDownload = result.data;
    };

    renderedCallback() {

        if (this.eventListenersAdded) {
            return;
        }

        this.eventListenersAdded = true;
        this.registerEvents();
    };

    get dropZoneContextClass() {
        return this.dragZoneActive ? 'active' : 'inactive';
    }

    
 
    @wire(getAllFiles)
    files(result) {
        this.refreshTable = result;
        
        if (result.data) {
            //this.data = result.data;
            //this.processRecords(result.data);
            this.items = result.data;
            console.log('getAllFiles items' + this.items);
            this.filename = [];
            for(let i=0;i<this.items.length;i++){
                this.filename.push(this.items[i].Title);
            }
            console.log('filename'+this.filename);
            if(this.loadPaginator){
            const paginatorChild = this.template.querySelector('c-user-files-paginator');
                        
                        paginatorChild.refreshData(this.items);
                    }
            this.error = undefined;
            this.loadPaginator = true;
            

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }
    handleFileUploadCardClose(event){
        console.log('>> handleFileUploadCardClose');
        this.loader = false;
    }
   
    handlePaginatorEvent(event){
        console.log('>> handlePaginatorEvent');
        this.data = event.detail.paginatorData;
    }
    
    processFile(fileselected) {
        console.log('>> processFile')
        this.fileError = '';
        console.log('fileselected name' + fileselected.name);
        console.log('filename  '+ this.filename);
        if(this.filename.includes(fileselected.name) ){
            console.log('Open Duplicate File Modal');
            this.currentFilename = fileselected.name;
            this.duplicateFileModalOpen = true;
            this.modalOpen = true;
        }

        //const file = event.target.files[0]
        if (fileselected.size > this.maxfilesize*1000000) {
            this.fileError = '  File size exceeded '+this.maxfilesize+' MB';
            //this.updateFileStatus(file, false);
            return;
        }
        //this.selectedFile = fileselected;
        var reader = new FileReader();
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': fileselected.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log(this.fileData);
        }
        reader.readAsDataURL(fileselected);
    }
    handleBrowseFiles(event){
        event.preventDefault();
        console.log('>> handleBrowseFiles');
        this.fileError = '';
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {
            let file =   input.files[0];
        console.log('file'+file);
        this.currentFile = file;
        this.processFile(file);
        }
        input.click();
        
        //this.processFile(file);
    }
    handleUploadFile(){
        console.log('>> handleUploadFile');
        if (this.fileData) {
        const {base64, filename, recordId} = this.fileData;
        this.fileExtension = this.fileData.filename.split('.')[1];
        //this.filename = this.fileData.filename;
        this.loader = true;
        this.progressRing = true;
        
        for(let i=1; i<=16 ; i++){
            setTimeout(()=>{this.fileUploadProgress = i*5;}, 300);
        }
        this.progressText = this.fileData.filename+" ";
        uploadFile({ base64, filename, recordId }).then(result=>{
            
            this.spinner = false;
            this.fileUploadProgress = 100;
            setTimeout(()=>{this.progressText = this.fileData.filename +' uploaded successfully';
                            this.progressRing = false;
                            this.fileData = null;},1000)
                        
            return refreshApex(this.refreshTable);
        })
      } else{
        this.fileError = '  Choose a File to upload';
      }
    }

    handleRowActions(event) {
        console.log('>> handleRowActions');
        this.actionName = event.detail.action.name;
        const row = event.detail.row;
        this.recordId = event.detail.row.Id;
        if (this.actionName === 'deleteRecord') {
            this.deleteModalOpen = true;
            this.modalOpen = true;
            this.rowFilename = event.detail.row.Title;
            this.deleteCdId = event.detail.row.ContentDocumentId;
            console.log(this.rowFilename+'   '+ this.deleteCdId);
            //alert('Delete Record');
            /*deleteFile({contentDocumentId : row.ContentDocumentId}).then(() => {
                console.log('File deleted successfully');
                return refreshApex(this.refreshTable);
            }).catch(error => {
                console.log(JSON.stringify(error));
            });*/
        }
        if (this.actionName === 'downloadRecord') {
            alert(this.basePathDownload);
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: this.basePathDownload+'/sfc/servlet.shepherd/document/download/'+row.ContentDocumentId
                }
            });
        }
    }

    closeModal(event){
        this.modalOpen = false;
        this.deleteModalOpen = false;
        this.duplicateFileModalOpen = false;
        this.fileData = '';
    }

    replaceFile(event){
        console.log('>> Inside replaceFile');
        this.modalOpen = false;
        this.deleteModalOpen = false;
        this.duplicateFileModalOpen = false;
        var index = this.filename.indexOf(this.currentFile.name);
        console.log('currentFilename' + this.currentFile.name);
        //console.log('current filename' + this.currentFilename);
        console.log('Content Document Id'+this.items[index].ContentDocumentId);
        /*deleteFile({contentDocumentId : this.items[index].ContentDocumentId}).then(result => {
            console.log('File deleted successfully');
            refreshApex(this.refreshTable);
            this.processFile(this.currentFile);
            this.handleUploadFile();
        }).catch(error => {
            console.log(JSON.stringify(error));
        });*/
        if (this.currentFile.size > this.maxfilesize*1000000) {
            this.fileError = '  File size exceeded '+this.maxfilesize+' MB';
            //this.updateFileStatus(file, false);
            return;
        }
        //this.selectedFile = fileselected;
        var reader = new FileReader();
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': this.currentFile.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log(this.fileData);
        }
        reader.readAsDataURL(this.currentFile);
        deleteFile({contentDocumentId : this.items[index].ContentDocumentId}).then(result => {
            console.log('File deleted successfully');
            this.modalOpen = false;
            this.deleteModalOpen = false;
            this.duplicateFileModalOpen = false;
            this.handleUploadFile();
            //return refreshApex(this.refreshTable);
            //this.processFile(this.currentFile);
            //this.handleUploadFile();
        }).catch(error => {
            console.log(JSON.stringify(error));
        });
        
        

    }

    handleDeleteFile(event){
        console.log('>> handleDeleteFile');
        deleteFile({contentDocumentId : this.deleteCdId}).then(result => {
            console.log(this.deleteCdId);
            console.log('File deleted successfully');
            this.modalOpen = false;
            this.deleteModalOpen = false;
            return refreshApex(this.refreshTable);
        }).catch(error => {
            console.log(JSON.stringify(error));
        });
    }

    registerEvents = () => {

        const dropArea = this.template.querySelector('[data-id="droparea"]');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, this.preventDefaults)
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, this.highlight);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, this.unhighlight);
        });

        dropArea.addEventListener('drop', this.handleDrop);

    };

    highlight = (e) => {
        this.dragZoneActive = true;
    };

    unhighlight = (e) => {
        this.dragZoneActive = false;
    };

    handleDrop = (e) => {
        let dt = e.dataTransfer;
        console.log('>> No of Files selected : ' + dt.files.length);
        if(dt.files.length > 1){
            this.fileError = "Multiple files selected. Please select one file only";
            this.fileData = '';
            return;
        }
        console.log(dt.files[0]);
        //this.processAllFiles(dt.files);
        this.currentFile = dt.files[0];
        this.processFile(dt.files[0]);
    };

    preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
}