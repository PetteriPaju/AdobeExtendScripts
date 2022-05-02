var autoSave = true;


//here you can change the stroke percentualy
main();
 
 
function main(){
    
var w = new Window ('dialog');
    var grp = w.add ('group');
        grp.add ('statictext {text: "Set Width (%): "}');

        var width = grp.add ('edittext {characters: 12, active: true}');
        width.onChanging = function () {slider.value =Number (width.text);};
        width.textselection = "80";
 
    var slider = w.add ('slider {minvalue: 10, maxvalue: 200, value: 80}');
    slider.onChanging = function () {width.text = Math.round(slider.value)};
    slider.size = "width: 300, height: 30";

   var autoSaveToggle = w.add('checkbox', undefined, "Auto Save?");
   autoSaveToggle.onClick = function() {
        autoSave= autoSaveToggle.value;
      }
      autoSaveToggle.value = true;

    w.add ('statictext {text: "Apply To Documents? "}');
    var buttons = w.add ('group {orientation: "row"}');
 
    buttons.add ("button", undefined, "All").onClick = function () {w.close(); w.hide(); DoAll(parseFloat(width.text)/100);  $.gc();};
    buttons.add ("button", undefined, "Current").onClick = function () {w.close(); setSizeToDocument(app.activeDocument,parseFloat(width.text)/100);  $.gc();}  ;
    buttons.add ("button", undefined, "Selection").onClick = function () {w.close(); setSizeToSelection(parseFloat(width.text)/100);   $.gc();}  ;
    buttons.add ("button", undefined, "Cancel").onClick = function () {w.close();};


w.show();   


    }


function DoAll(p){
  
    	for (var q = 0; q<app.documents.length;q++){
        setSizeToDocument(app.documents[q],p);    
    }
}


function ChangeWidthOfLayer(layer,percentage){

if(!layer.editable)return;

    if(layer.typename=="CompoundPathItem"){
        for(var u=0;u<layer.pathItems.length;u++)
            ChangeWidthOfLayer(layer.pathItems[u],percentage);
        }
    else if(layer.typename=="PathItem")
            layer.strokeWidth *= percentage;
             
}

function setSizeToSelection(percentage){
    
    
    if(app.activeDocument == null)return;
    if(app.activeDocument.selection == null)return;
    if(app.activeDocument.selection.length == 0)return;
    
    
    
    for(var i=0;app.activeDocument.selection.length;i++){
        ChangeWidthOfLayer(app.activeDocument.selection[i],percentage);
        }

       if(app.activeDocument.fullName.created && autoSave)app.activeDocument.save();
    
    }



function setSizeToDocument(document,percentage){
    
           app.activeDocument = document;
           document.activate();

    // choose all page elements
    for (var i=0;i<document.pageItems.length;i++)
                ChangeWidthOfLayer(document.pageItems[i],percentage);
           
       if(document.fullName.created && autoSave)document.save();
 
    }
