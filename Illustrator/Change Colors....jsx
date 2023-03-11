Array.prototype.indexOf||(Array.prototype.indexOf=function(r,e,t){"use strict";return function(i,n){if(null==this)throw TypeError("Array.prototype.indexOf called on null or undefined");var f=r(this),o=f.length>>>0,u=t(0|n,o);if(u<0)u=e(0,o+u);else if(u>=o)return-1;if(void 0===i){for(;u!==o;++u)if(void 0===f[u]&&u in f)return u}else if(i!=i){for(;u!==o;++u)if(f[u]!=f[u])return u}else for(;u!==o;++u)if(f[u]===i)return u;return-1}}(Object,Math.max,Math.min));
var hexToRGB = function(hex) {var r = hex >> 16; var g = hex >> 8 & 0xFF; var b = hex & 0xFF;return [r, g, b];};
function customDraw(){with(this) {graphics.drawOSControl();graphics.rectPath(0, 0, size[0], size[1]);graphics.fillPath(fillBrush);}}

//Class to contain infromation about color changing actions
function colorAction(name, color, type,colorBox) {
    //Name of layers to be affected
    this.name = name;
     //Target color
    this.color = color;
    //Target type of the action. 0==Stroke, 1==Fill
    this.type = type;
	
	this.colorBox = colorBox;
}

var presetNames =  ["Skin", "mouth_base","mouth_dark1","mouth_dark2","mouth_s_light", "mouth_s_dark"];
var presetTypes =  [0, 1,1,1,1,1,1];

//Array of all action that will be run
var actionQueue = [];
//Version of the Illustrator
var version;

var w;
    
main();



function main() {


    if (app.documents.length == 0) return;
    //Get the version of the Illustrator
    version = parseInt(app.version.split(".")[0]);

    //Create window
    w = new Window('dialog{orientation: "column" }');
    //Create container for all areas
    var wrap = w.add('group {orientation: "row"}');
    wrap.alignChildren = "left";


    //Create the left group (area which user uses to setup actions)
    var leftGroup = wrap.add('group {orientation: "column"}');
    
    //Create group for text box
    var nameGroup = leftGroup.add('group');
    nameGroup.add('statictext {text: "Name: "}');
    
    var targetNameTxt =nameGroup.add('edittext {characters: 12, active: true}');
    targetNameTxt.text = "Skin";
    targetNameTxt.active = true

    //Drop Down for preset names
    var myDropdownPreset = nameGroup.add("dropdownlist",undefined,presetNames);
    myDropdownPreset.itemSize = [100, 12];
    myDropdownPreset.selection = 0;
    
    //Stores currently selected color
    var selectedColor = app.activeDocument.defaultFillColor;
      
    var colorButtons = leftGroup.add('group {orientation: "row"}');
    var mainPipet = colorButtons.add("button",undefined,"");
    
    mainPipet.onDraw = customDraw;
    mainPipet.preferredSize = [50, 50];
    colorToBox(selectedColor,mainPipet);
    
    var colorFillBtn = colorButtons.add("button", undefined, "Use Fill Color");
    var colorStrokeBtn = colorButtons.add("button", undefined, "Use Stroke Color");

    colorFillBtn.onClick = function() {
        selectedColor = app.activeDocument.defaultFillColor;
        colorToBox(selectedColor,mainPipet);   
    }

    colorStrokeBtn.onClick = function() {
        selectedColor = app.activeDocument.defaultStrokeColor;
        colorToBox(selectedColor,mainPipet);
    }

    var qButtonGroup = leftGroup.add("panel{orientation: 'row'}");
    var qButton1 = qButtonGroup.add("button", undefined, "Queue stroke action");
    var qButton2 = qButtonGroup.add("button", undefined, "Queue fill action");
    var qButton3 = qButtonGroup.add("button", undefined, "Queue both actions");
	var qButton4 = leftGroup.add("button", undefined, "Read From Document");
	
    qButton1.onClick = function() {
        createAction(actionPanel,targetNameTxt.text, 0,selectedColor);
        w.layout.layout(true);
    }

    qButton2.onClick = function() {

        createAction(actionPanel,targetNameTxt.text, 1,selectedColor);
        w.layout.layout(true);
    }
    qButton3.onClick = function() {

        createAction(actionPanel,targetNameTxt.text, 2,selectedColor);
        w.layout.layout(true);
    }
	
	   qButton4.onClick = function() {

        ReadFromDocument(app.activeDocument);
		
		
		
        w.layout.layout(true);
    }
	
	
	
 
    var rightGroup = wrap.add('group {orientation: "column"}');
    rightGroup.alignment = [ScriptUI.Alignment.LEFT, ScriptUI.Alignment.TOP]
    rightGroup.add('statictext {text: "Action Queue "}')
  
    rightGroup.preferredSize = [186, 0];
    
    var actionPanel = rightGroup.add('group {orientation: "column"}');
    actionPanel.alignChildren = "top";
    
    leftGroup.add('statictext {text: "Apply To Documents? "}');

    var ExecuteButtons = leftGroup.add('group {orientation: "row"}');

    var eb1 = ExecuteButtons.add("button", undefined, "To All");
    var eb2 = ExecuteButtons.add("button", undefined, "To Current");
    var eb3 = ExecuteButtons.add("button", undefined, "Cancel");

    colorToBox(selectedColor,mainPipet);

    mainPipet.onClick =  function() {selectedColor = onPippetClicked(selectedColor,mainPipet); }

    eb1.onClick = function() {
        w.close();
        for (var q = 0; q < app.documents.length; q++) RunActionsToDocument(app.documents[q]);
    }

    eb2.onClick = function() {
        RunActionsToDocument(app.activeDocument);
        w.close();
    }
    myDropdownPreset.onChange = function() {
        targetNameTxt.text = myDropdownPreset.selection.text;
        targetNameTxt.active = true;
    }

w.onShow = function(){    for(var i =0; i<presetNames.length; i++){
        createAction(actionPanel,presetNames[i],presetTypes[i], app.activeDocument.defaultFillColor)    ;    
          w.layout.layout(true);
          w.center();
        }}; 

    w.show();








}

function RunActionsToDocument(document) {
    var doc = document;
    app.activeDocument = doc;
    doc.activate();
    // choose all page elements
    for (var i = 0; i < document.pathItems.length; i++) {
        var myLayer = document.pathItems[i];

        if (!myLayer.editable) continue;

        if (myLayer.typename == "CompoundPathItem")
            for (var u = 0; u < myLayer.pathItems.length; u++) DoAction(myLayer.pathItems[u]);

        if (myLayer.typename == "PathItem") DoAction(myLayer);

    }

    if (doc.fullName.created) doc.save();

}


function ReadFromDocument(document){
	
	
	    var doc = document;
    app.activeDocument = doc;
    doc.activate();
    // choose all page elements
    for (var i = 0; i < document.pathItems.length; i++) {
        var myLayer = document.pathItems[i];
		
        if (myLayer.typename == "CompoundPathItem")
            for (var u = 0; u < myLayer.pathItems.length; u++) {
				
				
				ReadAction(myLayer.pathItems[u]);
				}

        if (myLayer.typename == "PathItem") ReadAction(myLayer);

    }
	
}

function ReadAction(layer){
	
    var lowercaseName = layer.name.toLowerCase();
    for (var i = 0; i < actionQueue.length; i++) {

        if (actionQueue[i].name == "" || lowercaseName.indexOf(actionQueue[i].name.toLowerCase()) != -1) {

            if ((actionQueue[i].type == 0  || actionQueue[i].type == 2)&& layer.stroked)actionQueue[i].color = layer.strokeColor;

            if ((actionQueue[i].type == 1 || actionQueue[i].type == 2) && layer.filled) actionQueue[i].color = layer.fillColor;
            
			colorToBox (actionQueue[i].color, actionQueue[i].colorBox);
			actionQueue[i].colorBox.hide();
			actionQueue[i].colorBox.show();
        }
    }
	
}


//Create new action and create a visual box in queue.
 function createAction(container,txt, type, color) {



        var group = container.add('group {orientation: "row"}');
        //Pipet-box
        var colorBox = group.add("button",undefined,"");
		
		
		var a = new colorAction(txt, color, type, colorBox);
        actionQueue.push(a);
		
		
        colorBox.onDraw = customDraw;
        colorBox.preferredSize = [25, 25];

        colorBox.alignment = [ScriptUI.Alignment.LEFT, ScriptUI.Alignment.CENTER];
        
        //Add OnClick callback to pipet of action queue item..
        colorBox.onClick = function(){
           a.color = onPippetClicked( a.color,colorBox);
        }
   
       colorToBox (a.color, colorBox); 
          
        //target name of the action  
        var txtBox = group.add('edittext {text: "xd"}');
        txtBox.text =txt;
        txtBox.alignment = [ScriptUI.Alignment.FILL, ScriptUI.Alignment.CENTER];
        
        //Target type of the action
        var typeDropdown =   group.add("dropdownlist");
        typeDropdown.add("item","Stroke");
        typeDropdown.add("item","Fill");
         typeDropdown.add("item","Stroke & Fill");
         
        typeDropdown.selection = typeDropdown.items[type];

        
        typeDropdown.onChange = function(){
            a.type = typeDropdown.selection.index;
            }

        txtBox.onChange  = function(){
            a.name = txtBox.text;                
            }


        var deleteAbtn= group.add("button", undefined, "X");
        deleteAbtn.preferredSize = [25, 25];
        //OnClick delete this action
        deleteAbtn.onClick = function() {

            actionQueue.splice(actionQueue.indexOf(a), 1);
            container.remove(group);
            w.layout.layout(true);
            container.alignChildren = "top";
        }
        deleteAbtn.alignment = [ScriptUI.Alignment.RIGHT, ScriptUI.Alignment.CENTER];

    }

//Set color of a pipet box
    function colorToBox(color, target) {

        var RGBColor = color;
        //Convert CMYK to RGB so that Pipet-box can display it. 
        if (RGBColor.typename == "CMYKColor") {


            var c = color.cyan / 100;
            var m = color.magenta / 100;
            var y = color.yellow / 100;
            var k = color.black / 100;

            var r = 1 - Math.min(1, c * (1 - k) + k);
            var g = 1 - Math.min(1, m * (1 - k) + k);
            var b = 1 - Math.min(1, y * (1 - k) + k);

            target.fillBrush = target.graphics.newBrush(target.graphics.BrushType.SOLID_COLOR, [r, g, b], 1);
        }
    
    else if (RGBColor.typename == "RGBColor")target.fillBrush = target.graphics.newBrush(target.graphics.BrushType.SOLID_COLOR, [RGBColor.red / 255, RGBColor.green / 255, RGBColor.blue / 255], 1);



    }

function onPippetClicked(targetColor, targetBox){
    
            //If version newer than CS5, use modern color pippet tool (might not work on newer versions, the actual earliest supported version is unknown at this point)
            /*
            if (version > 15) targetColor = app.showColorPicker(targetColor);    
        else {
            //For CS5 and older use legacy color pippet
            var color_decimal = $.colorPicker();
            var color_hexadecimal = color_decimal.toString(16);
            var color_rgb = hexToRGB(parseInt(color_hexadecimal, 16));
            
            //Convert color to CMYK if necessary
            if (app.activeDocument.documentColorSpace == DocumentColorSpace.CMYK)
            targetColor = rgb2cmyk(color_rgb);

             else {
                targetColor.red = color_rgb[0];
                targetColor.green = color_rgb[1];
                targetColor.blue = color_rgb[2];
            }
        
        }
    */
targetColor = app.showColorPicker(targetColor);  
       colorToBox (targetColor, targetBox);
    return targetColor;
    }

function DoAction(layer) {
    if (!layer.editable) return;

    var lowercaseName = layer.name.toLowerCase();
    for (var i = 0; i < actionQueue.length; i++) {

        if (actionQueue[i].name == "" || lowercaseName.indexOf(actionQueue[i].name.toLowerCase()) != -1) {

            if ((actionQueue[i].type == 0  || actionQueue[i].type == 2)&& layer.stroked) layer.strokeColor = actionQueue[i].color;

            if ((actionQueue[i].type == 1 || actionQueue[i].type == 2) && layer.filled) layer.fillColor = actionQueue[i].color;
            
        }
    }
}


function rgb2cmyk(rgbColor) {
    var computedC = 0;
    var computedM = 0;
    var computedY = 0;
    var computedK = 0;

    // BLACK
    if (rgbColor[0] == 0 && rgbColor[1] == 0 && rgbColor[2] == 0) {
        computedK = 1;
        return [0, 0, 0, 1];
    }


    computedC = 1 - (rgbColor[0] / 255);
    computedM = 1 - (rgbColor[1] / 255);
    computedY = 1 - (rgbColor[2] / 255);
    var minCMY = Math.min(computedC,Math.min(computedM, computedY));
    computedC = (computedC - minCMY) / (1 - minCMY);
    computedM = (computedM - minCMY) / (1 - minCMY);
    computedY = (computedY - minCMY) / (1 - minCMY);
    computedK = minCMY;

    var cmyk = new CMYKColor(computedC, computedM, computedY, computedK);
    cmyk.cyan = computedC * 100;
    cmyk.magenta = computedM * 100;
    cmyk.yellow = computedY * 100;
    cmyk.black = computedK * 100;

    return cmyk;
}