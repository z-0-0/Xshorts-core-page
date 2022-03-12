var ppt;

class _VAST_ADS {
	
	constructor( video, src, url ){
		this.video = video;	
		this.vastURL = url;
		this.videoSrc = src;	
		this.event = new Array();
	}
	
	$ = (...args) =>{ return this.div.querySelector(args); }
	$$= (...args) =>{ return this.div.querySelectorAll(args); }
	
	report = ( url )=>{
		fetch( url )
		.then( ()=>console.log('report done: ',url) )
		.catch( ()=>console.log('report error: ',url) );
	}
	
	DomContent = ()=>{
		return `
			<videoPlayer class="uk-inline uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-light">
				<video id="video-player" autoplay playinline preload="auto"></video>
				<div id="skip" class="uk-position-bottom-right uk-position-medium" hidden>
					<a style="border-radius:10px" class="uk-button uk-button-default"> Skip </a>
				</div>
				<div id="play" class="uk-position-center uk-position-medium">
					<a class="uk-icon" uk-icon="icon: play-circle; ratio: 7;"></a>
				</div>
			</videoPlayer>
		`;
	}
	
	XMLparser = (text)=>{
		let result = new Object();
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString( text ,"text/xml");
	
		ppt = xmlDoc;
		try{ 
					
			result.error = xmlDoc.querySelector('Error').textContent;
			result.video = xmlDoc.querySelector('MediaFile').textContent;
			result.tracking = xmlDoc.querySelector('Tracking').textContent;
			result.click = xmlDoc.querySelector('ClickThrough').textContent;
			result.impression = xmlDoc.querySelector('Impression').textContent;
			
			result.duration = Number(xmlDoc.querySelector('Duration').innerHTML.replace(/:/g,''));
		//	result.skip = Number(xmlDoc.querySelector('Linear').attributes.skipoffset.value.replace(/:/g,'')) || 0;
		
		/*
			result.offset = Number(xmlDoc.querySelector('Tracking').attributes.offset.value.replace(/:/g,''));
			
		*/
						
		} catch(e) { console.log(e); return false; }
		
		return result;
	}
	
	initVideoAds = ()=>{
		this.div = document.createElement('div');
		this.div.innerHTML = this.DomContent();
		this.video.parentNode.replaceChild( this.div,this.video );
	}
	
	addEvents =()=>{
		this.event = [
			[this.$('#skip'),'click', ()=>this.endAds()],
			[this.$('#video-player'),'ended', ()=>this.endAds()],
			[this.$('#video-player'),'timeupdate', (e)=>{
				if( this.data.skip<e.srcElement.currentTime 
				 && this.data.skip<this.data.duration )
					this.$('#skip').hidden = false;
			}],
		//	[this.$('#video-player'),'click',()=>{ window.open(this.data.click); this.endAds(); }],
		//	[this.$('#video-player'),'canplay',()=>{ this.report( this.data.impression ); }],
		//	[this.$('#video-player'),'click',()=>{ this.report( this.data.error ); }],
		]
	}
	
	startVideoAds = ()=>{ this.addEvents();
		this.event.map( e=>{ e[0].addEventListener(e[1],e[2]); });
		this.$('#video-player').src = this.data.video;
		this.$('#video-player').controls = false;
	}
	
	endAds = ()=>{	
		this.event.map( e=>{ e[0].removeEventListener(e[1],e[2]) });
	
		this.$('#video-player').src = this.videoSrc;
		this.$('#video-player').controls = true;	
		this.$('#video-player').onclick = null;
		this.$('#video-player').play();
		this.$('#skip').hidden = true;	
	}
	
	runVideoAds = ()=>{	
		fetch( this.vastURL )
		.then( async(response)=>{
			this.data = this.XMLparser( await response.text() );
			this.$('#play').onclick = ()=>{
				this.$('#play').hidden = true;
				if( this.data != false )
					this.startVideoAds();
				else this.endAds();
			}

		})
	}
	
};	let vast = _VAST_ADS;

window.onload = ()=>{
	
	let src = 'http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4';
	let vas = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml'; ///vast.xml
	
		ads = new vast( this.$('#videoPlayer'),src,vas );
		ads.initVideoAds();
		ads.runVideoAds();
	
}

