window.addEventListener('load', function(){
	fetch(`/hls?id=${query.get('id')}`)
	.then( async function(response){
		
		var data = await response.json();
		
		$('#info').innerHTML = `
			<p class="uk-text-bold uk-text-lead uk-text-truncate"> ${data.name} </p>
			<div class="uk-flex uk-flex-wrap"> <strong>Tags:</strong> ${ badge(data.category) }</div>
		`;
		
		query.set('filter',data.category[(Math.random()*data.category.length).toFixed(0)]);
		query.set('search','random');
		
		$('video').poster = data.image;		
		loadVideos(); events(); 
		console.log( data );
		
		$('video').setAttribute('ads',`https://syndication.realsrv.com/splash.php?idzone=4629722`);
		$('video').setAttribute('src',`key?path=https_video.beeg.com/${data.hls['fl_cdn_480']}`);
		
		if (Hls.isSupported()) {
			var hls = new Hls();
				hls.loadSource( $('video').src );
				hls.attachMedia( $('video') );
		} else if (video.canPlayType('application/vnd.apple.mpegurl'))
			$('video').src = $('video').src;
	
	}).catch( function(err){console.log(err)} );
});
