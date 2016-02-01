
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
  
  - `gulp` this will run the *default task* which is to build the entire project into the build directory.

    *Note: This will run the following tasks: styles, lint, html, scripts, images, fonts, copy*

  - `gulp lint` this will lint all the javascript within the `src/assets/js` directory. 

    *Note: This doesn't not include the `src/assets/js/lib` directory and files*

  - `gulp images` this will optimize and sort all the images from `src/assets/img/global` and `src/assets/img/your-slide` into the corrosponding directory in build

  - `gulp fonts` this will migrate the fonts from src to build for each slides directory

  - `gulp copy` this will copy any files and directories other than what is in the `assets` directory to each slide directory

  - `gulp styles` this will compile the `.scss` files within `src/assets/scss` and output them into the the build directory for each slide. This will also build a copy into `src/assets/css`. 

    *Note: You must add your slides `.scss` file to the `src/assets/scss/style.scss`*

  - `gulp scripts` this will compile the `src/assets/js/main.js` and concatenate the file with each slides `.js` file. This will output into `build/assets/js/main.min.js` for each slides directory in the build directory.

    *Note: If you want to add more libraries to be concatenated with the main.min.js if you find the `gulp.task` for scripts in the `gulpfile.babel.js` in the main directory of the project you can add them below or above `jquery-1.12.0.min.js` depending on which order you want them added.*

  - `gulp html` this will minify and output the html files into their slides directory 

    *Example: `src/homepage-isi.html` will output into `build/homepage-isi/homepage-isi.html`

  - `gulp clean` this will empty the build and .tmp directories

  - `gulp serve` this will start a local server to host the `src` version of the files. **This will also watch any changes to html, scss/css, js, and images and run their gulp task ( scss would compile when changed, etc.. ).** 

    *Note: The terminal will output a message where the server can be located, if you want to serve the build files instead use `gulp serve:build`*

  - `gulp server:build` this will do the same as `gulp serve` but instead it would host the files from the build directory

  - `gulp zip` this will zip each slides directory within the build folder into a directory called `dist` each slide's directory and assets should be zipped individually
