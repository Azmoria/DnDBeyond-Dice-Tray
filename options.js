let localData = localStorage.getItem("DiceTraySavedData") 
if(localData != undefined){
   let readImportedData = JSON.parse(localData);
    for(item in readImportedData){
        $(`input[data-name='${readImportedData[item].name}'`).val(`${readImportedData[item].value}`)
    }
}

$(".spectrum").spectrum({
    showAlpha: true,
    showPalette: false,
    localStorageKey: "spectrum.diceTray",
    clickoutFiresChange: true,
    showInitial: true,
    showInput: true,
    allowEmpty:true,
    showPalette: true,
    preferredFormat: "hex",
    color: "#009933",
    palette: [
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
    ]
});

$('input').on('blur change', function(){
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

function saveOptionsSentAsData(data,callback=function(){})
{
    //Options data received as a message from options.js is 
    //  stored in storeage.local.
    chrome.storage.local.set(data, function() {
        //Invoke a callback function if we were passed one.
        if(typeof callback === 'function'){
            callback();
        }
    });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {key: newValue});  
    });
  }
});
