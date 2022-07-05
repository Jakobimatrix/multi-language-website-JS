/* File: language.js
 * Author: Jakob Wandel (https://jakobs-fotokiste.de)
 * Last Modified: March 29th, 2016
 * @version 2.0
 *
 * Copyright (C) 2016 Jakob Wandel
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of
 * the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details at:
 * http://www.gnu.org/copyleft/gpl.html
 *
 * This script provides the possibility to change the Language with javascript and cookies within defined elements like div, span, p etc.
 *
 * 0. Include the script in to the head of your HTML document like <script language="javascript" type="text/javascript" src="PATH/language.js"></script>
 * 1. Decide which languages you want your website to be in and write these in the GLOBAL array "LANGUAGES_ARRAY" like LANGUAGES_ARRAY = new Array("GER","ENG");
 * 2. Set the path to the flag images in the GLOBAL variable "FLAGS_PATH". NOTE that image name has to be GER.jpg or ENG.jpg -->spelling depends how you wrote these in to the GLOBAL array "LANGUAGES_ARRAY"
 * 3. Choose a default language. The spelling must like the img name the same as you wrote it in to the "LANGUAGES_ARRAY" array.
 * 4. Decide weather you want to show the flag of the current language or not in the GLOBAL var "DONT_SHOW_FLAG_WITH_CURRENT_LANGUAGE"
 * 5. Set the style attributes between #STYLE tags like you wish
 * 6. In you HTML code all elements with the className "GER" or "ENG" -->spelling depends how you wrote these in to the GLOBAL array "LANGUAGES_ARRAY"
 *      are effected
 * example:
 * <span class="ENG">This is an english text.</span>
 * <div class="GER">DAS IST EIN DEUTSCHER TEXT.</div>
 * <p class="ESP">Esto es un texto en espanolo.</p>
 */

//**************************<Change Settings here>*************************
LANGUAGES_ARRAY = new Array("GER","ENG","LOREM");                      //all suported languages have to be written in this array. NOTE that the classnames have to be equal to these entries
FLAGS_PATH = "https://localhost/multi-language-website-JS-master/pictures/";             //the path where all the pictures of the flages are. NOTE that image name has to be (e.g. GER.jpg) like you defined it in the array "LANGUAGES_ARRAY" above
DEFAULT_LANGUAGE = "GER";                                      //set the default language
DONT_SHOW_FLAG_WITH_CURRENT_LANGUAGE = false;                   //if DONT_SHOW_FLAG_WITH_CURRENT_LANGUAGE is true, the flag of the current language wont be displayed
COOKIENAME = "Language";                                       //choose an avaiable name for the cookie
COOKIE_HTTPS_ONLY = "true";                                    // If your side always redirect to https (which it should) than allow only cookies via https.

CLASSNAME_FLAGS = "LanguageFlag";                              //choose an avaiable class name for the flags
IDNAME_FLAG_CONTAINER = "FlagPole";                            //choose an avaiable ID for the flag container

//FYI:
//The Flaggs will be created as doomObjects and will be placed inside a div. This div will either append to the body or inside a given div container if place_flags_into_div is set to true.

// set the style (css format) / behavoiur for the unique flags both for desktop and mobile. Dont change the order of the IDs!
var CSS_FLAGS = `
.both{
  cursor: pointer;
  z-index: 100;
  width: 50px;
  height: 30px;
  margin-left: 10px;
  float-felft;
}

.mobile{
  position: relative;
}

.desktop{
  position: relative;
}`

// set the style (css format) / behavoiur of the container in which all the flaggs will be in.
var CSS_FLAG_CONTAINER = `
.both{

}

.mobile{
  width: 150px;
  position: fixed;
  top: 5px;
  right: 5px;
}

.desktop{
  position: absolute;
  top: 15px;
  right: 15px;
}`

var PLACE_FLAG_INTO_DIV = [true, false];   //{desktop, mobile} If you wish for the flags to be inserted into a div (which must exist before this script gets executed) set the value to true.
var INSERT_DIV_ID = ["menue", ""];         //{desktop, mobile} Define a ID from a div in which to insert the flags. This is only necessary if place_flags_into_div is true.

//**************************</Change Settings here>*************************

/*ONLY TOUCH STUFF BELOW THIS IF YOU KNOW WHAT YOU ARE DOING*/
All_DOM_Flags = new Array();


function DEBUG(text){
   if(false){
       console.log(text);   
   }
}

/* Extract the style from the CSS string returning cssRules object
 * */
var rulesForCssText = function (styleContent) {
    var doc = document.implementation.createHTMLDocument(""),
        styleElement = document.createElement("style");

    styleElement.textContent = styleContent;
    // the style will only be parsed once it is added to a document
    doc.body.appendChild(styleElement);

    return styleElement.sheet.cssRules;
};

/* Make an simple array containing the information as a string from a cssRules Object
 * */
function cssRulesToString(cssRules){
  var rules_string = new Array();
  for(var rule in cssRules){
    let css = cssRules[rule].cssText;
    if(typeof(css) == "string"){
      var curly_bracket_1 = css.indexOf("{")+1;
      var curly_bracket_2 = css.indexOf("}");
      rules_string[rule] = css.substring(curly_bracket_1, curly_bracket_2);
    }
  }
  return rules_string;
}

/* setCookie requires the Language as a string like it is defined in the global array "LANGUAGES_ARRAY"
 * Function sets Cookie with name "Language" and value whatever the function gets.
 * If "Language" is the default language the function deletes the cookie with name Language
 * since its redundant and would only cause cookiemonster to be sad.
 * */
function setCookie(Language){
    let https_only = '';
    if(COOKIE_HTTPS_ONLY){
        https_only = ';secure';
    }
    if(Language != DEFAULT_LANGUAGE){
        document.cookie = COOKIENAME+'=' + Language + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;SameSite=Lax' + https_only;
    }else{
        document.cookie = COOKIENAME+'=' + Language + '; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;SameSite=Lax' + https_only;
    }
}

/*
 * Function requires the name of the cookie and returns its value or null if the cookie dosnt exist
 * */
function getCookie(name) {
    let cookiesArray = document.cookie.split(';');                  //get all the cookies and write them in to an array like Array(Name1=value1,Name2=value2...)
    for(let i = 0; i < cookiesArray.length; ++i) {
        pos = cookiesArray[i].indexOf(COOKIENAME);              //get the start position of the string COOKIENAME (defined in the globals)
        if(pos > -1){                                           //thats the cookie we are looking for
            return cookiesArray[i].substr(COOKIENAME.length+1);   //returns the value behind COOKIENAME=
        }
    }                                                           //cookie not found
    return null;
}

/*
 * function reads the UserAgent and searches for keywords which suggest that the visitor uses a mobile device
 * http://www.useragentstring.com/pages/Mobile%20Browserlist/
 * */
function isMobile(){
    var UserAgent = navigator.userAgent.toLowerCase();
    // User-Agent search for keywords of a mobile user
    if(UserAgent.search(/(iphone|ipad|opera mini|fennec|palm|bolt|mobile|gobrowser|phone|iris|meamo|midp|minimo|netfront|semec-browser|uzard|teleca|teashark|skyfire|blackberry|android|symbian|series60)/)>-1){
        // mobiles user
        return true;
    }
    return false;
}

/*
 * function displayLanguage Sets style attribute "display" to "block" for all elements with className Language.
 * */
function displayLanguage(Language){
    let ELEMENTS = document.getElementsByClassName(Language);    //returns array with all elements whose className is "Language"
    if(ELEMENTS.length > 0){
        for (let i = 0; i < ELEMENTS.length; ++i) {
            ELEMENTS[i].setAttribute("style", "display: block;");//set the styleattribute
        }
    }
}

/*
 * function displayLanguage Sets style attribute "display" to "none" for all elements with className Language.
 * */
function vanishLanguage(Language){
    let ELEMENTS = document.getElementsByClassName(Language);
    if(ELEMENTS.length > 0){
        for (let i = 0; i < ELEMENTS.length; ++i) {
            ELEMENTS[i].setAttribute("style", "display: none;");
        }
    }
}

/*
 * This function is called from a clickevent over one of the flags
 * it requires the domObjekt = the FlagImage --> eg. call the function with oncklick="changeLanguage(this)"
 * */
function changeLanguage(domObjekt){
    let changeToLanguage = domObjekt.name;  //get the Language from the name attribut of the given DOM objekt

    let actualLanguage = getCookie();       //get the current Language from the Cookie
    
    if(actualLanguage == null){             //if there is no cookie it must be the default language
        actualLanguage = DEFAULT_LANGUAGE;  //some people dislike cookies, good for them!
    }
    actualLanguage = actualLanguage.replace("=",""); //delete possible = signs //I hate js because every fucking browser does things different here
    
    DEBUG("change " + actualLanguage + " to " + changeToLanguage);
    
    setCookie(changeToLanguage);         //set a new Cookie with the chosen language
    DEFAULT_LANGUAGE = changeToLanguage; //some people dislike cookies, good for them!
    vanishLanguage(actualLanguage);      //let all things with className "actualLanguage" disappear
    displayLanguage(changeToLanguage);   //let all things with className "changeToLanguage" appear

    var index = 0;
    if(IS_MOBILE){ //set the index according to sceen for access INSERT_DIV_ID (see globals ^ on page begin.)
      index = 1;
    }

    if(DONT_SHOW_FLAG_WITH_CURRENT_LANGUAGE){ //if we dont want to display the flag with the displayed language, we must erase all flags and set them new
        for(let i = 0 ; i < All_DOM_Flags.length; ++i){
            document.getElementById(IDNAME_FLAG_CONTAINER).removeChild(All_DOM_Flags[i]); //remove old Flags
        }
        All_DOM_Flags = Array();            //delete the global array with all DOM Elements
        showFlags(changeToLanguage);        //set the flags new --> also sets the global All_DOM_Flags
    }
}

/*
 * This function creates the div which will include all the flags.
 * Options how container is displayed can be changed in the globals ^ on page begin.
 * */
function setFlagContainer(){
  let newContainer = document.createElement("div");

  if(IS_MOBILE){  //mobile
    newContainer.setAttribute("style", CONTAINER_CSS[0] + CONTAINER_CSS[1]); //set the style defined in CSS_FLAGS for .both and .mobile
  }else{        //desktop
    newContainer.setAttribute("style", CONTAINER_CSS[0] + CONTAINER_CSS[2]); //set the style defined in CSS_FLAGS for .both and .dektop
  }
  newContainer.id = IDNAME_FLAG_CONTAINER;
  var index = 0;
  if(IS_MOBILE){ //set the index according to sceen for access INSERT_DIV_ID (see globals ^ on page begin.)
    index = 1;
  }
  if(PLACE_FLAG_INTO_DIV[index]){
    document.getElementById(INSERT_DIV_ID[index]).appendChild(newContainer);
  }else{
    document.body.appendChild(newContainer);
  }
}

/*
 * This function creates the flages.
 * Options how the flags are displayed can be changed in he globals ^ on page begin.
 * */
function showFlags(visitorsLanguage){
    //alert("showFlag: "+visitorsLanguage);
    for(let i = 0; i < LANGUAGES_ARRAY.length; ++i){ //LANGUAGES_ARRAY is the global Array where all the supportet languages are in
        let show = true;
        if(LANGUAGES_ARRAY[i] == visitorsLanguage && DONT_SHOW_FLAG_WITH_CURRENT_LANGUAGE){ //if the global DONT_SHOW_FLAG_WITH_CURRENT_LANGUAGE is set to true the flag of the current language wont be displayed
            show = false;
        }
        if(show){
            let newFlag = document.createElement("img"); //create new Doomelement
            newFlag.src = FLAGS_PATH+LANGUAGES_ARRAY[i]+".jpg";//link zu den Bildern

            if(IS_MOBILE){  //mobile
                newFlag.setAttribute("style", FLAG_CSS[0] + FLAG_CSS[1]); //set the style defined in CSS_FLAGS for .both and .mobile
            }else{        //desktop
                newFlag.setAttribute("style", FLAG_CSS[0] + FLAG_CSS[2]); //set the style defined in CSS_FLAGS for .both and .dektop
            }

            newFlag.name = LANGUAGES_ARRAY[i];
            newFlag.className = CLASSNAME_FLAGS;
            newFlag.addEventListener("click", function(){changeLanguage(this);}); //add click event listener ||click NOT onclick || this is the way to call a function on click--> function(){changeLanguage(this);}
            document.getElementById(IDNAME_FLAG_CONTAINER).appendChild(newFlag);  //add new DOM Objekt to ParentObjekt (defined in globals)
            All_DOM_Flags.push(newFlag);
        }
    }
}

// extract css rules
var FLAG_CSS = cssRulesToString(rulesForCssText(CSS_FLAGS));
var CONTAINER_CSS = cssRulesToString(rulesForCssText(CSS_FLAG_CONTAINER));
var IS_MOBILE = isMobile();

/*
 * window.onload starts after the HTML content is loaded
 * It shows all the flags for the selectable languages defined in the global array "LANGUAGES_ARRAY"
 * It checks whether the language Cookie is set, and decides which
 * language should be shown to the user by calling vanishLanguage()
 * */
window.onload = function () {

    let visitorsLanguage = getCookie(COOKIENAME);
    if(visitorsLanguage == null){
        visitorsLanguage = DEFAULT_LANGUAGE;
    }
    setFlagContainer();

    showFlags(visitorsLanguage);

    for(let i = 0; i < LANGUAGES_ARRAY.length; ++i){
        if(LANGUAGES_ARRAY[i] != visitorsLanguage){
            vanishLanguage(LANGUAGES_ARRAY[i]);       //all but visitors language (currently selected)
        }
    }
}
