$$= function(...args){ return document.querySelectorAll(args); }
$ = function(...args){ return document.querySelector(args); }

//https://store.externulls.com/tag/facts/tags?get_original=true&slug=index

//TODO: CONSTANTS  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//

const db = new Object(); db.page = 1;
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

async function suggest( text ){ 
	var request = await fetch(`/suggest?q=${text}`).then(async(response)=>{});
	$('#suggestions').innerHTML = request.text();
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
	fetch(`related_shorts?id=${id}&page=${db.subPage}`)
	.then( async(response)=>{
		$('#video-list').children[0].innerHTML = await response.text();
		$$('#short').forEach( (x,i)=>{ db.page++;
			x.addEventListener('itemhidden',function(el){ el.target.children[0].src = ''; });
			x.addEventListener('itemshown',function(el){
				el.target.children[0].src = el.target.children[0].dataset.src;
			});
		});
	});
}

function show( url,q,id ){
	db.subPage=1; addShorts( id ); UIkit.modal( $('modal') ).show();
	$('modal').querySelector('close').addEventListener('click',function(){
		$('#video-list').children[0].innerHTML = new String();
	});
}

function events(){
		
	$$('#txt_search').forEach( function(item){
		var url = new URL(window.location);
		
		item.addEventListener('keydown', async function(){ suggest( item.value ); });
		
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
		$('spinner').hidden = false;
		
		var search = window.location.search.replace('?','');
		
		fetch(`/short?${search}&page=${db.page}`)
		.then( async( response )=>{	db.page++;
			$('#videos').innerHTML += await response.text();
			$('spinner').hidden=true; lazyImage(); viedeoEvents();
		});			
				
	}	
}

window.addEventListener('load', function(){
	loadVideos(); events();
});

