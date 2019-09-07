class NotificationController {
	
	static
	actionNewFeed(params) {
		
		
		
		Notification.addedFeed(params['userId'], params['feedId'], params['title'], params['body']);
	}
	
};