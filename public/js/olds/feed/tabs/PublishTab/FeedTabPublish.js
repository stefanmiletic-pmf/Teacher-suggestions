import FeedTab from "../FeedTab.js";
import FeedsHeaderTabUtil from "../FeedsHeaderTabUtil.js";
import FeedTabTitleBuilder from "../FeedTabTitleBuilder.js";
import FeedTabPreBodyBuilderPublish from "./FeedTabPreBodyBuilderPublish.js";


export default class FeedTabPublish extends FeedTab{

	getID() {
	
		return -1;
	
	}

	constructor(parentDom, user_id) {
		super(parentDom, user_id);

	
	}
	
	
	
	
	setTitleBuilder() {
	
		
		this.feedTabTitleBuilder = new FeedTabTitleBuilder(this);
		this.feedTabTitleBuilder.setTitle("Objavi");
		
	}
	
	setPreBodyBuilder() {
	
		
		this.feedTabPreBodyBuilder = new FeedTabPreBodyBuilderPublish(this);
		this.feedTabPreBodyBuilder.setupPanel();
	
	}
	
	


}

