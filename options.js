let localData = localStorage.getItem("DiceTraySavedData") 
if(localData != undefined){
   let readImportedData = JSON.parse(localData);
    for(item in readImportedData){
        $(`input[data-name='${readImportedData[item].name}'`).val(`${readImportedData[item].value}`)
    }
}

$(".spectrum").spectrum({
    showAlpha: true,
    showPalette: true,
    localStorageKey: "spectrum.diceTray",
    clickoutFiresChange: true,
    showInitial: true,
    showInput: true,
    allowEmpty:true,
    showButtons: false,
    preferredFormat: "hex"
});

$('input').on('blur', function(){
    let savedData = {};
    let inputs = $('input[data-name]')
    for(i = 0; i < inputs.length; i++){
        let newData = {
            name: $(inputs[i]).attr('data-name'),
            value: inputs[i].value
        }
        if(newData.name == undefined){
            console.log('undefined');
        }
        savedData[newData.name] = newData;
    }

    let jsonSavedData = JSON.stringify(savedData)
    localStorage.setItem("DiceTraySavedData", jsonSavedData);
    saveOptionsSentAsData({'dicetraydata': savedData});
});

function saveOptionsSentAsData(data,callback=function(){}) {
    //Options data received as a message from options.js is 
    //  stored in storeage.local.
    chrome.storage.local.set(data, function() {
        //Invoke a callback function if we were passed one.
        if(typeof callback === 'function'){
            callback();
        }
    });
}

