
var YouTubeHighDefinition = {
	quality:null,
	size:null,
	volume:null,
	volumelevel:null,
	youtubevideoautoplaybehavior:null,
	playlistvideoautoplaybehavior:null,
	suggestedautoplay:null,
	autoexpanddescription:null, 
	isOptionHandle:null,
	ytPlayer:null,
	requestChange:function(id,volume,volumelevel,youtubevideoautoplaybehavior,playlistvideoautoplaybehavior,suggestedautoplay,autoexpanddescription,isOptionHandle){	
		//YouTubeHighDefinition.askQualitySize();
		//YouTubeHighDefinition.changeVideoQuality(document);
		YouTubeHighDefinition.changeVideoQuality(document,YouTubeHighDefinition.quality ? YouTubeHighDefinition.quality : "highress",volume,volumelevel,youtubevideoautoplaybehavior,playlistvideoautoplaybehavior,isOptionHandle);
		YouTubeHighDefinition.changeVideoSize(document,YouTubeHighDefinition.size ? YouTubeHighDefinition.size : "expand",id,isOptionHandle);		
		YouTubeHighDefinition.expandVideoDescription(document,autoexpanddescription,isOptionHandle);		
		YouTubeHighDefinition.enablesuggestedautoplay(document,suggestedautoplay);
	},
	getIntendedQuality:function(player,currentvideoquality){
		if(currentvideoquality=="highres") return player.getAvailableQualityLevels()[0];
		else if(player.getAvailableQualityLevels().indexOf(currentvideoquality)==-1){
			return player.getAvailableQualityLevels()[0];
		} 
		else return currentvideoquality;		
	},
	getSetVideoQuality:function(player,currentvideoquality){
		if(currentvideoquality=="hd2160" && player.getAvailableQualityLevels().indexOf(currentvideoquality)==-1) return player.getAvailableQualityLevels()[0];
		else return currentvideoquality;		
	},	
	getVideoQuality:function(){
		var currentvideoquality=YouTubeHighDefinition.quality;
		if(currentvideoquality=="4k2160") currentvideoquality="hd2160";
		return currentvideoquality;
	},
	getPlaylistVideoAutoPlayBehavior:function(){
		var currentplaylistvideoautoplaybehavior=YouTubeHighDefinition.playlistvideoautoplaybehavior;
		if(currentplaylistvideoautoplaybehavior=="default") return true;
		else if(currentplaylistvideoautoplaybehavior=="autoplay") return true;
		else if(currentplaylistvideoautoplaybehavior=="autopause") return false;
		//return YouTubeHighDefinition.getCurrentEmbeddedVideoAutoPlayBehavior() ? 1 : 0;
	},	
	getYoutubeVideoAutoPlayBehavior:function(youtubevideoautoplaybehavior){
		var currentyoutubevideoautoplaybehavior=youtubevideoautoplaybehavior;
		if(currentyoutubevideoautoplaybehavior=="default") return true;
		else if(currentyoutubevideoautoplaybehavior=="autoplay") return true;
		else if(currentyoutubevideoautoplaybehavior=="autopause") return false;
		//return YouTubeHighDefinition.getCurrentEmbeddedVideoAutoPlayBehavior() ? 1 : 0;
	},	
	enablesuggestedautoplay:function(document, checked){
		if(document.location.pathname.search(/^\/watch/)==0){
			if(document.getElementById("autoplay-checkbox")) document.getElementById("autoplay-checkbox").click();
			if(document.getElementById("autoplay-checkbox")) document.getElementById("autoplay-checkbox").checked=checked;
			if(document.querySelector("paper-toggle-button#toggle[aria-pressed*="+!checked+"]")) {
				document.querySelector("paper-toggle-button#toggle[aria-pressed*="+!checked+"]").click();
			}
		}
	},	
	expandVideoDescription:function(doc,autoexpanddescription,isOptionHandle){
		if(autoexpanddescription){
			if(doc.getElementById("action-panel-details")) {
				doc.getElementById("action-panel-details").classList.remove("yt-uix-expander-collapsed");
			}
			var interwal;
			var it=0;
			if(doc.querySelector("paper-button#more")) {
				doc.querySelector("paper-button#more").click()
			}
			else{
				interwal=doc.defaultView.setInterval(function(){					
					if(!doc.querySelector("paper-button#more")) {
						it++;
						return;
					}
					else {
						doc.defaultView.clearInterval(interwal);
					}
					doc.querySelector("paper-button#more").click();								
				},100)						
			}			
		}
		else{
			if(isOptionHandle){
				doc.querySelector("paper-button#less").click();	
			}
		}
	},	
	askQualitySize:function () {
		chrome.runtime.sendMessage({'action' : 'qualitysize_ask'}, 
			function(o) {
				YouTubeHighDefinition.changeVideoQuality(document,o['video_quality'],volume,volumelevel);
				YouTubeHighDefinition.changeVideoSize(document,o['video_size']);				
			}
		);
	},	
	getVolumeLevel:function(volume,volumelevel){
		if(volume=="default") return "default";
		else if(volume=="mute") return 0;
		if(volume=="100%") return 100;
		if(volume=="volumelevel") return volumelevel;	
	},
	checkI:function(doc,quality,volume,volumelevel,youtubevideoautoplaybehavior,playlistvideoautoplaybehavior,isOptionHandle){
		var player=YouTubeHighDefinition.ytPlayer;
		player.setPlaybackQuality(quality);	
	},
	onSPFDone:function(event){
		var doc=event.currentTarget.document;
		//YouTubeHighDefinition.changeVideoQuality(doc,true);
		window.postMessage({ type: "FROM_PAGE_SCRIPT_REQUEST_CHANGE", text: "NULL" }, "*");	
	},
	onNavigateFinish:function(event){
		window.setTimeout(function(){
			YouTubeHighDefinition.expandVideoDescription(document,YouTubeHighDefinition.autoexpanddescription,null);
		},1000);		
		var enableplaylistautoplay = YouTubeHighDefinition.getPlaylistVideoAutoPlayBehavior();		
		var enableautoplay = YouTubeHighDefinition.getYoutubeVideoAutoPlayBehavior(YouTubeHighDefinition.youtubevideoautoplaybehavior);
		YouTubeHighDefinition.pauseVideo(enableautoplay,enableplaylistautoplay,"onNavigateFinish");
		//YouTubeHighDefinition.scrollTo(document);
	},
	pauseVideo:function(enableautoplay,enableplaylistautoplay,re){
		var player=document.getElementById("movie_player");	
		if(typeof player.getAdState!=="undefined" && player.getAdState()!=1){
			if(document.location.search.indexOf('list=') != -1){
				if(!enableplaylistautoplay){
					player.pauseVideo();
				}
			}
			else{
				if(!enableautoplay){
					player.pauseVideo();
				}
			}							
		}		
	},
	scrollTo:function(document){
		var dc=document;				
		var xpos=0;
		var ypos=parseInt(dc.defaultView.getComputedStyle(dc.getElementById("masthead-container"),null).getPropertyValue("height").replace("px",""));						
		var offsetTop=YouTubeHighDefinition.findPosition(dc.getElementById("page-manager"))[1];
		if(!dc.body.classList.contains("fullytpagesize")){
			if(spf) {
				dc.defaultView.scrollTo(xpos,offsetTop/2);						
			}					
			else {
				dc.defaultView.scrollTo(xpos,offsetTop/2);// requires half somehow.
			}
			//dc.getElementById("movie_player").scrollIntoView(false);
		}					
		else{
			dc.defaultView.scrollTo(xpos,offsetTop);// requires whole for secondary requests
		}		
	},
	findPosition:function(node){
		var left_pos = top_pos = 0;
		if (node.offsetParent) {	
			do {
				left_pos += node.offsetLeft;
				top_pos += node.offsetTop;	
			} while (node = node.offsetParent);
		}
		return [left_pos,top_pos];
	},	
	Slistener:function(event){
		var doc=event.currentTarget.ownerDocument;
		if (event.propertyName === 'transform' && event.target.id === 'progress' && event.target.getAttribute("style")=="transform: scaleX(1);") {
			YouTubeHighDefinition.scrollTo(document);			
		}		
	},	
	changeVideoQuality:function(doc,quality,volume,volumelevel,youtubevideoautoplaybehavior,playlistvideoautoplaybehavior,isOptionHandle){
		try {
			var domain=doc.domain;
		} catch (err) {
			return;
		}
		if (!domain) {
			return;
		}
		
		if (domain.search(/youtube.com$/) != -1) {

			var dc = document;
			var player = document.getElementById("movie_player");

			if(player) player.addEventListener('onStateChange','ythdonPlayerStateChange');			
			else{}			
			window.addEventListener("spfdone",YouTubeHighDefinition.onSPFDone);
			window.addEventListener("yt-navigate-start",YouTubeHighDefinition.onSPFDone);
			window.addEventListener("yt-navigate-finish",YouTubeHighDefinition.onNavigateFinish);			
			window.addEventListener("transitionend", YouTubeHighDefinition.Slistener, true);
			//window.addEventListener("transitioncancel", YouTubeHighDefinition.Slistener2, true);
			//document.getElementById("progress").addEventListener("transitionend", YouTubeHighDefinition.Slistener, true);
			//document.body.addEventListener("transitionend", YouTubeHighDefinition.Slistener, true);
			
			/*if(YouTubeHighDefinition.flashBlockInstalled) {

				if (doc.location.pathname=="/watch") {
					YouTubeHighDefinition.handleFlashBlock(dc);
					YouTubeHighDefinition.changeVideoSize(doc);
				}
				
				return;
			
			}*/

			if (document.location.pathname.indexOf("/embed")==0) {
				YouTubeHighDefinition.checkI(doc,quality,volume,volumelevel,youtubevideoautoplaybehavior,playlistvideoautoplaybehavior,isOptionHandle);
			}
			
			if (doc.location.pathname=="/watch") {
				
				var currentvideoquality = quality;
				//var enableautoplay = YouTubeHighDefinition.getPrefValue("extensions.youtubehighdefinition.enableautoplay");
				var enableautoplay = YouTubeHighDefinition.getYoutubeVideoAutoPlayBehavior(youtubevideoautoplaybehavior);
				var volumelevel	= YouTubeHighDefinition.getVolumeLevel(volume,volumelevel);
				/*player.setAttribute("wmode", "opaque");

				var flashvars = player.getAttribute("flashvars");

				function changeFlashvars(flashvars, option, value) 
				{
					var delimit = "&" + option;
					if (flashvars.indexOf(delimit) == -1 ) {
						flashvars += delimit + "=" + value;
					}
					else {
						var splitarray = flashvars.split(delimit);
						var result = splitarray[1].indexOf("&");
						if (result != -1) {
							flashvars = splitarray[0] + delimit + "=" + value + splitarray[1].substr(result);
						}
						else {
							flashvars = splitarray[0] + delimit + "=" + value;
						}
					}
					return flashvars;
				}				

				player.setAttribute("flashvars", changeFlashvars(flashvars,"vq",currentvideoquality ));
			
				var oldplayer=player;
				var playerparentnode=oldplayer.parentNode;
				var playernextsibling=oldplayer.nextSibling; 
				playerparentnode.removeChild(oldplayer); 
				var playerclone=oldplayer.cloneNode(true); 
				playerparentnode.insertBefore(playerclone,playernextsibling);*/
				
				var prelogs_enabled=true;
				if(prelogs_enabled){
					try {
						try{player.getPlayerState()}
						catch(e){
							throw e;
						}
					}catch(e){
						var ythderrinterval=window.setInterval(function(){
							try{						
								document.getElementById("movie_player").getPlayerState()
								window.clearTimeout(ythderrinterval);
								YouTubeHighDefinition.changeVideoQuality(doc,quality,volume,volumelevel,youtubevideoautoplaybehavior,playlistvideoautoplaybehavior,isOptionHandle);
							}catch(e){
								
							}
						},25);
						return;
					}
				}				

				function checkPlayerReady(player) {
					try{
						if (player.getPlayerState() !=-1) return true;
						else return false;
					}
					catch(e){
						return false;
					}
				}

				var ythdinterval=window.setInterval(function(){
					var player=document.getElementById("movie_player");
					if(checkPlayerReady(player)) {

						if(currentvideoquality=="default") {
							if(volumelevel!="default") {
								player.unMute();
								player.setVolume(volumelevel);
							}							
							var cTime=player.getCurrentTime();
							//if(isOptionHandle) player.stopVideo();
							//player.seekTo(cTime);
							//player.pauseVideo();
							player.setPlaybackQuality("small");
							player.setPlaybackQuality(currentvideoquality);
							//player.playVideo();
							if(!enableautoplay) {
								player.pauseVideo();
							}
						}
						else {
							if(volumelevel!="default") {
								player.unMute();
								player.setVolume(volumelevel);
							}							
							var cTime=player.getCurrentTime();
							//if(isOptionHandle) player.stopVideo();
							//player.seekTo(cTime);
							//player.pauseVideo();
							player.setPlaybackQuality(currentvideoquality);
							//player.playVideo();
							if(!enableautoplay) {
								player.pauseVideo();
							}
						}
						
						window.clearInterval(ythdinterval);
						//YouTubeHighDefinition.changeVideoSize(doc,YouTubeHighDefinition.size);
					}
				
				},50);
				
			}
			
		
			//YouTubeHighDefinition.addOptionButton(dc);
		}
			
	},
	handleChannelChange:function(event){

		if(event.target.nodeName=='EMBED') { 
		
			var doc = event.target.ownerDocument;

			window.setTimeout(function () { 

				YouTubeHighDefinition.changeVideoQuality(doc);
					
			},1); 
		
		}
		
	},
	changeVideoSize:function(doc,size,id,isOptionHandle){

		var dc = doc;
		if(size) YouTubeHighDefinition.size=size;
		var channel= dc.getElementById("playnav-player");
		if(channel) return;//do not let channels have a size because they cant

		var currentvideosize = size ? size : YouTubeHighDefinition.size;

		if(currentvideosize=="fullpage") {
			
			if(!dc.getElementById("ythdlink")){
				var link=dc.createElement("link");
				link.setAttribute("rel","stylesheet");
				link.setAttribute("type","text/css");
				link.setAttribute("id","ythdlink");				
				link.setAttribute("href",id+"style/style.css");
				dc.head.appendChild(link);				
			}
			
			if(dc.getElementById("player")) {
				dc.getElementById("player").removeAttribute('style');
			}
			if(dc.getElementsByClassName("html5-video-container")[0]) {
				dc.getElementsByClassName("html5-video-container")[0].removeAttribute('style');
			}					
			if(dc.getElementById("player-api")){
				dc.getElementById("player-api").style.removeProperty("margin-left");
			}					
			/*
			if(dc.getElementById("related")){
				dc.getElementById("related").style.removeProperty("top");
			}
			*/ 
			if(dc.getElementById("watch-appbar-playlist")){
				dc.getElementById("watch-appbar-playlist").style.removeProperty("left");						
			} 
			if(dc.getElementById("watch-appbar-playlist")){
				dc.getElementById("watch-appbar-playlist").style.removeProperty("margin-top");						
			}
			
			/*
			if(dc.getElementsByClassName("ytp-size-toggle-large")[0]){
				dc.getElementsByClassName("ytp-size-toggle-large")[0].click();
			}
			*/				
			if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 28,")==0) || !dc.querySelector("ytd-watch[theater]")){								
				if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 28,")==0) && dc.querySelector(".ytp-size-button path").parentNode.parentNode) {
					dc.querySelector(".ytp-size-button path").parentNode.parentNode.click();
					//dc.defaultView.clearInterval(interwal)					
				}
			}
			
			if(dc.getElementById("watch7-container") && dc.getElementById("watch7-container").classList.contains('watch-wide')) {
				dc.getElementById("watch7-container").classList.remove('watch-wide');
			}
			/*if(dc.getElementById("watch7-container") && dc.getElementById("watch7-container").classList.contains('watch-medium')){
				dc.getElementById("watch7-container").classList.remove('watch-medium');
			}*/ 
			if(dc.getElementById("player") && dc.getElementById("player").classList.contains('watch-playlist-collapsed')) {
				dc.getElementById("player").classList.remove('watch-playlist-collapsed');
			}							
			if(dc.getElementById("player") && dc.getElementById("player").classList.contains('watch-medium')) {
				dc.getElementById("player").classList.remove('watch-medium');
			}
			if(dc.getElementById("player") && dc.getElementById("player").classList.contains('watch-small')) {
				dc.getElementById("player").classList.remove('watch-small');
			}
			if(dc.getElementById("page") && dc.getElementById("page").classList.contains('watch-non-stage-mode')) {
				dc.getElementById("page").classList.remove('watch-non-stage-mode');
			}
			/*if(dc.getElementById("page") && dc.getElementById("page").classList.contains('watch-stage-mode')) {
				dc.getElementById("page").classList.remove('watch-stage-mode');
			}*/
			if(dc.getElementById("page")){
				dc.getElementById("page").classList.add('watch-stage-mode');						
			}
			if(dc.getElementById("page")){
				dc.getElementById("page").classList.add('watch-wide');						
			}
			
			function doTheRest(){
				if(dc.getElementById("masthead-container") && dc.getElementById("page-manager")){
					YouTubeHighDefinition.scrollTo(document);
					var interwal2=dc.defaultView.setInterval(function(){
						if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 28,")==0) || !dc.querySelector("ytd-watch[theater]")){								
							if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 28,")==0) && dc.querySelector(".ytp-size-button path").parentNode.parentNode) {
								dc.querySelector(".ytp-size-button path").parentNode.parentNode.click();
								dc.defaultView.clearInterval(interwal2)					
							}
						}
						else {
							dc.defaultView.clearInterval(interwal2)	
						}
					},1000)
					
					/*
					var interwal3=dc.defaultView.setInterval(function(){
						YouTubeHighDefinition.scrollTo(document);									
						dc.defaultView.clearInterval(interwal3)
					},5000);
					*/
					
				}						
			}
			
			var interwal;
			var it=0;
			
			if(dc.querySelector("#player.ytd-watch")){
				//dc.getElementById("player").setAttribute('style','height:' + (dc.body.clientHeight) + 'px !important');
				dc.querySelector("#player.ytd-watch").setAttribute('style','height:' + (dc.defaultView.innerHeight) + 'px !important');
			}
			else{
				interwal=dc.defaultView.setInterval(function(){
					if(!dc.querySelector("#player.ytd-watch")) {
						it++;
						return;
					}
					else {
						dc.defaultView.clearInterval(interwal);
					}
					dc.querySelector("#player.ytd-watch").setAttribute('style','height:' + (dc.defaultView.innerHeight) + 'px !important');
					doTheRest();								
				},100)						
			}

			if(dc.getElementsByClassName("html5-video-container")[0] && dc.getElementById("movie_player")){
				dc.getElementsByClassName("html5-video-container")[0].setAttribute('style','width:' + (dc.body.clientWidth) + 'px !important;margin-left:-'+dc.getElementById("movie_player").getBoundingClientRect().x+'px !important;');
			}					
			
			//dc.defaultView.setTimeout(function(){dc.getElementById("movie_player").scrollIntoView(true);},1000)
			
			if(dc.getElementById("placeholder-playlist") && dc.getElementById("watch-appbar-playlist")){
				var element = dc.getElementById("placeholder-playlist");
				var rect = element.getBoundingClientRect();					
				var element2 = dc.getElementById("watch-appbar-playlist");
				var rect2 = element2.getBoundingClientRect();	
				if(rect.y!=rect2.y) {
					if(dc.getElementById("watch-appbar-playlist")){
						dc.getElementById("watch-appbar-playlist").style.setProperty("margin-top",(rect.y-rect2.y)+"px", "important");
					}
				}
				/*if(dc.getElementById("watch-appbar-playlist")) {
					dc.getElementById("watch-appbar-playlist").style.setProperty("left",((rect.right-rect2.right)+640+10)+"px", "important");
				}*/						
			}
			
			doTheRest();
			
		}		
		
		else if((currentvideosize=="expand")) {
			
			if(dc.getElementById("ythdlink")) dc.getElementById("ythdlink").parentNode.removeChild(dc.getElementById("ythdlink"));
					
			/*
			if(dc.getElementsByClassName("ytp-size-toggle-large")[0]){
				dc.getElementsByClassName("ytp-size-toggle-large")[0].click();
			}
			*/				
			if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 28,")==0) || !dc.querySelector("ytd-watch[theater]")){								
				if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 28,")==0) && dc.querySelector(".ytp-size-button path").parentNode.parentNode) {
					dc.querySelector(".ytp-size-button path").parentNode.parentNode.click();
					//dc.defaultView.clearInterval(interwal)					
				}
			}

			if(dc.querySelector("#player.ytd-watch")){
				dc.querySelector("#player.ytd-watch").removeAttribute('style');
			}
			if(dc.getElementsByClassName("html5-video-container")[0]) {
				dc.getElementsByClassName("html5-video-container")[0].removeAttribute('style');
			}					
			if(dc.getElementById("player-api")){
				dc.getElementById("player-api").style.removeProperty("margin-left");
			}					
			/*
			if(dc.getElementById("related")){
				dc.getElementById("related").style.removeProperty("top");
			}
			*/
			if(dc.getElementById("watch-appbar-playlist")){
				dc.getElementById("watch-appbar-playlist").style.removeProperty("left");
			}
			if(dc.getElementById("watch-appbar-playlist")){
				dc.getElementById("watch-appbar-playlist").style.removeProperty("margin-top");
			}
			
			if(dc.getElementById("watch7-container")){
				dc.getElementById("watch7-container").classList.add('watch-wide');
			}
			/*if(dc.getElementById("watch7-container")){
				dc.getElementById("watch7-container").classList.add('watch-medium');
			}*/
			if(dc.getElementById("player")){
				dc.getElementById("player").classList.add('watch-playlist-collapsed');
			}
			if(dc.getElementById("player")){
				dc.getElementById("player").classList.add('watch-medium');
			}					
			if(dc.getElementById("page")){
				dc.getElementById("page").classList.add('watch-stage-mode');
			}					
			if(dc.getElementById("page")){
				dc.getElementById("page").classList.add('watch-wide');
			}					
			if(dc.getElementById("player") && dc.getElementById("player").classList.contains('watch-small')){
				dc.getElementById("player").classList.remove('watch-small');
			}
			if(dc.getElementById("page") && dc.getElementById("page").classList.contains('watch-non-stage-mode')) {
				dc.getElementById("page").classList.remove('watch-non-stage-mode');
			}
			
			if(isOptionHandle) {
				dc.defaultView.scrollTo(0,0);
			}
			
			if(dc.getElementsByClassName("html5-main-video")[0]){
				dc.getElementsByClassName("html5-main-video")[0].style.top="0px";
			}

			var interwal=dc.defaultView.setInterval(function(){
						
				if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 28,")==0) || !dc.querySelector("ytd-watch[theater]")){								
					if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 28,")==0) && dc.querySelector(".ytp-size-button path").parentNode.parentNode) {
						dc.querySelector(".ytp-size-button path").parentNode.parentNode.click();
						dc.defaultView.clearInterval(interwal)					
					}
				}
				else {
					dc.defaultView.clearInterval(interwal)	
				}
			},1000)
			
			//chrome.cookies.set({"url": ".youtube.com", "name": "wide", "value": 1});          
		}
		else if(currentvideosize=="shrink") {
			
			if(dc.getElementById("ythdlink")) dc.getElementById("ythdlink").parentNode.removeChild(dc.getElementById("ythdlink"));
			
			if(dc.querySelector("#player.ytd-watch")){
				dc.querySelector("#player.ytd-watch").removeAttribute('style');
			}
			if(dc.getElementsByClassName("html5-video-container")[0]) {
				dc.getElementsByClassName("html5-video-container")[0].removeAttribute('style');
			}					
			if(dc.getElementById("player-api")){
				dc.getElementById("player-api").style.removeProperty("margin-left");
			}					
			/*
			if(dc.getElementById("related")){
				dc.getElementById("related").style.removeProperty("top");
			}
			*/
			if(dc.getElementById("watch-appbar-playlist")){
				dc.getElementById("watch-appbar-playlist").style.removeProperty("left");
			}
			if(dc.getElementById("watch-appbar-playlist")){
				dc.getElementById("watch-appbar-playlist").style.removeProperty("margin-top");
			}
			
			/*
			if(dc.getElementsByClassName("ytp-size-toggle-small")[0]){
				dc.getElementsByClassName("ytp-size-toggle-small")[0].click();
			}					
			if (dc.querySelector("ytd-watch[theater]")) {
				dc.getElementsByClassName("ytp-size-button")[0].click();
			}						
			if(dc.querySelector(".ytp-size-button[title*=Default]") || dc.querySelector("ytd-watch[theater]")){
				if(dc.querySelector(".ytp-size-button[title*=Default]")) {
					dc.querySelector(".ytp-size-button[title*=Default]").click();
				}
			} 						
			*/						
			
			if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 26,")==0) || dc.querySelector("ytd-watch[theater]")){								
				if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 26,")==0) && dc.querySelector(".ytp-size-button path").parentNode.parentNode) {
					dc.querySelector(".ytp-size-button path").parentNode.parentNode.click();
					//dc.defaultView.clearInterval(interwal)					
				}
			}					
			
			if(dc.getElementById("watch7-container") && dc.getElementById("watch7-container").classList.contains('watch-wide')){
				dc.getElementById("watch7-container").classList.remove('watch-wide');
			} 
			/*if(dc.getElementById("watch7-container") && dc.getElementById("watch7-container").classList.contains('watch-medium')){
				dc.getElementById("watch7-container").classList.remove('watch-medium');
			}*/
			if(dc.getElementById("player") && dc.getElementById("player").classList.contains('watch-playlist-collapsed')){
				dc.getElementById("player").classList.remove('watch-playlist-collapsed');	
			} 						
			if(dc.getElementById("player") && dc.getElementById("player").classList.contains('watch-medium')){
				dc.getElementById("player").classList.remove('watch-medium');	
			} 						
			if(dc.getElementById("player")){
				dc.getElementById("player").classList.add('watch-small');
			}
			if(dc.getElementById("page")){
				dc.getElementById("page").classList.add('watch-non-stage-mode');
			}					
			if(dc.getElementById("player") && dc.getElementById("player").classList.contains('watch-wide')){
				dc.getElementById("player").classList.remove('watch-wide');
			}
			if(dc.getElementById("page") && dc.getElementById("page").classList.contains('watch-stage-mode')) {
				dc.getElementById("page").classList.remove('watch-stage-mode');
			}
			if(dc.getElementById("page") && dc.getElementById("page").classList.contains('watch-wide')) {
				dc.getElementById("page").classList.remove('watch-wide');
			}					

			if(isOptionHandle) {
				dc.defaultView.scrollTo(0,0);
			}
			
			var interwal=dc.defaultView.setInterval(function(){
						
				if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 26,")==0) || dc.querySelector("ytd-watch[theater]")){								
					if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 26,")==0) && dc.querySelector(".ytp-size-button path").parentNode.parentNode) {
						dc.querySelector(".ytp-size-button path").parentNode.parentNode.click();
						dc.defaultView.clearInterval(interwal)					
					}
				}
				else {
					dc.defaultView.clearInterval(interwal)	
				}
			},1000)
			
			
			//chrome.cookies.set({"url": ".youtube.com", "name": "wide", "value": 0});
		}
		
		else if(currentvideosize=="default") {
			
			if(isOptionHandle){
				
				//if(dc.body.classList.contains("fullytpagesize")) {
					
					if(dc.querySelector("#player.ytd-watch")){
						dc.querySelector("#player.ytd-watch").removeAttribute('style');
					}
					if(dc.getElementsByClassName("html5-video-container")[0]) {
						dc.getElementsByClassName("html5-video-container")[0].removeAttribute('style');
					}						
					if(dc.getElementById("player-api")){
						dc.getElementById("player-api").style.removeProperty("margin-left");
					}					
					/*
					if(dc.getElementById("related")){
						dc.getElementById("related").style.removeProperty("top");
					}
					*/
					if(dc.getElementById("watch-appbar-playlist")){
						dc.getElementById("watch-appbar-playlist").style.removeProperty("left");
					}
					if(dc.getElementById("watch-appbar-playlist")){
						dc.getElementById("watch-appbar-playlist").style.removeProperty("margin-top");
					}
					
					/*
					if(dc.getElementsByClassName("ytp-size-toggle-small")[0]){
						dc.getElementsByClassName("ytp-size-toggle-small")[0].click();
					}					
					if (dc.querySelector("ytd-watch[theater]")) {
						dc.getElementsByClassName("ytp-size-button")[0].click();
					}						
					if(dc.querySelector(".ytp-size-button[title*=Default]") || dc.querySelector("ytd-watch[theater]")){
						if(dc.querySelector(".ytp-size-button[title*=Default]")) {
							dc.querySelector(".ytp-size-button[title*=Default]").click();
						}
					} 						
					*/						
					
					if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 26,")==0) || dc.querySelector("ytd-watch[theater]")){							
						if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 26,")==0) && dc.querySelector(".ytp-size-button path").parentNode.parentNode) {
							dc.querySelector(".ytp-size-button path").parentNode.parentNode.click();
						}
					}						
					
					
					if(dc.getElementById("watch7-container") && dc.getElementById("watch7-container").classList.contains('watch-wide')){
						dc.getElementById("watch7-container").classList.remove('watch-wide');
					} 
					/*if(dc.getElementById("watch7-container") && dc.getElementById("watch7-container").classList.contains('watch-medium')){
						dc.getElementById("watch7-container").classList.remove('watch-medium');
					}*/
					if(dc.getElementById("player") && dc.getElementById("player").classList.contains('watch-playlist-collapsed')){
						dc.getElementById("player").classList.remove('watch-playlist-collapsed');	
					} 						
					if(dc.getElementById("player") && dc.getElementById("player").classList.contains('watch-medium')){
						dc.getElementById("player").classList.remove('watch-medium');
					} 
					if(dc.getElementById("player")){
						dc.getElementById("player").classList.add('watch-small');
					}
					if(dc.getElementById("page")){
						dc.getElementById("page").classList.add('watch-non-stage-mode');
					}					
					if(dc.getElementById("player") && dc.getElementById("player").classList.contains('watch-wide')){
						dc.getElementById("player").classList.remove('watch-wide');
					}
					if(dc.getElementById("page") && dc.getElementById("page").classList.contains('watch-stage-mode')) {
						dc.getElementById("page").classList.remove('watch-stage-mode');
					}

					if(isOptionHandle){
						dc.defaultView.scrollTo(0,0);
					}
					
					var interwal=dc.defaultView.setInterval(function(){
								
						if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 26,")==0) || dc.querySelector("ytd-watch[theater]")){								
							if((dc.querySelector(".ytp-size-button path") && dc.querySelector(".ytp-size-button path").getAttribute("d").indexOf("m 26,")==0) && dc.querySelector(".ytp-size-button path").parentNode.parentNode) {
								dc.querySelector(".ytp-size-button path").parentNode.parentNode.click();
								//dc.defaultView.clearInterval(interwal)					
							}
						}
						else {
							dc.defaultView.clearInterval(interwal)	
						}
					},1000)							
					
				//}	
				
			}
			
		}		
		
		if(dc.body) dc.body.classList.add("fullytpagesize");
				
	},	
	decodeFlashvars : function (passedFlashvar) {
		var flashVars = {};
		var flashVarsArray = passedFlashvar.split('&');
		for ( i=0;i<flashVarsArray.length;i++ ) {
			var a = flashVarsArray[i].split('=');
			flashVars[a[0]] = decodeURIComponent(a[1]).replace(/\+/g," ");//?------------------ replace may create problems
		}
		return flashVars;
	},
	encodeFlashvars : function (passedFlashvar) {
		var newFlashVars="";
		for (var prop in passedFlashvar) {
			if(!/^(?:ad|ctb|rec)_/i.test(prop)) {
				newFlashVars += "&" + prop + "=" + encodeURIComponent(passedFlashvar[prop]);
			}
		}
		return newFlashVars;
	},		
	addStyle: function(css){
		if(document.getElementById("youtubehighdefinition-stylesheet")==null){
			var link=document.createElement("link");
			link.setAttribute("type","text/css");
			link.setAttribute("rel","stylesheet");
			link.setAttribute("id","youtubehighdefinition-stylesheet");					
			link.setAttribute("href",css);	
			document.getElementsByTagName("head")[0].appendChild(link);
			//document.getElementById("page").classList.add('watch-wide');
			//document.getElementById("watch-video").classList.add('medium');	
		}
		else{
			document.getElementById("youtubehighdefinition-stylesheet").parentNode.removeChild(document.getElementById("youtubehighdefinition-stylesheet"));
		}
	}
};

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_CONTENT_SCRIPT")) {
	//window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
  }
  else if (event.data.type && (event.data.type == "FROM_CONTENT_SCRIPT_SET_VQ")) {
    YouTubeHighDefinition.quality=event.data.text;	
  }
  else if (event.data.type && (event.data.type == "FROM_CONTENT_SCRIPT_SET_VS")) {
    YouTubeHighDefinition.size=event.data.text;
  }
  else if (event.data.type && (event.data.type == "FROM_CONTENT_SCRIPT_REQUEST_CHANGE")) {
	YouTubeHighDefinition.volume=event.data.volume;
	YouTubeHighDefinition.volumelevel=event.data.volumelevel;
	YouTubeHighDefinition.youtubevideoautoplaybehavior=event.data.youtubevideoautoplaybehavior;
	YouTubeHighDefinition.playlistvideoautoplaybehavior=event.data.playlistvideoautoplaybehavior;
	YouTubeHighDefinition.suggestedautoplay=event.data.suggestedautoplay;
	YouTubeHighDefinition.autoexpanddescription=event.data.autoexpanddescription; 
	YouTubeHighDefinition.isOptionHandle=event.data.isOptionHandle;	  
	YouTubeHighDefinition.requestChange(event.data.id,event.data.volume,event.data.volumelevel,event.data.youtubevideoautoplaybehavior,event.data.playlistvideoautoplaybehavior,event.data.suggestedautoplay,event.data.autoexpanddescription, event.data.isOptionHandle);
  }
}, false);

/*window.addEventListener("DOMContentLoaded",function(event){
	//YouTubeHighDefinition.requestChange();
	YouTubeHighDefinition.changeVideoSize(document,YouTubeHighDefinition.size);
},false);*/

window.addEventListener("spfdone",YouTubeHighDefinition.onSPFDone);
window.addEventListener("yt-navigate-start",YouTubeHighDefinition.onSPFDone);

try{
	if(window.ythdonPlayerStateChange && player.removeEventListener) player.removeEventListener('onStateChange','ythdonPlayerStateChange');
	var ythdonPlayerStateChange=function(newState){
		try{
			//var window=window;
			//var window=this;
			//var document=window.document;
			var player=document.getElementById("movie_player");
			var currentvideoquality = YouTubeHighDefinition.getVideoQuality();
			var enableplaylistautoplay = YouTubeHighDefinition.getPlaylistVideoAutoPlayBehavior();
			var enableautoplay = YouTubeHighDefinition.getYoutubeVideoAutoPlayBehavior(YouTubeHighDefinition.youtubevideoautoplaybehavior);	
			if(player.getCurrentTime()==0 && newState==1){
				if(document.location.search.indexOf('list=') != -1) {
					if(!enableplaylistautoplay) {
						player.pauseVideo();
					}
				}
				else{
					if(!enableautoplay) {
						player.pauseVideo();							
					}
				}			
			}			
			if(player.getPlaybackQuality()!=YouTubeHighDefinition.getIntendedQuality(player,currentvideoquality)) {
				if(typeof player.getAdState!=="undefined" && player.getAdState()!=1) {								
					if(document.location.search.indexOf('list=') != -1) {
						if(!enableplaylistautoplay) {
							player.pauseVideo();	
						}
					}
					else{
						if(!enableautoplay) {
							player.pauseVideo();	
						}
					}								
				}							
			}
			if(document.getElementsByTagName("video").length==0 && newState==1 && player.getCurrentTime() < 1 && window.ythdFlPlayerPaused == false){
				if(document.location.search.indexOf('list=') != -1){
					if(!enableplaylistautoplay) {
						player.pauseVideo();	
						window.ythdFlPlayerPaused = true;
					}
				}
				else{
					if(!enableautoplay){
						player.pauseVideo();	
						window.ythdFlPlayerPaused = true;
					}
				}							
			}
			if(newState===-1 || player.getPlaybackQuality()!=YouTubeHighDefinition.getIntendedQuality(player,currentvideoquality)) {
				if(player.getPlaybackQuality()!=YouTubeHighDefinition.getIntendedQuality(player,currentvideoquality)){
					if(typeof player.getAdState!=="undefined" && player.getAdState()!=1){
						if(document.location.search.indexOf('list=') != -1){
							if(!enableplaylistautoplay){
								player.pauseVideo();	
							}
						}
						else{
							if(!enableautoplay){
								player.pauseVideo();	
							}
						}								
					}
				}								
				var ythdonPlayerStateChangeInterval = window.setInterval(function(){
					if (document.location.pathname!="/watch") {
						window.clearInterval(ythdonPlayerStateChangeInterval);										
					}
					try {										
						if(player.getPlaybackQuality()!=YouTubeHighDefinition.getIntendedQuality(player,currentvideoquality)){
							if(typeof player.getAdState!=="undefined" && player.getAdState()!=1){
								if(document.location.search.indexOf('list=') != -1){
									if(!enableplaylistautoplay){
										player.pauseVideo();
									}
								}
								else{
									if(!enableautoplay){
										player.pauseVideo();
									}
								}							
							}											
						}											
						player.setPlaybackQuality(YouTubeHighDefinition.getSetVideoQuality(player,currentvideoquality));
						if (player.getPlaybackQuality() === YouTubeHighDefinition.getIntendedQuality(player,currentvideoquality)){
							window.clearInterval(ythdonPlayerStateChangeInterval);
						}
					} catch(e) {
						window.clearInterval(ythdonPlayerStateChangeInterval);
					}
				}, 25);
			}							
		}
		catch(e){}						
	}				

	if(window.onYouTubePlayerReady) window.onYouTubePlayerReady==null;
	var onYouTubePlayerReady=function(player){
		YouTubeHighDefinition.ytPlayer=player;
		//player.addEventListener('onStateChange','ythdonPlayerStateChange');
		var currentvideoquality = YouTubeHighDefinition.getVideoQuality();
		var enableplaylistautoplay = YouTubeHighDefinition.getPlaylistVideoAutoPlayBehavior();
		var enableautoplay = YouTubeHighDefinition.getYoutubeVideoAutoPlayBehavior(YouTubeHighDefinition.youtubevideoautoplaybehavior);						
		if(player.getPlaybackQuality()!=YouTubeHighDefinition.getIntendedQuality(player,currentvideoquality)){
			if(typeof player.getAdState!=="undefined" && player.getAdState()!=1){
				if(document.location.search.indexOf('list=') != -1){
					if(!enableplaylistautoplay){
						player.pauseVideo();
					}
				}
				else{
					if(!enableautoplay){
						player.pauseVideo();	
					}
				}							
			}							
		}						
		var onYouTubePlayerReadyInterval = window.setInterval(function(){
			if (document.location.pathname!="/watch") {
				window.clearInterval(onYouTubePlayerReadyInterval);										
			}							
			try {									
				if (player.getPlaybackQuality() !== YouTubeHighDefinition.getIntendedQuality(player,currentvideoquality)){
					if(typeof player.getAdState!=="undefined" && player.getAdState()!=1){
						if(document.location.search.indexOf('list=') != -1) {
							if(!enableplaylistautoplay){
								player.pauseVideo();
							}
						}
						else{
							if(!enableautoplay){
								player.pauseVideo();	
							}
						}
					}									
				}
				player.setPlaybackQuality(YouTubeHighDefinition.getSetVideoQuality(player,currentvideoquality));
				if (player.getPlaybackQuality() === YouTubeHighDefinition.getIntendedQuality(player,currentvideoquality)){
					window.clearInterval(onYouTubePlayerReadyInterval);
				}
			} catch(e){
				window.clearInterval(onYouTubePlayerReadyInterval);
			}
		}, 25);	
	};
	window.onYouTubePlayerReady=onYouTubePlayerReady;
	}
catch(e){
	
}