var ref = new ActionReference();
ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
var layerDesc = executeActionGet(ref);
var combNames = [];
if (layerDesc.hasKey(stringIDToTypeID("smartObject")) == true) {
	
	
	GetCompNames();
	
	
var theSO = layerDesc.getObjectValue(stringIDToTypeID("smartObject"));
var x = theSO.getList(stringIDToTypeID("compsList"));


var theCompsList = theSO.getObjectValue(stringIDToTypeID("compsList"));
var theSOMore = layerDesc.getObjectValue(stringIDToTypeID("smartObjectMore"));

var appliedComp = theSOMore.getInteger(stringIDToTypeID("comp"));

if (theCompsList.count > 2) {
var theCompsList = theCompsList.getList(stringIDToTypeID("compList"));


	var id = theCompsList.getObjectValue(0).getInteger(stringIDToTypeID("ID"));
	setLayerCompByID(id);
	app.activeDocument.activeLayer.name = combNames[0];

for (var m = 1; m < theCompsList.count; m++) {
	
	var id = theCompsList.getObjectValue(m).getInteger(stringIDToTypeID("ID"));
	var name = theCompsList.getObjectValue(m).getString(stringIDToTypeID("name"));
	
	var idDplc = charIDToTypeID( "Dplc" );
    var desc33 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref7 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref7.putEnumerated( idLyr, idOrdn, idTrgt );
    desc33.putReference( idnull, ref7 );
    var idNm = charIDToTypeID( "Nm  " );
    desc33.putString( idNm, combNames[m]);
    var idVrsn = charIDToTypeID( "Vrsn" );
    desc33.putInteger( idVrsn, 5 );
    var idIdnt = charIDToTypeID( "Idnt" );
        var list7 = new ActionList();
        list7.putInteger( 9548 );
    desc33.putList( idIdnt, list7 );
executeAction( idDplc, desc33, DialogModes.NO );

	setLayerCompByID(id);
};

};
};


function GetCompNames(){
var originalDoc = app.activeDocument;
var id6 = stringIDToTypeID( "placedLayerEditContents" );
var desc3 = new ActionDescriptor();
executeAction( id6, desc3, DialogModes.NO );
var doc = app.activeDocument;

for(var i = 0; i<doc.layerComps.length; i++){
	combNames.push(doc.layerComps[i].name);
}

app.activeDocument = originalDoc;
	
	
}



function setLayerCompByID(id){
		var idsetPlacedLayerComp = stringIDToTypeID( "setPlacedLayerComp" );
    var desc7 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref2.putEnumerated( idLyr, idOrdn, idTrgt );
    desc7.putReference( idnull, ref2 );
    var idcompID = stringIDToTypeID( "compID" );
    desc7.putInteger( idcompID, id );
executeAction( idsetPlacedLayerComp, desc7, DialogModes.NO );
	
}
