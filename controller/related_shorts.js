
let url = "https://api.redgifs.com/v2/users";

axios.get( `${url}/${req.query.id}/search?order=recent&page=${req.query.page}`,{ responseType: 'json' } )
.then( response=>{ let page = '';
	
	response.data.gifs.forEach( x=>{
		let q = ( x.height<x.width ) ? 'uk-nocover' : 'uk-cover' ;
		page += `
			<li id="short" class="uk-flex uk-flex-center"> 
				<video data-src="${x.urls.sd}" poster="${x.urls.thumbnail}" class="${q} uk-width-auto@s uk-width-1-1" autoplay loop preload="auto"></video>
			</li>
		`;
	});	
	
	res.send( 200, page );

});
