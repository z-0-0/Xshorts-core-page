$$= function(...args){ return document.querySelectorAll(args); }
$ = function(...args){ return document.querySelector(args); }

//TODO: CONSTANTS  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//

const query = new URLSearchParams(window.location.search);

//TODO: lazyImage Fuction  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
function badge(list){
	let page = new String();
	list.forEach( function(item){
		page+=`<a class="uk-red-badge" href="/?search_text=${item}">${item}</a>`;
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

//TODO: LoadVideos XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
async function loadVideos(){
	if( $('spinner').hidden ){
		$('spinner').hidden = false;
		
		var off = $$('video').length;
		var search = ''
		
		if( query.get('search_text') != null )
			search = query.get('search_text');
		
		fetch(`videos?id=27173&offset=${off}&search_text=${search}`)
		.then( async( response )=>{
			$('#videos').innerHTML += await response.text();
			$('spinner').hidden=true; lazyImage(); viedeoEvents();
		});			
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

function events(){
		
	$$('#txt_search').forEach( function(item){
		var url = new URL(window.location);
		
		item.addEventListener('change', function(){ 	
			url.pathname = '/';	
			url.searchParams.delete('search_text');
			url.searchParams.append('search_text',item.value);
			window.location.href = url;
		});
	});
	
	$('#loadMore').addEventListener('click', function(){ window.onloadmore(); });
}
 
// main Fuction XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX// 
window.onloadmore = function(){ loadVideos(); }

