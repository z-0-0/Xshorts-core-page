$$= (...args) =>{ return document.querySelectorAll(args); }
$ = (...args) =>{ return document.querySelector(args); }

//TODO: CONSTANTS  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//

const min = 20;
const origin = window.origin;
const db = new Object();
	  db.placeholder = "./img/18yPorn.png";
const query = new URLSearchParams(window.location.search);

//TODO: lazyImage Fuction  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
badge = (list)=>{
	let page = new String();
	list.forEach( item=>{
		page+=`<a class="uk-badge" href="/?filter=${item}">${item}</a>`;
	});	return page;
}

//TODO: lazyImage Fuction  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
lazyImage = ()=>{
	const config = { rootMargin: '250px 0px' };
	var observer = new IntersectionObserver( (entries, observer)=>{
		entries.forEach( entry=>{
			image = entry.target;
			if( entry.isIntersecting ){
				image.src = image.dataset.src;
				observer.unobserve( image );
			}
		});
	} , config);
	$$('#videoData > img').forEach( (image)=>{ observer.observe(image) });
}


//TODO: chunck Fuction XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
getChunkList = async(start,end,filter=query.get('filter'),search=query.get('search'))=>{ 
	var request = await fetch(`${origin}/request?filter=${filter}&search=${search}&start=${start}&end=${start+end}`);
	return request.json();
}

//TODO: LoadVideos XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
// <div class="uk-position-center uk-light" uk-spinner="ratio:3" hidden></div>
loadVideos = async()=>{
	if( $('spinner').hidden ){
		$('spinner').hidden = false;
		var list = await getChunkList( $$("#video").length,min );
		for( var i in list ){ try{
			let video = JSON.parse( list[i] );
			$('#videos').innerHTML += ` 
				<a href="./play?id=${video.id}" class="uk-padding-small uk-child-width-expand" id="video">
					<div class="uk-inline uk-flex uk-child-width-expand" id="videoData">
						<img class="uk-inline" src="${db.placeholder}" data-src="${video.image}" alt="${video.name}" id="image"></img>
						<div class="uk-padding-small uk-padding-remove-vertical uk-overlay-primary uk-position-bottom ">
							${video.name.slice(0,30)}...
						</div>
					</div>
					<video data-id="${video.id}" preload="auto" playsinline hidden muted loop autoplay></video>
				</a>
			`;	
		} catch(e) {}
		}	$('spinner').hidden=true; lazyImage(); viedeoEvents();
	}	
}

//TODO: Main Fuction   XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
viedeoEvents = ()=>{
	
	$$('#video').forEach( item=>{
		var child = item.children;		
		item.onmouseenter = ()=>{
		//	child[0].children[2].hidden = false;
			child[1].src=`/vp.externulls.com/new/480p/${child[1].dataset.id}.mp4`;
			child[1].oncanplay = ()=>{
				child[0].hidden = true; child[1].hidden = false;
			}
		}
		
		item.onmouseleave = ()=>{
			child[1].src=``;
		//	child[0].children[2].hidden = true;
			child[0].hidden = false; child[1].hidden = true;
		}
		
	});

}

events = ()=>{
	
	$('#loadMore').onclick = ()=>{ window.onloadmore(); }
	
	$$('#txt_search').forEach( item=>{
		item.onchange = ()=>{ window.location=`/?filter=${item.value}`; }
	});
}
 
// main Fuction XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX// 
window.onloadmore=()=>{ loadVideos(); }


