var Utils = {
	ctor: function() {
		Utils.loadHeader();
		Utils.loadFooter();
		Utils.bindScroll();
	},

	loadHeader: function() {
		$('#header').load('partials/header.html', function() {
			// Bind after form HTML has been loaded
			Utils.checkIfLoggedIn();
			Utils.bindLoginForm($('#modal-login-form'));
		});
	},

	loadFooter: function() {
		$('#footer').load('partials/footer.html');	
	},

	loadCountriesCites: function() {
		var countriesInput = $('#form-search-country');
		var citiesInput = $('#form-search-city');

		if(Utils.isPage('results')) { 
			countriesInput = $('#form-search-results-country');
			citiesInput = $('#form-search-results-city');
		}

		$.getJSON('json/countries-cities.json', function(json, textStatus) {
			var countries = Object.keys(json);

			countriesInput.typeahead({
				source: countries,
				afterSelect: function(selectedCountry) {
					// clear autocomplete to load new cities
					citiesInput.val('');
					citiesInput.typeahead('destroy');
					citiesInput.addClass('no-pointer-events');

					// while loading
					citiesInput.attr('placeholder', 'Loading Cities...');
					citiesInput.typeahead({
						source: json[selectedCountry],
						afterSelect: function(selectedCity) {
							var apiUrl = 'http://api.songkick.com/api/3.0/search/locations.json?query=' + selectedCity + '&apikey=gEWc4D3BUdLW76zt&jsoncallback=?';
							
							$.getJSON(apiUrl, function(json, textStatus) {								
								if(json.resultsPage.totalEntries < 1) {
									$('input[name=city]').addClass('input-error');
									bindClearError();
								}
								else {
									var cityId = json.resultsPage.results.location[0].metroArea.id;
									$('input[name=city]').removeClass('input-error');
									$('.form-city-id').val(cityId);
								}
							});
						}
					});

					// after done loading new cities
					citiesInput.removeClass('no-pointer-events');
					citiesInput.removeClass('input-error'); // if field has been marked as error
					citiesInput.attr('placeholder', 'City');
				}
			});
		});
	},

	eventCreator: function(currentEvent) {		
		var HTML = '';
		HTML += '<div class="col-md-6 col-lg-4">'
			 +  	'<div class="card card-block back-white event-preview" id="event-' + currentEvent.id + '">'
			 +			'<div class="card-img-top-crop">'
			 +			'</div>'
			 +  		'<h4 class="card-title">' + currentEvent.performance[0].displayName + '</h4>'
			 +  		'<p class="card-text">' + Utils.formatDate(currentEvent.start.date) + ' @ <span class="event-preview-venue">' + currentEvent.venue.displayName + '</span><br>'
			 +  		 currentEvent.start.time + '</p>'
			 +  		'<a href="event.html?id=' + currentEvent.id + '" class="btn btn-primary card-link">Details <i class="fa fa-long-arrow-right"></i></a>'
			 +			'<div class="event-preview-top-triangle"> <i class="fa fa-ticket"></i> </div>'
			 +  	'</div>'
			 +  '</div>';
		return HTML;
	},

	loadEventsImages: function(allEvents) {
		for(var i = 0; i < allEvents.length; i++) {
			(function(i) { // using anonymous function for getJson to be used for each index
				var currentEvent = allEvents[i];
				var currentEventArtist = allEvents[i].performance[0].artist.displayName;
				currentEventArtist = currentEventArtist.split(' ').join('+');
				var currentEventImage = $('#event-' + currentEvent.id + ' .card-img-top-crop');

				$.bingSearch({
				    query: currentEventArtist + ' Music', // Add 'Music' to search string to improve accuracy
				    appKey: 'BJGjSR3WlsUY2ZbSyH7U1kxIVwrnz3o0MJGVKsMsWyM',
				    urlBase: 'server/searchproxy.php',
				    pageSize: 1,
				    searchResultIterator: function(data) {
				    	// Change placeholder background for event
				    	currentEventImage.css('background-image', 'url("' + data.Media + '")');
				    	currentEventImage.css('background-size', 'cover');
				    	currentEventImage.css('background-position', 'top');
				    }
				});
			})(i);
		}
	},

	checkIfLoggedIn: function() {
		var session = localStorage.getItem('session');

		if(session) {
			$('#nav-logout').show();
			$('#nav-admin').show();
			$('#nav-login').hide();

			$('#nav-logout').click(function() {
				localStorage.removeItem('session');
				location.reload();
			})
		}
		else {
			if(Utils.isPage('admin') || Utils.isPage('add-featured') || Utils.isPage('edit-featured')) {
				// Exit admin pages if not logged in
				location.href = 'index.html';
			}
		}
	},

	bindEventClick: function() {
		$('.event-click').unbind('click');
		$('.event-click').click(function() {
			var eventId = $(this).attr('data-event-id');
			
			$.ajax({
				method: 'GET',
				url: 'server/event-new-click.php?id=' + eventId,
			})
			.success(function(json) {
				// Go to event page after documenting click
				location.href = 'featured-event.html?id=' + eventId;
			});
		});
	},

	bindSearchForm: function(form) {
		form.submit(function(event) {
			event.preventDefault();
			var formId = $(this).attr('id');
			var data = $(this).serializeArray();
			var dataString = $(this).serialize();
			var isValid = Utils.validateData(formId, data);

			if(isValid) {
				location.href = 'results.html?' + dataString;
			}
		});
	},

	bindLoginForm: function(form) {
		$('#modal-login-form input').keydown(function() {
			$('#login-status').html('');
			$('#login-status').css('color', 'auto');
		});

		form.submit(function(event) {
			event.preventDefault();
			var formId = $(this).attr('id');
			var data = $(this).serializeArray();
			var dataString = $(this).serialize();
			var isValid = Utils.validateData(formId, data);

			var formData = {
				email: data[0].value,
				password: data[1].value
			}

			var jsonData = JSON.stringify(formData);

			if(isValid) {
				$.ajax({
					url: 'server/login.php',
					type: 'POST',
					dataType: 'json',
					data: jsonData
				})
				.success(function(json) {
					var isValidLogin = json;
					if(isValidLogin) {
						var session = Utils.generateUUID();
						localStorage.setItem('session', session);
						location.reload();
					}
					else {
						$('#login-status').html('Sorry, please try again');
						$('#login-status').css('color', 'red');
					}
				})
			}
		});
	},

	bindDatePicker: function() {
		$('.datepicker-start').daterangepicker({
			singleDatePicker: true,
			minDate: new Date()
		});

		var datePickerEndSetting = {
			singleDatePicker: true,
			startDate: moment($('.datepicker-start').val()).add(7, 'days'),
			minDate: moment($('.datepicker-start').val()).add(1, 'days')
		}

		$('.datepicker-end').daterangepicker(datePickerEndSetting);

		$('.datepicker-start').on('apply.daterangepicker', function(event, picker) {
			$('.datepicker-end').daterangepicker(datePickerEndSetting);
		});
	},

	bindScroll: function() {
		$(window).scroll(function() {
			var scrollPosition = $(window).scrollTop();

			if(scrollPosition > 25) {
				$('.navbar').addClass('back-aqua');
				$('.part-img').hide();
			}
			else {
				$('.navbar').removeClass('back-aqua');
				$('.part-img').show();
			}
		});
	},

	getUrlVars: function(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");

       for(var i=0; i < vars.length; i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable) {
                   return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
               }
       }

       return false;
	},

	isPage: function(pageName) {
		if(location.href.indexOf(pageName) != -1) {
			return true;
		}
		else return false;
	},

	validateData: function(formId, data) {
		var isValid = true;

		for(var i = 0; i < data.length; i++) {
			if(data[i].value.length < 1) {
				isValid = false;
				Utils.showError(formId, data[i])
			}
		}

		return isValid;
	},

	showError: function(formId, input) {
		$('#' + formId + ' input[name=' + input.name + ']').addClass('input-error');

		if(input.name.indexOf('textarea') != -1) { // input is textarea
			$('#' + formId + ' textarea[name=' + input.name + ']').addClass('input-error');
		}

		Utils.bindClearError();
	},

	bindClearError: function() {
		$('.input-error').keydown(function() {
			$(this).removeClass('input-error');
		});
	},

	formatDate: function(date) {
		return moment(date).format('DD/MM/YYYY');
	},

	generateUUID: function() { // Generate Session ID
	    var d = new Date().getTime();
	    if(window.performance && typeof window.performance.now === "function"){
	        d += performance.now();;
	    }
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	}
}

$(document).ready(Utils.ctor);