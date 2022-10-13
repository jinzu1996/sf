import { LightningElement,api } from 'lwc';

export default class Paginator extends LightningElement {

    @api childRecCountPerPage;// No. of Records to display on a page
    @api allSearchResult = []; // All search record coming from Main lwc component.
    totalPages; // total pages based on All-recs/ No of records per page.
    pageSizeGreaterFive = true;   // True if less than 5 records, else False.
    pageSizeOne = true; // If only one page after resource search
    recordToDisplay = []; // Final List where we can add the filtered list to display on Result table.
    initialCount = 0; // Used in for loop ( index initialization)
    maxCount = 0; // Used in For loop (TO what index we need to filter Resources to display)
    currentPageNo = 0; // Default Current Page no 1.
    //pagesize = 2; 
    pageList = [];

    //this.totalPages = this.totalRecs ;
    connectedCallback(){
        console.log('allSearchResult>>'+ this.allSearchResult);
        this.handleNextPage();
    }

    //Method only called from Search operation to pass result value to pagination and initialize vars
    @api getPagination(allSearchResult){
        this.allSearchResult = [];
        this.pageSizeGreaterFive = true;
        this.pageSizeOne = true;
        this.allSearchResult = allSearchResult;
        this.totalPages = 0;
        this.initialCount = 0; // Used in for loop ( index initialization)
        this.maxCount = 0; // Used in For loop (TO what index we need to filter Resources to display)
        this.currentPageNo = 0; // Default Current Page no 1.
        console.log('allSearchResult00>>'+ this.allSearchResult);
        this.handleNextPage();

    }

    handleNextPage(){
        console.log('page called-currentPageNo->'+this.currentPageNo);
        if (this.allSearchResult){
            console.log('handleNextPage>>');
            this.totalPages = Math.ceil(this.allSearchResult.length / this.childRecCountPerPage );
            this.currentPageNo = this.currentPageNo + 1;

            if (this.currentPageNo == 1){
                this.initialCount = 0;
                this.maxCount = this.childRecCountPerPage;
            }
            else{
                this.maxCount = this.currentPageNo * this.childRecCountPerPage;
                this.initialCount = this.maxCount - this.childRecCountPerPage;
                if (this.maxCount > this.allSearchResult.length){
                    this.maxCount = this.allSearchResult.length;
                }
                
            }
            this.recordToDisplay = [];
            for (let i = this.initialCount ; i < this.maxCount ; i++){
                
                if(this.allSearchResult[i] != null && this.allSearchResult[i] != '' &&
                 typeof this.allSearchResult[i] != 'undefined'){
                    this.recordToDisplay.push(this.allSearchResult[i]);
                }
            }
        }
        //console.log('recordToDisplay>>'+ this.recordToDisplay);

        
        const paginationAction = new CustomEvent('paginationaction', {
            detail: {
                        npRecs:this.recordToDisplay
                    }
            });
        this.dispatchEvent(paginationAction);

        this.generatePageList();
    }


    handlePreviousPage(){
        console.log('handlePreviousPage');

        if (this.allSearchResult){

            this.totalPages = Math.ceil(this.allSearchResult.length / this.childRecCountPerPage );
            if (this.currentPageNo > 1){
                this.currentPageNo = this.currentPageNo - 1;
            }

            if (this.currentPageNo == 1){
                this.initialCount = 0;
                this.maxCount = this.childRecCountPerPage;
            }
            else{
                this.maxCount = this.currentPageNo * this.childRecCountPerPage;
                this.initialCount = this.maxCount - this.childRecCountPerPage;
                if (this.maxCount > this.allSearchResult.length){
                    this.maxCount = this.allSearchResult.length;
                }
                
            }

            this.recordToDisplay = [];
            for (let i = this.maxCount-1 ; i >= this.initialCount ; i--){

                if(this.allSearchResult[i] != null && this.allSearchResult[i] != '' &&
                 typeof this.allSearchResult[i] != 'undefined'){
                    this.recordToDisplay.push(this.allSearchResult[i]);
                }
            }

        }

        const paginationAction = new CustomEvent('paginationaction', {
            detail: {
                        npRecs:this.recordToDisplay
                    }
            });
        this.dispatchEvent(paginationAction);

        this.generatePageList();
    }

    get disablePrevious(){ 
        return this.currentPageNo <= 1;
    }

    get disableNext(){ 
        return this.currentPageNo >= this.totalPages;
    }
    

    /*
     * this function generate page list
     * */
    generatePageList(){
        var tempPageList = [];
        this.pageList = [];
        console.log('generatePageList0>>'+this.totalPages);

        //If total pages are less than 5, then hide "..."
        //If only one page, then hide both.
        if (this.totalPages == 1){
            this.pageSizeOne = false;
            this.pageSizeGreaterFive = false;
        }
        else if(this.totalPages < 5){
            console.log('pageSizeGreaterFive>>');
            this.pageSizeGreaterFive = false;
        }

        if(this.totalPages > 1){
            console.log('generatePageList1>>');
            if(this.totalPages <= 10){
                console.log('generatePageList2>>');
                var counter = 2;
                for(; counter < (this.totalPages); counter++){
                    this.pageList.push(counter);
                    console.log('generatePageList3>>'); 
                }
            } else{
                if(this.currentPageNo < 5){
                    this.pageList.push(2, 3, 4, 5, 6);
                    console.log('pageList0>>'+this.pageList);
                } else{
                    if(this.currentPageNo>(this.totalPages-5)){
                        this.pageList.push(this.totalPages-5, this.totalPages-4, this.totalPages-3, this.totalPages-2, this.totalPages-1);
                        console.log('pageList1>>'+this.pageList);
                    } else{
                        this.pageList.push(this.currentPageNo-2, this.currentPageNo-1, this.currentPageNo, this.currentPageNo+1, this.currentPageNo+2);
                        console.log('pageList2>>'+this.pageList);
                    }
                }
            }
        }
        //this.pageList.push(tempPageList);
        console.log('pageList3>>'+this.pageList.length);
        /*if (this.pageList.length < 2){
            this.flagForTotalPages = false;
        } */
    } 

/**
 * On Page click go to the respective page. Used the same event as in PageNext and prev.
 */
    onSelectivePageClick(event){
        console.log('onSelectivePageClick>>'+event.currentTarget.name);
        this.currentPageNo = parseInt(event.currentTarget.name);
        this.recordToDisplay = [];
        if (this.currentPageNo == 1){
            this.initialCount = 0;
            this.maxCount = this.childRecCountPerPage;
        }
        else{
            this.maxCount = this.currentPageNo * this.childRecCountPerPage;
            this.initialCount = this.maxCount - this.childRecCountPerPage;
            if (this.maxCount > this.allSearchResult.length){
                this.maxCount = this.allSearchResult.length;
            }
            
        }        
        for (let i = this.initialCount ; i < this.maxCount ; i++){

            if(this.allSearchResult[i] != null && this.allSearchResult[i] != '' &&
                 typeof this.allSearchResult[i] != 'undefined'){

                    this.recordToDisplay.push(this.allSearchResult[i]);
            }
        }
        const paginationAction = new CustomEvent('paginationaction', {
            detail: {
                        npRecs:this.recordToDisplay
                    }
            });
        this.dispatchEvent(paginationAction);  
        
        this.generatePageList();
    }


}