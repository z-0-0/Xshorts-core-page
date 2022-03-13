const _play = 'data:image/svg+xml;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48cGF0aCBkPSJNMTIsMkM2LjQ4LDIsMiw2LjQ4LDIsMTJzNC40OCwxMCwxMCwxMHMxMC00LjQ4LDEwLTEwUzE3LjUyLDIsMTIsMnogTTEyLDIwYy00LjQxLDAtOC0zLjU5LTgtOHMzLjU5LTgsOC04czgsMy41OSw4LDggUzE2LjQxLDIwLDEyLDIweiBNOS41LDE2LjVsNy00LjVsLTctNC41VjE2LjV6Ii8+PC9nPjwvc3ZnPg=='

class _VAST_ADS {
	
	constructor( video, src, url ){
		this.event = new Array();
		this.videoSrc = src;
		this.vastURL = url;	
		this.video = video;	
	}
	
	$ = (...args) =>{ return this.div.querySelector(args); }
	$$= (...args) =>{ return this.div.querySelectorAll(args); }
	
	reportTrack = ( url )=>{
		fetch( url )
		.then( ()=>console.log('reportTrack done: ',url) )
		.catch( ()=>console.log('reportTrack error: ',url) );
	}
	
	DomContent = ()=>{
		return `
			<videoPlayer class="uk-inline uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-light">
				<video id="video-player" autoplay playinline preload="auto"></video>
				<div id="skip" class="uk-position-bottom-right uk-position-medium" hidden>
					<a style="border-radius:10px" class="uk-button uk-button-primary"> Skip </a>
				</div> <a id="play" class="uk-position-center"> <img src="${_play}"> </a>
			</videoPlayer>
		`;
	}
	
	XMLparser = (text)=>{
		try{
			let result = new Object();
			let parser = new DOMParser();
			let xmlDoc = parser.parseFromString( text ,"text/xml");
		
			result.events = new Array();	
			result.redirect = xmlDoc.querySelector('ClickThrough').textContent;
			result.duration = Number(xmlDoc.querySelector('Duration').innerHTML.replace(/:/g,''));
			
			try{ result.skip = Number(xmlDoc.querySelector('Linear').attributes.skipoffset.value.replace(/:/g,'')); } 
			catch(e) { result.skip = result.duration + 1; }
		
		/*
			xmlDoc.querySelectorAll('Tracking').forEach( x=>{
				result.events.push([ x.attributes.event.value, x.textContent ]);
			});
		*/
		
			result.src = xmlDoc.querySelector('MediaFile').textContent;		
		//	result.events.push([ 'error', xmlDoc.querySelector('Error').textContent ]);
			result.events.push([ 'load', xmlDoc.querySelector('Impression').textContent ]);
		
			this.data = result; return true;
		} catch(e) { return false; }
	}
	
	initVideoAds = ()=>{
		this.div = document.createElement('div');
		this.div.innerHTML = this.DomContent();
		this.video.parentNode.replaceChild( this.div,this.video );
	}
	
	addEvents =()=>{
		this.event = [
			[this.$('#skip'),'click',()=>this.endAds()],
			[this.$('#video-player'),'timeupdate', (e)=>{
				if( this.data.skip<e.srcElement.currentTime && this.data.skip<this.data.duration )
					this.$('#skip').hidden = false;
			}],
			[this.$('#video-player'),'ended',()=>this.endAds()],
			[this.$('#video-player'),'click',()=>{ window.open(this.data.redirect); this.endAds() }],
			[this.$('#video-player'),'error',()=>{ /*this.reportTrack( this.data.error );*/ this.endAds(); }],
		];
		
		this.data.events.map( x=>{
			this.event.push([this.$('#video-player'),x[0],()=>this.reportTrack(x[1])]); 
		});		
		
	}
	
	startVideoAds = ()=>{ this.addEvents();
		this.event.map( e=>{ e[0].addEventListener(e[1],e[2]); });
		this.$('#video-player').src = this.data.src;
		this.$('#video-player').controls = false;
	}
	
	endAds = ()=>{	
		this.event.map( e=>{ e[0].removeEventListener(e[1],e[2]) });
		
		if (Hls.isSupported()) {
			var hls = new Hls();
				hls.loadSource( this.videoSrc );
				hls.attachMedia( this.$('#video-player') );
		} else if (video.canPlayType('application/vnd.apple.mpegurl'))
			this.$('#video-player').src = this.videoSrc;
		
		this.$('#video-player').controls = true;	
		this.$('#video-player').onclick = null;
		this.$('#video-player').play();
		this.$('#skip').hidden = true;	
	}
		
	playVideo = ()=>{
		this.$('#play').onclick = ()=>{
			this.$('#play').hidden = true;
			this.endAds();
		}
	}
	
	playAds = ()=>{
		this.$('#play').onclick = ()=>{
			this.$('#play').hidden = true;
			this.startVideoAds();
		}
	}	
	
	runVideoAds = ()=>{	
		fetch( this.vastURL )
		.then( async(response)=>{
			let parsed = this.XMLparser( await response.text() );		
			if( parsed ) this.playAds();
			else this.playVideo();
		}).catch( e=>this.playVideo() );
	}
	
};	let vast = _VAST_ADS;

startVast = ()=>{
	$$('.vast-ads').forEach( video=>{
		
		let src = video.attributes.src.value;
		let ads = video.attributes.ads.value;
	
		let VastAds = new vast( video,src,ads );
			VastAds.initVideoAds(); 
			VastAds.runVideoAds();
	});
}

// ./vast.xml
// https://syndication.realsrv.com/splash.php?idzone=4629722
// https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml

