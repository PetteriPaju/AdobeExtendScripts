//@include "TracingUtilities.jsx"
var currentColorObject;
var time;
function Main(){
   
 if(app.documents.length == 0)return;   
 if(app.activeDocument == null)return;
if(!app.activeDocument.activeLayer)return;
 app.activeDocument.suspendHistory("Smart Fill", "Fill(true)");  
    
    }


function Fill(applyToGlow){
  
      var selectedLayers = new Array; 
      var ref = new ActionReference(); 
      ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") ); 
      var desc = executeActionGet(ref); 
      if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){ 
         desc = desc.getList( stringIDToTypeID( 'targetLayers' )); 
          var c = desc.count 
           for(var i=0;i<c;i++){ 
            try{ 
               activeDocument.backgroundLayer; 
               makeActiveByIndex(desc.getReference( i ).getIndex() ); 
                   FillLayer(app.activeDocument.activeLayer, app.foregroundColor, applyToGlow);
            }catch(e){ 
               makeActiveByIndex(desc.getReference( i ).getIndex()+1); 
               FillLayer(app.activeDocument.activeLayer, app.foregroundColor, applyToGlow);
            } 
          } 
      }
       
  }

      
  


function Fill1(applyToGlow){

       var selected =app.activeDocument.activeLayer;
        
        var selectedLayerCount = GetSelectedLayerCount();
        
        if(selectedLayerCount <=1){
                    FillLayer(app.activeDocument.activeLayer, app.foregroundColor, applyToGlow);
                    return;
            }
        
    var arr = getSelectedLayersIdx();
        
    for(var i=0; i< arr.length; i++){     
        
        if(arr[i] == selected)continue;
        makeActiveByIndex(arr[i])
        FillLayer(app.activeDocument.activeLayer, app.foregroundColor, applyToGlow);
  }

    }

function FillLayer(layer, color){  

    if(layer.locked)return;

                var parentVisible =  true;
    
              //To keep layer visibility same as before, we must also check visiibility of parent group of selected smart object.
            if(layer.parent != app.activeDocument){             
               //store whetever parent group was visible before turning it visible. This will ensure that script gets a right visibility value for SmartObject later in code.
                parentVisible =  layer.parent.visible;
                ShowLayer( layer.parent);
                }
             
             //Store Visibility value of smart object.
                var wasVisible = layer.visible;
                ShowLayer( layer);
                
                
        if(layer.kind == LayerKind.NORMAL ){FillArtLayer(layer,color);}
        else if (layer.kind == LayerKind.SOLIDFILL){FillSolidLayer(layer,color);}
        
    //    if(applyToGlow)
         //   FillStyle(app.activeDocument.activeLayer, color);
            
                                //Restore the original visibility for the smartObject.
            layer.visible = wasVisible;

            if(!wasVisible)HideLayer(layer);

            
            //Restore the original visibility for the parent group (if it exists)
              if(layer.parent != app.activeDocument && !parentVisible)    
              HideLayer(layer.parent);   
}

function ApplyOpacityToActiveLayer(opacityValue){
    
// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc233 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref54 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref54.putEnumerated( idLyr, idOrdn, idTrgt );
    desc233.putReference( idnull, ref54 );
    var idT = charIDToTypeID( "T   " );
        var desc234 = new ActionDescriptor();
        var idOpct = charIDToTypeID( "Opct" );
        var idPrc = charIDToTypeID( "#Prc" );
        desc234.putUnitDouble( idOpct, idPrc, opacityValue);
    var idLyr = charIDToTypeID( "Lyr " );
    desc233.putObject( idT, idLyr, desc234 );
executeAction( idsetd, desc233, DialogModes.NO );

}

function FillArtLayer(layer, color){
    if(layer.locked)return;
    app.activeDocument.activeLayer = layer;
    
    app.activeDocument.selection.fill(color.rgb, ColorBlendMode.NORMAL,100,true);

    app.activeDocument.selection.deselect();
    
    }



function FillSolidLayer(layer, color){

    app.activeDocument.activeLayer = layer;
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(sTID("contentLayer"), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);    var desc2 = new ActionDescriptor();    var desc3 = new ActionDescriptor();
    desc3.putDouble(cTID('Rd  '), color.rgb.red);
    desc3.putDouble(cTID('Grn '), color.rgb.green );
    desc3.putDouble(cTID('Bl  '), color.rgb.blue );
    desc2.putObject(cTID('Clr '), sTID("RGBColor"), desc3);    desc1.putObject(cTID('T   '), sTID("solidColorLayer"), desc2);    executeAction(cTID('setd'), desc1, DialogModes.NO);

  
    }
	
	function FillSolidStroke(layer, color){
	 
		  app.activeDocument.activeLayer = layer;
		
			var idsetd = charIDToTypeID( "setd" );
    var desc2560 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref797 = new ActionReference();
        var idcontentLayer = stringIDToTypeID( "contentLayer" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref797.putEnumerated( idcontentLayer, idOrdn, idTrgt );
    desc2560.putReference( idnull, ref797 );
    var idT = charIDToTypeID( "T   " );
        var desc2561 = new ActionDescriptor();
        var idstrokeStyle = stringIDToTypeID( "strokeStyle" );
            var desc2562 = new ActionDescriptor();
            var idstrokeStyleContent = stringIDToTypeID( "strokeStyleContent" );
                var desc2563 = new ActionDescriptor();
                var idClr = charIDToTypeID( "Clr " );
                    var desc2564 = new ActionDescriptor();
                    var idRd = charIDToTypeID( "Rd  " );
                    desc2564.putDouble( idRd, color.rgb.red);
                    var idGrn = charIDToTypeID( "Grn " );
                    desc2564.putDouble( idGrn, color.rgb.green );
                    var idBl = charIDToTypeID( "Bl  " );
                    desc2564.putDouble( idBl,  color.rgb.blue );
                var idRGBC = charIDToTypeID( "RGBC" );
                desc2563.putObject( idClr, idRGBC, desc2564 );
            var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
            desc2562.putObject( idstrokeStyleContent, idsolidColorLayer, desc2563 );
            var idstrokeStyleVersion = stringIDToTypeID( "strokeStyleVersion" );
            desc2562.putInteger( idstrokeStyleVersion, 2 );
            var idstrokeEnabled = stringIDToTypeID( "strokeEnabled" );
            desc2562.putBoolean( idstrokeEnabled, true );
        var idstrokeStyle = stringIDToTypeID( "strokeStyle" );
        desc2561.putObject( idstrokeStyle, idstrokeStyle, desc2562 );
    var idshapeStyle = stringIDToTypeID( "shapeStyle" );
    desc2560.putObject( idT, idshapeStyle, desc2561 );
executeAction( idsetd, desc2560, DialogModes.NO );
		
	}

function FillStyle(layer, color, applyGlow){
 
      app.activeDocument.activeLayer = layer;
      app.activeDocument.foregroundColor = color.rgb;
      SetStyleColor(color, applyGlow);

      //To Do for Outer Glow. Read current info and merge it with wanted color

    }


    
    function SetStyleColor(inputColor, applyGlow){

        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        var d = executeActionGet(ref);

        if (!d.hasKey(stringIDToTypeID('layerEffects'))) return;

   
  

        var idsetd = charIDToTypeID( "setd" );
        var desc21 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref3 = new ActionReference();
            var idPrpr = charIDToTypeID( "Prpr" );
            var idLefx = charIDToTypeID( "Lefx" );
            ref3.putProperty( idPrpr, idLefx );
            var idLyr = charIDToTypeID( "Lyr " );
            var idOrdn = charIDToTypeID( "Ordn" );
            var idTrgt = charIDToTypeID( "Trgt" );
            ref3.putEnumerated( idLyr, idOrdn, idTrgt );
        desc21.putReference( idnull, ref3 );


        var idT = charIDToTypeID( "T   " );
            var desc22 = new ActionDescriptor();
            var idScl = charIDToTypeID( "Scl " );
            var idPrc = charIDToTypeID( "#Prc" );
            desc22.putUnitDouble( idScl, idPrc, 100.000000 );
            
   
            if(hasFill(d))PutFill(desc22,inputColor);
           
            if(hasOuterGlow(d)){    
                 
                var values = getGlowValues(d);
                var newColor = inputColor;

                if(!applyGlow){

                    newColor.rgb.red = values.color.getDouble(stringIDToTypeID("red"));
                    newColor.rgb.green = values.color.getDouble(stringIDToTypeID("green"));
                    newColor.rgb.blue = values.color.getDouble(stringIDToTypeID("blue"));
                }
              
                PutGlow(desc22,values,newColor );
            }
         
        var idLefx = charIDToTypeID( "Lefx" );
        desc21.putObject( idT, idLefx, desc22 );
    executeAction( idsetd, desc21, DialogModes.NO );
    }

    function PutFill(desc22, inputColor){

        var idSoFi = charIDToTypeID( "SoFi" );
        var desc23 = new ActionDescriptor();
        var idenab = charIDToTypeID( "enab" );
        desc23.putBoolean( idenab, true );
        var idpresent = stringIDToTypeID( "present" );
        desc23.putBoolean( idpresent, true );
        var idshowInDialog = stringIDToTypeID( "showInDialog" );
        desc23.putBoolean( idshowInDialog, true );
        var idMd = charIDToTypeID( "Md  " );
        var idBlnM = charIDToTypeID( "BlnM" );
        var idScrn = charIDToTypeID( "Nrml" );
        desc23.putEnumerated( idMd, idBlnM, idScrn );
        var idClr = charIDToTypeID( "Clr " );
            var desc24 = new ActionDescriptor();
            var idRd = charIDToTypeID( "Rd  " );
            desc24.putDouble( idRd, inputColor.rgb.red );
            var idGrn = charIDToTypeID( "Grn " );
            desc24.putDouble( idGrn, inputColor.rgb.green );
            var idBl = charIDToTypeID( "Bl  " );
            desc24.putDouble( idBl, inputColor.rgb.blue);
        var idRGBC = charIDToTypeID( "RGBC" );
        desc23.putObject( idClr, idRGBC, desc24 );
        var idOpct = charIDToTypeID( "Opct" );
        var idPrc = charIDToTypeID( "#Prc" );
        desc23.putUnitDouble( idOpct, idPrc, 100.000000 );
    var idSoFi = charIDToTypeID( "SoFi" );
    desc22.putObject( idSoFi, idSoFi, desc23 );

    }


    function PutGlow(desc99,glowValues, inputColor){

        var idOrGl = charIDToTypeID( "OrGl" );
        var desc102 = new ActionDescriptor();
        var idenab = charIDToTypeID( "enab" );
        desc102.putBoolean( idenab, glowValues.enabled );
        var idpresent = stringIDToTypeID( "present" );
        desc102.putBoolean( idpresent, glowValues.present );
        var idshowInDialog = stringIDToTypeID( "showInDialog" );
        desc102.putBoolean( idshowInDialog, glowValues.showInDialog );
        var idMd = charIDToTypeID( "Md  " );
        var idBlnM = charIDToTypeID( "BlnM" );

        desc102.putEnumerated( idMd, idBlnM, glowValues.mode );
        var idClr = charIDToTypeID( "Clr " );
            var desc103 = new ActionDescriptor();
            var idRd = charIDToTypeID( "Rd  " );
            desc103.putDouble( idRd, inputColor.rgb.red );
            var idGrn = charIDToTypeID( "Grn " );
            desc103.putDouble( idGrn, inputColor.rgb.green );
            var idBl = charIDToTypeID( "Bl  " );
            desc103.putDouble( idBl, inputColor.rgb.blue);
        var idRGBC = charIDToTypeID( "RGBC" );
        desc102.putObject( idClr, idRGBC, desc103 );
        var idOpct = charIDToTypeID( "Opct" );
        var idPrc = charIDToTypeID( "#Prc" );
        desc102.putUnitDouble( idOpct, idPrc, glowValues.opacity );
        var idGlwT = charIDToTypeID( "GlwT" );
        var idBETE = charIDToTypeID( "BETE" );
        var idSfBL = charIDToTypeID( "SfBL" );
        desc102.putEnumerated( idGlwT, idBETE, glowValues.glowTechnique );
        var idCkmt = charIDToTypeID( "Ckmt" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc102.putUnitDouble( idCkmt, idPxl, glowValues.chokeMatte );
        var idblur = charIDToTypeID( "blur" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc102.putUnitDouble( idblur, idPxl, glowValues.blur);
        var idNose = charIDToTypeID( "Nose" );
        var idPrc = charIDToTypeID( "#Prc" );
        desc102.putUnitDouble( idNose, idPrc, glowValues.noise );
        var idShdN = charIDToTypeID( "ShdN" );
        var idPrc = charIDToTypeID( "#Prc" );
        desc102.putUnitDouble( idShdN, idPrc, glowValues.shadingNoise);
        var idAntA = charIDToTypeID( "AntA" );
        desc102.putBoolean( idAntA, glowValues.antiAlias );
        var idTrnS = charIDToTypeID( "TrnS" );
        var idShpC = charIDToTypeID( "ShpC" );
        desc102.putObject( idTrnS, idShpC, glowValues.shape );
        var idInpr = charIDToTypeID( "Inpr" );
        var idPrc = charIDToTypeID( "#Prc" );
        desc102.putUnitDouble( idInpr, idPrc, glowValues.inputRange );
    var idOrGl = charIDToTypeID( "OrGl" );
    desc99.putObject( idOrGl, idOrGl, desc102 );

    }

    function hasFill(d)
    {

        if (!d.hasKey(stringIDToTypeID('layerEffects'))) return false
        if (!d.getObjectValue(stringIDToTypeID('layerEffects')).hasKey(stringIDToTypeID('solidFill'))) return false
        return true
    }; 

    function hasOuterGlow(d)
    {
        if (!d.hasKey(stringIDToTypeID('layerEffects'))) return false
        if (!d.getObjectValue(stringIDToTypeID('layerEffects')).hasKey(stringIDToTypeID('outerGlow'))) return false
        return true
    }; 


    function getGlowValues(d) {

        var temp = d.getObjectValue(stringIDToTypeID('layerEffects')).getObjectValue(stringIDToTypeID('outerGlow'));

        // possible values of the 'style' are insetFrame, centeredFrame and outsetFrame
        return {
            enabled: temp.getBoolean(stringIDToTypeID("enabled")),
            present: temp.getBoolean(stringIDToTypeID("present")),
            showInDialog: temp.getBoolean(stringIDToTypeID("showInDialog")),
            mode: temp.getEnumerationValue(stringIDToTypeID("mode")),
            color : temp.getObjectValue(stringIDToTypeID("color")),
            opacity: temp.getDouble(stringIDToTypeID("opacity")),
            glowTechnique : temp.getEnumerationValue(stringIDToTypeID("glowTechnique")),
            chokeMatte : temp.getDouble(stringIDToTypeID("chokeMatte")),
            blur : temp.getDouble(stringIDToTypeID("blur")),
            noise : temp.getDouble(stringIDToTypeID("noise")),
            shadingNoise: temp.getDouble(stringIDToTypeID("shadingNoise")),
            antiAlias: temp.getBoolean(stringIDToTypeID("antiAlias")),
            inputRange: temp.getDouble(stringIDToTypeID("inputRange")),
            shape: temp.getObjectValue(stringIDToTypeID("transparencyShape"))
        }
    };