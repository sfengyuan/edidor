export function genFile (identifier, themeName) {
  return `/*
Hugo Edidor theme wild mode exported.
homepage: https://github.com/jacobsun/edidor
Usage:
1. Throw me to your site root folder/static/css directory, you can rename me to whatever you like.
2. Copy the code below to your config file.

--------
[[menu.main]]
parent = "Theme"
identifier = "${identifier}"
name = "${themeName}"
url = "#"
weight = 30
--------

3. Change the field 'name' and 'weight' to whatever you like. Leave others alone, and don't add your custom field, hugo doesn't support that, though I really hope so :/.
*/`
}
