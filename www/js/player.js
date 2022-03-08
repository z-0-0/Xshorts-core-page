window.onload=()=>{ 
	
	fetch(`/hls?id=${query.get('id')}`)
	.then( async(response)=>{
		
		var data = await response.json();		
		var videoSrc = `/${data.hls['fl_cdn_480']}`;
		var video = $('video');
		
		$('#info').innerHTML = `
			<p class="uk-text-bold uk-text-lead uk-text-truncate"> ${data.name} </p>
			<div> <strong>Tags:</strong> ${ badge(data.category) }</div>
		`;	
		
		query.set('filter',data.category[(Math.random()*data.category.length).toFixed(0)]);
		query.set('search','random');		
		loadVideos(); events(); 
		
		if (Hls.isSupported()) {
			var hls = new Hls();
				hls.loadSource(videoSrc);
				hls.attachMedia(video);
		} else if (video.canPlayType('application/vnd.apple.mpegurl'))
			video.src = videoSrc;
		
	}).catch( err=>console.log(err) );
	
}
