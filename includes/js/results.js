var Results = {
	ctor: function() {
		Utils.loadCountriesCites();
		Utils.bindDatePicker();
		Results.loadResultsSearchFormVars();
		Results.loadEvents($('#events'));
		Results.bindResultsSort($('#results-sort-btn'));
		Results.bindResultsSortMethods($('#results-sort-tooltip li'));
	},

	events: '', // store events for sort without calling api again

	loadEvents: function(eventsDiv) {
		var cityId = $('#form-search-results-city-id').val();
		var apiUrl = 'http://api.songkick.com/api/3.0/events.json?location=sk:' + cityId + '&apikey=gEWc4D3BUdLW76zt&jsoncallback=?';

		$.getJSON(apiUrl, function(json, textStatus) {
			var allEvents = json.resultsPage.results.event;

			// Get all event results pages
			if(json.resultsPage.totalEntries > 50) {
				var callsToMake = Math.floor((json.resultsPage.totalEntries - 50) / 50);
				for(var i = 2; i < callsToMake; i++) {
					apiUrl = 'http://api.songkick.com/api/3.0/events.json?location=sk:' + cityId + '&apikey=gEWc4D3BUdLW76zt&page=' + i + '&jsoncallback=?';			
					$.getJSON(apiUrl, function(json, textStatus) {
						$.each(json.resultsPage.results.event, function() {
							allEvents.push($(this)[0]);
						})
					});
				}
			}

			allEvents = Results.filterEventsByDate(allEvents);
			allEvents.length = 12
			allEvents.length = allEvents.length > 12 ? 12 : allEvents.length;

			for(var i = 0; i < allEvents.length; i++) {
				var currentEvent = Utils.eventCreator(allEvents[i]);
				eventsDiv.append(currentEvent);
			}

			Utils.loadEventsImages(allEvents);
		});
	},

	reloadEvents: function() { // load local events after sort
		var eventsDiv = $('#events');
		var allEvents = Results.events;
		allEvents.length = allEvents.length > 12 ? 12 : allEvents.length;
		eventsDiv.html('');

		for(var i = 0; i < allEvents.length; i++) {
			var currentEvent = Utils.eventCreator(allEvents[i]);
			eventsDiv.append(currentEvent);
		}

		Utils.loadEventsImages(allEvents);
	},

	filterEventsByDate: function(allEvents) {
		var start = new Date($('.datepicker-start').val());
		var end = new Date($('.datepicker-end').val());
		var filteredEvents = [];
		
		for(var i = 0; i < allEvents.length; i++) {
			var eventDate = new Date(allEvents[i].start.date);
			var isInDateRange = moment(eventDate).isBetween(start, end);
			if(isInDateRange) {
				filteredEvents.push(allEvents[i]);
				allEvents[i].index = i;
			}
		}
		Results.events = filteredEvents; // save events for sort later
		return filteredEvents;
	},

	loadResultsSearchFormVars: function() {
		$('#form-search-results-country').val(Utils.getUrlVars('country'));
		$('#form-search-results-city').val(Utils.getUrlVars('city'));
		$('#form-search-results-date-range-start').val(Utils.getUrlVars('date-range-start'));
		$('#form-search-results-date-range-end').val(Utils.getUrlVars('date-range-end'));
		$('#form-search-results-city-id').val(Utils.getUrlVars('city-id'));
		$('#results-fb-share').attr('href', 'http://www.facebook.com/sharer/sharer.php?u=' + location.href);
	},

	bindResultsSort: function(sortBtn) {
		sortBtn.click(function() {
			$('#results-sort-tooltip').toggle();
		});
	},

	bindResultsSortMethods: function(sortMethod) {		
		sortMethod.click(function() {
			$('.sort-method').removeClass('active');
			$(this).addClass('active');
			var sortMethod = $(this).attr('data-sort-method');

			if(sortMethod == 'upcoming') {
				Results.events.sort(function(event1, event2) {
					return event1.index - event2.index;
				});
			}
			else { // sortMethod = popularity
				Results.events.sort(function(event1, event2) {
					return event2.popularity - event1.popularity;
				});
			}
			$('#results-sort-tooltip').toggle();
			Results.reloadEvents();
		})
	}
}

$(document).ready(Results.ctor);