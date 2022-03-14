//TODO: Libreries ########################################################### //

const readline = require('readline');
const axios = require('axios');
const http = require('http');
const url = require('url');
const fs = require('fs');

const path = `${__dirname}/www`;
const port = process.env.PORT || 3000;

//TODO: String Normalization ################################################ //
const slugify = str => { const map = {
    'c' : 'ç|Ç','n' : 'ñ|Ñ',
   	'e' : 'é|è|ê|ë|É|È|Ê|Ë',
   	'i' : 'í|ì|î|ï|Í|Ì|Î|Ï',
   	'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
   	'o' : 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
   	'a' : 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
	''	: ` |:|_|!|¡|¿|\\?|#|/|,|-|'|"|’`,
};	for (var pattern in map) { 
		str=str.replace( new RegExp(map[pattern],'g' ), pattern); 
	}	return str.toLowerCase();
}

//TODO: String Normalization ################################################ //
const mimeType = {    
    "bmp" : "image/bmp",
    "gif" : "image/gif",
    "png" : "image/png",
    "jpg" : "image/jpeg",
    "jpeg": "image/jpeg",
    "webp": "image/webp",
    "svg" : "image/svg+xml",
    
    "aac" : "audio/aac",
    "wav" : "audio/wav",
    "weba": "audio/webm",
    "mp3" : "audio/mpeg",
    
    "mp4" : "video/mp4",
    "webm": "video/webm",
    "ts"  : "video/mp2t",
    "mpeg": "video/mpeg",
    "avi" : "video/x-msvideo",

	"fbx" : "text/plain",
	"dae" : "text/plain",
	"mtl" : "text/plain",
	"obj" : "text/plain",
	"glb" : "text/plain",
	"gltf": "text/plain",
    
    "css" : "text/css",
    "csv" : "text/csv",
//  "html": "text/html",
    "txt" : "text/plain",
    "text": "text/plain",
    "js"  : "text/javascript",
    "xml" : "application/xml",
    
    "zip" : "application/zip",
    "pdf" : "application/pdf",
    "gz"  : "application/gzip",
    "json": "application/json",
    "tar" : "application/x-tar",
    "rar" : "application/vnd.rar",
    "7z"  : "application/x-7z-compressed",
    "m3u8": "application/vnd.apple.mpegurl",
};

//TODO: header Functions XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX   //
header = ( mimeType="text/plain" )=>{
	return { 
		'Content-Security-Policy-Reporn-Only': "default-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self';",
		'Strict-Transport-Security': 'max-age=31536000; preload',
	//	'cache-control': 'public, max-age=6000',
		'Access-Control-Allow-Origin':'*',
		'Content-Type':mimeType 
	};
}

chunkheader = ( start,end,size,mimeType="text/plain" )=>{
	const contentLength = end-start+1;
	return {
		'Content-Security-Policy-Reporn-Only': "default-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self';",
		'Strict-Transport-Security': 'max-age=31536000; preload',
		"Content-Range":`bytes ${start}-${end}/${size}`,
	//	'cache-control': 'public, max-age=6000',
		"Access-Control-Allow-Origin":"*",
		"Content-Length":contentLength,
		"Content-Type": mimeType,
		"Accept-Ranges":"bytes",
	};
}

//TODO: 404 Page Error XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
_404_ = ()=>{ 
	let url = `${path}/404.html`
	if( fs.existsSync(url) )
		return fs.readFileSync(`${path}/404.html`); 
		return '404 not found';
}

//TODO: Server Started ###################################################### //
router = (req,res)=>{ 
	
	var q = url.parse(req.url, true);
	var d = q.query;
					
	//TODO: Server Pages #################################################### //
	if( q.pathname=="/" ){
		fs.readFile(`${path}/index.html`, (err,data)=>{
			if (err) {
				res.writeHead(404, header('text/html'));
				return res.end( _404_() ); }
			res.writeHead(200,header('text/html'));
			res.write(data); res.end();
		});
	} else if( fs.existsSync(`${path}${q.pathname}.html`) ) {
		let data = fs.readFileSync(`${path}${q.pathname}.html`);
		res.writeHead(200,header('text/html'));
		res.end(data);
	}
	
	//TODO: Server Conditions ############################################### //
	else if( q.pathname == '/request' ){
		
		var data = new Array();
		
		const readInterface = readline.createInterface({
			input: fs.createReadStream(`${__dirname}/data`),
		});
		
		try{ let i=0;
			readInterface.on('line', (line)=>{ 
			
				if( i>d.end ) readInterface.close();
			
				if( d.filter=='undefined' ){i++; 
					if( d.start<i && i<d.end ) data.push(line);
				} else { 
					let index = slugify(line).search( slugify(d.filter) );
					if( index>=0 ){ i++; 
						if( d.start<i && i<d.end ) data.push(line);
					}
				}
					
			});
		} catch(e) {}
		
		readInterface.on('close', (line)=>{
			if( d.search=='random' ){
				data = data.sort(() => Math.random()-0.5)
			}
			res.writeHead(200, header('text/plain'));
			res.end( JSON.stringify(data.reverse()) );
		});
		
	}
	
	else if( q.pathname == '/hls' ){
		axios.get(`https://store.externulls.com/facts/file/${d.id}`,{ responseType: 'json' })
		.then( async(response)=>{
			
			let data = response.data;
			let video = new Object();
				
			video.category = new Array();
			video.id = data['fc_file_id'];
			video.duration = data['file']['fl_duration'];
			video.name = data['file']['stuff']['sf_name'];
			video.creation = data['fc_facts'][0]['fc_created'];
			video.thumbs = data['fc_facts'][0]['fc_thumbs'][0];
			video.image = `/thumbs-015.externulls.com/videos/${video.id}/${video.thumbs}.jpg/to.webp?size=320x180`
								
			for( var i in data['tags'] ){
				video.category.push( data['tags'][i]['tg_slug'] )			
			}	
			
			if( response.data['fc_facts'][0]['hls_resources'] === undefined ){
				video.hls = data['file']['hls_resources'];
			} else {
				res.writeHead(200, header('text/plain'));
				video.hls = data['fc_facts'][0]['hls_resources'];
			}
			
			res.writeHead(200, header('text/plain'));
			res.end( JSON.stringify(video) );
			
		});
	}
	
	else if( q.pathname.startsWith("/thumbs") || q.pathname.startsWith("/vp.") 
		  || q.pathname.endsWith(".ts") || q.pathname.startsWith("/store") ){
		axios.get( `https:/${q.path}`,{ responseType: 'arraybuffer' } )
		.then( async(response)=>{
			res.writeHead(200, header('text/plain'));
			res.end( response.data );
		});
	}
	
	else if( q.pathname.startsWith("/key") ){
		axios.get( `https://video.beeg.com${q.path}` )
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
							
			res.writeHead(200, header('text/plain'));
			res.end( file.join('\n') );
		});
	}
		
	//TODO: Server Chunk   XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX //
	else{
		const keys = Object.keys(mimeType);
		for( var i in keys ){
			if( q.pathname.endsWith(keys[i]) ){
				
				const range = req.headers.range;
				this.url = (`${path}${q.pathname}`).replace(/%20/g,' ');
			
				try{ 	
					if( fs.existsSync( this.url ) ){
						res.writeHead(200, header( mimeType[keys[i]] ));
						res.end( fs.readFileSync( this.url ) );
					}	
					
				} catch(e) {
					res.writeHead(404, header('text/html'));
					res.end( _404_() );
				}	return 0;		
			}
		}	
		
		res.writeHead(404, header('text/html'));
		res.end( _404_() );
	}	
	
}

http.createServer( router )
.listen(port,'0.0.0.0',()=>{
	console.log(`started at http://localhost:${port}`)
});