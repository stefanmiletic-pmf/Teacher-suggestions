		var feedsHooks = {};
					
							
		var userConfiguration = {
					
						faculty: "{{ user.faculty }}",
						fullName: "{{ user.fullName }}",
						id: "{{ user.id }}",
						name: "{{ user.name }}",
						profile_image_path: "{{ user.profile_image_path }}"
					
			}
					
					//console.log(userConfiguration);
	
		var debug = document.getElementsByClassName("debug")[0];
		
	
		
		class FeedWindowBuilder {
		
			static 
			getFeedDomTemplate() {
			
					var htmlToParse = "<div class='card feed-card'>  <div class='card-header'>                        <div class='d-flex justify-content-between align-items-center'>                            <div class='d-flex justify-content-between align-items-center'>                                <div class='mr-2'>                                    <img class='rounded-circle user-profile-image' width='45' src='' alt=''>                                </div>                                <div class='ml-2 user-about'>                                    <div class='h5 m-0 user-about-hashtag'>@LeeCross</div>                                    <div class='h7 text-muted user-faculty'>Miracles Lee Cross</div>                                </div>                            </div>                            <div>                                <div class='dropdown'>                                    <button class='btn btn-link dropdown-toggle' type='button' id='user-drop1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>                                        <i class='fa fa-ellipsis-h'></i>                                    </button>                                    <div class='dropdown-menu dropdown-menu-right' aria-labelledby='user-drop1'>                                        <div class='h6 dropdown-header'>Opcije</div>                                         <a class='dropdown-item feed-report' href='#'>Reportuj</a>                                    </div>                                </div>                            </div>                        </div>                    </div>                    <div class='card-body'>                        <div class='text-muted h7 mb-2'> <i class='far fa-clock feed-time-created'></i> </div>                        <a class='card-link' href='#'>                            <h5 class='card-title feed-title'>Totam non adipisci hic! Possimus ducimus amet, dolores illo ipsum quos                                cum.</h5>                        </a>                        <p class='card-text feed-body'>                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam sunt fugit reprehenderit consectetur exercitationem odio,                            quam nobis? Officiis, similique, harum voluptate, facilis voluptas pariatur dolorum tempora sapiente                            eius maxime quaerat.                            <a href='https://mega.nz/#!1J01nRIb!lMZ4B_DR2UWi9SRQK5TTzU1PmQpDtbZkMZjAIbv97hU' target='_blank'>https://mega.nz/#!1J01nRIb!lMZ4B_DR2UWi9SRQK5TTzU1PmQpDtbZkMZjAIbv97hU</a>                        </p>                    </div>                    <div class='card-footer'> <div class='like-panel'><span class='liked-counter badge badge-primary text-wrap'>0</span><div class='action-like btn btn-link'><i class='far fa-check-circle like-icon'></i> <span class='like-title'>Slazes se?</span></div>    </div><a href='#' class='card-link action-share'><i class='far fa-share-square'></i> Deli</a>                    </div>                </div>";
					
					
					
	
					var parser = new DOMParser();
					var el = parser.parseFromString(htmlToParse, "text/html");
					
					var feed_card = el.getElementsByClassName("feed-card")[0]
					
					
					return feed_card;
			
			}
		
			constructor(feed) {
			
				
				this.like_class = "far fa-check-circle";
				this.like_text = "Slazes se?";
				
				this.liked_class = "fas fa-check-circle";
				this.liked_text = "Slazem se";
			
				this.feed = feed;
				//console.log(this.feed);
				this.feedDOM = FeedWindowBuilder.getFeedDomTemplate();
				this.feedDOM.className += " fade-in";
				this.feedDOM.setAttribute("data-feed-id", this.feed.feed_id);
				
				this.userHashTag = this.feedDOM.getElementsByClassName("user-about-hashtag")[0];
				
				this.userFaculty = this.feedDOM.getElementsByClassName("user-faculty")[0];
				this.userProfileImage = this.feedDOM.getElementsByClassName("user-profile-image")[0]
				
				
				
				this.likeIcon =  this.feedDOM.getElementsByClassName("like-icon")[0];
				this.likeTitle =  this.feedDOM.getElementsByClassName("like-title")[0];
				
				
				this.feedReport =  this.feedDOM.getElementsByClassName("feed-report")[0];
				
				this.feedTimeCreated =  this.feedDOM.getElementsByClassName("feed-time-created")[0];
				
				
				this.feedTitle =  this.feedDOM.getElementsByClassName("feed-title")[0];
				
				this.feedBody =  this.feedDOM.getElementsByClassName("feed-body")[0];
				
				this.feedFooterLike =  this.feedDOM.getElementsByClassName("action-like")[0];
				this.feedFooterShare =  this.feedDOM.getElementsByClassName("action-share")[0];
				
				
				this.feedFooterLikeCounter =  this.feedDOM.getElementsByClassName("liked-counter")[0];
				
				
				
				
				this.setFeedAttributes();
			
			}
			
			setFeedAttributes() {
			
			
			
				this.userHashTag.innerHTML = "@" + this.feed.name;
				this.userFaculty.innerHTML =  this.feed.faculty;
				this.userProfileImage.src = "\\images\\" + (this.feed.profile_image_path ? this.feed.profile_image_path : "profiledefault.png");
				this.feedReport.href = "javascript:void(0)";
				this.feedTimeCreated.innerHTML = this.feed.createdAt;
				this.feedTitle.innerHTML = this.feed.title;
				this.feedBody.innerHTML = this.feed.text;
				this.feedFooterShare.href = "javascript:void(0)";
				this.feedFooterLikeCounter.innerHTML = this.feed.liked_times;
				
				this.likeIcon =  this.feedDOM.getElementsByClassName("like-icon")[0];
				
				
				//console.log(this.feed);
				if ( this.feed.liked_id ) {
				
				
					this.toggleLikeButton();
					
				}
			
			}
			
			
			checkLikeButton() {
			
				if ( this.likeTitle.innerHTML == this.like_text ) {
					
						return 1;
						
					} else {
					
						return -1;
					}
				
			}
			
			toggleLikeButton() {
					
					
					if ( this.likeTitle.innerHTML.toString().localeCompare(this.like_text) == 0 )  {
					
						this.likeTitle.innerHTML = this.liked_text;
						console.log(this.likeTitle.innerHTML);
						
						this.likeIcon.className = this.likeIcon.className.replace(this.like_class, this.liked_class);
						
						return 1;
						
					} else {
					
						this.likeTitle.innerHTML = this.like_text;
						this.likeIcon.className = this.likeIcon.className.replace(this.liked_class, this.like_class);
						
						return -1;
					}
			
			}
			
			build() {
			
				return this.feedDOM;
			
			}
			
			setLikeCounter(num) {
			
				this.feedFooterLikeCounter.innerHTML = num;
			
			}
			
			addLikeDelta(delta) {
			
				var lc = parseInt(this.feedFooterLikeCounter.innerHTML);
				this.feedFooterLikeCounter.innerHTML = lc + delta;
				
			
			}
			
			returnLikeCounter() { 
			
				if ( this.feedFooterLikeCounter != null ) {
				
					return parseInt(this.feedFooterLikeCounter.innerHTML);
				
				}else 
					return -1;
				
			
			}
			
			setLikeButton() {
			
				if ( this.feedFooterLike) {
				
					this.feedFooterLike.addEventListener("click", function() {
					
						
					
						AJAXFeedUpdater.updateLikeCounter(this.feed, this, 
											this.checkLikeButton.bind(this),
											this.toggleLikeButton.bind(this) );
											
											
					
					}.bind(this));
					
					return true;
				} else 
				return false;
			
			}
			
		}
		
		
		class AJAXFeedUpdater {
		
			static
			updateLikeCounter(feed, feedDecorator, checkLikeButtonFN, toggleLikeButtonFN) {
	
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
											
											var feedBuilder = feedDecorator;
											AJAXFeedUpdater.refreshFeedLike(feed, feedBuilder);
											
										}
										
										
										
									
									
								},error: function( msg ) {
								
										console.log(msg);
										debug.innerHTML = msg.responseText;
									
									
								}
									
							});
					
		
			}
		
			static
			refreshFeedLike(feed, feedBuilder) {
			
					//console.log("bind");
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
								
										console.log(msg);
										debug.innerHTML = msg.responseText;
									
									
								}
									
							});
					
				
				}, 5500);
				
				return id;
			
			}
		
			static
			bind(feed, feedBuilder) {
			
				var id = AJAXFeedUpdater.refreshFeedLike(feed, feedBuilder);
			
			
				feedsHooks[feed.feed_id] = id;
			
			}
		
		}
	
	
		
		class FeedsGenerator {
		
		
			static
			insertNewFeedDom(dom) {
			
					var feedMainDom = FeedsGenerator.returnMainFeedPanel();
					feedMainDom.insertBefore(dom, feedMainDom.children[1]);
			}
		
			static 
			returnMainFeedPanel() {
				return document.getElementsByClassName("feeds-main")[0];
			}
				
			static
			twoDigits(d) {
				if(0 <= d && d < 10) return "0" + d.toString();
				if(-10 < d && d < 0) return "-0" + (-1*d).toString();
				return d.toString();
			}

			static
			toMysqlFormat() {
				return this.getUTCFullYear() + "-" + FeedsGenerator.twoDigits(1 + this.getUTCMonth()) + "-" + FeedsGenerator.twoDigits(this.getUTCDate()) + " " + FeedsGenerator.twoDigits(this.getUTCHours()) + ":" + FeedsGenerator.twoDigits(this.getUTCMinutes()) + ":" + FeedsGenerator.twoDigits(this.getUTCSeconds());
			}
		
			static
			publishedFeedShow(id, title, text) {
				
					
					
				
						var feed = {
							
								feed_id: id,
								createdAt: FeedsGenerator.toMysqlFormat.apply(new Date()),
								faculty: userConfiguration.faculty,
								fullName: userConfiguration.fullName,
								user_id: userConfiguration.id,
								name: userConfiguration.name,
								profile_image_path: userConfiguration.profile_image_path,
								text: text,
								title: title
							
							}
							
							var feedBuilder = FeedsGenerator.showFeed(feed);
							AJAXFeedUpdater.bind(feed, feedBuilder);
							
							
							
			
			}
		
			static
			showFeed(feed) {
			
					//console.log("showFeed");
				
					var feedBuilder = new FeedWindowBuilder(feed);
					feedBuilder.setLikeButton();
					
					
					var feedDom = feedBuilder.build();
					//console.log(feedDom);
					//feedMainDom.appendChild(feedDom);
					
					//referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
					FeedsGenerator.insertNewFeedDom(feedDom);
					
					return feedBuilder;
			}
		
			static 
			fetchFeeds() {
			
				var feedMainDom = document.getElementsByClassName("feeds-main")[0];
			
				
				var feeds = {{ feeds|json_encode()|raw }};
				
				for ( var i = 0; i < feeds.length; ++i ) {
				
					var feed = feeds[i];
					
					
					var feedBuilder = FeedsGenerator.showFeed(feed);
					AJAXFeedUpdater.bind(feed, feedBuilder);
					
					
					
				}
				
				
			
			}
			
			static 
			setupFeedPanel() {
				  
					var publishButton = document.getElementsByClassName("publishButton")[0];
					var publishTitle = document.getElementsByClassName("publishTitle")[0];
					var publishTextarea = document.getElementsByClassName("publishTextarea")[0];
					
					
					
					publishButton.addEventListener("click", function() {
					
						
					
						
							$.ajax({
							  method: "POST",
							  url: "/FeedProvider/publish",
							  data: {
										title: publishTitle.value,
										text: publishTextarea.value
										
									},success: function( msg ) {
								
										//console.log(msg);
										
										if ( msg != "error" ) {
										
											//console.log(parseInt(msg));
											
											FeedsGenerator.publishedFeedShow(parseInt(msg), publishTitle.value, publishTextarea.value);
												
											publishTitle.value = "";
											publishTextarea.value = "";
											
										}
										
											
										
									
									
									},error: function( msg ) {
								
									console.log(msg);
									debug.innerHTML = msg.responseText;
									
									
									}
									
							});
					
					});
				  
				
			}	
			

		}
		
		
		
		FeedsGenerator.setupFeedPanel();
		FeedsGenerator.fetchFeeds();
		
		
	
	
		
	