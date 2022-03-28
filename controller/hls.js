axios.get(`https://store.externulls.com/facts/file/${req.query.id}`,{ responseType: 'json' })
.then( async(response)=>{
		
	let data = response.data;
	let video = new Object();
				
	video.category = new Array();
	video.id = data['fc_file_id'];
	video.duration = data['file']['fl_duration'];
	video.name = data['file']['stuff']['sf_name'];
	video.creation = data['fc_facts'][0]['fc_created'];
	video.thumbs = data['fc_facts'][0]['fc_thumbs'][0];
	video.image = `path?path=thumbs-015.externulls.com/videos/${video.id}/${video.thumbs}.jpg/to.webp?size=320x180`
								
	for( var i in data['tags'] ){
		video.category.push( data['tags'][i]['tg_slug'] );
	}	
			
	if( response.data['fc_facts'][0]['hls_resources'] === undefined ){
		video.hls = data['file']['hls_resources'];
	} else {
		res.writeHead( 200, {'Content-Type':'text/plain'} );
		video.hls = data['fc_facts'][0]['hls_resources'];
	}
			
	res.send( 200, JSON.stringify(video) );
			
});