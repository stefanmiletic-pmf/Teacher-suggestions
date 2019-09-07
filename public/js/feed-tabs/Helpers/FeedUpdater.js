var publish_pagination = null;

class FeedUpdater {

	static 
	fetchFeedsPage(url, addFeedCallback, addPaginationHeaderCallback, addPaginationFooterCallback, onClickCallback) {
	
		console.log(url);
	
		$.ajax({
			  method: "GET",
			  url: url,
			  success: function( msg ) {
				
						
						//console.log(msg);
						if ( msg.indexOf('DOCTYPE') !== -1 ){
							var win = window.open('/', '_parent');
							win.document.write(msg);
							return;
						}
						
						if ( msg === 'error' ) {
							
							
							//console.log(msg);
							Error.add("Akcija [Preuzimanje novosti] nije izvršena.");
							return;
						}
						
						
						
						var parsed = jQuery.parseJSON(msg);
						var feeds = parsed.feeds;
						
						
						
						if ( !feeds ){
							
							
							
							Notification.addNotif("Ne postoje još uvek objave ");
							return;
							
						}
						
						var pagination = parsed.pagination;
						
						Publish.reset();
						Pagination.resetPublishTab();
						
						
						if ( feeds.length != 0 ){
								for ( var i = 0; i < feeds.length; ++i ) {
		
									var feed = feeds[i];
									addFeedCallback(feed);
									
									
								}
							
							if ( pagination ){
								
								var before = function(dom) {
									
									var div = document.getElementsByClassName('post-to-send')[0];
									div.parentNode.insertBefore(dom, div.nextSibling);
									
								};
								
								var after = function(dom) {
									
									
									var div = document.getElementById('tab-publish');
									div.appendChild(dom);
									
								};

								new Pagination(pagination, before, onClickCallback, true).show();
								new Pagination(pagination, after, onClickCallback, true).show();
							
							
							}
							
						} else {
							
							
							Notification.addNotif("Ne postoje još uvek objave ");
							
						}
					
				
					
					
				},error: function( msg ) {
				
						console.log(msg.responseText);
						Error.add("Akcija [Preuzimanje novosti] nije izvršena.");
					
					
				}
					
			});
					
				
	}
	
	
			
	static
	updateLikeCounter(feed, feedDecorator, checkLikeButtonFN, toggleLikeButtonFN) {

		$.ajax({
					  method: "POST",
					  url: "/FeedProvider/add-delta-like",
					  data: {
						id: feed.feed_id,
						delta: checkLikeButtonFN()
						
					  }
					  ,success: function( msg ) {
						  
						  
								if ( msg.indexOf('DOCTYPE') !== -1 ){
									var win = window.open('/', '_parent');
									win.document.write(msg);
									return;
								}
						
						
								
								if ( msg == "success" ) {
								
									feedDecorator.addLikeDelta(toggleLikeButtonFN());
									
								} else {
									
									console.log(msg);
									Error.add("Akcija [Slažem se] nije izvršena.");
									
								}
								
								
								
							
							
						},error: function( msg ) {
						
								console.log(msg.responseText);
								Error.add("Akcija [Slažem se] nije izvršena.");
							
							
						}
							
					});
			

	}



}

