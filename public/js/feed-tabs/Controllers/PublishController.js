class PublishController  {
	
	static
	actionFeedApproval(params) {
		
		
		if ( params['approved'] ) {
			Publish.add(params['feed'], true);
		} else {
			Error.add(params['data']);
		}
		
	}
	
}