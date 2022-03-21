if( req.parse.pathname.startsWith("/thumbs") 
 || req.parse.pathname.startsWith("/store") 
 || req.parse.pathname.startsWith("/vp") 
 || req.parse.pathname.endsWith(".ts") ){
	 
	axios.get( `https:/${req.parse.path}`,{ responseType: 'arraybuffer' } )
	.then( response=>{	
		res.writeHead( 200, {'Content-Type':'text/plain'} );
		res.end( response.data );	
	});

}

else if( req.parse.pathname.startsWith("/key") ){
	axios.get( `https://video.beeg.com${req.parse.path}` )
	.then( async(response)=>{
				
		let file = response.data.toString().split('\n');
		let url = new Array();
				
		for( var i in file ){ 
			if( file[i].startsWith('http') ){
						
				let index = [
					file[i].indexOf('http') + 7,
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
				return `${url[0]}${url[1]}/seg-${seg}-v1-a1.ts`; 
			} else if( line.startsWith('#EXT-X-ENDLIST') )
				done=true;
			return line;
		});
						
		res.writeHead( 200, {'Content-Type':'text/plain'} );
		res.end( file.join('\n') );
	});
}
