
//@include "TracingUtilities.jsx"
OpenDoc (app.activeDocument);

var bt = new BridgeTalk();
bt.target = "illustrator";
bt.body = 'app.beep(); alert("Files Opened")';
bt.onResult = function (inBT) { 
    result = eval(inBT.body); 
};
bt.onError = function (inBT) { 
    alert(inBT.body); 
};
bt.send(8);
