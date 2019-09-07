var user_counter = 1;

class UserBuilder {


	static
	reset() {
		
		user_counter = 1;
		
	}

	// **director method
	static
	director(user_row_conf) {
	
			var userBuilder = new UserBuilder(user_row_conf);
			
			return userBuilder;
	}
		

	

	static 
	domTemplate() {
	
			var htmlToParse = "<table><tr class='user-row fade-in'>                        <td class='user-row-number'> 1</td>                        <td class='user-row-name-image'><span><img src='/examples/images/avatar/1.jpg' class='avatar' alt='Avatar'> <span class='user-row-name'>Michael Holz</span></span></td>   <td class='user-row-email'></td>                     <td class='user-row-created-at'>04/10/2013</td>                        						<td class='user-row-status'><span class='status user-row-status-icon'>&bull;</span> <span class='user-row-status-text'> Active </span></td>                        <td class='user-row-department'>04/10/2013</td>                        <td class='user-row-cabinet'>04/10/2013</td>												<td>							<a href='#' class='fa fa-trash' title='Obriši' data-toggle='tooltip'></a>						</td>                    </tr></table>";
			
			
			

			var parser = new DOMParser();
			var el = parser.parseFromString(htmlToParse, "text/html");
			
			
			////console.log(el);
			var user_row = el.getElementsByClassName("user-row")[0];
			
			
			return user_row;
	
	}
	
	

	constructor( user_row_conf) {
		
		var last_pagination = Pagination.getLastPagination();
		//console.log("LAST:");
		
		//console.log(last_pagination);
		var user_number_data = user_counter++;
		if ( last_pagination)
		 user_number_data +=  parseInt(last_pagination.offset);
	 
		var user_id = user_row_conf['id'];
		var user_name_data = user_row_conf['fullName'];
		var user_image_data = user_row_conf['profile_image_path'];
		var user_email_data = user_row_conf['email'];
		var user_created_at_data = user_row_conf['createdAt'];
		var user_status_data = user_row_conf['status'];   
		var user_department_data = user_row_conf['department'];
		var user_cabinet_data = user_row_conf['cabinetName'];      
	
		
		
		this.userDOM = UserBuilder.domTemplate();
		
		var $userDOM = $(this.userDOM);
		
		////console.log(this.userDOM);
		
		
		$userDOM.find(".user-row-number").text(user_number_data);
		
		
		var $uni = $userDOM.find(".user-row-name-image")
		$uni.find('.avatar').attr("src", "\\images\\" + (user_image_data ? user_image_data : "profiledefault.png"));
		$uni.find('.user-row-name').text(user_name_data);
		
		
		
		
		$userDOM.find(".user-row-email").text(user_email_data);
		
		
		$userDOM.find(".user-row-created-at").text(UserBuilder.timeSince(parseInt(user_created_at_data)));
		
		
		var $us = $userDOM.find(".user-row-status");
		$us.find(".user-row-status-icon");
		if ( parseInt(user_status_data) === 1 ) {
			
		$us.find(".user-row-status-text").text("Aktivan");
			$us.find(".user-row-status-icon").addClass("status-active");
			
		} else {
			
		$us.find(".user-row-status-text").text("Neaktivan");
			$us.find(".user-row-status-icon").addClass("status-unactive");
			
			
		}
		
		$userDOM.find(".user-row-department").text(user_department_data);
		
		
		$userDOM.find(".user-row-cabinet").text(user_cabinet_data);
		

		
		
		
		
		
		var $trash = $userDOM.find(".fa-trash");
		
		var userDOM_arg = this.userDOM;
		
		$trash.click(function() {
			
			
			var onSuccessCallback = function() {
				
					
				userDOM_arg.parentNode.removeChild(userDOM_arg);
				
				var $pagination = $('.pagination');
				
				if ($pagination[0]){
					
					
					$pagination.find("li.active a").first().click();
					
				} else {
					
					var from = parseInt($("#pagination-from").text());
					var total = parseInt($("#pagination-total").text());
					
					if ( from-1 === 0  ){
						
						$("#users-counter").html("");
						
					} else {
						
						$("#pagination-from").text(from-1);
						$("#pagination-total").text(total-1);
						
					}
					
					
					
				}
				
				
			}
			
			UserUpdater._on_delete(user_id, user_name_data, $userDOM , onSuccessCallback);
			
			
			
		});
		
		
		
		
	
	}
	



	build() {
	
		return this.userDOM;
	
	}
	
	// unix timestamp
	static
	timeSince(timeStamp) {
		
		timeStamp = parseInt(timeStamp*1000);
		
		timeStamp = new Date(timeStamp);
		
		var now = new Date();
		var secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
		
		
			
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
			
			var day = timeStamp.getDate();
			var month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
			var year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
			return day + " " + month + year;
		}
	}
	
}

