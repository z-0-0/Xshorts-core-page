//TODO: LoadVideos XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
loadVideos = async()=>{
	fetch('/store.externulls.com/tag/facts/tags?slug=index')
	.then( async(response)=>{
		var data = await response.json();
		var page = '';
		data.forEach( item=>{
			page+=` <a href="/?filter=${item['tg_slug']}" class="uk-button uk-button-default"> ${item['tg_name']} </a> `;
		});
		$('#videos').innerHTML = page;
	}).catch(e=>console.log(e));
}

//TODO: Main Fuction   XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
events = ()=>{	
	$$('#txt_search').forEach( item=>{
		item.onchange = ()=>{ window.location=`/?filter=${item.value}`; }
	});
}
 
window.onload=()=>{ loadVideos(); events(); }
