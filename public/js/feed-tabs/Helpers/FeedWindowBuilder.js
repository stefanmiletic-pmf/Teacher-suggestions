//import AJAXFeedUpdater from "./AJAXFeedUpdater.js";

var feed_windows = {};

 
const like_class = "far fa-check-circle";
const like_text = "Slazes se?";

const liked_class = "fas fa-check-circle";
const liked_text = "Slazem se";

class FeedWindowBuilder {


		// **director method
		static
		director(feed) {
		
				var feedBuilder = new FeedWindowBuilder(feed);
				feedBuilder.saveSelfReference();
				feedBuilder.setLikeButton();
				
				
				return feedBuilder;
		}
			

	

	static 
	domTemplate() {
	
			var htmlToParse = "<div class='card feed-card'>  <div class='card-header'>                        <div class='d-flex justify-content-between align-items-center'>                            <div class='d-flex justify-content-between align-items-center'>                                <div class='mr-2'>                                    <div class='profile-image'><span class='image-user-name' data-name='{{ user.fullName }}'>  </span><img class='rounded-circle user-profile-image' width='45' src='' alt=''></div>                                </div>                                <div class='ml-2 user-about'>                                    <div class='h5 m-0 user-full-name'>@LeeCross</div>                                    <div class='h7 text-muted user-department'>Miracles Lee Cross</div>       <div class='h7 text-muted user-email'>Miracles Lee Cross</div>                          </div>                            </div>                            <div>                                <div class='dropdown'>                                    <button class='btn btn-link dropdown-toggle' type='button' id='user-drop1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>                                        <i class='fa fa-ellipsis-h'></i>                                    </button>                                    <div class='dropdown-menu dropdown-menu-right' aria-labelledby='user-drop1'>                                        <div class='h6 dropdown-header'>Opcije</div>                                         <a class='dropdown-item feed-share' href='javascript:void(0)'>Deli</a>                                    </div>                                </div>                            </div>                        </div>                    </div>                    <div class='card-body'>                        <div class='text-muted h7 mb-2'><span class='badge badge-primary is-fresh'>sveže</span> <i class='far fa-clock feed-time-created'></i> </div>                        <a class='card-link' href='javascript:void(0)'>                            <h5 class='card-title feed-title'>Totam non adipisci hic! Possimus ducimus amet, dolores illo ipsum quos                                cum.</h5>                        </a>                        <p class='card-text feed-body'>             </p>                    </div>                    <div class='card-footer'> <div class='like-panel'><span class='liked-counter badge badge-primary text-wrap'>0</span><div class='action-like btn btn-link'><i class='far fa-check-circle like-icon'></i> <span class='like-title'>Slazes se?</span></div>    </div><a href='javascript:void(0)' class='card-link action-share'><i class='far fa-share-square'></i> Deli</a>                    </div>                </div>";
			
			
			

			var parser = new DOMParser();
			var el = parser.parseFromString(htmlToParse, "text/html");
			
			var feed_card = el.getElementsByClassName("feed-card")[0]
			
			
			return feed_card;
	
	}
	
	resetHooks() {
		
		for ( var i =0; i < this.hooks.length; ++i) {
			
			var hook = this.hooks[i];
			clearInterval(hook);
			
		}
		
	}

	constructor(feed) {
		
		
		this.hooks = [];
	
		this.user_id = feed.user_id;
	
		this.feed = feed;
		
		this.feed.liked_times = parseInt(this.feed.liked_times);
		
		
		this.feedDOM = FeedWindowBuilder.domTemplate();
		this.feedDOM.className += " fade-in";
		
		
		this.feedDOM.setAttribute("data-feed-id", this.feed.feed_id);
		
		
		
		var fullName = this.feedDOM.getElementsByClassName("user-full-name")[0];
		fullName.innerHTML =  this.feed.fullName;
		
		var department = this.feedDOM.getElementsByClassName("user-department")[0];
		department.innerHTML =  this.feed.department;
		
		
		var email = this.feedDOM.getElementsByClassName("user-email")[0];
		email.innerHTML =  this.feed.email;
		
		
		var profileImage = this.feedDOM.getElementsByClassName("user-profile-image")[0]
		profileImage.src = "\\images\\" + (this.feed.profile_image_path ? this.feed.profile_image_path : "profiledefault.png");
		
		
		var imageCL =	this.feedDOM.getElementsByClassName("image-user-name")[0];
		
		

		  var txt = this.feed.fullName.trim();
		  var splited = txt.split(' ');
		  imageCL.innerHTML = ((splited[0])[0]).toUpperCase() + ((splited[splited.length-1])[0]).toUpperCase();
			  
		
		
		this.likeIcon =  this.feedDOM.getElementsByClassName("like-icon")[0];
		this.likeTitle =  this.feedDOM.getElementsByClassName("like-title")[0];
		
		
		var copyLinkPanelShow = function(target, url) {
			
			
			
			
			$('#copy-link-panel .url').val(url);
			$('#copy-link-panel').css("display", "block");
			
		}
		
		var shareOnClick = function(e) {
			
			
			
			var url =window.location.href;
			
			if ( url.indexOf("?") !== -1 ) 
				url = url.substring(0, url.indexOf("?"));
			
			
			copyLinkPanelShow(e.target, url + "?feedId=" + feed.feed_id);
			
			window.scrollTo(0, 0);
			
		}
		
		
		var feedShare =  this.feedDOM.getElementsByClassName("feed-share")[0];
		feedShare.addEventListener("click", shareOnClick);
		
		
		
		
		var timeCreated =  this.feedDOM.getElementsByClassName("feed-time-created")[0];
		var isFreshDom =  this.feedDOM.getElementsByClassName("is-fresh")[0];
		
		
		
		
		var isFresh = {};
		timeCreated.innerHTML = "  " + FeedWindowBuilder.timeSince(this.feed.createdAt, isFresh);
		
		if ( isFresh['fresh'] ) {
			isFreshDom.style.display = 'inline-block';
		}
		
		
		var tcId = setInterval(function() {
			
			var isFresh = {};
			timeCreated.innerHTML = "  " + FeedWindowBuilder.timeSince(feed.createdAt, isFresh);
			if ( !isFresh['fresh'] ) {
				isFreshDom.style.display = 'none';
			}
		
		
		}, 1000 * 60);
		
		this.hooks.push(tcId);
		
		
		var title =  this.feedDOM.getElementsByClassName("feed-title")[0];
		title.innerHTML = this.feed.title;
		
		if ( feed['newTab'] === undefined ){
			title.addEventListener("click", function() {
				
				
				var $tabAE = Tab.checkIfExists(false, feed.feed_id);
						
				if ($tabAE[0]  ) {
			
						$tabAE.click();
						return;
				}
			
					
				TabUpdater.fetchTab(feed.feed_id);
					
					
			});
		}
		
		
		
		var body =  this.feedDOM.getElementsByClassName("feed-body")[0];
		body.innerHTML = this.feed.body;
		
		this.footerLike =  this.feedDOM.getElementsByClassName("action-like")[0];
		this.footerLike.href = "javascript:void(0)";
		var footerShare =  this.feedDOM.getElementsByClassName("action-share")[0];
		footerShare.href = "javascript:void(0)";
		footerShare.addEventListener("click", shareOnClick);
		
		
		
		this.footerLikeCounter =  this.feedDOM.getElementsByClassName("liked-counter")[0];
		this.footerLikeCounter.innerHTML = this.feed.liked_times;
		
		
		if ( this.feed.liked_id ){
			
				
				this.likeTitle.innerHTML = liked_text;
				this.likeIcon.className += " "  + liked_class;
				
				
		}
		
		
		
		
		
	
	}
	
	saveSelfReference() {
		
		
		
		if ( !feed_windows[this.feed.feed_id] ) {
			
			feed_windows[this.feed.feed_id] = [];
			
		}
		
		(feed_windows[this.feed.feed_id]).push(this);
		
		
		
	}
	

	
	
	checkLikeButton() {
	
		if ( this.feed.liked_id ) {
			
				return -1;
				
			} else {
			
				return 1;
			}
		
	}
	
	static
	updateAllFeedsAfterAction(feed_id, caller, action, args) {
		
		
		var existing_feeds_windows = feed_windows[feed_id];
		if ( existing_feeds_windows ) {
			
			
			 for ( var i = 0; i < existing_feeds_windows.length; ++ i ) {
				 
				 
				 var existing_feed_window = existing_feeds_windows[i];
				 
				 if ( existing_feed_window == caller ){
					 continue;
				 }
				
				if ( !args )
					args = [];
				
				args.push(true)
				action.apply(existing_feed_window, args);
				
				
				
			 }
			
			
		}
		
		
	}
	
	toggleLikeButton(ignore_recursive) {
			
			
			if ( !this.feed.liked_id )  {
				this.feed.liked_id = this.user_id;
				
			
				this.likeTitle.innerHTML = liked_text;						
				this.likeIcon.className = this.likeIcon.className.replace(like_class, "");
				
				this.likeIcon.className += " "  + liked_class;
				
				
				if ( ignore_recursive != true)
					FeedWindowBuilder.updateAllFeedsAfterAction(this.feed.feed_id, this, this.toggleLikeButton);
				
				return 1;
				
			} else {
			
				this.feed.liked_id = null;
				
				this.likeTitle.innerHTML = like_text;
				
								
				this.likeIcon.className = this.likeIcon.className.replace(liked_class, "");
				
				this.likeIcon.className += " "  + like_class;
				
				
				if ( ignore_recursive != true)
					FeedWindowBuilder.updateAllFeedsAfterAction(this.feed.feed_id, this, this.toggleLikeButton);
				
				return -1;
			}
	
	}
	
	build() {
	
		return this.feedDOM;
	
	}
	
	setLikeCounter(num, ignore_recursive) {
	
		
		this.feed.liked_times = parseInt(num);
		this.footerLikeCounter.innerHTML = num;
		console.log("this.footerLikeCounter");
		
		
		
		
		if ( ignore_recursive != true)
			FeedWindowBuilder.updateAllFeedsAfterAction(this.feed.feed_id, this, this.setLikeCounter, [num]);

		
	
	}
	
	addLikeDelta(delta, ignore_recursive) {
	
		
		
		
		
		this.feed.liked_times +=  parseInt(delta);
		
		this.footerLikeCounter.innerHTML = this.feed.liked_times;
		
		if ( ignore_recursive != true)
			FeedWindowBuilder.updateAllFeedsAfterAction(this.feed.feed_id, this, this.addLikeDelta, [delta]);
		
		
	
	}
	
	returnLikeCounter() { 
	
		if ( this.footerLikeCounter != null )
			return parseInt(this.feedFooterLikeCounter.innerHTML);
		else 
			return -1;	
	
	}
	
	setLikeButton() {
		
		var callback = function() {
			
			
			
			
			FeedUpdater.updateLikeCounter(this.feed, this, 
								this.checkLikeButton.bind(this),
								this.toggleLikeButton.bind(this) );
								
								
			
		}.bind(this);
		
	
		this.footerLike.addEventListener("click", callback.bind(this));
		
		
			
	
	}
	
	// unix timestamp
	static
	timeSince(timeStamp, isFresh) {
		
		timeStamp = parseInt(timeStamp*1000);
		
		timeStamp = new Date(timeStamp);
		
		var now = new Date();
		var secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
		
		
		if ( isFresh )
			isFresh['fresh'] = true;
			
		if(secondsPast < 60){
		  return "pre " + parseInt(secondsPast) + 's';
		}
		if(secondsPast < 3600){
		  return "pre " + parseInt(secondsPast/60) + 'm';
		}
		if(secondsPast <= 86400){
		  return "pre " + parseInt(secondsPast/3600) + 'h';
		}
		if(secondsPast > 86400){
			
			
			
			
			if ( isFresh )
				isFresh['fresh'] = false;

			var day = timeStamp.getDate();
			
			var month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
			
			if ( month.indexOf('Aug') !== -1 ){
				console.log(month);
				month = month.replace('Aug', 'Avg');
				console.log(month);
			}
			var year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
			return day + " " + month + year;
		}
	}
	
}

