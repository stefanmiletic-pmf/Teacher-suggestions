import FeedTabPublish from "./tabs/PublishTab/FeedTabPublish.js";
import FeedsGenerator from "./FeedsGenerator.js";
import FeedsHeaderTabUtil from "./tabs/FeedsHeaderTabUtil.js";
import FeedTabSoloView from "./tabs/SoloViewTab/FeedTabSoloView.js";
import AJAXFeedUpdater from "./AJAXFeedUpdater.js";


				
// publish tab director 
var publishTabBuilder = new FeedTabPublish( FeedsGenerator.returnFeedsViewPanel(), 123);
publishTabBuilder.setTitleBuilder();
publishTabBuilder.setPreBodyBuilder();
/////////////////////



FeedsHeaderTabUtil.addTab(publishTabBuilder);





//FeedsGenerator.fetchFeeds(publishTabBuilder);
//publishTabBuilder.show();


// var feed = {
	
	// createdAt: "2019-07-28 16:33:57",
	// faculty: "PMF Nis",
	// feed_id: 45,
	// fullName: "Stefan asd Miletic",
	// liked_id: null,
	// liked_times: 0,
	// name: "stefan123",
	// profile_image_path: "profiledefault.png",
	// text: "asd",
	// title: "mnogooducacaakknaslovd",
	// user_id: 129
	
// }


// publishTabBuilder.addFeed(feed, FeedTabSoloView);


AJAXFeedUpdater.fetchFeeds(publishTabBuilder, FeedTabSoloView);
		
