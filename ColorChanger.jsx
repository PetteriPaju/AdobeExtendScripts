// This script will open a window, that allows user to setup color chnaging actions
//All layers, wtih given name will be changed to corresponding color. Color change affects both shape-layers and pixel layers.


//@include "TracingUtilities.jsx"
//@include "SmartFill.jsx"
Array.prototype.indexOf||(Array.prototype.indexOf=function(r,e,t){"use strict";return function(i,n){if(null==this)throw TypeError("Array.prototype.indexOf called on null or undefined");var f=r(this),o=f.length>>>0,u=t(0|n,o);if(u<0)u=e(0,o+u);else if(u>=o)return-1;if(void 0===i){for(;u!==o;++u)if(void 0===f[u]&&u in f)return u}else if(i!=i){for(;u!==o;++u)if(f[u]!=f[u])return u}else for(;u!==o;++u)if(f[u]===i)return u;return-1}}(Object,Math.max,Math.min));
function customDraw() {with(this) {graphics.drawOSControl(); graphics.rectPath(0, 0, size[0], size[1]);graphics.fillPath(fillBrush);}}

var defaultPath="~/Documents/AdobePresets/";
var defaultName = "New Color Preset";
const kMySettings = "ColorChangerSettings";
const kMyString = app.stringIDToTypeID( "myString" );

var recolorExpr = /recolor/;






var presetNames = ["skin_base", "skin_dark1", "skin_dark2", "skin_light", "skin_outline"];

function colorAction(name, color, applyGlow, isStroke) {

    this.name = name;
    this.color = color;
    this.applyGlow= applyGlow;
	this.isStroke= isStroke;
}


var DefColour = app.foregroundColor



var w;
var actionQueue = [];

var documentList = [];
var actionGroup;

init();

var selectedLayers;
function init() {
    
    getSettings();
    selectedLayers = getSelectedLayersAll(app.activeDocument);
    for (var i = 0; i < presetNames.length; i++) actionQueue.push(new colorAction(presetNames[i], DefColour,true,false));
    CreateWindow();

}


function CreateWindow() {

    w = new Window("dialog", "Color Changer", undefined);
    w.margins = 10;
    w.alignChildren = "left";
    
     w.add("button", undefined, "Close").onClick = function() {
        w.close();
    }

    var dcmntSelector = w.add("dropdownlist");

    var current = 0;
    for (var i = 0; i < app.documents.length; i++) {
        dcmntSelector.add("item", app.documents[i].name);
        if (app.documents[i] == app.activeDocument) current = i;
    }

    dcmntSelector.selection = dcmntSelector.items[current];

    dcmntSelector.onChange = function() {
        app.activeDocument = app.documents[dcmntSelector.selection.index];
    }

  var xmlGroup = w.add('group {orientation: "row"}');


xmlGroup.add("button",undefined,"LoadXML").onClick = OpenXMLDialog;
    
xmlGroup.add("button",undefined,"Save XML").onClick = CreateXML;
    

     actionGroup = w.add("panel");

    for (var i = 0; i < actionQueue.length; i++)  createColorPalette(actionGroup, actionQueue[i]);
    

    w.add("button", undefined, "Add Action").onClick = function() {
        var ca = new colorAction("new Action", DefColour);
        actionQueue.push(ca);
        createColorPalette(actionGroup, ca);
        w.layout.layout(true);
    }

    w.add("button", undefined, "Execute On Selection").onClick = function() {
		 SetupRecolor();
        app.activeDocument.suspendHistory("Color Change", "RunOnSelection()");
         w.close();
         alert("Complete!");
    }

   w.add("button", undefined, "Execute to Document").onClick = function() {
        SetupRecolor();
        app.activeDocument.suspendHistory("Color Change", "RunOnThisDocument()");
         w.close();
        alert("Complete!");
    }

    w.show();
}


function SetupRecolor(){
    actionQueue.push(new colorAction("recolor", DefColour,true, false));
    
    }

function createColorPalette(root, cAction) {

    var g = root.add('group {orientation: "row"}');
    g.preferredSize = [300, 25];

    var subGroup = g.add('group {orientation: "row"}');
    subGroup.alignment = ["left", "center"];


    var deletebtn = subGroup.add("button", undefined, "X");

    deletebtn.onClick = function() {

        actionQueue.splice(actionQueue.indexOf(cAction), 1);
        root.remove(g);

        w.layout.layout(true);
    }

    deletebtn.preferredSize = [20, 20];

    var txt = subGroup.add("edittext", undefined, cAction.name);
    txt.onChange = function() {
        cAction.name = txt.text
    };

    txt.preferredSize = [100, 20];
    txt.alignment = ["left", "center"];

    var subgroup2 = g.add('group');

    subgroup2.preferredSize = [25, 20];
    subgroup2.alignment = ["right", "center"];
    subgroup2.margins = 0;
    var box = subgroup2.add("button", undefined, "");
    box.onDraw = customDraw;
    box.fillBrush = box.graphics.newBrush(box.graphics.BrushType.SOLID_COLOR, [cAction.color.rgb.red / 255, cAction.color.rgb.green / 255, cAction.color.rgb.blue / 255, 1]);
    box.preferredSize = [25, 20];

    box.onClick = function() {

        w.close();
        // set starting color
        var historyState = activeDocument.activeHistoryState;
        var startColor = app.foregroundColor;
        var originalUnits = app.preferences.rulerUnits;
        app.preferences.rulerUnits = Units.PIXELS;
        app.activeDocument.selection.select([[0, 0], [1, 0], [1, 1], [0, 1]]);
        app.preferences.rulerUnits = originalUnits;
        // create colour layer
        CreateSolidLayer(startColor);
        // call the color picker
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated(stringIDToTypeID("contentLayer"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc.putReference(charIDToTypeID("null"), ref);
        var modeDesc = new ActionDescriptor();
        var colorDesc = new ActionDescriptor();
        colorDesc.putDouble(charIDToTypeID("Rd  "), startColor.rgb.red);
        colorDesc.putDouble(charIDToTypeID("Grn "), startColor.rgb.green);
        colorDesc.putDouble(charIDToTypeID("Bl  "), startColor.rgb.blue);
        modeDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
        desc.putObject(charIDToTypeID("T   "), stringIDToTypeID("solidColorLayer"), modeDesc);

        try {
            executeAction(charIDToTypeID("setd"), desc, DialogModes.ALL)
        } catch (e) {}
        // get user's color and set to forground color
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        var desc = executeActionGet(ref)
        var adjList = desc.getList(stringIDToTypeID('adjustment'));
        var adjDesc = adjList.getObjectValue(0);
        var colorDesc = adjDesc.getObjectValue(stringIDToTypeID('color'));
        var Colour = new SolidColor();
        Colour.rgb.red = colorDesc.getDouble(charIDToTypeID('Rd  '));
        Colour.rgb.green = colorDesc.getDouble(charIDToTypeID('Grn '));
        Colour.rgb.blue = colorDesc.getDouble(charIDToTypeID('Bl  '));
        // restore

        while (activeDocument.activeHistoryState != historyState) {

            var idDlt = charIDToTypeID("Dlt ");
            var desc52 = new ActionDescriptor();
            var idnull = charIDToTypeID("null");
            var ref21 = new ActionReference();
            var idHstS = charIDToTypeID("HstS");
            var idCrnH = charIDToTypeID("CrnH");
            ref21.putProperty(idHstS, idCrnH);
            desc52.putReference(idnull, ref21);
            executeAction(idDlt, desc52, DialogModes.NO);

        }
    


        cAction.color = Colour;
        box.fillBrush = box.graphics.newBrush(box.graphics.BrushType.SOLID_COLOR, [cAction.color.rgb.red / 255, cAction.color.rgb.green / 255, cAction.color.rgb.blue / 255, 1]);

        CreateWindow();

    }
        var toggle =  g.add('checkbox', undefined, "Apply Glow");
        toggle.onClick = function() {
        cAction.applyGlow = toggle.value;
          }
      
      toggle.value = cAction.applyGlow;
	  
	     var toggle2 =  g.add('checkbox', undefined, "isStroke?");
        toggle2.onClick = function() {
        cAction.isStroke = toggle.value;
          }
      
      toggle2.value = cAction.isStroke;

}



function RunOnThisDocument(){
    
	RunOnDocument(app.activeDocument);
}

function RunOnSelection(){
    
	    var layers = [];
	
	   for (var i = 0; i < actionQueue.length; i++) {
        layers.push([]);
        actionQueue[i].name = actionQueue[i].name.toLowerCase();

    }

	getLayerSetsDataSelected(actionQueue,layers, selectedLayers);
  
    for (var i = 0; i < layers.length-1; i++) 
        ProcessActionForArray(layers[i],actionQueue[i]);

    ProcessRecolors(layers[layers.length-1]);
}

function RunOnDocument(document) {

    var layers = [];

//Allocate layers-array, each element will contain child arrays, which contain all layers which names correpond to an action.
    for (var i = 0; i < actionQueue.length; i++) {
        layers.push([]);
        actionQueue[i].name = actionQueue[i].name.toLowerCase();

    }
    
    getLayerSetsData(actionQueue,layers);
    
 
    for (var i = 0; i < layers.length-1; i++) 
        ProcessActionForArray(layers[i],actionQueue[i]);
           
ProcessRecolors(layers[layers.length-1]);

 collapseAllGroups();
}


function ProcessRecolors(recolorArray){
    if(recolorArray.length > 0){
        deselectLayers();
        var thisDocument = activeDocument;
             multiSelectByIDs(recolorArray);
                var ref = new ActionReference(); 
          ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") ); 
          var desc = executeActionGet(ref); 
          if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){ 
             desc = desc.getList( stringIDToTypeID( 'targetLayers' )); 
              var c = desc.count 
               for(var i=0;i<c;i++){ 
                try{ 
                   activeDocument.backgroundLayer; 
                   makeActiveByIndex(desc.getReference(i).getIndex()); 
    
                   openSmartObject(null);
    
                    if(app.activeDocument == thisDocument)continue;
                   RunOnThisDocument();
                        app.activeDocument.save();
                        app.activeDocument.close();
                   app.activeDocument = thisDocument;
                   
                }catch(e){ 
                    makeActiveByIndex(desc.getReference(i).getIndex()+1); 
                 openSmartObject(null);
                                 if(app.activeDocument == thisDocument)continue;
    
                 RunOnThisDocument();
                 app.activeDocument.save();
                    app.activeDocument.close();
                      app.activeDocument = thisDocument;
                } 
              } 
          }
    }
}

function ProcessActionForArray(layerArray, actionQueueEntry){

    if(layerArray.length == 0)return;
    deselectLayers();
    isOutline = actionQueueEntry.name.indexOf("outline", 0) != -1;
    var newColor = actionQueueEntry.color;
  multiSelectByIDs(layerArray);

 if(!isOutline){
            
var ref = new ActionReference(); 
ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") ); 
var desc = executeActionGet(ref); 
if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){ 
   desc = desc.getList( stringIDToTypeID( 'targetLayers' )); 
    var c = desc.count 
     for(var z=0;z<c;z++){ 
      try{ 
         activeDocument.backgroundLayer; 
         makeActiveByIndex(desc.getReference(z ).getIndex() ); 
             FillStyle(app.activeDocument.activeLayer, newColor);
         if(actionQueueEntry.isStroke) FillSolidStroke(app.activeDocument.activeLayer, newColor);
         else  FillLayer(app.activeDocument.activeLayer, newColor);
      }catch(e){ 
         makeActiveByIndex(desc.getReference(z ).getIndex()+1); 
            FillStyle(app.activeDocument.activeLayer, newColor);
         if(actionQueueEntry.isStroke) FillSolidStroke(app.activeDocument.activeLayer, anewColor);
         else  FillLayer(app.activeDocument.activeLayer, newColor);
      } 
    } 
}          
     }
 else FillOutline(newColor);         

}

function getLayerSetsData(actionQueue,layerCollection)
{
    //var count = 0;//set counter for multi-dimensional array
    var lyrSets = [];
    var layerSets = 0
    
try{app.activeDocument.backgroundLayer;}
catch(e){layerSets=1}

    while (true)
    {
        var ref = new ActionReference();
        ref.putIndex(charIDToTypeID('Lyr '), layerSets);
        try{var d1 = executeActionGet(ref)} catch (err){ break;};

        var c2t = function (s){return app.charIDToTypeID(s);};
        var s2t = function (s){return app.stringIDToTypeID(s);};
        var lyrSet = {};

        lyrSet.type = d1.getInteger(s2t("layerKind"));
        lyrSet.name = d1.getString(c2t("Nm  "));
        lyrSet.id = d1.getInteger(s2t("layerID"));
        
       
              for (var q = 0; q < actionQueue.length; q++) {         
            
            if (lyrSet.name.toLowerCase().indexOf(actionQueue[q].name) != -1){ layerCollection[q].push(lyrSet.id);}
        }
        
        layerSets++;
    }; 
};

function getLayerSetsDataSelected(actionQueue,layerCollection,seledctedArray)
{    
	for(var i = 0; i<seledctedArray.length; i++){
       
              for (var q = 0; q < actionQueue.length; q++) {         
            
            if (seledctedArray[i].name.toLowerCase().indexOf(actionQueue[q].name) != -1){ layerCollection[q].push(seledctedArray[i].id);}
        }
	}
};





function doesIdExists( id ){// function to check if the id exists
   var res = true;
   var ref = new ActionReference();
   ref.putIdentifier(charIDToTypeID('Lyr '), id);
    try{var desc = executeActionGet(ref)}catch(err){res = false};
    return res;
}

function multiSelectByIDs(ids) {
  if( ids.constructor != Array ) ids = [ ids ];
  i

    var layers = new Array();
    var id54 = charIDToTypeID( "slct" );
    var desc12 = new ActionDescriptor();
    var id55 = charIDToTypeID( "null" );
    var ref9 = new ActionReference();
    for (var i = 0; i < ids.length; i++) {
       if(doesIdExists(ids[i]) == true){// a check to see if the id stil exists
           layers[i] = charIDToTypeID( "Lyr " );
           ref9.putIdentifier(layers[i], ids[i]);
       }
    }


    desc12.putReference( id55, ref9 );
    var id58 = charIDToTypeID( "MkVs" );
    desc12.putBoolean( id58, false );
    
    if(ids.length >0)
    executeAction( id54, desc12, DialogModes.NO );
}

function CreateSolidLayer(startColor) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID('contentLayer'));
    desc.putReference(charIDToTypeID('null'), ref);
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putDouble(charIDToTypeID('Rd  '), startColor.rgb.red);
    desc3.putDouble(charIDToTypeID('Grn '), startColor.rgb.green);
    desc3.putDouble(charIDToTypeID('Bl  '), startColor.rgb.blue);
    desc2.putObject(charIDToTypeID('Clr '), charIDToTypeID('RGBC'), desc3);
    desc1.putObject(charIDToTypeID('Type'), stringIDToTypeID('solidColorLayer'), desc2);
    desc.putObject(charIDToTypeID('Usng'), stringIDToTypeID('contentLayer'), desc1);
    executeAction(charIDToTypeID('Mk  '), desc, DialogModes.NO);
};

function CreateAction(name){
    var ca = new colorAction(name, DefColour, true);
   actionQueue.push(ca);
   createColorPalette(actionGroup, ca);
   w.layout.layout(true);	
}

function CreateActionFromXML(xmlObject){

    var ca = new colorAction(name, new SolidColor(), true);        
        ca.name = xmlObject.name[0].toString(); 
        ca.color.rgb.hexValue = xmlObject.colorHex[0].toString();
        if(xmlObject.applyGlow[0] != null)
           ca.applyGlow = (xmlObject.applyGlow[0].toString() === 'true'); 
           else ca.applyGlow =true;
           
         if(xmlObject.isStroke[0] != null)
           ca.isStroke = (xmlObject.isStroke[0].toString() === 'true'); 
           else ca.isStroke =false;   
   actionQueue.push(ca);
   createColorPalette(actionGroup, ca);
   w.layout.layout(true);

}

function OpenXMLDialog(){
    
    var file = new File(defaultPath + defaultName);   
   file = file.openDlg();
   if(file == null)return;
   
       
   file.open("r");  
      defaultPath = file.path + "/";;
       saveSettings();
   var str = file.read();
   var xml = new XML(str);
   
   while(actionGroup.children.length>0) actionGroup.remove(actionGroup.children[0]);  
    actionQueue = [];
   
   for(var i =0; i<xml.elements().length(); i++)CreateActionFromXML(xml.elements()[i]);

    w.layout.layout(true);  
    }

function CreateXML(){ 
var xml= new XML("<ColorPreset></ColorPreset>");
for(var i =0; i<actionQueue.length; i++)  xml = xml.appendChild (new XML("<Preset> <name> " + actionQueue[i].name + "</name>" + "<colorHex>" + actionQueue[i].color.rgb.hexValue + "</colorHex>  <applyGlow>" + actionQueue[i].applyGlow+"</applyGlow> <isStroke>" + actionQueue[i].isStroke+"</isStroke> </Preset>" ));
    
    
    var xmlFile = new File(defaultPath + defaultName);
    xmlFile = xmlFile.saveDlg("Save Preset","*.xml");
    
if(xmlFile != null){
    xmlFile.open("w");

    xmlFile.writeln(xml);
    xmlFile.close();
    
    defaultPath = xmlFile.path + "/";
 saveSettings();
}
 return xml;
}


function saveSettings()
{
  var desc = new ActionDescriptor().putString(kMyString, defaultPath);
  // "true" means setting persists across Photoshop launches.
  app.putCustomOptions( kMySettings, desc, true );
}

function getSettings()
{
    try{
  var desc = app.getCustomOptions( kMySettings );
  defaultPath = desc.getString(kMyString);
  }
catch(e){

    }
}



