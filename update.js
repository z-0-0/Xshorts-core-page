//TODO: Libreries ########################################################### //

const readline = require('readline');
const axios = require('axios');
const http = require('http');
const url = require('url');
const fs = require('fs');

//TODO: String Normalization ################################################ //
//https://store.externulls.com/webmasters/data.txt?days_back=10000&delimiter=%27|%27&secondary_delimiter=%27,%27&thumbs_number=7&fields=id,thumbs,title,duration,tags,people&thumb_params=size=320x240
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
	
			let fact = await axios.get(`https://store.externulls.com/facts/file/${video.id}`,{ responseType: 'json' });
	
			if( fact.data['fc_facts'][0]['hls_resources'] === undefined ){
				video.dislike = fact.data['fc_facts'][0]['fc_dislikes']
				video.created = fact.data['fc_facts'][0]['fc_created']
				video.views = fact.data['fc_facts'][0]['fc_st_views']
				video.likes = fact.data['fc_facts'][0]['fc_likes']
				video.hls = fact.data['file']['hls_resources']
			} else {
				video.dislike = fact.data['fc_facts'][0]['fc_dislikes']
				video.created = fact.data['fc_facts'][0]['fc_created']
				video.views = fact.data['fc_facts'][0]['fc_st_views']
				video.hls = fact.data['fc_facts'][0]['hls_resources']
				video.likes = fact.data['fc_facts'][0]['fc_likes']
			}
	
			fs.promises.appendFile( './newdata',`${JSON.stringify(video)}\n` );
			console.log('done');
		} catch(e) {}
	});

}).catch( err=>console.log(err) )

*/

let file_list = new Array();

const file = readline.createInterface({
	input: fs.createReadStream('./data.txt'),
//	output: process.stdout,
	terminal: false
});
	
file.on('line', line => {
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
	
		file_list.push(JSON.stringify(video));
		console.log('done');
	} catch(e) {}
});

file.on('close', ()=>{
	file_list = file_list.sort( (a,b)=>{
		return Math.random()>0.8;
	}); fs.writeFileSync('./newdata',file_list.join('\n'));
});	
