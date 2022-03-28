
let _url = req.query.path;
	_url = _url.replace(/ /g,'+');
	_url = _url.replace(/_/g,'://');
	
axios.get( _url )
.then( async(response)=>{
				
	let file = response.data.toString().split('\n');
	let url = new Array();
			
	for( var i in file ){ 
		if( file[i].startsWith('http') ){
					
			let index = [
				file[i].indexOf('http') + 8,
				file[i].indexOf('.com') + 4,
				file[i].indexOf('.mp4') + 4,							
			];
						
			url = [
				file[i].slice(index[0],index[1]),
				file[i].slice(index[1],index[2]),
				file[i].slice(index[2])
			];
					
			break;
					
		}
	}
			
	let done=false; let seg = 0;
	file = file.map( line=>{
		if( !line.startsWith('#') && !done ){ seg++; 
			return `path?path=${url[0]}${url[1]}/seg-${seg}-v1-a1.ts`; 
		} else if( line.startsWith('#EXT-X-ENDLIST') )
			done=true;
		return line;
	});
	
	res.send( 200, file.join('\n') );

})

.catch(e=>res.send(404,'something went wrong'));

