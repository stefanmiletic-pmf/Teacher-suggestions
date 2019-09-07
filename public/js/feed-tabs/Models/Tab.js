//import User from "./User.js";


class Tab {
	
	static
	checkIfExists(is_user_tab, id) {
		
		var tab_anchor_class_name = (is_user_tab ? "tab-user-anchor-": "tab-anchor-") + id;
		
		
		return $('.' + tab_anchor_class_name);
		
	}
	
	
	constructor(is_user_tab, id, title, onDeleteTab){
		
		
		var tab_class_name = (is_user_tab ? "tab-user-"  : "tab-" ) + id;
		this.class_name = tab_class_name;
		
		var tab_anchor_class_name = (is_user_tab ? "tab-user-anchor-": "tab-anchor-") + id;
		var tab_href_class_name = (is_user_tab ? "tab-user-" : "tab-") + id;
		
		this.$tab = $("<li class='nav-item " + tab_class_name + "'></li>");
		
		
		this.$a = $("<a class='nav-link " + tab_anchor_class_name + "' data-toggle='tab' href='#" + tab_href_class_name + "' role='tab' aria-controls='posts' aria-selected='true'></a>");
		
		var $close_btn = $("<button type='button' class='close tab-close' aria-label='Close'>  <span aria-hidden='true'>&times;</span></button>");
		
	

		this.$a.text(title);
		this.$tab.append(this.$a);
		
		
		
		
		
		
		
		this.$tabBody = $("<div id='" + tab_href_class_name +  "' class='tab-body-div'></div>");
		
		this.$tabBodyFeedWrapper = $("<div class='feeds-view'></div>");
		this.$tabBody.append(this.$tabBodyFeedWrapper);
		
		
		
		
		
		var $tabList = $("#tabSelection");
		this.$tabParent = $("#tabs");
		
		
		var tab_arg = this.$tab;
		var tab_body_arg = this.$tabBody;
		var tabParent_arg = this.$tabParent;
		
		$close_btn.click(function() {
			
			tab_arg.remove();
			tab_body_arg.remove();
			tabParent_arg.tabs('refresh');
			
			// var page_active = $('.page-item.active a').first().text();
			
			// ////console.log("page_active");
			// ////console.log($('.page-item.active a'));
			// ////console.log(page_active);
			
			// if ( page_active == "1" )
				// $('.fast-backward a').click();
			
			$('.post-tab-anchor').click();
			if ( onDeleteTab )
				onDeleteTab();
			
			
			
		});
		
		this.$tab.append($close_btn);
		
		
		$tabList.append(this.$tab);
		this.$tabParent.append(this.$tabBody);
		
	
		
		
	}

	show() {
		
		
		this.$tabParent.tabs('refresh');
		this.$a.click();
		
		return this;
	}
	
	
	emptyBody() {
		
		console.log("NOW EMPTY");
		this.$tabBodyFeedWrapper.empty();
		
		
		console.log(this.p1);
		if ( this.p1 )
			this.p1.resetPaginationDiv();
		
		if ( this.p2 )
			this.p2.resetPaginationDiv();
	}

	add(feed) {
		
		
		var feedDom = FeedWindowBuilder.director(feed, null).build();
		this.$tabBodyFeedWrapper.append(feedDom);
		
		return this;
	}
	
	addPagination(pagination, before, after, onClickCallback) {
		
		if ( !pagination)
			return;
		
		this.p1 = new Pagination(pagination, before, onClickCallback);
		this.p1.show();
		this.p2 = new Pagination(pagination, after, onClickCallback);
		this.p2.show();
		
	}
	



	
}