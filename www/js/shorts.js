$$= function(...args){ return document.querySelectorAll(args); }
$ = function(...args){ return document.querySelector(args); }

//TODO: CONSTANTS  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//

const min = 30;
const db = new Object(); db.page=1;
	  db.placeholder = "./img/placeholder.png";
const query = new URLSearchParams(window.location.search);

//TODO: lazyImage Fuction  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
function badge(list){
	let page = new String();
	list.forEach( function(item){
		page+=`<a class="uk-red-badge" href="/?filter=${item}">${item}</a>`;
	});	return page;
}

//TODO: lazyImage Fuction  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
function lazyImage(){
	const config = { rootMargin: '250px 0px' };
	var observer = new IntersectionObserver( function(entries, observer){
		entries.forEach( function(entry){
			image = entry.target;
			if( entry.isIntersecting ){
				image.src = image.dataset.src;
				observer.unobserve( image );
			}
		});
	} , config);
	$$('#video > img').forEach( function(image){ observer.observe(image) });
}


//TODO: chunck Fuction XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
async function getChunkList(){ 
	//search_text=${}&order=trending&	
	var url = "https://api.redgifs.com/v2/gifs"
	var search = window.location.search.replace('?','');
	var request = await fetch(`${url}/search?${search}&page=${db.page}`);
	var data = await request.json(); db.page++; return data.gifs;
}

async function getRelatedList( id ){
	var url = "https://api.redgifs.com/v2/gifs";
	var request = await fetch(`${url}/${id}/related?page${db.subPage}`);
	var data = await request.json(); db.page++; return data.gifs;
}

async function getUsersList(){
	var url = "https://api.redgifs.com/v1/creators";
	var request = await fetch(`${url}/search?order=trending&verified=y&page=${db.page}`);
	var data = await request.json(); db.page++; return data.items;
}

async function getUserList( id ){
	var url = "https://api.redgifs.com/v2/users";
	var request = await fetch(`${url}/${id}/search?order=recent&page=${db.subPage}`);
	var data = await request.json(); db.page++; return data.gifs;
}

async function suggest( text ){ 
	var url = "https://api.redgifs.com/v1/tags";
	var request = await fetch(`${url}/suggest?query=${text}`);
	var data = await request.json(); return data;
}

//TODO: LoadVideos XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
async function loadVideos(){
	if( $('spinner').hidden ){
		
		var page = new String();
		$('spinner').hidden = false;
		var list = await getChunkList();
		
		for( var i in list ){ try{
			var q = ( list[i].height<list[i].width ) ? 'uk-nocover' : 'uk-cover' ;
			page += ` 
				<a onclick="show('${list[i].urls.sd}','${q}','${list[i].id}')" class="uk-inline uk-padding-small uk-child-width-expand uk-height-large" id="video">
					<img src="${db.placeholder}" data-src="${list[i].urls.thumbnail}" alt="${list[i].id}" id="image"></img>
					<video data-src="${list[i].urls.vthumbnail}" preload="auto" playsinline hidden muted loop autoplay></video>
				</a>
			`;	
		} catch(e) { console.error(e) } }	
		
		$('#videos').innerHTML += page;
		$('spinner').hidden=true; lazyImage(); viedeoEvents();
	}	
}

//TODO: Main Fuction   XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
function viedeoEvents(){
	
	$$('#video').forEach( function(item){
		var child = item.children;		
		
		item.addEventListener('mouseenter', function(){
			child[1].src=child[1].dataset.src;
			child[1].addEventListener('canplay',function(){
				child[0].hidden = true; child[1].hidden = false;
			});
		});
		
		item.addEventListener('mouseleave', function(){
			child[0].hidden = false; child[1].hidden = true;
			child[1].src=``;
		});
		
	});

}

async function addShorts(id){
	db.data = await getRelatedList(id); var page = new String();
	db.data.forEach( x=>{ var q = ( x.height<x.width ) ? 'uk-nocover' : 'uk-cover' ;
		page += `<li id="short" class="uk-flex uk-flex-center"> 
			<video data-src="${x.urls.sd}" poster="${x.urls.thumbnail}" class="${q} uk-width-auto@s uk-width-1-1" autoplay loop preload="auto"></video>
		</li>`;
	}); $('#video-list').children[0].innerHTML += page;
	$$('#short').forEach( (x,i)=>{
		x.addEventListener('itemhidden',function(el){ el.target.children[0].src = ''; });
		x.addEventListener('itemshown',function(el){
			el.target.children[0].src = el.target.children[0].dataset.src;
		//	if( i==$$('#short').length-1 ) addShorts();
		});
	});
}

function show( url,q,id ){
	$('#video-list').children[0].innerHTML = `<li id="short" class="uk-flex uk-flex-center"> <video data-src="${url}" class="${q} uk-width-auto@s uk-width-1-1" autoplay loop preload="auto"></video> </li>`;
	db.subPage=1; addShorts( id ); UIkit.modal( $('modal') ).show();
	$('modal').querySelector('close').addEventListener('click',function(){
		$('#video-list').children[0].innerHTML = new String();
	});
}

function events(){
		
	$$('#txt_search').forEach( function(item){
		var url = new URL(window.location);
		
		item.addEventListener('keydown', async function(){ 
			var data = await suggest( item.value );
			var page = new String();
			data.forEach( x=>{
				page+=`<option value="${x.text}">`
			}); $('#suggestions').innerHTML = page;
		});
		
		item.addEventListener('change', function(){ 	
			if( item.value.startsWith('@') ) {
				db.subPage=1; addShorts( item.value.replace('@','') ); UIkit.modal( $('modal') ).show();
				$('modal').querySelector('close').addEventListener('click',function(){
					$('#video-list').children[0].innerHTML = new String();
				});
			} else {
				url.pathname = '/shorts';	
				url.searchParams.delete('search_text');
				url.searchParams.append('search_text',item.value);
				window.location.href = url;
			}
		});
	});
	
	$('#loadMore').addEventListener('click', function(){ window.onloadmore(); });
}
 
// main Fuction XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX// 
window.onloadmore = function(){ loadVideos(); }

async function loadVideos(){
	if( $('spinner').hidden ){
		
		var page = new String();
		$('spinner').hidden = false;
		var list = await getChunkList();
		
		for( var i in list ){ try{
			var q = ( list[i].height<list[i].width ) ? 'uk-nocover' : 'uk-cover' ;
			page += ` 
				<a onclick="show('${list[i].urls.sd}','${q}','${list[i].userName}')" class="uk-inline uk-padding-small uk-child-width-expand uk-height-large" id="video">
					<img src="${db.placeholder}" data-src="${list[i].urls.thumbnail}" alt="${list[i].id}" id="image"></img>
					<video data-src="${list[i].urls.vthumbnail}" preload="auto" playsinline hidden muted loop autoplay></video>
				</a>
			`;	
		} catch(e) { console.error(e) } }	
		
		$('#videos').innerHTML += page;
		$('spinner').hidden=true; lazyImage(); viedeoEvents();
	}	
}

window.addEventListener('load', function(){
	getRelatedList = getUserList;
//	getChunkList = getUsersList;
	loadVideos(); events();
});

