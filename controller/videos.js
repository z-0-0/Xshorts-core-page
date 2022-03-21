
let url = "https://store.externulls.com/facts/tag";

axios.get( `${url}?id=${req.query.id}&limit=30&offset=${req.query.offset}`,{ responseType: 'json' } )
.then( response=>{
	let page = new String();		
	response.data.forEach( x=>{
	
		let id =  x.fc_file_id;
		let name = x.file.stuff.sf_name;
		let story = x.file.stuff.sf_story;
		let views = x.fc_facts[0].fc_views;
		let likes = x.fc_facts[0].fc_likes;
		let tmb = x.fc_facts[0].fc_thumbs[0];
		let dislikes = x.fc_facts[0].fc_dislikes;
		let vid = `/vp.externulls.com/new/480p/${id}.mp4`;
		let img = `/thumbs-015.externulls.com/videos/${id}/${tmb}.jpg/to.webp?size=320x180`;
		
		page += ` 
			<a href="./play?id=${id}" class="uk-inline uk-padding-small uk-child-width-expand uk-height-medium" id="video">
				<img src="./img/placeholder.png" data-src="${img}" alt="${id}" id="image"></img>
				<video data-src="${vid}" preload="auto" playsinline hidden muted loop autoplay></video>
				<div class="uk-position-cover">
					<spam class="uk-red-badge-actived uk-position-bottom uk-position-medium">${name.slice(0,30)}<spam>
				</div>
			</a>
		`;	
		
	});	
	
	res.writeHead( 200,{'Content-Type':'text/plain'} );
	res.end( page );

});
