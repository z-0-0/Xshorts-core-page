//TODO: Libreries ########################################################### //

const readline = require('readline');
const axios = require('axios');
const http = require('http');
const url = require('url');
const fs = require('fs');

var file_list = new Array();

getHot = async()=>{
	//https://store.externulls.com/facts/tag?slug=index&limit=100000000&offset=0
	//https://store.externulls.com/facts/tag?id=27173&limit=100000000&offset=0
	let response = await axios.get( 'https://store.externulls.com/facts/tag?slug=index&limit=100000&offset=0',{ responseType: 'json' } )
	
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
			video.category.push( x['id'].toString() );
			video.category.push( x['tg_slug'] );
			video.category.push( 'hot' );
		});	file_list.push(JSON.stringify(video));
		
		console.log( `done: ${i}/${response.data.length}` );
	}//	file_list = file_list.sort(() => Math.random()-0.5)
	
};

getDB = async()=>{ getHot();

	let response = await axios.get( 'https://store.externulls.com/webmasters/data.txt?days_back=100000&delimiter=%27|%27&secondary_delimiter=%27,%27&thumbs_number=1&fields=duration,date,id,title,thumbs,brand,people,tags&thumb_params=ratio=16x9',{ responseType: 'stream' } )
	
	var lineReader = readline.createInterface({
		input: response.data,
		debug: 'false'
	});

	var prev_name = ''; let i=0;
	lineReader.on('line', (line)=>{ i++;
		let data = line.replace(/'/g,'').split('|');
		let video = new Object();
	
		try{		
			video.name = data[3];
			video.duration = data[0];
			video.creation = data[1];
			video.id = data[2].slice(1);
			video.image = data[4].replace('https:/','');
			video.category = (`${data[5]},${data[6]},${data[7]}`).split(',');
		
			if( video.name != prev_name )
				file_list.push(JSON.stringify(video));
		
			prev_name = video.name;
		//	lineReader.close();
	
		} catch(e) { console.log(e,line); }
	
	});
	
	lineReader.on('close',()=>{
	//	file_list = file_list.sort(() => Math.random()-0.5)
		fs.writeFileSync('./data',file_list.join('\n'));
	});

};	getDB();


