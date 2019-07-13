	var ExtPop={
		sto:null,
		getStorage:function(){
			return ExtPop.sto=="sync" ? chrome.storage.sync : chrome.storage.local;
		}		
	}
	
	function requestVideoQualitySizeChange(event) {

		var f = document.getElementsByTagName("select")[0];		
		var q=f.options[f.selectedIndex].getAttribute("value");
			
		var g = document.getElementsByTagName("select")[1];		
		var s=g.options[g.selectedIndex].getAttribute("value");
			
		var j = document.getElementById("annotationsoff");		
		var a=j.checked;
			
		var v = document.getElementById("volume");		
		var vl = document.getElementById("volumelevel");
	
		var volume=document.querySelector('#volume input[type="radio"][name="volume"]:checked').value;
		var volumelevel=document.querySelector('#volumelevel').value;
		
		var youtubevideoautoplaybehavior=document.querySelector('#youtubevideoautoplaybehavior').value;
		var playlistvideoautoplaybehavior=document.querySelector('#playlistvideoautoplaybehavior').value;
		
		var suggestedautoplay = document.getElementById("suggestedautoplay").checked;
		
		var embeddedvideoautoplaybehavior=document.querySelector('#embeddedvideoautoplaybehavior').value;
		
		var autoexpanddescription = document.getElementById("autoexpanddescription").checked;

		chrome.tabs.query({
				active: true,
				currentWindow:true
			}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {action: 'video_qualitysize_change', 'quality' : q, 'size' : s, "volume": volume, "volumelevel": volumelevel, suggestedautoplay: suggestedautoplay, autoexpanddescription: autoexpanddescription, "isOptionHandle" : true}, function(response) {
						//foo
					}
				);
			}
		);
		
		saveQualitySize(q,s,a,volume,volumelevel,youtubevideoautoplaybehavior,playlistvideoautoplaybehavior,suggestedautoplay, embeddedvideoautoplaybehavior,autoexpanddescription);
		
	}	
		
	function saveQualitySize(q,s,a,volume,volumelevel,youtubevideoautoplaybehavior,playlistvideoautoplaybehavior,suggestedautoplay, embeddedvideoautoplaybehavior,autoexpanddescription) {
		chrome.runtime.sendMessage({'action' : 'qualitysize_save', 'quality' : q, 'size' : s, "annotationsoff": a, "volume": volume, "volumelevel": volumelevel,
		youtubevideoautoplaybehavior:youtubevideoautoplaybehavior,		
		playlistvideoautoplaybehavior:playlistvideoautoplaybehavior,		
		suggestedautoplay:suggestedautoplay,		
		embeddedvideoautoplaybehavior:embeddedvideoautoplaybehavior,		
		autoexpanddescription:autoexpanddescription		
		}, function(o) {
				//foo
			}
		);
	}	
	/*
		function requestVideoSizeChange(size) {
			
			chrome.tabs.query({
					active: true,
					currentWindow:true
				}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {action: 'video_size_change', 'size' : size}, function(response) {
							//foo
						}
					);
				}
			);			
		
		}
	*/

	function adjustOptions(q,s,annotationsoff,volume,volumelevel,youtubevideoautoplaybehavior,playlistvideoautoplaybehavior,suggestedautoplay,embeddedvideoautoplaybehavior,autoexpanddescription) {
	
		var a;
		var b;
		var si;
		var sib;
	
		a = document.getElementsByTagName("select")[0];		
		
		for (var i=0;i<a.length;i++) {
		
			if(a[i].getAttribute("value")==q) {si=i;break;}
		
		}

		a.selectedIndex=si;

		document.getElementsByTagName("select")[0].addEventListener("change",requestVideoQualitySizeChange,true);

		
		b = document.getElementsByTagName("select")[1];		

		for (var i=0;i<b.length;i++) {
		
			if(b[i].getAttribute("value")==s) {sib=i;break;}
		
		}
		
		b.selectedIndex=sib;
		
		document.getElementsByTagName("select")[1].addEventListener("change",requestVideoQualitySizeChange,true);		

		document.getElementById("annotationsoff").checked=annotationsoff;
		document.getElementById("annotationsoff").addEventListener("change",requestVideoQualitySizeChange,true);

		document.querySelector('#volume input[type="radio"].vol_'+volume+'').checked=true;
		document.querySelector('#volumelevel').value=volumelevel;
		document.getElementById("volume").addEventListener("change",requestVideoQualitySizeChange,true);
		document.getElementById("volumelevel").addEventListener("focus",function(event){
			document.getElementById("volumelevelinput").checked=true;
		},true);
		document.getElementById("volumelevel").addEventListener("change",requestVideoQualitySizeChange,true);
		
		document.querySelector('#youtubevideoautoplaybehavior [value="'+youtubevideoautoplaybehavior+'"]').selected=true;
		document.querySelector('#youtubevideoautoplaybehavior').addEventListener("change",requestVideoQualitySizeChange,true);
		
		document.querySelector('#playlistvideoautoplaybehavior [value="'+playlistvideoautoplaybehavior+'"]').selected=true;
		document.querySelector('#playlistvideoautoplaybehavior').addEventListener("change",requestVideoQualitySizeChange,true);

		document.getElementById("suggestedautoplay").checked=suggestedautoplay;
		document.getElementById("suggestedautoplay").addEventListener("change",requestVideoQualitySizeChange,true);	
		
		document.querySelector('#embeddedvideoautoplaybehavior [value="'+embeddedvideoautoplaybehavior+'"]').selected=true;
		document.querySelector('#embeddedvideoautoplaybehavior').addEventListener("change",requestVideoQualitySizeChange,true);
		
		document.getElementById("autoexpanddescription").checked=autoexpanddescription;
		document.getElementById("autoexpanddescription").addEventListener("change",requestVideoQualitySizeChange,true);		
		
	}		
	
	function askQualitySize() {
		if(!ExtPop.sto){
			chrome.runtime.sendMessage({'action' : 'storage_ask_by_popup'}, 
				function(o) {
					//			
				}
			);
			return;
		}		
		ExtPop.getStorage().get(null, function(items){
			adjustOptions(
				items['video_quality'],
				items['video_size'],
				items["annotationsoff"],
				items["volume"],
				items["volumelevel"],
				items["youtubevideoautoplaybehavior"],
				items["playlistvideoautoplaybehavior"],
				items["suggestedautoplay"],
				items["embeddedvideoautoplaybehavior"],	
				items["autoexpanddescription"]
			);	
		});			
		/*
		chrome.runtime.sendMessage({'action' : 'qualitysize_ask'}, 
			function(o) {
				adjustOptions(o['video_quality'],o['video_size']);
			}
		);
		*/
	}
	
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.action == 'storage_answer_to_popup') {
			try{				
				ExtPop.sto=request.sto;				
				askQualitySize();				
			}catch(e){alert(e);}
		}
	});	
	
	ExtPop.sto="local";
	
	$(document).ready(function() {
		askQualitySize();
	});	