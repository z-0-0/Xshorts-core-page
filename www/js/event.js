$$= function(...args){ return document.querySelectorAll(args); }
$ = function(...args){ return document.querySelector(args); }

//TODO: CONSTANTS  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//

const min = 20;
const origin = window.origin;
const db = new Object();
	  db.placeholder = "./img/18yPorn.png";
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
async function getChunkList(start,end,filter=query.get('filter'),search=query.get('search')){ 
	var request = await fetch(`${origin}/request?filter=${filter}&search=${search}&start=${start}&end=${start+end}`);
	return request.json();
}

//TODO: LoadVideos XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
// <div class="uk-position-center uk-light" uk-spinner="ratio:3" hidden></div>
async function loadVideos(){
	if( $('spinner').hidden ){
	
		var page = new String();
		$('spinner').hidden = false;
		var list = await getChunkList( $$("#video").length,min );
		
		for( var i in list ){ try{
			let video = JSON.parse( list[i] );
			page += ` 
				<a href="./play?id=${video.id}" class="uk-inline uk-padding-small uk-child-width-expand" id="video">
					<img class="uk-height-medium" src="${db.placeholder}" data-src="${video.image}" alt="${video.name}" id="image"></img>
					<video data-id="${video.id}" preload="auto" playsinline hidden muted loop autoplay></video>
					<div class="uk-position-cover">
						<spam class="uk-red-badge-actived uk-position-bottom uk-position-medium">${video.name.slice(0,30)}<spam>
					</div>
				</a>
			`;	
		} catch(e) {} }	
		
		$('#videos').innerHTML += page;
		$('spinner').hidden=true; lazyImage(); viedeoEvents();
	}	
}

//TODO: Main Fuction   XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
function viedeoEvents(){
	
	$$('#video').forEach( function(item){
		var child = item.children;		
		
		item.addEventListener('mouseenter', function(){
		//	child[0].children[2].hidden = false;
			child[1].src=`/vp.externulls.com/new/480p/${child[1].dataset.id}.mp4`;
			child[1].addEventListener('canplay',function(){
				child[0].hidden = true; child[1].hidden = false;
			});
		});
		
		item.addEventListener('mouseleave', function(){
			child[1].src=``;
		//	child[0].children[2].hidden = true;
			child[0].hidden = false; child[1].hidden = true;
		});
		
	});

}

function events(){
	
	$('#loadMore').addEventListener('click', function(){ window.onloadmore(); });
	
	$$('#txt_search').forEach( function(item){
		item.addEventListener('change', function(){ window.location=`/?filter=${item.value}`; });
	});
	
}
 
// main Fuction XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX// 
window.onloadmore = function(){ loadVideos(); }

