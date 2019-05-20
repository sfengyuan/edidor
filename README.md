# Edidor
[中文](https://github.com/jacobsun/edidor/blob/master/README-zh.md)

A hugo theme that looks like an editor with a builtin style generator, INFINITE COLOR MODE from a market perspective. 😂


Thanks for [@GoHugoIO](https://twitter.com/GoHugoIO)'s [promotion](https://twitter.com/GoHugoIO/status/1127175277673631744)

# Screenshot
This is the light mode.
![screenshot](https://raw.githubusercontent.com/jacobsun/edidor/master/images/screenshot.png)
This is the dark mode.
![screenshot](https://raw.githubusercontent.com/jacobsun/edidor/master/images/dark.png)

Now this is the interesting part -- wild mode.
![screenshot](https://raw.githubusercontent.com/jacobsun/edidor/master/images/wild_mode.png)
Wild mode too.
![screenshot](https://raw.githubusercontent.com/jacobsun/edidor/master/images/wild_mode2.png)
Still wild mode.
![screenshot](https://raw.githubusercontent.com/jacobsun/edidor/master/images/wild_mode3.png)

# Wild Mode Demo
I don't need to post more images, you can generate it by your self. Just head to [my site](https://ziox.xyz/). Keep clicking 'Theme > Wild mode'

**No guarantee for what colors you can get** 🙃

# Features

- viewport unit, test from 1920 x 1080 desktop to 320 x 568 mobile
- No frameworks, only a Lodash `throttle` and an easing function from d3.ease
- All static icons are inline svgs, coloring available due to mask-image
- syntax hightlighting by highlight.js, can be turn off
- Disqus comment system
- multiple languages

i18n isn't completed!!
NO IE support, and does in future!

# Installation
Inside the folder of your Hugo site run:

```
cd themes
git submodule add https://github.com/jacobsun/edidor
```
Or
```
cd themes
git clone https://github.com/jacobsun/edidor
```

# Usage

Copy `config.toml` in `exampleSite` to your site root folder, you are good to go, you can also find more information there.

# Config

## Logo

Logo images should be `svg` file, they are in the root/static/images/ directory. You need to have three versions. Just copy and rename theme, if you don't want to use separate design.

- logo.svg(default in dark mode!)
- logo_light.svg
- logo_wild.svg

The theme will display the appropriate logo automatically.

## Menu
Some menu entries are important to the theme, if you change it, some functions will stop to work.

Do not change these fields:
- the name of 'Theme'
- all 'identifier' shipped with the theme.

Beyond those, you can customize it as you like.

*Why the field 'Theme' in menu doesn't use identifier, but name?*

I tried, but when I add an identifier to the top menu, some weired things happend, this is just a temporary workaroud.

## Wild mode

This is my favourite, and here is how it works.
When you click the 'wild mode' link, some random css color rules will be applied to the page, and also saved in your browser's localStorage.
When you go to another page, thoese rules will be loaded from local machine and applied again.

If you want to publish the local styles to your server end. You have to use custom css in hugo.

## Custom CSS

In your config file: add
```
[params]
    customCss = ["custom.css", ...]
```
Place the `custom.css` to your site root/static/css directory.

## Add wild mode CSS

Click `Export Wild mode`, and enter a theme name, a css file will be downloaded.
You can find the code that you need in this file, and following the above steps.

## Custom JS

In your config file: add
```
[params]
    customJs = ["custom.js", ...]
```
Place the `custom.js` to your site root/static/js directory.

## Custom syntax highlighting

The theme use [hightlight.js](https://highlightjs.org/) library, if you want to use custom hightlight.js, add it as custom js, and add this to your config.
```
useCustomSyntaxHighlight = true
```
You don't need to run the code manually.

# Todo

# Other
This is a new theme, if you found any problems, feel free to open an issue, and contribution is welcome! 😊

# FAQ


# License
MIT
