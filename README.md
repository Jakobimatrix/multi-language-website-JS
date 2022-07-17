# multi-language-website-JS
A simple javascript to support multiple languages on a webpage were useing PHP or similar solutions are not possible.

This script swaps the visibility of HTML elements with speciffic class names. An example usage is provided.
You only need to change some style parameter in language.js as well as the path to the flag pictures and which languages you want to support.
For more detail please have a look into language.js

Feel free to improve the script and share your improvements.

Advantages useing this script:
1. Fast installation
2. No further dependencies
3. No code dublication needed / No need to have a copy of each side for each language.
4. The text is at the place were in will be shown and not stored in some database.
5. Usable for Wordpress:
   * Upload the script to your wordpress.
   * Inside an Article just use the HTML tags with the corresponding language classname.
   * For the menue you can also set a class name: Customizer -> Menue -> check "CSS-Classes" in the options and than just add a class name to the menue entry.
   * In contrast: Useing a plugin like Polylang would require you to have a copied-side for each Language. Meaning if you want to change a picture, you'll have to do it for each language (but you wouldnt need to cheat with the Menue).
6. No reload of the webpage when changeing language.

Disadvantages useing this script:
1. Its JavaScript.
2. A very small amount of visitors blocks JavaScript and/or cookies.
3. You need to address the cookie in your impressum / privacy page (at least if you are in the EU).
4. If your side loades slow, because of a low internet connection or your side just has to much to load (shrink your pictures, use jpg compression)
   The User will shortly see all languages displayed.
5. At every visit all the text/languages needs to be downloaded.

Wordpress Installation:
1. You need to put the script into */wp-content/themes/THE NAME OF YOUR ACTIVE THEME/js/language.js*
2. In your Wordpres go to Design -> Theme-Editor and choose the "Theme-Functions" (functions.php)
3. one line below `<?php` you need to add the following lines of code:
```php
function fuege_javascripts_ein() {
    $url_Language = get_template_directory_uri().'/js/language.js';
    wp_enqueue_script( 'language', $url_Language, false, null, true );
}
add_action( 'wp_enqueue_scripts', 'fuege_javascripts_ein' );
```

Wordpress Menue Items:
This script also works for the Wordpress menue items if we use a little force:
1. Go to Appearance -> Menue and select "screen options" (currently top right corner) and activate "CSS Classes"
2. You need to have all menue items for each language ready. You can then add the CSS class of the language to the corressponding menue item. So if you have 3 Languages, you need to have each menue item three times one for each langage pointing to the same page.


