//TODO: Libreries ########################################################### //

const readline = require('readline');
const axios = require('axios');
const fs = require('fs');

var file_list = new Array();
let _limit = 50;

getKeywords = async()=>{

	let keywords = '';
	
	var lineReader = readline.createInterface({
		input: fs.createReadStream('./data'),
		debug: 'false'
	});

	let i=0;
	lineReader.on('line', (line)=>{	
		let data = JSON.parse(line);
		if( i<_limit && Math.random()>0.8 ){ i++;
			keywords+=`${data.name}, `;
		}
	});
	
	lineReader.on('close',()=>{ console.log(keywords) });

};	getKeywords();


