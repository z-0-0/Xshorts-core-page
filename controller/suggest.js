
axios.get( `${url}?query=${ req.query.q }`,{ responseType: 'json' })
.then( async(response)=>{ let page = '';
	var data = response.data;

	data.forEach( x=>{
		page+=`<option value="${x.text}">`
	});	
	
	res.writeHead( 200,{'Content-Type':'text/plain'} );
	res.end( page );
	
});
	