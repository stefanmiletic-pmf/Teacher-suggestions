class App {
	
	static 
	getFilters() {
		
		
		
	}
	
    static 
	addPaginationHeaderCallback(dom) {
		
		//$('#users-panel .table-wrapper').insertBefore(dom);
		
		//var div = document.getElementById('user-table');
		var div = document.getElementsByClassName('table-title')[0];
		div.parentNode.insertBefore(dom, div.nextSibling);
					

    }
	
    static 
	addPaginationFooterCallback(dom) {
		
		
		//$('#users-panel .table-wrapper').insertAfter(dom);
		
		//$('#users-panel .table-wrapper').insertBefore(dom);
		var after_tabs = document.getElementById('users-panel');
		after_tabs.appendChild(dom);

    }
	
	
	
}