# AdobeExtendScripts
This page contains collection of extensions made for Adobe Illustrator and Phoshop.
Extensions are made using Javascript and Adobe's Extendscript-API.

Disclaimer! All these scripts were made for my personal use and are here for presentation purposes. They are not actively developed and not made for public use. 
With that said they are free to use, but at your own risk. 

While some of the scripts are self contained, there are some that are dependent on each other, so it is recommended that you download all of them if you wish to use them yourself. 

The extensions found are are the following:

## Photoshop

### Smart Fill
Allows you to change color of any type of layer, with a single command. Supports raster layer and vector layers. Changing af style colors is still under development if you want to change color of style use Color Changer extension. 

Smart fill also supports multi selection, so you can modify multiple layers at one. 

Bind RunSmartFill.jsx to hotkey to use.

### Color Changer
A companion tool to Smart fill. Allows changing of color, opacity and shading of layers based on their name. Changes can be applied to the whole document or just selected layers. 

If you wish to make chargers to shape layers stroke, use IsStroke-option, if you wish to apply color to outer glow use isGlow-option.

Each Color Action is run for every layer that has at least partially matching name. 
Styles can be easily saved and loaded with XML files.
Because of the limitations of Extendscript, this process may take a while.


#### Comps to Layers
Converts every Layer Comp inside Smart object to their own Smart Object layer.

## Illustrator

### Change Stroke Width
Allows you to change path stroke width by percentage. Work either document or selection wide. 
Useful when you have lot of strokes with different weight and want to thin them down in unified manner.

### Color Changer
Similar to PS Color Changer. Allows you to change colors of fills and strokes based on name. 





