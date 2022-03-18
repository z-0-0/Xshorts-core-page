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
	var offset = $$('video').length;
	var url = "https://store.externulls.com/facts";
	var search = 'id=27173';//window.location.search.replace('?','');
	var request = await fetch(`${url}/tag?${search}&limit=40&offset=${offset}`);
	var data = await request.json()
	
	data = data.map( x=>{
	
		var id =  x.fc_file_id;
		var tmb = x.fc_facts[0].fc_thumbs[0];
	
		return {
			id: id,
			name: x.file.stuff.sf_name,
			story: x.file.stuff.sf_story,
			views: x.fc_facts[0].fc_views,
			likes: x.fc_facts[0].fc_likes,
			dislikes: x.fc_facts[0].fc_dislikes,
			vid: `/vp.externulls.com/new/480p/${id}.mp4`,
			img: `/thumbs-015.externulls.com/videos/${id}/${tmb}.jpg/to.webp?size=320x180`,
		}
	});	
	
	return data;
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
			page += ` 
				<a href="./play?id=${list[i].id}" class="uk-inline uk-padding-small uk-child-width-expand uk-height-medium" id="video">
					<img src="${db.placeholder}" data-src="${list[i].img}" alt="${list[i].id}" id="image"></img>
					<video data-src="${list[i].vid}" preload="auto" playsinline hidden muted loop autoplay></video>
					<div class="uk-position-cover">
						<spam class="uk-red-badge-actived uk-position-bottom uk-position-medium">${list[i].name.slice(0,30)}<spam>
					</div>
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
				url.pathname = '/';	
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

