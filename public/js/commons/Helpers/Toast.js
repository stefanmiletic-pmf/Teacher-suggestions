
class Toast {
	
		
		static
		makeToast(id, title, body, addCallback, onClickCallback) {
		
		
			
			var $toast = $("<div class='toast' role='alert' aria-live='assertive' aria-atomic='true' data-delay='5000'></div>");
			
			var $toast_header = $("<div class='toast-header'></div>");
			
			
			var $toast_img= $("<div class='rounded mr-2'>");
			
			var $toast_title= $("<strong class='mr-auto'></strong>");
			$toast_title.text(title);
			
			
			
			
			var $toast_timeCreated = $("<small class='badge badge-primary'>Sveže</small>");
			
			
			var $toast_close_btn = $("<button type='button' class='ml-2 mb-1 close' data-dismiss='toast' aria-label='Close'></button>");
			
			var $toast_close_btn_sign = $("<span aria-hidden='true'>&times;</span>");
			$toast_close_btn.append($toast_close_btn_sign);
			
			
			var $toast_body = $("<div class='toast-body'></div>");
			$toast_body.text(body);
			
			$toast_body.click(function() {
				
				
				if ( onClickCallback )
					onClickCallback();
				else{
					
					
					var feed_id = id;
					var $tabAE = Tab.checkIfExists(false, feed_id);
							
							
					if ($tabAE[0]  ) {
				
							
				
							$tabAE.click();
							return;
					}
			
				
					TabUpdater.fetchTab(feed_id);
				
				}
			});
			
			$toast_header.append($toast_img);
			$toast_header.append($toast_title);
			$toast_header.append($toast_timeCreated);
			$toast_header.append($toast_close_btn);
			
			
			
			
			$toast.append($toast_header);
			$toast.append($toast_body);
			
			
			addCallback($toast[0]);
			
			$toast.toast('show');
			
			$('#myToast').on('hidden.bs.toast', function () {
				  console.log('HIDDEN');
			});
			
			
		}
	
			
	
}