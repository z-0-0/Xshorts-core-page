//TODO: Libreries ########################################################### //

const readline = require('readline');
const axios = require('axios');
const http = require('http');
const url = require('url');
const fs = require('fs');

//TODO: String Normalization ################################################ //
//https://store.externulls.com/webmasters/data.txt?days_back=10000&delimiter=%27|%27&secondary_delimiter=%27,%27&thumbs_number=1&fields=id,thumbs,title,duration,tags,people&thumb_params=ratio=16x9
/*
axios.get( 'https://store.externulls.com/webmasters/data.txt?days_back=10000&delimiter=%27|%27&secondary_delimiter=%27,%27&thumbs_number=7&fields=id,thumbs,title,duration,tags,people&thumb_params=size=320x240',{ responseType: 'stream' } )
.then( (response)=>{

	const file = readline.createInterface({
	//	output: process.stdout,
		input: response.data,
		terminal: false
	});
	
	file.on('line', async(line) => {
		try{
			let data = line.replace(/'/g,'').split('|');
	
			let video = {
				id: data[0].slice(1),
				name: data[2],
				image: data[1].replace('https://','').split('?')[0],
				duration: data[3],
				category: data[4],
				people: data[5],
			};	//console.log( video );
		
			fs.promises.appendFile( './newdata',`${JSON.stringify(video)}\n` );
			console.log('done');
		} catch(e) {}
	});

}).catch( err=>console.log(err) )

*/

//https://store.externulls.com/facts/tag?id=27173&limit=100000000&offset=0
axios.get( 'https://store.externulls.com/facts/tag?slug=index&limit=100000000&offset=0',{ responseType: 'json' } )
.then( (response)=>{
		
	let file_list = new Array();
	
	response.data.forEach( data=>{
		let video = new Object();
		
		video.category = new Array();
		video.id = data['fc_file_id'];
		video.duration = data['file']['fl_duration'];
		video.name = data['file']['stuff']['sf_name'];
		video.creation = data['fc_facts'][0]['fc_created'];
		video.thumbs = data['fc_facts'][0]['fc_thumbs'][0];
		video.image = `/thumbs-015.externulls.com/videos/${video.id}/${video.thumbs}.jpg/to.webp?size=320x180`
		
		for( var i in data['tags'] ){
			let tag = data['tags'][i];
			video.category.push( tag['tg_slug'] )			
		}
		
		//console.log( video );
		file_list.push(JSON.stringify(video));		
	});
	
	file_list = file_list.sort( (a,b)=>{
		if( Math.random()>0.7 ) return 1;
		else if( Math.random()<0.3 ) return -1;
		else return 0;
	}); fs.writeFileSync('./data',file_list.join('\n'));

}).catch(e=>console.log(e));
