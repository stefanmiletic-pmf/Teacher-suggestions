import FeedTab from "../FeedTab.js";
import FeedsHeaderTabUtil from "../FeedsHeaderTabUtil.js";
import FeedTabTitleBuilder from "../FeedTabTitleBuilder.js";
import FeedsGenerator from "../../FeedsGenerator.js";




var soloViewsMemos = [];

export default class FeedTabSoloView extends FeedTab{

	

	getID() {
	
		return this.feed.feed_id;
	
	}
	
	

	constructor(parentDom, user_id) {
		super(parentDom, user_id);
		
		this.feedTitle = "undefined";
		this.feed = null;
		
	
	}
	
	setTitleBuilder() {
	
		
		this.feedTabTitleBuilder = new FeedTabTitleBuilder(this, true);
		this.feedTabTitleBuilder.setTitle(this.feedTitle);
		
		
	}
	
	setPreBodyBuilder() {
	
		
	
	}
	
	addFeed(feed, FeedTabSoloViewClass) {
	
		this.feed = feed;
		this.feedTitle = this.feed.title;
		
		this.setTitleBuilder();
		this.feedTabTitleBuilder.setId(this.feed.feed_id);
		
		super.addFeed(feed, FeedTabSoloViewClass);
		
	
	}
	
	

	static
	generateNewTab(feed) {
	
			var soloViewFeedTabBuilder = null;
			if ( soloViewsMemos[feed.feed_id] && !((soloViewsMemos[feed.feed_id]).isDestroyed()) ) {
			
				soloViewFeedTabBuilder = soloViewsMemos[feed.feed_id];
				
			} else {
			
				//console.log(feed);
				soloViewFeedTabBuilder = new FeedTabSoloView( FeedsGenerator.returnFeedsViewPanel());
				soloViewFeedTabBuilder.setTitleBuilder();
				
				soloViewFeedTabBuilder.addFeed(feed, FeedTabSoloView);
				
				FeedsHeaderTabUtil.addTab(soloViewFeedTabBuilder);
				soloViewsMemos[feed.feed_id] = soloViewFeedTabBuilder;
				
			}
			
					
			
			
			FeedsHeaderTabUtil.on_tab_clicked(soloViewFeedTabBuilder);

			
			
	}
	
	
	

}

		