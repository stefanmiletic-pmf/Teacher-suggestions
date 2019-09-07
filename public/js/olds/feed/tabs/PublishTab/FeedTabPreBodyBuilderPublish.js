
import FeedTabPreBodyBuilder from "../FeedTabPreBodyBuilder.js";
import FeedsGenerator from "../../FeedsGenerator.js";



export default class FeedTabPreBodyBuilderPublish extends FeedTabPreBodyBuilder {

	constructor(parentBuilder) {
		super(parentBuilder);

		
		var htmlToParse = "<div class='publishTabBody'><div class='tab-content'>                            <div class='tab-pane fade show active' id='posts' role='tabpanel' aria-labelledby='posts-tab'>                                <div class='form-group'>                                    <label class='sr-only' for='message'>title</label>                                    <input class='form-control publishTitle' id='title' placeholder='Naslov?' />									                                    <label class='sr-only' for='message'>text</label>                                    <textarea class='form-control publishTextarea' id='message' rows='3' placeholder='Sta si smislio?'></textarea>                                </div>                            </div>                        </div>                        <div class='btn-toolbar justify-content-between'>                            <div class='btn-group'>                                <button type='submit' class='btn btn-primary publishButton'>objavi</button>                            </div>                        </div></div>";
		
		

		var parser = new DOMParser();
		var el = parser.parseFromString(htmlToParse, "text/html");
		
		
		this.post_tab_body = el.getElementsByClassName("publishTabBody")[0]
		
		
		
		
		
	
	}
	
	getDom() {
		
		return this.post_tab_body;
		
	}
	
	 
	setupPanel() {
		  
		  
		  
		//console.log(this.post_tab_body);
			var publishButton = this.post_tab_body.getElementsByClassName("publishButton")[0];
			var publishTitle = this.post_tab_body.getElementsByClassName("publishTitle")[0];
			var publishTextarea = this.post_tab_body.getElementsByClassName("publishTextarea")[0];
			
				var builder_as_arg = this;
			
			
			publishButton.addEventListener("click", function() {
			
				
				
					$.ajax({
					  method: "POST",
					  url: "/FeedProvider/publish",
					  data: {
								title: publishTitle.value,
								text: publishTextarea.value
								
							},success: function( msg ) {
						
								////console.log(msg);
								
								if ( msg != "error" ) {
								
									////console.log(parseInt(msg));
									
									
									builder_as_arg.on_feed_published(parseInt(msg), publishTitle.value, publishTextarea.value);
										
									publishTitle.value = "";
									publishTextarea.value = "";
									
								}
								
									
								
							
							
							},error: function( msg ) {
						
								//console.log(msg);
								debug.innerHTML = msg.responseText;
							
							
							}
							
					});
			
			});
		  
		
	}	

	
	build() {
	
		return  this.post_tab_body;
	
	}
	
	
	
	on_feed_published(id, title, text) {
		
			
			
		
				var feed = {
					
						feed_id: id,
						createdAt: FeedsGenerator.toMysqlFormat.apply(new Date()),
						faculty: userConfiguration.faculty,
						fullName: userConfiguration.fullName,
						user_id: userConfiguration.id,
						name: userConfiguration.name,
						profile_image_path: userConfiguration.profile_image_path,
						text: text,
						title: title,
						liked_times: 0
						
					
					}
					
					this.parentBuilder.addFeed(feed);
					
					
					
	
	}
	
	
	
	

}

