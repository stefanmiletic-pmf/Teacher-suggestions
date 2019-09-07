import FeedWindowBuilder from "../FeedWindowBuilder.js";
import AJAXFeedUpdater from "../AJAXFeedUpdater.js";
import FeedsHeaderTabUtil from "./FeedsHeaderTabUtil.js";



export default class FeedTab {


	


	constructor(parentDom, user_id) {
	
		this.user_id = user_id;
		
		this.parentDom = parentDom;
		this.feedTabTitleBuilder = null;
		this.feedTabPreBodyBuilder = null;
		
		this.feedsDOM = document.createElement("div");
		
		this.feedBindHooks = [];
		
		this.is_destroyed = false;
		
	
	}
	
	getFeedsDom() {
		
		return this.feedsDOM;
		
	}
	
	getTitleBuilder() {
	
		if ( this.feedTabTitleBuilder ) 
			return this.feedTabTitleBuilder;
			
		return null;
	
	}
	
	getPreBodyBuilder() {
	
		if ( this.feedTabPreBodyBuilder ) 
			return this.feedTabPreBodyBuilder;
			
		return null;
	
	}
	
	
	addFeed(feed, FeedTabSoloViewClass) {
	
		
		var feedBuilder = FeedWindowBuilder.getFeedCustomBuilder(feed, this.user_id, FeedTabSoloViewClass);
		
		
	
		var feedDom = feedBuilder.build();
		
		////console.log("Feed dom: " );
		////console.log(feedDom);
		////console.log("this.parentDom: " );
		////console.log(this.parentDom);
		//this.feedsDOM.appendChild(feedDom);
		
		if ( this.feedsDOM.children.length > 1 )
			this.feedsDOM.insertBefore(feedDom, this.feedsDOM.children[0]);
		else 
			this.feedsDOM.appendChild(feedDom);
		
		
		
		var new_id = AJAXFeedUpdater.bind(feed, feedBuilder);
		this.feedBindHooks.push(new_id);
	
	}
	
	show() {
	
		//console.log("pre");
		//console.log(this.parentDom);
		this.parentDom.innerHTML = "";
		this.parentDom.appendChild(this.feedsDOM);
		//console.log("posle");
		//console.log(this.parentDom);
	
	}
	
	isDestroyed() {
		
		return this.is_destroyed;
		
	}
	
	destroy() {
		
		this.is_destroyed = true;
		
		for ( var i = 0; i < this.feedBindHooks.length; ++i ) {
			
			var feed_hook = this.feedBindHooks[i];
			
			clearInterval(feed_hook);
			
		}
		
		
		
		// //console.log('this.parentDom.parentNode');
		// //console.log(this.parentDom.parentNode);
		// //console.log('this.parentDom');
		// //console.log(this.parentDom);
		
		// return;
		
		var titleDom = this.feedTabTitleBuilder.getDom();
		
		titleDom.parentNode.removeChild(titleDom);
		
		
		
		if ( this.feedTabPreBodyBuilder ){
		
			var preBodyDom = this.feedTabPreBodyBuilder.getDom();
			preBodyDom.parentNode.removeChild(preBodyDom);
		
		
		}
		
		//console.log('this.parentDom.parentNode');
		//console.log(this.parentDom.parentNode);
		this.feedsDOM.parentNode.removeChild(this.feedsDOM);
		
		
		//console.log('after this.parentDom.parentNode');
		//console.log(this.parentDom.parentNode);
		
		
		
		
		var prev_active = FeedsHeaderTabUtil.returnPrevActiveBuilder();
		
		FeedsHeaderTabUtil.resetActiveAndPrevActive();
		
		var conf = FeedsHeaderTabUtil.getTabsConf();
		
		//console.log(1);
		//console.log(FeedsHeaderTabUtil.getTabsConf());
		
		
		
		FeedsHeaderTabUtil.setActive(prev_active, true);
		
		
		//console.log(2);
		
		//console.log(FeedsHeaderTabUtil.getTabsConf());
		
		
		
		
	}
	
	

}

