window.onload=()=>{ 
	loadVideos(); 
	events(); 
	fetch(`/hls?id=${query.get('id')}`)
	.then( async(response)=>{
		
		var data = await response.json();
		var videoSrc = `/${data['fl_cdn_480']}`;
		var video = $('video');
		
		if (Hls.isSupported()) {
			var hls = new Hls();
				hls.loadSource(videoSrc);
				hls.attachMedia(video);
		} else if (video.canPlayType('application/vnd.apple.mpegurl'))
			video.src = videoSrc;
		
	}).catch( err=>console.log(err) );
}
