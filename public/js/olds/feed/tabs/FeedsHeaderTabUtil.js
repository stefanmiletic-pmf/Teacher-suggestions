

var tabs_conf = {
	prevActive: null,
	activeBuilder: null,
	buildersMemo: {}
};


export default class FeedsHeaderTabUtil {

	
	
	static
	getTabsConf() {
		
		return tabs_conf;
		
	}
	
	static
	addTab(tabBuilder) {
	
		var list = document.getElementsByClassName("card-header-tabs")[0];
		list.appendChild(tabBuilder.getTitleBuilder().build());
			
		FeedsHeaderTabUtil.setActive(tabBuilder, true);
		tabBuilder.show();
	
	}
	
	static
	showTabPreBody(tabBuilder) {
	
	
		var pre_body = document.getElementsByClassName("tab-body-div")[0];
		
		pre_body.innerHTML = "";
		if ( tabBuilder.getPreBodyBuilder() ) {
		
			////console.log(tabBuilder.getPreBodyBuilder().build());
			
			pre_body.appendChild(tabBuilder.getPreBodyBuilder().build());
			
		} 
		
	
	}
	
	static
	showTabBody(tabBuilder) {
	
	
		var body = document.getElementsByClassName("feeds-view")[0];
		
		body.innerHTML = "";
		body.appendChild(tabBuilder.getFeedsDom());
			
		
		
	
	}

	
	static
	returnActiveBuilder() {
		return tabs_conf.activeBuilder;	
	}
	
	static
	returnPrevActiveBuilder() {
		return tabs_conf.prevActive;	
	}


	static
	resetActiveAndPrevActive() {
		
		
		tabs_conf.activeBuilder = null;
		tabs_conf.prevActive = null;
		
	}

	static
	setActiveTabBuilder(builder){
	
		if ( builder == null && tabs_conf.activeBuilder == null )
			return;
	
		if ( tabs_conf.activeBuilder != null )
			tabs_conf.prevActive = tabs_conf.activeBuilder
			
		tabs_conf.activeBuilder = builder;
	}


	static
	setActive(tabBuilder, active) {
	
		
		var prev_active_builder = FeedsHeaderTabUtil.returnActiveBuilder();
		if ( prev_active_builder == tabBuilder ){
			
			
			//console.log("isit je prethodni");
			return;
		}
	
		if ( active ) {
		
			if ( prev_active_builder ) {
				
					////console.log("resetujem prethodnig");
					FeedsHeaderTabUtil.setActiveTabBuilder(null);
					FeedsHeaderTabUtil.setActive(prev_active_builder, false);
					
			}
			
			
			////console.log("postavljam sadasnjeg");
			var tabTitleBuilder = tabBuilder.getTitleBuilder();
			tabTitleBuilder.setActive(true);
			
			
			
			FeedsHeaderTabUtil.setActiveTabBuilder(tabBuilder);
			FeedsHeaderTabUtil.showTabPreBody(tabBuilder);
			//console.log("builder");
			//console.log(tabBuilder);
			tabBuilder.show();
			
			
			
			return true;
		
		
		
		} else {
		
		
			var tabTitleBuilder = tabBuilder.getTitleBuilder();
			tabTitleBuilder.setActive(false);
			
			FeedsHeaderTabUtil.setActiveTabBuilder(null);
			
			return true;
			
		}
		
		return false;
	
	}

	static
	on_tab_clicked(tabBuilder) {
	
		if ( FeedsHeaderTabUtil.returnActiveBuilder() == tabBuilder ) 
			return;
	
		
	
		FeedsHeaderTabUtil.setActive(tabBuilder, true);
		
	
	}

}
