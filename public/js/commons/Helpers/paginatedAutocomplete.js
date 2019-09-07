$.widget("custom.paginatedAutocomplete", $.ui.autocomplete, {
  options: {
    minLength: 1,
    sourceUrl: '/FeedProvider/search-for-user',
    pageSize: 3,
    source: function (request, response) {
      var self = this;
	  
	  console.log("SOURCE");
	  console.log(request);
	  
	  if ( !request.term ){
		  
		self._resultsContainerElement.css('display', 'none');
		  return;
		  
		  
	  }

      $.ajax({
        url: this.options.sourceUrl,
        type: "GET",
        dataType: "json",
        data: {
          term: request.term,
          page: self._pageIndex+1
        },
        success: function (data) {
          var items = data.data;

          self._totalItems = data.total;

          // Create a menu item for each of the items on the page.                    
          response($.map(items, function (item) {
			  
			  
            return {
              label: item.fullName,
              value: item.fullName,
			  fullName: item.fullName,
			  id: item.id
            }
          }));
        }
      });
    },
    focus: function () {
	  console.log("focus");
      // prevent value inserted on focus
      return false;
    }
  },
  search: function (value, event) {
	  console.log("search");
    // Start a fresh search; Hide pagination panel and reset to 1st page.
    this._pageIndex = 0;
	

    $.ui.autocomplete.prototype.search.call(this, value, event);
  },
  select: function (item) {
	  console.log("select");
	  console.log(item);
    var self = this;

    // Apply the item's label to the autocomplete textbox.        
    this._value(item.label);

    // Keep track of the selected item.
    self._previousSelectedItem = item;
	
	
    self._resultsContainerElement.css('display', 'none');
	
	var $tabAE = Tab.checkIfExists(true, item.id);
					
	if ($tabAE[0]  ) {
			$tabAE.click();
			return;
	}
	
	TabUpdater.fetchUserFeeds("/FeedProvider/show-user-feeds?page=1",parseInt(item.id), item.fullName);
					
	
  },
  close: function (event) {
	  return;
	  console.log("close");
    // Close the pagination panel when the selection pop-up is closed.
    this._paginationContainerElement.css('display', 'none');

    $.ui.autocomplete.prototype.close.call(this, event);
  },
  _previousSelectedItem: null,
  _totalPages: null,
  _totalItems: null,
  _pageIndex: 0,
  _create: function () {
    var self = this;

	console.log("CREATE");

    // Create the DOM structure to support the paginated autocomplete.

    this.element.after("<div class='ui-autocomplete-pagination-results'></div>");
    this._resultsContainerElement = this.element.next("div.ui-autocomplete-pagination-results");
    this._resultsContainerElement.append("<div  class='ui-autocomplete-pagination-container'>" +
      "<button type='button' class='previous-page' style='float: left;'></button>" +
      "<button type='button' class='next-page' style='float: left;'></button>" +
      "<div  class='ui-autocomplete-pagination-details'>" +
      "</div>" +
      "</div>");
    this._paginationContainerElement = this._resultsContainerElement.children("div.ui-autocomplete-pagination-container");
    this._nextPageElement = this._paginationContainerElement.find("button.next-page");
    this._previousPageElement = this._paginationContainerElement.find("button.previous-page");
    this._paginationDetailsElement = this._paginationContainerElement.find("div.ui-autocomplete-pagination-details");

    this._nextPageElement.button({ text: false, icons: { primary: "ui-icon ui-icon-arrowthick-1-e fas fa-arrow-right" } });
    this._previousPageElement.button({ text: false, icons: { primary: "ui-icon-arrowthick-1-w fas fa-arrow-left" } });

    // Append the menu items (and related content) to the specified element.
    if (this.options.appendTo !== null) {
      this._paginationContainerElement.appendTo(this._resultsContainerElement);
      this._resultsContainerElement.appendTo(this.options.appendTo);
      this.options.appendTo = this._resultsContainerElement;
    }
    else {
      this.options.appendTo = this._resultsContainerElement;
    }

    // Hide default JQuery Autocomplete details (want to use our own blurb).
    $(this.element).next("span.ui-helper-hidden-accessible").css("display", "none");

    // Event handler(s) for the next/previous pagination buttons.
    this._on(this._nextPageElement, { click: this._nextPage });
    this._on(this._previousPageElement, { click: this._previousPage });

    // Event handler(s) for the autocomplete textbox.
    this._on(this.element, {
      blur: function (event) {
        // When losing focus hide the pagination panel
		
		
		self._resultsContainerElement.css('display','none' );
        this._pageIndex = 0;
      },
      paginatedautocompleteopen: function (event) {
        // Autocomplete menu is now visible.
        // Update pagination information.

        var self = this,
            paginationFrom = null,
            paginationTo = null,
            menuOffset = this.menu.element.offset();

        self._totalPages = Math.ceil(self._totalItems / self.options.pageSize);

        paginationFrom = self._pageIndex * self.options.pageSize + 1;
        paginationTo = ((self._pageIndex * self.options.pageSize) + self.options.pageSize);

        if (paginationTo > self._totalItems) {
          paginationTo = self._totalItems;
        }

        // Align the pagination container with the menu.
       // this._paginationContainerElement.offset({ top: menuOffset.top, left: menuOffset.left });

        // Modify the list generated by the autocomplete so that it appears below the pagination controls.
        this._resultsContainerElement
        .find("ul").prependTo(".ui-autocomplete-pagination-results")
        // .css({
          // "padding-top": "60px",
          // "min-width": "300px",
          // "z-index": "100"
        // });


		if (3 >= self._totalItems) {
			
			 this._paginationContainerElement.css('display', 'none');
			
		} else {
			
			
			 this._paginationContainerElement.css('display', 'block');
			 
			this._paginationDetailsElement.html("Prikaz " + paginationFrom.toString() + " - " + paginationTo.toString() + "|Ukupno " + self._totalItems.toString() + ".");
			
		}
      }
    });

    // Event handler(s) for the pagination panel.
    this._on(this._paginationContainerElement, {
      mousedown: function (event) {
        // The following will prevent the pagination panel and selection menu from losing focus (and disappearing).
        // Prevent moving focus out of the text field
        event.preventDefault();

        // IE doesn't prevent moving focus even with event.preventDefault()
        // so we set a flag to know when we should ignore the blur event
        this.cancelBlur = true;
        this._delay(function () {
          delete this.cancelBlur;
        });
      }
    });

    // Now we're going to let the default _create() to do it's thing. This will create the autocomplete pop-up selection menu.
    $.ui.autocomplete.prototype._create.call(this);

    // Event handler(s) for the autocomplete pop-up selection menu.
    this._on(this.menu.element, {
      menuselect: function (event, ui) {
        var item = ui.item.data("ui-autocomplete-item");    // Get the selected item.

        this.select(item);
      }
    });
  },
  _nextPage: function (event) {
	  
	  console.log("NEXT_PAGE");
	  console.log("this._pageIndex: " + this._pageIndex);
	  console.log("this._totalPages-1: " + (this._totalPages-1));
    if (this._pageIndex < this._totalPages - 1) {
      this._pageIndex++;
      $.ui.autocomplete.prototype._search.call(this, this.term);
    }
  },
  _previousPage: function (event) {
	  console.log("_previousPage");
    if (this._pageIndex > 0) {
      this._pageIndex--;
      $.ui.autocomplete.prototype._search.call(this, this.term);
    }
  },
  _change: function (event) {
	  console.log("CHANGE");
    // Clear the textbox if an item wasn't selected from the menu.
    if (((this.selectedItem === null) && (this._previousSelectedItem === null)) ||
        (this.selectedItem === null) && (this._previousSelectedItem !== null) && (this._previousSelectedItem.label !== this._value())) {

      // Clear values.
      this._value("");
    }

    $.ui.autocomplete.prototype._change.call(this, event);
  },
  _destroy: function () {
	  console.log("_destroy");
    this._paginationContainerElement.remove();
    this._resultsContainerElement.remove();
    $.ui.autocomplete.prototype._destroy.call(this);
  },
  __response: function (content) {
	  console.log("__response");
	  
    var self = this;
    self._totalItemsOnPage = content.length;
	if ( self._totalItemsOnPage <= 0 ) {
		self._resultsContainerElement.css('display','none' );
	} else {
		self._resultsContainerElement.css('display', 'block');
		self._paginationContainerElement.css('display','block' );
	}
    //self._paginationContainerElement.css('display', self._totalItemsOnPage > 0 ? 'block' : 'none');
	
	// if ( self._totalItemsOnPage <= 0 ) {
		// self._paginationContainerElement.css('visibility','hidden' );
	// } else {
		// self._paginationContainerElement.css('visibility','visible' );
	// }
	
	
    $.ui.autocomplete.prototype.__response.call(this, content);
  }
});

//$.widget.bridge("paginatedAutocomplete", $.paginatedAutocomplete);