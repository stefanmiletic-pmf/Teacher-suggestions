import AJAXFeedUpdater from "./AJAXFeedUpdater.js";

var feed_windows = {};

export default class FeedWindowBuilder {


		// **director method
		static
		getFeedCustomBuilder(feed, user_id, FeedTabSoloViewClass) {
		
				var feedBuilder = new FeedWindowBuilder(feed, user_id, FeedTabSoloViewClass);
				feedBuilder.saveSelfReference();
				feedBuilder.setLikeButton();
				
				
				return feedBuilder;
		}
			

	

	static 
	getFeedDomTemplate() {
	
			var htmlToParse = "<div class='card feed-card'>  <div class='card-header'>                        <div class='d-flex justify-content-between align-items-center'>                            <div class='d-flex justify-content-between align-items-center'>                                <div class='mr-2'>                                    <img class='rounded-circle user-profile-image' width='45' src='' alt=''>                                </div>                                <div class='ml-2 user-about'>                                    <div class='h5 m-0 user-about-hashtag'>@LeeCross</div>                                    <div class='h7 text-muted user-faculty'>Miracles Lee Cross</div>                                </div>                            </div>                            <div>                                <div class='dropdown'>                                    <button class='btn btn-link dropdown-toggle' type='button' id='user-drop1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>                                        <i class='fa fa-ellipsis-h'></i>                                    </button>                                    <div class='dropdown-menu dropdown-menu-right' aria-labelledby='user-drop1'>                                        <div class='h6 dropdown-header'>Opcije</div>                                         <a class='dropdown-item feed-report' href='#'>Reportuj</a>                                    </div>                                </div>                            </div>                        </div>                    </div>                    <div class='card-body'>                        <div class='text-muted h7 mb-2'> <i class='far fa-clock feed-time-created'></i> </div>                        <a class='card-link' href='#'>                            <h5 class='card-title feed-title'>Totam non adipisci hic! Possimus ducimus amet, dolores illo ipsum quos                                cum.</h5>                        </a>                        <p class='card-text feed-body'>                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam sunt fugit reprehenderit consectetur exercitationem odio,                            quam nobis? Officiis, similique, harum voluptate, facilis voluptas pariatur dolorum tempora sapiente                            eius maxime quaerat.                            <a href='https://mega.nz/#!1J01nRIb!lMZ4B_DR2UWi9SRQK5TTzU1PmQpDtbZkMZjAIbv97hU' target='_blank'>https://mega.nz/#!1J01nRIb!lMZ4B_DR2UWi9SRQK5TTzU1PmQpDtbZkMZjAIbv97hU</a>                        </p>                    </div>                    <div class='card-footer'> <div class='like-panel'><span class='liked-counter badge badge-primary text-wrap'>0</span><div class='action-like btn btn-link'><i class='far fa-check-circle like-icon'></i> <span class='like-title'>Slazes se?</span></div>    </div><a href='#' class='card-link action-share'><i class='far fa-share-square'></i> Deli</a>                    </div>                </div>";
			
			
			

			var parser = new DOMParser();
			var el = parser.parseFromString(htmlToParse, "text/html");
			
			var feed_card = el.getElementsByClassName("feed-card")[0]
			
			
			return feed_card;
	
	}

	constructor(feed, user_id, FeedTabSoloViewClass) {
		////console.log(FeedTabSoloViewClass);
		this.FeedTabSoloViewClass = FeedTabSoloViewClass;
	
		this.user_id = user_id;
		this.like_class = "far fa-check-circle";
		this.like_text = "Slazes se?";
		
		this.liked_class = "fas fa-check-circle";
		this.liked_text = "Slazem se";
	
		this.feed = feed;
		//////console.log(this.feed);
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
		
		
		
		
		
		this.setFeedAttributes(feed);
	
	}
	
	saveSelfReference() {
		
		
		
		if ( !feed_windows[this.feed.feed_id] ) {
			
			feed_windows[this.feed.feed_id] = [];
			
		}
		
		(feed_windows[this.feed.feed_id]).push(this);
		
		
		
	}
	
	setFeedAttributes(feed) {
	
	
	
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
		
		
		//////console.log(this.feed);
		if ( this.feed.liked_id ) {
		
			this.toggleLikeButton();
			
		}
		
		
		this.feedTitle.addEventListener("click", function() {
		
		
				//this.on_post_clicked_callback(this.feed, this.user_id);
				//FeedTabSoloView.generateNewTab(this.feed, this.user_id);
				
				this.FeedTabSoloViewClass.generateNewTab(this.feed, this.user_id);
				
				
		}.bind({feed: feed, user_id: this.user_id, FeedTabSoloViewClass: this.FeedTabSoloViewClass}));
	
	}
	
	
	checkLikeButton() {
	
		if ( this.likeTitle.innerHTML == this.like_text ) {
			
				return 1;
				
			} else {
			
				return -1;
			}
		
	}
	
	static
	updateAllFeedsAfterAction(feed_id, caller, action, args) {
		//console.log("updateAllFeedsAfterAction");
		var existing_feeds_windows = feed_windows[feed_id];
		if ( existing_feeds_windows ) {
			
			//console.log('caller');
			//console.log(caller);
			//console.log(existing_feeds_windows);
			
			
		//console.log("------------------------------");
			
			 for ( var i = 0; i < existing_feeds_windows.length; ++ i ) {
				 
				 
				 var existing_feed_window = existing_feeds_windows[i];
				 //console.log("existing_feed_window:");
				//console.log(existing_feed_window);
				 if ( existing_feed_window == caller ){
						//console.log( "i-ti je isti " + i);
						//console.log("sledeci")
					 continue;
					 
				 }
				
				if ( !args )
					args = [];
				
				args.push(true)
				action.apply(existing_feed_window, args);
				
				
		//console.log("------------------------------");
				//console.log("sledeci")
				
				
			 }
			
			
		}
		
		
	}
	
	toggleLikeButton(is_recursive) {
			
		//console.log("toggleLikeButton is_recursive:" + is_recursive );
		//console.log("this:" );
		//console.log(this );
			
			
			if ( this.likeTitle.innerHTML.toString().localeCompare(this.like_text) == 0 )  {
			
				this.likeTitle.innerHTML = this.liked_text;						
				this.likeIcon.className = this.likeIcon.className.replace(this.like_class, this.liked_class);
				
				this.feed.liked_id = this.user_id;
				
				if ( is_recursive == undefined)
					FeedWindowBuilder.updateAllFeedsAfterAction(this.feed.feed_id, this, this.toggleLikeButton);
				
				return 1;
				
			} else {
			
				this.feed.liked_id = null;
				this.likeTitle.innerHTML = this.like_text;
				this.likeIcon.className = this.likeIcon.className.replace(this.liked_class, this.like_class);
				
				
				if ( is_recursive == undefined)
					FeedWindowBuilder.updateAllFeedsAfterAction(this.feed.feed_id, this, this.toggleLikeButton);
				
				return -1;
			}
	
	}
	
	build() {
	
		return this.feedDOM;
	
	}
	
	setLikeCounter(num, is_recursive) {
	
		//console.log("setLikeCounter num: " + num);
		
		this.feed.liked_times = num;
		
		this.feedFooterLikeCounter.innerHTML = this.feed.liked_times;
		
		
		if ( is_recursive == undefined)
			FeedWindowBuilder.updateAllFeedsAfterAction(this.feed.feed_id, this, this.setLikeCounter, [num]);
		
		
		//var children = document.getElementsByClassName("liked-counter");
		
		//for ( var i =0; i < children.length; ++i ) {
		
		//	var child = children[i];
		//	child.innerHTML = num;
		
		//}
		
	
	}
	
	addLikeDelta(delta, is_recursive) {
	
		//console.log("addLikeDelta delta: " + delta);
		
		var lc = parseInt(this.feedFooterLikeCounter.innerHTML);
		this.feed.liked_times = lc + delta;
		
		this.feedFooterLikeCounter.innerHTML = this.feed.liked_times;
		
		
		if ( is_recursive == undefined)
			FeedWindowBuilder.updateAllFeedsAfterAction(this.feed.feed_id, this, this.addLikeDelta, [delta]);
		
		
	
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

