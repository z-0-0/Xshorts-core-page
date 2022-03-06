$$= (...args) =>{ return document.querySelectorAll(args); }
$ = (...args) =>{ return document.querySelector(args); }

// lazyImage Fuction XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX   //
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
	$$('img').forEach( (image)=>{ observer.observe(image) });
}

// Main Fuction XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
window.onload = () =>{ }

