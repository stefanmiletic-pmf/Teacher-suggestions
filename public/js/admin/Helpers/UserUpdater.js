
class UserUpdater {

	static 
	fetchUsersPage(url, data, addUserCallback, addPaginationHeaderCallback, addPaginationFooterCallback, onClickCallback) {
	
		$.ajax({
			  method: "GET",
			  url: url,
			  data: data,
			  success: function( msg ) {
				
						
						//	//console.log(msg);
							
						// $('.debug').html(msg);
						if ( msg.indexOf('DOCTYPE') !== -1 ){
							var win = window.open('/', '_parent');
							win.document.write(msg);
							return;
						}
						
						if ( msg === 'error' ) {
							
							
							//console.log(msg);
							Error.add( "Akcija [Prikazivanje korisnika] nije izvršena.");
							return;
						}
						
						
						
						var parsed = jQuery.parseJSON(msg);
						var users = parsed.users;
						
						//console.log(parsed);
						
						if ( !users ){
							
							
							UserUpdater.setBlur($("#user-list"));
							UserUpdater.setBlur($("#users-counter"));
							
							Notification.addNotif("[Prikazivanje korisnika]", "Ne postoje korisnici");
							return;
							
						}
						
						var pagination = parsed.pagination;
						
						////console.log("LELELELLE");
						UserPanel.reset(pagination);
						Pagination.reset();
						UserBuilder.reset();
			
							
						if ( pagination && pagination.total_pages > 1) {
							if ( addPaginationHeaderCallback)
							new Pagination(pagination, addPaginationHeaderCallback, onClickCallback).show();
						
						
							if ( addPaginationFooterCallback)
								new Pagination(pagination, addPaginationFooterCallback, onClickCallback).show();
						
						}
						
						
						
						if ( users.length != 0 ){
							
							UserUpdater.unsetBlur($("#user-list"));
							UserUpdater.unsetBlur($("#users-counter"));
								for ( var i = 0; i < users.length; ++i ) {
		
									var user = users[i];
									
									addUserCallback( user);
								}
						} else {
							
							
							UserUpdater.setBlur($("#user-list"));
							UserUpdater.setBlur($("#users-counter"));
							Notification.addNotif("[Prikazivanje korisnika]", "Ne postoje korisnici");
							
						}
					
				
					
					
				},error: function( msg ) {
				
						$('.debug').html(msg.response);
						console.log(msg);
						Error.add("Akcija [Preuzimanje novosti] nije izvršena.");
					
					
				}
					
			});
					
				
	}
	
	
	static
	fetchDepartmentsGroupBy(onSuccessCallback) {
		
			$.ajax({
			  method: "GET",
			  url: "/Admin/departments-group-by",
			  success: function( msg ) {
				
						//console.log(msg);
				
						//$('.debug').html(msg);
						
						
						var parsed = jQuery.parseJSON(msg);
						
						onSuccessCallback(parsed);
				
				
			  }, error: function(msg) {
				  
					Error.add("Akcija [Sortiranje departmana - graf] nije izvršena.");
					$('.debug').html(msg.responseText);
				  
			  }
			  
			});
		
	}
	
	static
	_on_delete(user_id, user_name, $userInfoDiv, onSuccessCallback) {
	
	
		
		UserUpdater.setBlur($userInfoDiv);
	
		function accept() {
			
	
				
				
					$.ajax({
					  method: "POST",
					  url: "/Admin/delete-user",
					  data: {
					  
						id: user_id
					  
					  },success: function( msg ) {
						
							//$('.debug').html(msg);
							
							if ( msg == "success" ) {
							
								Notification.addNotif("[brisanje korisnika]", "Uspešno je izbrisan korisnik " + user_name + ".");
								
								onSuccessCallback();
							
							} else {
								
								Notification.addNotif("[brisanje korisnika]", "Akcija [brisanje korisnika] nije izvršena.");
							
							console.log(msg);
								
							}
							
							//console.log(msg);
						
					  }, error: function(msg) {
						  
							$('.debug').html(msg.responseText);
							Notification.addNotif("[brisanje korisnika]", "Akcija [brisanje korisnika] nije izvršena.");
							
							console.log(msg);
						  
					  }
					});
			
				
			
		}
		
		function decline() {
		
			UserUpdater.unsetBlur($userInfoDiv);
				
		}
		
		if (confirm("Obriši korisnika " + user_name + ".")) {
					
					accept();
			
		} else {
				
					decline();
				
				}
		
		
		
	}
	
	
	static
	setBlur($dom) {
		
		if ( !$dom[0] )
			return;
		
		$dom.addClass("empty");
		var blurProp = "blur(2px)"

		$dom
			.css({
			   'filter'         : blurProp,
			   '-webkit-filter' : blurProp,
			   '-moz-filter'    : blurProp,
			   '-o-filter'      : blurProp,
			   '-ms-filter'     : blurProp
			});
		
	}
	
	static
	unsetBlur($dom) {
		
		if ( !$dom[0] )
			return;
		
		$dom.removeClass("empty");
			var blurProp = "none"
  
			$dom
				.css({
				   'filter'         : blurProp,
				   '-webkit-filter' : blurProp,
				   '-moz-filter'    : blurProp,
				   '-o-filter'      : blurProp,
				   '-ms-filter'     : blurProp
				});
		
		
	}


	static
	exportTable(url, extension) {
		
			$.ajax({
				type:'GET',
				url: url,
				dataType:'json',
				success: function(data){
					
					var $a = $("<a>");
					$a.attr("href",data.file);
					$("body").append($a);
					$a.attr("download","Korisnicki izvestaj." + extension);
					$a[0].click();
					$a.remove();
				},
				error: function(data) {
					
					console.log(data.responseText);
					
					Error.add("Akcija [Eksportovanje tabele] nije izvršena.");
					//$('.debug').html(data.responseText);
					
					
				}
				
			});
		
		
	}



}

