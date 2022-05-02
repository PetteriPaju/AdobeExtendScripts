main();

function main(){
    
    if(app.documents.length == 0)return;    
        	var doc =   app.activeDocument;
           doc.selection = null;
           
           
    // Merge live paint
     for (var i = 0; i <doc.pluginItems.length; i++) {   
         if(doc.pluginItems [i].locked)continue; 
         doc.pluginItems [i].selected = true;
         app.executeMenuCommand("Expand Planet X");  
         app.executeMenuCommand ('ungroup');  
         break;    
  
  }


      var complete = false;
      
      // Loop that goes on until no changes to document has been made, aka when there are no longer different color groups to merge
      while(!complete){          
          
          //Keep track of current amount of paths in the document
      var lastLength = doc.pathItems.length;       
      
      
      for (var i=0;i<doc.pathItems.length;i++){        
          
        if(checkLayerLockedStatus(doc.pathItems[i]))continue;
        
            doc.selection = null;
            //Delete strokes
            if(doc.pathItems[i].stroked){ 
                doc.pathItems[i].remove();
                break;
                }
            
            //Selesct current path
            doc.pathItems[i].selected = true;
           
           //Find paths with the same colot and merge
            app.executeMenuCommand("Find Fill Color menu item");   
            app.executeMenuCommand ('group');  
            app.executeMenuCommand ('Live Pathfinder Add');  
            app.executeMenuCommand ('expandStyle');  
            
            //If there was a merge, number of path items have changed, so the loop must break and start over
            if(lastLength != doc.pathItems.length){break; }
              }
      //Check if number of paths was not changed, in which case end the  loop
       complete = lastLength == doc.pathItems.length;
      }
  
  complete = false;
  
  //Remove unnesessary extra groups created by the process
     while(!complete){       
         
      var lastLength = doc.groupItems.length;       

      for (var i=0;i<doc.groupItems.length;i++){    
        if(checkLayerLockedStatus(doc.groupItems[i])) continue;  
              doc.selection = null;
              
              // Delete group if it has only one child
          if(doc.groupItems[i].pathItems.length == 1){
                        doc.groupItems[i].selected = true;
                        app.executeMenuCommand ('ungroup');        
              }
          
             if(lastLength != doc.groupItems.length){break; }
          
          }    
       complete = lastLength == doc.groupItems.length;

      }

}
function checkLayerLockedStatus(layer)
{
    if(!layer.locked) 
    for(var parent = layer.parent; parent.typename=='Layer'; parent = parent.parent)
    {
         if(parent.locked)
            return true;
    }
    return layer.locked;
 }
 
    
    
    