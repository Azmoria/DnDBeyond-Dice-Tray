chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    $('body').css('--dicetray-background-color', message.key['color'].value)
    $('body').css('--dicetray-background-image', `url(${message.key['image url'].value})`)  
    $('body').css('--dice-speed', message.key['diceSpeed'].value);
    $('.dice-rolling-panel__container').css('visibility', message.key['hideDice'].value)
    console.log(message)
    return true;
});

chrome.storage.local.get("dicetraydata", function(result){
    if(result.dicetraydata != undefined){
        $('body').css('--dicetray-background-color', result.dicetraydata['color'].value)
        $('body').css('--dicetray-background-image', `url(${result.dicetraydata['image url'].value})`)   
    }
    else{
        $('body').css('--dicetray-background-color', `#009933`)
        $('body').css('--dicetray-background-image', ``) 
    }
    $('body').css('--dice-speed', result.dicetraydata['diceSpeed'].value);
    setTimeout(function(){
        $('.dice-rolling-panel__container').css('visibility', result.dicetraydata['hideDice'].value)
    }, 1000);
});
