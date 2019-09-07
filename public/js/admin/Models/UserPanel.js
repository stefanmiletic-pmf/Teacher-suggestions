

class UserPanel {
	
	static
	reset(pagination) {
		
		
		$('#user-list').remove();
		$('#users-counter').text("");
		
		
		if ( pagination ) {
			
			
				var page = parseInt(pagination.page);
				var perPage = parseInt(pagination.limit);
				
				var total = parseInt(pagination.total_rows);
				
				var from = Math.min( total, page * perPage);
				
				
				
			
			//console.log(Math.ceil(parseInt(pagination.page)* (parseInt(pagination.total_rows) / parseInt(pagination.total_pages)  ) ));
			
				var $hint_text = $("<div class='hint-text'>Prikaz <b id='pagination-from'>5</b> od ukupno <b id='pagination-total'>25</b> korisnika</div>");
				$hint_text.find("#pagination-from").text(from);
				$hint_text.find("#pagination-total").text(total);
				
				$('#users-counter').append($hint_text);
			
			
		} 
		
		
		
	}
	
	static
	add(dom) {
		
		if ( ! ( $('#user-list')[0]) ) {
			
			var $userTable = $('#user-table');
			var $tbody = $("<tbody id='user-list'></tbody>");
		
			$tbody.append(dom);
			
			$userTable.append($tbody[0]);
			
				
			
		} else {
			
			
			$('#user-list').append(dom);
			
		}
		
		
	}

}

