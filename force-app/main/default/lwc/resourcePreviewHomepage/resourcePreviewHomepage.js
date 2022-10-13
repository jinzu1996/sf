import { LightningElement,api,wire } from 'lwc';
import resourceSearch from '@salesforce/apex/resourceSearchController.resourceSearch';
import { NavigationMixin } from 'lightning/navigation';
import commBasePath from '@salesforce/community/basePath';
const DELAY = 400;

export default class ResourcePreviewHomepage extends NavigationMixin(LightningElement){

    searchResult = [];
    searchStringParent = '';
    resetSearch = '';
    showTable = false;
    recordsPerPage = [];
    showResourceDetail = false;
    absPath = '';
    @api selectedResourceRec;
    @api recCountPerPage = '4';
    @api pageHeader = 'RESOURCE';
    @api pageTitle = 'Here you\'ll find handly documentation about our APIs And SDKs for our Feeds and Chat products';    
    @api phSearchBox = 'Enter String to search';    
    @api phCategory ='Select Category';
    @api phSubCategory = 'Select Sub Category';
    @api submitButtonLabel = 'Submit';
    @api submitButtonColor = 'Brand';
    @api resetButtonLabel = 'Reset';
    @api resetButtonColor = 'destructive'; 
    @api showVertical = false; // Controls the entire resource home page style.
    @api noResourceFound; // When in search no result found.
    @api resourceDetailNavagationToNewTab = false; //Handle the view of resource detail page
    @api navigationTypeNewTab = false; 
    //@api pageAllignment;


    //On Page Load, need to show the results.
    @wire(resourceSearch, { searchName: '',  category: '', subCat: ''})
    wireResource(wireResourceList) {
        const { data, error } = wireResourceList;
        if(data){
            console.log('Wire:recCountPerPage>>'+this.recCountPerPage);
            this.searchResult = [];
            this.recordsPerPage = [];
            if (data){
                this.searchResult = data;
                if(this.recordsPerPage.length == 0){
                    for(let i=0; i<this.recCountPerPage; i++){
                        if(data[i]){
                            this.recordsPerPage.push(data[i]);
                        }
                    }
                }
                //Show table controls visibility of result table and paginator component.
                this.showTable = true;
            }
        }
        else if(error){
            //this.showTable = false;
            console.log('Failed>>'+error);
        }
    }

    handleSearchValue(event){
        var cat = ''; 
        var subCat = '';
        console.log('handleSearchValue1>>');
        console.log('IMP:recCountPerPage>>'+this.recCountPerPage);
        if( event != null && event.detail.userSearchInput != null){
            this.searchStringParent = event.detail.userSearchInput;
        }
        if(event != null && event.detail.cat != null && event.detail.subCat != null ){
            cat = event.detail.cat;
            subCat = event.detail.subCat;

            //For Horizontal view as no reset button so added, None in Pick list and reseting the search.
            if (cat == 'None'){
                cat = '';
                subCat = '';
            }

        }
        console.log('this.searchStringParent>>'+this.searchStringParent);
        console.log('subCat & cat value>>'+ subCat + cat);
        resourceSearch({searchName : this.searchStringParent, category: cat, subCat: subCat})
            .then((result) => {
                this.searchResult = [];
                this.recordsPerPage = [];
                this.showTable = true;
                console.log('sz1>>'+result);

                //Added as other componets needed to hide when search result return no result.
                if(result.length == 0){
                    this.showTable = false;
                    this.searchResult = null;
                    return;
                }

                if (result){
                    this.searchResult = result;
                    if(this.recordsPerPage.length == 0){
                        for(let i=0; i<this.recCountPerPage; i++){
                            if(result[i] != null && result[i] != '' && typeof result[i] != 'undefined'){
                                console.log('sz2>>'+this.recordsPerPage.length);
                                this.recordsPerPage.push(result[i]);
                                console.log('result[i]>>'+ JSON.stringify(result[i]));
                                console.log('sz3>>'+this.recordsPerPage.length);
                            }
                        }
                        console.log('final>>'+ this.recordsPerPage);

                        /*After specific string search, To refresh the pages in pagination section.
                        To call the method present in a different child comp.*/
                        const paginatorComp = this.template.querySelector('c-paginator');
                        //console.log('paginatorComp>>'+paginatorComp);
                        paginatorComp.getPagination(this.searchResult);
                        console.log('final2>>'+ this.recordsPerPage);
                    }
                    //Show table controls visibility of result table and paginator component.
                    this.showTable = true;
                    console.log('final3>>'+ this.recordsPerPage);
                }
                console.log('handleSearchValue2>>'+ result.length);
                console.log('this.recordsPerPage>>'+ this.recordsPerPage);
            })
            .catch((error) => {
                //this.showTable = false;
                console.log('Failed>>'+error);
            });
    }

    /*
    Reset event call from filter component. 
    This will initialize the searchString parameter on searchbar component.
    */
    handleResetEvent(){
        this.template.querySelector('form').reset();
        this.searchResult = [];
        this.searchStringParent = '';
        this.handleSearchValue();
    }

    //Show detail of resource when clicked.
    showResDetailAction(event){
        console.log('showResDetailAction->this.resourceDetailNavagationToNewTab>>'+this.resourceDetailNavagationToNewTab);
        if(this.resourceDetailNavagationToNewTab == false){
            //Same tab resource detail view.
            this.navigationTypeNewTab = false;
            this.showResourceDetail = true;
            this.selectedResourceRec = event.detail.resRec;
        }
        else if (this.resourceDetailNavagationToNewTab == true){
            this.navigationTypeNewTab = this.resourceDetailNavagationToNewTab;
            this.selectedResourceRec = event.detail.resRec;
            //console.log('this.selectedResourceRec>>'+ this.selectedResourceRec);
            //console.log('comm__namedPage>>');
            /*  this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        pageName: 'Resource_Detail_Page__c'
                    },
                });
            */
            //window.parent.location.href = 'http://google.com';

            //Form the exact resource path from community base path. Pass the resource record Id in url.
            this.absResourcePath = commBasePath + '/resource-detail-page/:term'+'?resId='+this.selectedResourceRec+'&newTab=true';
            console.log('commBasePath>>'+commBasePath);
            console.log('absResourcePath>>'+this.absResourcePath);
            window.open(
                this.absResourcePath,
                '_blank' 
            );
        }
    }

    handlePaginationEvent(event){
        this.recordsPerPage = event.detail.npRecs;
        //console.log('handlePaginationEvent>>'+this.recordsPerPage);
    }

    goBackToResResultPage(){
        this.showResourceDetail = false;
    }

}