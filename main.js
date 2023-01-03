var childWindow = null;

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
    if(window.parent != null && window.parent.childWindow != undefined && window.parent.childWindow != null) {
        childWindow = window.parent.childWindow;
        window.childWindow = childWindow;
        console.log(childWindow.name + " is the child of parent window");
    }
    if (childWindow == null || window.childWindow.closed != false){
        childWindow = window.open('', 'Dice Tray', 'toolbar=0,location=0,menubar=0');
        window.childWindow = childWindow;
        window.parent.childWindow = childWindow;
        console.log(childWindow.name + " is the child of this window");
         childWindow.onbeforeunload = function(){
            delete window.childWindow;
            delete window.parent.childWindow;
        }; 
    }
    if(childWindow.document.querySelector('video') == undefined || childWindow.document.querySelector('video') == null){
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
       	chromeTempFix(video);
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
        chromeTempFix(newVideo);
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
      }
      if(node.className == 'dice-rolling-panel__container' && (childWindow == null || window.childWindow.closed != false)){
      	console.log('Added video to Dice Tray');
      	diceTray();
      }
    }
  })
})

dicetrayobserver.observe(document.body, {
    childList: true
  , subtree: true
  , attributes: false
  , characterData: false
});

var styleobserver = new MutationObserver(function(mutations) {
mutations.forEach(function(mutationRecord) {
		let dicespeed= $('body').css('--dice-speed');
	
		window.requestAnimationFrame = function(e) { setTimeout(e, 100-dicespeed); } 
        console.log('dice speed changed!');
    });    
});

var target = document.getElementById('site');
styleobserver.observe(target, { attributes : true, attributeFilter : ['style'] });


function chromeTempFix(video){
	/*start temporary chrome fix*/
	let isChrome = window.chrome;
	if(isChrome){
		var dicecanvas=$(`<canvas width='${window.innerWidth}' height='${window.innerHeight}' class='streamer-canvas' />`);
		$(video).css({
			'visibility': 'hidden'
		})
		dicecanvas.attr("id","streamer-canvas");
		//dicecanvas.css("opacity",0.5);
		dicecanvas.css("position","fixed");
		dicecanvas.css("top","50%");
		dicecanvas.css("left","50%");
		dicecanvas.css("transform","translate(-50%, -50%)");
		dicecanvas.css("z-index",60000);
		dicecanvas.css("touch-action","none");
		dicecanvas.css("pointer-events","none");
		dicecanvas.css("filter", "drop-shadow(-16px 18px 15px black)");
		dicecanvas.css("clip-path", "inset(2px 2px 2px 2px)");
		$(childWindow.document).find('body').append(dicecanvas);
		let canvasStream=dicecanvas.get(0);
		let ctx=canvasStream.getContext('2d');
		let tmpcanvas = childWindow.document.createElement("canvas");
		tmpcanvas.width = window.innerWidth;
		tmpcanvas.height = window.innerHeight;
		video.addEventListener("resize", function(){
  		let videoAspectRatio = video.videoWidth / video.videoHeight
			if (video.videoWidth > video.videoHeight)
			{
				tmpcanvas.width = Math.min(video.videoWidth, window.innerWidth);
				tmpcanvas.height = Math.min(video.videoHeight, window.innerWidth / videoAspectRatio);		
			}
			else {
				tmpcanvas.width = Math.min(video.videoWidth, window.innerHeight / (1 / videoAspectRatio));
				tmpcanvas.height = Math.min(video.videoHeight, window.innerHeight);		
			}
			dicecanvas.attr("width", tmpcanvas.width + "px");
			dicecanvas.attr("height", tmpcanvas.height  + "px");
			dicecanvas.css("height",tmpcanvas.height);
			dicecanvas.css("width",tmpcanvas.width );
  		});

		let updateCanvas=function(){
			let tmpctx = tmpcanvas.getContext("2d", {
				willReadFrequently: true,
			});
			window.requestAnimationFrame(updateCanvas);
			tmpctx.drawImage(video, 0, 0, tmpcanvas.width, tmpcanvas.height);
			if(tmpcanvas.width>0)
			{
				const frame = tmpctx.getImageData(0, 0, tmpcanvas.width, tmpcanvas.height);

				for (let i = 0; i < frame.data.length; i += 4) {
					const red = frame.data[i + 0];
					const green = frame.data[i + 1];
					const blue = frame.data[i + 2];
					if ((red < 28) && (green < 28) && (blue < 28))
						frame.data[i + 3] = 128;
					if ((red < 14) && (green < 14) && (blue < 14))
						frame.data[i + 3] = 0;
					
					
				}
				ctx.putImageData(frame,0,0);	
			}
		};
		updateCanvas();
	}
/*end temporary chrome fix*/
}


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
			