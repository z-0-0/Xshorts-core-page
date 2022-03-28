
axios.get( `${url}?query=${ req.query.q }`,{ responseType: 'json' })
.then( async(response)=>{ let page = '';
	var data = response.data;

	data.forEach( x=>{
		page+=`<option value="${x.text}">`
	});	
	
	res.send( 200, page );
	
});
	