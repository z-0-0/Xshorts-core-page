//TODO: Libreries ########################################################### //
//const readline = require('readline');
const axios = require('axios');
const http = require('http');
const url = require('url');
const fs = require('fs');

const path = "./www";
const port = process.env.PORT | 5000;

//TODO: String Normalization ################################################ //
const slugify = str => { const map = {
    'c' : 'ç|Ç','n' : 'ñ|Ñ',
   	'e' : 'é|è|ê|ë|É|È|Ê|Ë',
   	'i' : 'í|ì|î|ï|Í|Ì|Î|Ï',
   	'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
   	'o' : 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
   	'a' : 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
	''	: ` |:|_|!|¡|¿|\\?|#|/|,|'|"|’`,
};	for (var pattern in map) { 
		str=str.replace( new RegExp(map[pattern],'g' ), pattern); }
	return str.toLowerCase();
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
    "html": "text/html",
    "text": "text/plain",
    "js"  : "text/javascript",
    
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
header = ( mimeType ="text/plain" )=>{
	return { 'Access-Control-Allow-Origin':'*', 'Content-Type':mimeType };
}

chunkheader = ( start,end,size,mimeType ="text/plain" )=>{
	const contentLength = end-start+1;
	return {
		"Content-Range":`bytes ${start}-${end}/${size}`,
		'Access-Control-Allow-Origin':'*',
		"Content-Length":contentLength,
		"Content-Type": mimeType,
		"Accept-Ranges":"bytes",
	};
}

//TODO: Server Started ###################################################### //
http.createServer( (req, res)=>{ 
	
	var q = url.parse(req.url, true);
	var d = q.query;
	
	//TODO: Server Conditions ############################################### //
	if( q.pathname=="/" ){
		fs.readFile(`${path}/index.html`, (err,data)=>{
			if (err) {
				res.writeHead(404, header('text/html'));
				return res.end("404 Not Found"); }
			res.writeHead(200,header('text/html'));
			res.write(data); res.end();
		});
	}
	
	//TODO: Server Chunk   XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX //
	else{
		const keys = Object.keys(mimeType);
		for( var i in keys ){
			if( q.pathname.endsWith(keys[i]) ){
				
				const range = req.headers.range;
				this.url = (`${path}${q.pathname}`).replace(/%20/g,' ');
			
				if(range){
					const chuck_size = Math.pow( 10,6 ); 
					const size = fs.statSync( this.url ).size;
					const start = Number(range.replace(/\D/g,""));
					const end = Math.min(chuck_size+start,size-1);

					res.writeHead(206, chunkheader( start,end,size,mimeType[keys[i]] ));
					const chuck = fs.createReadStream(this.url, {start,end});
					chuck.pipe(res);
					
				} else {
					fs.readFile( this.url, (err,data)=>{
						if (err) {
							res.writeHead(404, header('text/html'));
							return res.end("404 File Not Exist"); 
						}
						res.writeHead(200, header( mimeType[keys[i]] ));
						res.end( data );
					});
				}	return 0;		
			}
		}	
		
		res.writeHead(404, header('text/html'));
		res.end("404 File Not Found");
	}	
	
}).listen(port); console.log(`server started at localhost:${port}`);

/*
let file = axios.get('https://store.externulls.com/webmasters/data.txt?days_back=100&delimiter=%27|%27&secondary_delimiter=%27,%27&thumbs_number=7&fields=title,url,duration,people,tags&trim_tags=true&thumb_params=size=320x240')
.then( response=>{
	console.log( response );
})
.catch( err=>{ console.log(e) } );

const readInterface = readline.createInterface({
    input: fs.createReadStream('embed.csv'),
//	output: process.stdout,
    console: false
});

readInterface.on('line', function(line) {
    console.log( line.split('|') );
});
*/
