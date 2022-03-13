window.onload=()=>{ 
	
	fetch(`/hls?id=${query.get('id')}`)
	.then( async(response)=>{
		
		var data = await response.json();
		
		$('#info').innerHTML = `
			<p class="uk-text-bold uk-text-lead uk-text-truncate"> ${data.name} </p>
			<div class="uk-flex uk-flex-wrap"> <strong>Tags:</strong> ${ badge(data.category) }</div>
		`;
		
		query.set('filter',data.category[(Math.random()*data.category.length).toFixed(0)]);
		query.set('search','random');
		$('video').poster = data.image;		
		loadVideos(); events(); 
		
		$('video').setAttribute('src',`/${data.hls['fl_cdn_480']}`);
		$('video').setAttribute('ads',`https://syndication.realsrv.com/splash.php?idzone=4629722`);
		startVast();
	
	}).catch( err=>console.log(err) );
	
}
