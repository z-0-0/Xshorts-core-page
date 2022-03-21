const readline = require('readline');

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
