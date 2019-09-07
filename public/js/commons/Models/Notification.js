


class Notification {
	
    static 
	addedFeed(user_id, feedId, title, body) {
		


		$("#refresh_feeds").css("display", "block");
		
		var notification_div = document.getElementById('notification-div');
		
		var addCallback = function(dom) {
			
			notification_div.appendChild(dom);
			
		}
		
		
		
	
		
		
		Toast.makeToast(feedId, title, body, addCallback);
		
		
    }
	
	static
	addNotif(title, body) {
		
		
		var notification_div = document.getElementById('notification-div');
		
		var addCallback = function(dom) {
			
			
			notification_div.appendChild(dom);
			
		}
		
	
		Toast.makeToast(-2, title, body, addCallback);
		
		
	}

	
}