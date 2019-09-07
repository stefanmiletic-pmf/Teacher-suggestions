class User {
	
	
	
	static
	add(id) {
        console.log("add id: " + id );
		
    }
	static
    remove(id) {
        console.log("remove id: " + id + "   ;  name: " + name);
    }
	
	static
	getSessionId() {
		
			var cookies = document.cookie.toString();
			var start = document.cookie.indexOf("PHPSESSID=") ;
			if ( start === -1 )
				return false;
			
			start += "PHPSESSID=".length
			
			var new_document_cookie =  document.cookie.substring(start);
			
			start = 0;
			var end = new_document_cookie.indexOf(";");
			
			if ( end === -1 )
				end = cookies.length;
			
			
			return new_document_cookie.substring(start, end)
		
	}
	
}