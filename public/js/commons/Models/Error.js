class Error {
	
    static 
	add(error) {
		
		var notification_div = document.getElementById('notification-div');
		
		var addCallback = function(dom) {
			
			notification_div.appendChild(dom);
			
		}
		
		
		
		Toast.makeToast(-1, "Sistemska greška", error.toString(), addCallback, function(){});
		
		
    }

	
}