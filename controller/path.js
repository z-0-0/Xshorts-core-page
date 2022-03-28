let _url = `https://${req.query.path}`
	_url = _url.replace(/ /g,'+');

axios( _url,{responseType: 'arraybuffer'} )
.then( response=>{ res.send( 200, response.data ); })
.catch( err=>{ res.send( 404, 'something went wrong' ); });
