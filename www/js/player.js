window.onload=()=>{ 
	
	fetch(`/hls?id=${query.get('id')}`)
	.then( async(response)=>{
		
		var data = await response.json();
		
		$('#info').innerHTML = `
			<p class="uk-text-bold uk-text-lead uk-text-truncate"> ${data.name} </p>
			<div> <strong>Tags:</strong> ${ badge(data.category) }</div>
		`;	
		
		$('video').innerHTML = `
			<source src="/${data.hls['fl_cdn_240']}" type="application/x-mpegURL" title="240p">
			<source src="/${data.hls['fl_cdn_480']}" type="application/x-mpegURL" title="480p">
			<source src="/${data.hls['fl_cdn_720']}" type="application/x-mpegURL" title="720p">
			<source src="/${data.hls['fl_cdn_1080']}" type="application/x-mpegURL" title="1080p">
		`;	
		
		query.set('filter',data.category[(Math.random()*data.category.length).toFixed(0)]);
		query.set('search','random');
		$('video').poster = data.image;		
		loadVideos(); events(); 

		if (Hls.isSupported()) {
			var hls = new Hls();
				hls.loadSource( `/${data.hls['fl_cdn_240']}` );
				hls.attachMedia( $('video') );
		} else if (video.canPlayType('application/vnd.apple.mpegurl'))
			$('video').src = `/${data.hls['fl_cdn_240']}`;
			
	}).catch( err=>console.log(err) );
	
}
