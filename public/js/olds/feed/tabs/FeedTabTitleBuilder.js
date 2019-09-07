import FeedsHeaderTabUtil from "./FeedsHeaderTabUtil.js";


export default class FeedTabTitleBuilder {


	constructor(parentBuilder, withCloseButton) {
	
		this.parentBuilder = parentBuilder;
		
		var htmlToParse = " <li class='nav-item post-tab'>                                <a class='nav-link post-tab-anchor' id='posts-tab' data-toggle='tab' href='#posts' role='tab' aria-controls='posts' aria-selected='true'></a>  ";
		
		if ( withCloseButton ) {
			
			htmlToParse += "   <button type='button' class='close close-tab-btn' aria-label='Close'>  <span aria-hidden='true'>&times;</span></button> "
			
		} 
		
		htmlToParse += "</li>"
		
		
		

		var parser = new DOMParser();
		var el = parser.parseFromString(htmlToParse, "text/html");
		
		this.post_tab = el.getElementsByClassName("post-tab")[0]
		this.post_tab_anchor = el.getElementsByClassName("post-tab-anchor")[0]
		
		
		if ( withCloseButton ) {
			
			
			this.close_tab_btn = el.getElementsByClassName("close-tab-btn")[0]
			
			this.close_tab_btn.addEventListener("click", function() {
				
				parentBuilder.destroy();
			
			}.bind(this));
		}
		
		
		this.post_tab_anchor.addEventListener("click", function() {
		
			FeedsHeaderTabUtil.on_tab_clicked(parentBuilder);
		
		}.bind(this));

	
	}
	
	getDom() {
		
		return this.post_tab;
		
	}

	setActive(active) {
	
		if ( active ) {
			if ( this.post_tab_anchor.className.indexOf("active") == -1 ) 
				this.post_tab_anchor.className += " active";
				
		} else {
			this.post_tab_anchor.className = this.post_tab_anchor.className.replace("active", "")
		}
		
		
	
	}

	setId(id) {
		this.post_tab.setAttribute("data-feed-id", id);
	}

	setTitle(title) {
		this.post_tab_anchor.innerHTML = title;
	}
	
	build() {
		return this.post_tab;
	}

}

