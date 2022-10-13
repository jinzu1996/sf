import { LightningElement, api } from 'lwc';

export default class UserFilesPaginator extends LightningElement {

    @api pagedata;
    @api pagesize;
    page;
    totalRecountCount;
    totalPage;
    endingRecord;
    startingRecord;
    data;
    pageList;
    item;
   
    @api refreshData(pageData){
       this.pagedata = pageData;
       console.log("pagedata and pagesize"+this.pagedata+'  '+this.pagesize);
        this.totalRecountCount = this.pagedata.length; 
        this.totalPage = Math.ceil(this.totalRecountCount / this.pagesize); 
        this.generatePageList(this.page);
        this.displayRecordPerPage(this.page);
    }


    connectedCallback(){
        console.log("pagedata and pagesize"+this.pagedata+'  '+this.pagesize);
        this.totalRecountCount = this.pagedata.length; 
        this.totalPage = Math.ceil(this.totalRecountCount / this.pagesize); 
            
        this.data = this.pagedata.slice(0,this.pagesize); 
        console.log("data"+this.data);
        this.endingRecord = this.pagesize;
        this.page = 1;
        this.generatePageList(this.page);
        const paginatorEvent = new CustomEvent('paginatorevent', {
            detail: {
                        paginatorData:this.data
                    }
            });
        this.dispatchEvent(paginatorEvent);
    }
    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pagesize) ;
        this.endingRecord = (this.pagesize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.pagedata.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
        const paginatorEvent = new CustomEvent('paginatorevent', {
            detail: {
                        paginatorData:this.data
                    }
            });
        this.dispatchEvent(paginatorEvent);
    }  
    handlePrev() {
        //this.isPageChanged = true;
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.generatePageList(this.page);
            this.displayRecordPerPage(this.page);
        }
          
    }  

    handleNext(){
        //this.isPageChanged = true;
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.generatePageList(this.page);
            this.displayRecordPerPage(this.page);            
        }
          
    }
    handleFirst() {
        //this.isPageChanged = true;
        
            this.page = 1; //decrease page by 1
            this.generatePageList(this.page);
            this.displayRecordPerPage(this.page);
                  
    }
    handleLast() {
        //this.isPageChanged = true;
        
            this.page = this.totalPage; 
            this.generatePageList(this.page);
            this.displayRecordPerPage(this.page);
                  
    }
    handleCurrentPage(event){
        this.page = event.target.name;
        console.log('page : ' + this.page + 'item : '+ this.item)
        this.generatePageList(this.page);
        this.displayRecordPerPage(this.page);
    }
    generatePageList(pageNumber)
     {
        pageNumber= parseInt(pageNumber);
           console.log('Page Number',pageNumber);
           this.pageList = [];
           console.log('Total Page',this.totalPage);
           if(this.totalPage >= 1)
           {  
               console.log('totalPage > 1');
               if(this.totalPage <= 10)
               {
                   console.log('totalpage <=10');
                   var counter = 1;
                   for(; counter <= (this.totalPage); counter++)
                   {
                    console.log('counter'+counter);
                    this.pageList.push(counter);
                   }
               }
               else
               {
                   if(pageNumber < 5)
                   {
                    console.log('pageNumber < 5');
                    this.pageList.push(1,2,3,4,5);
                   }
                   else
                   {
                       if(pageNumber>(this.totalPage-5)){
                        this.pageList.push(this.totalPage-5, this.totalPage-4, 
                    this.totalPage-3, this.totalPage-2, this.totalPage-1);
                    } else{
                        this.pageList.push(pageNumber-2, pageNumber-1, pageNumber, 
                    pageNumber+1, pageNumber+2);
                    }
                   }
               }
           }
     }
}