
let url = "https://api.redgifs.com/v2/gifs/search";

axios.get( `${url}${req.parse.search}`,{ responseType: 'json' } )
.then( response=>{ let page = '';
			
	response.data.gifs.forEach( x=>{
		let q = ( x.height<x.width ) ? 'uk-nocover' : 'uk-cover' ;
		page += ` 
			<a onclick="show('${x.urls.sd}','${q}','${x.userName}')" class="uk-inline uk-padding-small uk-child-width-expand uk-height-large" id="video">
				<img src="./img/placeholder.png" data-src="${x.urls.thumbnail}" alt="${x.id}" id="image"></img>
				<video data-src="${x.urls.vthumbnail}" preload="auto" playsinline hidden muted loop autoplay></video>
			</a>
		`;	
		
	});	
	
	res.writeHead( 200,{'Content-Type':'text/plain'} );
	res.end( page );

});
