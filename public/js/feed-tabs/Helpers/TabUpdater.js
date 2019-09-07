var tabs = {};

class TabUpdater {
	
	
			
	
	static
	fetchUserFeeds(url, user_id, fullName) {
		
		var onClickCallback = function() {
			TabUpdater.fetchUserFeeds(this.getAttribute('data-href'), user_id, fullName);
		}	
		
		
		$.ajax({
			  method: "GET",
			  url: url + "&id=" + user_id,
			  success: function( msg ) {
				
						
						if ( msg === "error" ){
							console.log(msg);
							Error.add("Akcija [Preuzimanje objava korisnika " + fullName + "] nije izvršena.");
							return;
						}
						
						
						
						var parsed = jQuery.parseJSON(msg);
						console.log(parsed);
						var feeds = parsed.feeds;
						
						
						
						if ( !feeds ){
							
				
							var url_string = new URL("http:/" + url);
							var c = url_string.searchParams.get("page");
							c = parseInt(c);
							if ( c === 1 )
								Notification.addNotif(fullName, "Korisnik " + fullName + " nema objave.");
							else
								Error.add("Akcija [Preuzimanje objava korisnika " + fullName+ ", strana "+ c +"] nije izvršena.");
							
							return;
							
						}
						
						if ( feeds.length != 0 ) {
							
							
							var onDeleteTab = function() {
								
								delete tabs[user_id];
								
							}
							
							var tab = null;
							if (tabs[user_id]){
								tab = tabs[user_id]
								tab.emptyBody();
							} else {
								tab = new Tab(true, feeds[0].user_id, fullName,onDeleteTab);
								tabs[user_id] = tab;
							}
							
							
							var pagination = parsed.pagination;
							
						
							for ( var i = 0; i < feeds.length; ++i) {
								
								var feed = feeds[i];
								tab.add(feed);
								
							}
									
								
							if ( pagination ){
								
								var before = function(dom) {
									
									console.log(this);
									var parent_id = this.class_name;
									var div = document.getElementById(parent_id);
									div.insertBefore(dom, div.firstChild);
									
								}.bind(tab);
								
								var after = function(dom) {
									
									
									console.log(this);
									var parent_id = this.class_name;
									var div = document.getElementById(parent_id);
									div.appendChild(dom);
									
								}.bind(tab);

								tab.addPagination(pagination, before, after, onClickCallback);
							
							
							}
							
							tab.show();
							
						} else {
							
							Notification.addNotif(fullName, "Korisnik " + fullName + " nema objave.");
							return;
						}
						
						
						
						
							
							
					
					
				},error: function( msg ) {
				
						
						console.log(msg);
						Error.add("Akcija [Preuzimanje objava korisnika " + fullName+ "] nije izvr�ena.");
					
					
				}
					
			});
		
	}
	
	static
	fetchTab(feed_id) {
		
		
		$.ajax({
			  method: "GET",
			  url: "/FeedProvider/show-feed-with-id?id=" + feed_id,
			  success: function( msg ) {
				
				
						if ( msg === "error" ){
							
							console.log(msg);
							Error.add("Akcija [Preuzimanje objave sa indentifikatorom " + feed_id + "] nije izvršena.");
							return;
							
						}
						
						
						var parsed = jQuery.parseJSON(msg);
						
						var feed = parsed;
						
						if ( !feed ){
							
							
							Notification.addNotif("Objava sa indentifikatorom " + feed_id + " ne postoji.");
							return;
							
						}
						
						
						feed['newTab'] = true;
						
						
						
						new Tab(false, feed.feed_id, feed.title).add(feed).show();
						//Tab.add(feed);
						
						
							
							
					
					
				},error: function( msg ) {
				
						
						console.log(msg);
						Error.add("Akcija [Preuzimanje objave sa indentifikatorom " + feed_id + "] nije izvršena.");
					
					
				}
					
			});
			
		
		
		
	}
	
};