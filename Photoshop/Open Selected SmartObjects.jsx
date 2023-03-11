//@include "TracingUtilities.jsx"
main();
function main(){
    
    if(app.documents.length == 0)return;   
    if(app.activeDocument == null)return;  
    
    //Get all selected layers
    var selectedLayers = getSelectedLayersAll(app.activeDocument);
    //Embedded or lniked Vector layers
    var selectedSublayer = [];
    //Embedded or linked raster layers, these are opened last
    var selectedExternalLayer = [];

    //Parse all selected layers for outlines
        for(var i=0;i<selectedLayers.length;i++){  

            loopChildren(selectedLayers[i],selectedSublayer,selectedExternalLayer);

            }
        
    deselectLayers();

    OpenArray(selectedSublayer,app.activeDocument);
    OpenArray(selectedExternalLayer,app.activeDocument);

    collapseAllGroups();


/*
if(selectedSublayer.length>10){
var bt = new BridgeTalk();
bt.target = "illustrator";
bt.body = 'app.beep(); alert("Files Opened")';
bt.onResult = function (inBT) { result = eval(inBT.body); };
bt.onError = function (inBT) { alert(inBT.body); };
bt.send(8);
}*/

}


//Loop the given array of layers for outlines


    function loopChildren(layer, array,selectedExternalLayer){
   
        if(noOutlineExpr.test(layer.name))return;

        // If Group, loop children
        if(layer.typename == 'LayerSet'){  
                

            for(var i = 0; i< layer.layers.length; i++){
            
                loopChildren(layer.layers[i],array,selectedExternalLayer);

                //Break execution if name has #Break statement
                if(OutlineBreakExpr.test(layer.layers[i].name))break;
                }
            
            }  
        //if a siingle layer, check for an outline-name
        else {      
             var nm =layer.name.toLowerCase();
             
            if(nm.indexOf("outline",0) !== -1){


            //if layer is embedded or linked psb layer, add it to secondary array to be opened last. Otherwise add it to normal array.
            if(!isPSB(layer))array.push(layer);
            else selectedExternalLayer.push(layer);
        }
            }  
    }



