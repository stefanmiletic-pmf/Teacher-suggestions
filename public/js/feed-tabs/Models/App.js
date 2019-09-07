class App {
	
    static 
	addPaginationHeaderCallback(dom) {
		
		var div = document.getElementsByClassName('post-to-send')[0];
		div.parentNode.insertBefore(dom, div.nextSibling);
					

    }
	
    static 
	addPaginationFooterCallback(dom) {
		
		
		
		var div = document.getElementById('tab-publish');
		div.appendChild(dom);

    }
	
	
	
	// static 
	// addUsersPagePaginationHeaderCallback(dom, parent_id) {
		
		// var div = document.getElementById(parent_id);
		// div.insertBefore(dom, div.firstChild);
					

    // }
	
    // static 
	// addUsersPagePaginationFooterCallback(dom, parent_id) {
		
		
		// var div = document.getElementById(parent_id);
		// div.appendChild(dom);
		

    // }
	
	
	
}