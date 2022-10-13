import { LightningElement, api, wire, track } from 'lwc';
import getNavigationMenuItems from '@salesforce/apex/C84_NavigationMenuItemsController.getNavigationMenuItems';
import GUEST_USER from '@salesforce/user/isGuest';
import userId from '@salesforce/user/Id';
import basePath from '@salesforce/community/basePath';
import { loadStyle } from 'lightning/platformResourceLoader';
import CommunityProductCSS from '@salesforce/resourceUrl/CommunityProductCSS';
import SLDS_ICONS from "@salesforce/resourceUrl/SLDS_ICONS";

const cmsBaseURL = '/sfsites/c/cms/delivery/media/';

export default class C84NavigationMenu extends LightningElement {
    @api logoID;//ContentID of the logo image stored in CMS Content
    @api width;//Width of a logo in pixels
    @api height;//Height of a logo in pixels
    @api bgColor;//Background color of the Navigation Menu
    @api bgColorSubMenu;
    @api borderColor;//Bottom Border color of the Navigation Menu
    logoURL;//URL of the logo image stored in CMS Content

    @api fontFamily = "Salesforce Sans";
    @api menuName;
    @api menuLabelColor;
    @api menuLabelSize;
    @api menuLabelBold;
    @api activeMenuBarColor;
    @api horizontalPadding;
    @api maxMenuItems;
    @track navigationMenuItems = [];
    navigationMenuItemsMap = [];
    @track navigationMenuItemsObj = [];
    publishedState;

    logoPositions = [
        { label: "Left", value: "Left" },
        { label: "Top-Left", value: "Top-Left" }
    ];
    @api currentLogoPosition;
    logoDivClass = 'slds-size_2-of-12';
    navMenuDivClass = 'slds-size_8-of-12';
    myProfileDivClass = 'slds-size_2-of-12';
    hideClass = 'slds-hide';
    showClass = 'slds-show'
    isLeft = false;
    isTopLeft = false;

    homePageURL = basePath;
    isGuestUser = GUEST_USER;
    isStyleLoaded = false;
    switchIconURL = SLDS_ICONS+'/utility-sprite/svg/symbols.svg#switch';
    chevronRightIconURL = SLDS_ICONS+'/utility-sprite/svg/symbols.svg#chevronright';
    userIconURL = SLDS_ICONS+'/action-sprite/svg/symbols.svg#user';
    myProfileURL = basePath + '/profile/'+ userId;

    @track iconStyle;

    @wire(getNavigationMenuItems, {
        menuName: '$menuName',
        maxMenuItems: '$maxMenuItems'
    })
    wiredMenuItems({ error, data }) {
        if(data) {
            this.navigationMenuItems = data['NavigationMenuItems'];
            this.navigationMenuItemsMap = data['NavigationMenuItemsMap'];
            console.log(JSON.stringify(this.navigationMenuItems));
        } else if(error) {
            this.navigationMenuItems = [];
            console.log(`Navigation menu error: ${JSON.stringify(error)}`);
        }
    }

    renderedCallback() {
        this.logoURL = cmsBaseURL+this.logoID;
        this.template.querySelector('[data-id="navMenu"]').style.backgroundColor = this.bgColor;
        this.template.querySelectorAll('.subMenuItem').forEach(element => {
            element.style.backgroundColor = this.bgColorSubMenu;
        });
        this.template.querySelector('[data-id="navMenu"]').style.borderBottom = `2px solid ${this.borderColor}`;
        this.template.querySelectorAll('.menuLabel').forEach(element => {
            element.style.fontFamily = this.fontFamily;
            element.style.color = this.menuLabelColor;
            element.style.fontSize = `${this.menuLabelSize}px`;
            
            if(this.menuLabelBold) {
                element.style.fontWeight = 'bold';
            }
        });
        this.template.querySelectorAll('.menuItem').forEach(element => {
            element.style.paddingLeft = `${this.horizontalPadding}px`;
            element.style.paddingRight = `${this.horizontalPadding}px`;
        });
        this.iconStyle = `fill:${this.menuLabelColor};width:${this.menuLabelSize}px;height:${this.menuLabelSize}px;`;//padding-left:0.1rem;padding-top:0.1rem
        
        let navMenuPaddingDiv = this.template.querySelector('[data-id="navMenuPaddingDiv"]');
        if(this.currentLogoPosition == 'Top-Left') {
            this.logoDivClass = 'slds-size_10-of-12';
            this.navMenuDivClass = 'slds-size_12-of-12';
            navMenuPaddingDiv.classList.remove('slds-m-around_large');
            navMenuPaddingDiv.classList.add('slds-m-bottom_x-small');
            this.isLeft = false;
            this.isTopLeft = true;
        }
        else if(this.currentLogoPosition == 'Left') {
            this.logoDivClass = 'slds-size_2-of-12';
            this.navMenuDivClass = 'slds-size_8-of-12';
            navMenuPaddingDiv.classList.add('slds-m-around_large');
            navMenuPaddingDiv.classList.remove('slds-m-bottom_x-small');
            this.isLeft = true;
            this.isTopLeft = false;
        }

        this.template.querySelectorAll('[data-name="subMenu"]').forEach(element => {
            if(this.currentLogoPosition == 'Top-Left') {
                element.style.top = '80%';
            }
            else if(this.currentLogoPosition == 'Left') {
                element.style.top = '50%';
            }
        });

    }

    constructor() {
        super();
        Promise.all([
            loadStyle(this, CommunityProductCSS)
            ]).then(() => {
                this.isStyleLoaded = true;
            })
            .catch(error => {
                console.log(error.body.message);
        });
    }

    handleClick(event) {
        let id = event.target.dataset.id;

        if(this.navigationMenuItemsMap[id].Open_in_new_window__c == false) {
            window.open(this.navigationMenuItemsMap[id].Page_URL__c, "_self");
        }
        else {
            window.open(this.navigationMenuItemsMap[id].Page_URL__c, "_blank");
        }
    }

    showProfileMenu(event) {
        let profileMenu = this.template.querySelector('.profileMenu');
        if(profileMenu.classList.contains('hide')) {
            profileMenu.classList.remove('hide');
        }
        else {
            profileMenu.classList.add('hide')
        }
    }
}