export default class AJAXFeedUpdater {



	static 
	fetchFeeds(tabBuilder, FeedTabSoloView) {
	
		console.log("fetchFeeds");
		$.ajax({
			  method: "GET",
			  url: "/FeedProvider/fetch-feeds"
			  ,success: function( msg ) {
				
						//console.log("success: ");
						
						var feeds = jQuery.parseJSON(msg);
						debug.innerHTML = jQuery.parseJSON(msg);
						
						for ( var i = 0; i < feeds.length; ++i ) {
		
							var feed = feeds[i];
							tabBuilder.addFeed(feed, FeedTabSoloView);
							
						}
				
					
					
				},error: function( msg ) {
				
						//console.log(msg);
						debug.innerHTML = msg.responseText;
					
					
				}
					
			});
					
					
		//var feeds = {{ feeds|json_encode()|raw }};
		// var feeds = [];
		// for ( var i = 0; i < feeds.length; ++i ) {
		
			// var feed = feeds[i];
			// tabBuilder.addFeed(feed);
			
		// }
		
	}
	
	
			
	static
	updateLikeCounter(feed, feedDecorator, checkLikeButtonFN, toggleLikeButtonFN) {

		console.log("updateLikeCounter");
		$.ajax({
					  method: "POST",
					  url: "/FeedProvider/refresh-feed-like",
					  data: {
						id: feed.feed_id,
						delta: checkLikeButtonFN()
						
					  }
					  ,success: function( msg ) {
						
								//console.log("success: ");
								//console.log(msg);
								debug.innerHTML = msg;
								
								if ( msg == "success" ) {
								
									feedDecorator.addLikeDelta(toggleLikeButtonFN());
									
									//var feedBuilder = feedDecorator;
									//AJAXFeedUpdater.refreshFeedLike(feed, feedBuilder);
									
								}
								
								
								
							
							
						},error: function( msg ) {
						
								//console.log(msg);
								debug.innerHTML = msg.responseText;
							
							
						}
							
					});
			

	}

	static
	refreshFeedLike(feed, feedBuilder) {
	
		var id = setInterval(function() {
		
					
			
					$.ajax({
					  method: "POST",
					  url: "/FeedProvider/refresh-feed",
					  data: {
						id: feed.feed_id
					  }
					  ,success: function( msg ) {
						
								console.log(msg);
								debug.innerHTML = msg;
							
							
								if ( msg != "error-maybe-good" ) {
								
									var likes = parseInt(msg);
									
									feedBuilder.setLikeCounter(likes);
									
								}
								
								
							
							
						},error: function( msg ) {
						
								//console.log(msg);
								debug.innerHTML = msg.responseText;
							
							
						}
							
					});
			
		
		}, 5500);
		
		return id;
	
	}

	static
	bind(feed, feedBuilder) {
	
		return AJAXFeedUpdater.refreshFeedLike(feed, feedBuilder);
	
	
	}

}

