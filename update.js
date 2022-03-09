//TODO: Libreries ########################################################### //

const readline = require('readline');
const axios = require('axios');
const http = require('http');
const url = require('url');
const fs = require('fs');

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

/*
//https://store.externulls.com/facts/tag?slug=index&limit=100000000&offset=0
//https://store.externulls.com/facts/tag?id=27173&limit=100000000&offset=0
axios.get( 'https://store.externulls.com/facts/tag?slug=index&limit=100&offset=0',{ responseType: 'json' } )
.then( async(response)=>{
		
	let file_list = new Array();
	
	for( var i in response.data ){
		let data = response.data[i];
		let video = new Object();
		
		video.category = new Array();
		video.id = data['fc_file_id'];
		video.duration = data['file']['fl_duration'];
		video.name = data['file']['stuff']['sf_name'];
		video.creation = data['fc_facts'][0]['fc_created'];
		video.thumbs = data['fc_facts'][0]['fc_thumbs'][0];
		video.image = `/thumbs-015.externulls.com/videos/${video.id}/${video.thumbs}.jpg/to.webp?size=320x180`
		
		data.tags.map( x=>{
			video.category.push( slugify(x['tg_slug']) );
			video.category.push( x['id'].toString() );
		});	file_list.push(JSON.stringify(video));
		
		console.log( `done: ${i}/${response.data.length}` );
	}
	
//	file_list = file_list.sort(() => Math.random()-0.5)
	fs.writeFileSync('./data',file_list.join('\n'));

}).catch(e=>console.log(e));
*/

axios.get( 'https://store.externulls.com/webmasters/data.txt?days_back=100000&delimiter=%27|%27&secondary_delimiter=%27,%27&thumbs_number=1&fields=duration,date,id,title,thumbs,brand,people,tags&thumb_params=ratio=16x9',{ responseType: 'stream' } )
.then( response=>{
		
	let i=0;
	let file_list = new Array();
	
	var lineaReader = readline.createInterface({
		input: response.data,
		debug: 'false'
	});

	lineaReader.on('line', (line)=>{ i++;
		console.log( line )
		let data = line.replace(/'/g,'').split('|');
		let video = new Object();
		
		try{
			video.name = data[3];
			video.duration = data[0];
			video.creation = data[1];
			video.id = data[2].slice(1);
			video.image = data[4].replace('https:/','');
			video.category = (`${data[5]},${data[6]},${data[7]}`).split(',');
		
			file_list.push(JSON.stringify(video));
		} catch(e) { console.log(e,line); }
		
	});
	
	lineaReader.on('close',()=>{
	//	file_list = file_list.sort(() => Math.random()-0.5)
		fs.writeFileSync('./data',file_list.join('\n'));
	});

}).catch(e=>console.log(e));
