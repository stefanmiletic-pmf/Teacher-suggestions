//import User from "./User.js";


class Publish {

	
	
	static
	reset() {
		
		
		
		//$('#tab-publish .feeds-view').remove();
		
		var feeds_view = document.getElementById('tab-publish');
		feeds_view = feeds_view.getElementsByClassName('feeds-view')[0];
		
		while (feeds_view.firstChild) {
			feeds_view.removeChild(feeds_view.firstChild);
		}
		
		
	}
	
    static 
	add(feed, approved) {
		
		var feeds_view = document.getElementById('tab-publish');
		feeds_view = feeds_view.getElementsByClassName('feeds-view')[0];
		
		if ( approved ){
		
		
			var $pagination = $('.pagination');
		
			if ( $pagination[0] ) {
				
				
				
				$('.fast-backward a').first().click();
				
				return;
				//var page = parseInt($pagination.find('li.active a').first().text());
				
				
			} else {
				
				
				if ( feeds_view.children.length === 3 ){
					// callback for who to add new feed
					var addCallback = function(feed) {
						
						Publish.add(feed);
						
					}
					
					var onClickCallback = function() {
					
						FeedUpdater.fetchFeedsPage(this.getAttribute('data-href'), addCallback, App.addPaginationHeaderCallback, App.addPaginationFooterCallback, onClickCallback);

					}
					
					
					// action: fetch feeds
					FeedUpdater.fetchFeedsPage('/FeedProvider/show-feeds-page?page=1', addCallback, App.addPaginationHeaderCallback, App.addPaginationFooterCallback, onClickCallback);
					
					return;

				} else {
					
					var feedDom = FeedWindowBuilder.director(feed, null).build();
					//feeds_view.appendChild(feedDom);
					
					feeds_view.insertBefore(feedDom, feeds_view.firstChild);
					return;
					
				}
				
				
				
				
			}
			
			
				
	
		}

		
		
		
		
		var feedDom = FeedWindowBuilder.director(feed, null).build();
		feeds_view.appendChild(feedDom);
		
	
    }

    static 
	submit() {
        //var messageToSubmit = document.getElementById('message-to-send');
		var postToSubmit = document.getElementsByClassName("post-to-send")[0]
		
		
		var postTitle = postToSubmit.getElementsByClassName("post-title")[0];
		var postTitleValue = postTitle.value;
		var postTextarea = postToSubmit.getElementsByClassName("post-textarea")[0];
		var postTextareaValue = postTextarea.value;
		
		var PHPSESSID = User.getSessionId();
		
		//console.log(postTitle);
		//console.log(postTextarea);
		//console.log(PHPSESSID);
		
		if ( postTitle == "" || postTextarea == "" || PHPSESSID == "")
			return;
		
		
	
		console.log("SENDING");
		WebSocketRequest.sendToServer('message', 'feedSubmit', 
				{	
					message: {
						
						auth: PHPSESSID,
						feed: {
							title: postTitleValue,
							body: postTextareaValue
						}
					}
					
		});
        

        postTitle.value = '';
        postTextarea.value = '';
    }
	
}