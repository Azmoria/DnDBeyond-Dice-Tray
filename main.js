var childWindow;


function resizeChild(child){
    var winHeight =  window.innerHeight;
    var winWidth =  window.innerWidth;
    var childHTML =  child.document.documentElement;
    if(winHeight > (screen.height-2) && winWidth == screen.width) {
        childHTML.requestFullscreen();
    }
    else if(winWidth<screen.width){
        child.resizeTo(window.outerWidth, winHeight+68);
    }
    else{
        child.resizeTo(window.outerWidth, winHeight+61);
    }
}

function diceTray() {
    if( window.parent.childWindow != undefined && window.parent.childWindow.closed != true) {
        childWindow = window.parent.childWindow;
        window.childWindow = childWindow;
        console.log(childWindow.name + " is the child of parent window");
    }
    if (window.childWindow == undefined || window.childWindow.closed !== false){
        childWindow = window.open('', 'Dice Tray', 'toolbar=0,location=0,menubar=0');
        window.childWindow = childWindow;
        window.parent.childWindow = childWindow;
        console.log(childWindow.name + " is the child of this window");
    }
    if(childWindow.document.querySelector('video') == undefined){
        childWindow.document.write('<video id="video0" muted autoplay></video>');
        resizeChild(childWindow);
    }
    if(window.location.href.indexOf("abovevtt") > -1) {
        childWindow.history.pushState({}, "Dice Tray - AboveVTT", window.location.href+"#DiceTray");
        childWindow.document.title = "Dice Tray - AboveVTT";
    }
    else if (window.parent.location.href.indexOf("abovevtt") > -1) {
        childWindow.history.pushState({}, "Dice Tray - AboveVTT", window.parent.location.href+"#DiceTray");
        childWindow.document.title = "Dice Tray - AboveVTT";
    }
    else{
        childWindow.history.pushState({}, "Dice Tray - " + document.title, window.location.href+"#DiceTray");
        childWindow.document.title = "Dice Tray - " +  document.title;
    }
    const body = childWindow.document.querySelector('body');
    var canvas =  document.querySelector('.dice-rolling-panel__container');
    const video =  childWindow.document.querySelector('#video0');
    body.setAttribute("id", 'diceTrayBody');
    var stream =  canvas.captureStream(30);
    if(video.srcObject == undefined || video.srcObject == null){
        stream.label =  window.location.href;
        video.srcObject =  stream;
    }
    else {
        canvas = document.querySelector('.dice-rolling-panel__container');
        var newStream = canvas.captureStream(30);
        newStream.label = window.location.href;
        var n = 0;
        var videoTags = childWindow.document.getElementsByTagName("video");
        let addRemove = "Video added to ";
        for (let i=0; i < videoTags.length; i++){
            if(videoTags[i].srcObject.label.indexOf("character") > -1 && window.location.href.indexOf("character") > -1) {
                addRemove = "Video replaced in "
                n=i;
                break;
            }
            if(videoTags[i].srcObject.label.indexOf("combat-tracker") > -1 && window.location.href.indexOf("combat-tracker") > -1){
                if (n > 2) {
                    addRemove = "Video replaced in "
                    n=i;
                    break;
                }
            }
            if(videoTags[i].srcObject.label.indexOf("encounter-builder") > -1 && window.location.href.indexOf("encounter-builder") > -1){
                addRemove = "Video replaced in "
                n=i;
                break;
            }
            if(videoTags[i].srcObject.label.indexOf("my-encounters") > -1 && window.location.href.indexOf("my-encounters") > -1){
                addRemove = "Video replaced in "
                n=i;
                break;
            }
            else {
                n+=1;
            }
        }
        if (!childWindow.document.querySelector('#video'+n)){
            childWindow.document.write('<video id="video'+n+'" muted autoplay></video>');
        }
        const newVideo = childWindow.document.querySelector('#video'+n);
        newVideo.srcObject = newStream;
        console.log(addRemove + childWindow.name);
    }

   	window.addEventListener('resize', function(event){
        if(childWindow.location.href.indexOf("abovevtt") > -1 && childWindow.location.href.indexOf("encounter") > -1 && childWindow.location.href.indexOf("#DiceTray") > -1){}
        else{
            if(childWindow.innerHeight < (childWindow.screen.height-1) && childWindow.innerwidth != childWindow.screen.width) {
                resizeChild(childWindow);
            }
        }
    });
	let dicetraycolor = $('body').css('--dicetray-background-color');
	let dicetrayimageurl = $('body').css('--dicetray-background-image');  

	$(childWindow.document).find('body').append($(`<style>
		body#diceTrayBody{
		   background-color: var(--dicetray-background-color) !important;
		   background-image: var(--dicetray-background-image) !important;
		   background-repeat: no-repeat !important;
		   background-position: top center !important;
		   background-attachment: fixed !important;
		   background-origin: content-box !important;
		   -webkit-background-size: cover !important;
		   -moz-background-size: cover !important;
		   -o-background-size: cover !important;
		   background-size: cover !important;
		   overflow: hidden !important;
		   margin: 0px !important;
		} 
		body#diceTrayBody video{
	        position: absolute;
	        top: 0;
	        left: 0;   
	        height: calc(100% + 1px);
	        width: calc(100% + 1px);     
    	}
		</style>`));

	$(childWindow.document).find('body').css('--dicetray-background-color', dicetraycolor)
	$(childWindow.document).find('body').css('--dicetray-background-image', dicetrayimageurl) 

    return childWindow;
}

let dicetrayobserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!mutation.addedNodes) return

    for (let i = 0; i < mutation.addedNodes.length; i++) {
      // do things to your newly added nodes here
      let node = mutation.addedNodes[i]
      if ((node.className == 'dice-rolling-panel' || $('.dice-rolling-panel').length>0) && !window.diceTrayAdded){
        window.diceTrayAdded = true;
        buildDiceTrayButton();
        if((window.parent.childWindow == undefined || window.parent.childWindow.closed == true)){
            dicetrayobserver.disconnect();
        }
      }
      if(node.className == 'dice-rolling-panel__container' && (window.parent.childWindow != undefined && window.parent.childWindow.closed != true)){
      	console.log('Added video to Dice Tray');
      	diceTray();
        if(window.diceTrayAdded == true){
            dicetrayobserver.disconnect();
        }
      }
    }
  })
});

dicetrayobserver.observe(document.body, {
    childList: true
  , subtree: true
  , attributes: false
  , characterData: false
});

var styleobserver = new MutationObserver(function(mutations) {
mutations.forEach(function(mutationRecord) {
		let dicespeed= $('body').css('--dice-speed');
	
		window.requestAnimationFrame = function(e) { setTimeout(e, 36-dicespeed); } 
        console.log('dice speed changed!');
    });    
});

var target = document.getElementById('site');
styleobserver.observe(target, { attributes : true, attributeFilter : ['style'] });


function buildDiceTrayButton(){
	$('#site').css('--theme-color', $('.ddbc-svg--themed path').css('fill'));
	let statusButton = `<div class="dice-die-button diceTrayButton" role="button" tabindex="0" style='background: rgba(16, 22, 26, 0.86);'><span class="ct-character-header-desktop__button-label" style='color: #fff; left: 50%; position: absolute; transform: translateX(-50%); margin: 0px'>Dice Tray</span></div>`

	$('.dice-toolbar__dropdown>div:last-of-type').prepend(statusButton)

	$('.dice-die-button.diceTrayButton').off().on("click", function(){
        childWindow = diceTray();
        window.childWindow = childWindow;
        window.parent.childWindow = childWindow;  
        var styleobserver = new MutationObserver(function(mutations) {
	    mutations.forEach(function(mutationRecord) {
	    		let dicetraycolor = $('body').css('--dicetray-background-color');
				let dicetrayimageurl = $('body').css('--dicetray-background-image');  
				
				$(childWindow.document).find('body').css('--dicetray-background-color', dicetraycolor)
				$(childWindow.document).find('body').css('--dicetray-background-image', dicetrayimageurl) 
		        console.log('style changed!');
		    });    
		});

		var target = document.getElementById('site');
		styleobserver.observe(target, { attributes : true, attributeFilter : ['style'] });
	});
}
			