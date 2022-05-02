


app.activeDocument.suspendHistory("Toggle Linked Visibility", "main()");  
function main(){
if(app.activeDocument == null)return;
if(app.activeDocument.activeLayer == null)return;
var activeLayer = app.activeDocument.activeLayer;


var linkedLayers = app.activeDocument.activeLayer.linkedLayers;

var id = app.activeDocument.activeLayer.visible ? charIDToTypeID( "Hd  " ) : charIDToTypeID( "Shw " );

var idselectLinkedLayers = stringIDToTypeID( "selectLinkedLayers" );
    var desc4 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref2.putEnumerated( idLyr, idOrdn, idTrgt );
    desc4.putReference( idnull, ref2 );
executeAction( idselectLinkedLayers, desc4, DialogModes.NO );

var desc6 = new ActionDescriptor();
var idnull = charIDToTypeID( "null" );
    var list2 = new ActionList();
        var ref3 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref3.putEnumerated( idLyr, idOrdn, idTrgt );
    list2.putReference( ref3 );
desc6.putList( idnull, list2 );

executeAction( id, desc6, DialogModes.NO );


}
