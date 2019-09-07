
var last_pagination = null;


class Pagination {
	
		static
		getLastPagination() {
			
			return last_pagination;
			
		}
		
		static
		reset() {
			
			
			//console.log("REMOVE");
			var pagination_divs = $('.pagination-wrapper');
			pagination_divs.remove();
			
			
		}
	
		resetPaginationDiv() {
			
			console.log("resetPaginationDiv");
			console.log(this.paginationDom[0]);
			var div = this.paginationDom[0];
			div.parentNode.removeChild(div);
			
		}
	
		constructor(pagination, addPaginationCallback, onClickCallback, is_publish_tab) {
			
			//console.log("CONSTRUCT");
			//console.log(pagination);
			
			
			last_pagination = pagination;
			
			this.pagination = pagination;
			this.paginationDom = null;
			
			if ( pagination['total_pages'] > 1 ){
				
				
				
				this.addPaginationCallback = addPaginationCallback;
				
				this.paginationDom = $("<div class='" + (is_publish_tab ? " publish_pagination " : "") + "container pagination-wrapper' style='float:left'></div>");
				
				this.paginationUL = $("<ul class='pagination pagination-sm justify-content-center'></ul>");
				
				
				
				
				this.fast_backward = $("<li class='fast-backward page-item'></li>");
				this.fast_backward_anchor = $("<a class='page-link' href='javascript:void(0)'><<</a>");
				this.fast_backward.append(this.fast_backward_anchor);
				
				
				if ( pagination.page <= 1 ) 
					this.fast_backward.addClass('disabled');
				
				this.fast_backward_anchor.attr('data-href', pagination.controller + '?page=1');
				
				
				
				this.paginationUL.append(this.fast_backward);
				
				
				
				this.backward = $("<li class='backward page-item'></li>");
				this.backward_anchor = $("<a class='page-link' href='javascript:void(0)'><</a>");
				this.backward.append(this.backward_anchor);
				
				
				this.paginationUL.append(this.backward);
			
					
			
				if ( pagination.page <= 1 ) 
					this.backward.addClass('disabled');
				else {
					
					var page = 1;
					if ( pagination.page > 1 )
						page =  pagination.page-1
					
				}	
				this.backward_anchor.attr('data-href', pagination.controller + '?page=' + page); 
					
				
				
				
				for ( var i = pagination.start; i <= pagination.end; ++i ) {
				
					var li = $("<li class='page-ith page-item " +  
										((i == pagination.page) ? "active" : "")  + " '></li>");
										
					var a = $("<a class='page-link'> </a>");
					a.attr('data-href',  pagination.controller + "?page=" +  i );
					a.attr('href', 'javascript:void(0)');
					a.text(i);
					li.append(a);
					
					this.paginationUL.append(li);
					
					
				}
				
				
				
				this.forward = $("<li  class='forward page-item'></li>");
				this.forward_anchor = $("<a class='page-link' href='javascript:void(0)'>></a>");
				this.forward.append(this.forward_anchor);
				
				
					
				if ( pagination.page >= pagination.total_pages ) 
					this.forward.addClass('disabled');
				
				
				this.forward_anchor.attr('data-href', pagination.controller + '?page=' + (parseInt(pagination.page)+1)); 
					
				
				
				
				this.paginationUL.append(this.forward);
				
				
				this.fast_forward = $("<li class='fast-forward page-item'></li>");
				this.fast_forward_anchor = $("<a class='page-link' href='javascript:void(0)'>>></a>");
				this.fast_forward.append(this.fast_forward_anchor);
				
				
				if ( pagination.page >= pagination.total_pages ) {
					
					this.fast_forward.addClass('disabled');
					
				}
				
				this.fast_forward_anchor.attr('data-href', pagination.controller + '?page=' + pagination.total_pages);
				
				
				
				this.paginationUL.append(this.fast_forward);
			
			
				this.paginationDom.append(this.paginationUL);
				
				
				this.paginationDom.find('li a').click(function(e){
					
					
					onClickCallback.call(this);
					window.scrollTo(0, 300);
					
				});
			
			}
			
			
			
		}
		
		show() {
			
			if ( this.paginationDom ) {
			
				this.addPaginationCallback(this.paginationDom[0]);
			}
			
			
		}
		
		static 
		resetPublishTab() {
			
			var pagination_divs = $('.publish_pagination');
			pagination_divs.remove();
			
		}
			
	
}