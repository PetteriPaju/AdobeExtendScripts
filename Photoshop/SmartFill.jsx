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
function FillOutline(color){
  
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
                   FillStyle(app.activeDocument.activeLayer, color);
            }catch(e){ 
               makeActiveByIndex(desc.getReference( i ).getIndex()+1); 
               FillStyle(app.activeDocument.activeLayer, color);
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
    var layerStyleObj = jamStyles.getLayerStyle ();
    if (layerStyleObj)
    {
           
     if ("layerEffects" in layerStyleObj)
    {  
        var layerEffectsObj = layerStyleObj["layerEffects"];
        if ("solidFill" in layerEffectsObj)
        {
               var glowObject = layerEffectsObj["solidFill"].color = { "red": color.rgb.red, "green": color.rgb.green, "blue": color.rgb.blue };
               jamStyles.setLayerStyle (layerStyleObj);       
        }
    
    if("outerGlow" in layerEffectsObj && applyGlow){       
                       var glowObject = layerEffectsObj["outerGlow"].color = { "red": color.rgb.red, "green": color.rgb.green, "blue": color.rgb.blue };
               jamStyles.setLayerStyle (layerStyleObj);       
      
        }
    

    else{
        
        
        
        }

    }
        
    }
    
    
    }
