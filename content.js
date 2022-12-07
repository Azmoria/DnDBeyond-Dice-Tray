browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    $('body').css('--dicetray-background-color', message.key['color'].value)
    $('body').css('--dicetray-background-image', `url(${message.key['image url'].value})`)   
    if(childWindow != undefined){
        $(childWindow.document).find('body').css('--dicetray-background-color', message.key['color'].value)
        $(childWindow.document).find('body').css('--dicetray-background-image',`url(${message.key['image url'].value})`)
    }
    console.log(message)
// return true <- this and the callback in background.js are what caused a crash in extensions page of my Google chrome
});

browser.storage.local.get("dicetraydata", function(result){
    $('body').css('--dicetray-background-color', result.dicetraydata['color'].value)
    $('body').css('--dicetray-background-image', `url(${result.dicetraydata['image url'].value})`)  
    result.dicetraydata  
    
});