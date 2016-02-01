
# Veeva Gulp Template

## Requirments 

  * NodeJS
  * npm (node package manager)
  * Gulp -- recommended to be installed globally
    * sudo npm install --global gulp

## Veeva Template - Guidelines

## Global Assets
  
  This should be the global assets, functionality, and styling for the presentation

  **SCSS/CSS:**
  `src/assets/scss/_main.scss`

  **JavaScript:**
  `src/assets/js/main.js`

  **Images:**
  `src/assets/img/global/global-image.png`

## Setting up a new Slide
  
  All slides, folders, and files should be named as the description of the slide, this is **extremely important**.
  This is per slide assets, functionality, and styling

  **Example:** `concentric-home`

  **HTML:**
  `src/concentric-home.html`

  **SCSS/CSS** (*note: concentric-home needs to be added to the src/assets/scss/style.scss via import*):
  `src/assets/scss/_concentric-home.scss`

  **JavaScript:**
  `src/assets/js/concentric-home.js`

  **Images:**
  `src/assets/img/concentric-home/your-image.png`


## SRC: Directory and File Structure

  * **src**
    * *slide-name.html*
    * assets
        * css
            * output from scss
        * fonts
        * img
            * global
                * global images
            * *slide-name*
                * slide images
        * js
            * lib 
                * jquery.js
            * main.js
            * *slide-name.js*
        * scss
            * _main.scss
            * _mixins.scss
            * _normalize.scss
            * _print.scss
            * *_slide-name.scss*
            * _variables.scss
            * style.scss

## Gulp

  When you first clone the Veeva Template, in the Terminal cd ( cd = current directory || EXAMPLE: `cd /projects/veeva-template` ) into the veeva template directory. 

### Installing NPM dependacies for the Veeva Template

  To install the packages required to run the Gulp task to build the Veeva Template you need to run the following command from the Veeva Template directory
  *Note: sudo maybe required dependenant on security settings*    

    npm install

    or 

    sudo npm install

  Adding new NPM packages:
  *Note: The flag --save will add it to the package.json file so it will be included for version control*

    sudo npm install NPM-PACKAGE --save

### Using Gulp Commands
  
  Using the command `gulp` this will run the *default task* which is to build the entire project into the build directory

    gulp

  Using the command `gulp lint` this will lint all the javascript within the `src/assets/js` directory minus the lib directory

    gulp lint

