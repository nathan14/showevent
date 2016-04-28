var Index = {
	ctor: function() {
		Utils.loadCountriesCites();
		Utils.bindDatePicker();
		Utils.bindScroll();
		Utils.bindSearchForm($('#form-search-main'));
		Index.loadFeaturedEvents();
		Index.loadNearbyEvents($('#events'));
	},

	featuredEvents: '',

	loadFeaturedEvents: function() {
		$.ajax({
			method: 'GET',
			url: 'server/get-all-events.php'
		})
		.success(function(json) {
			Index.featuredEvents = json;
			Index.loadCalendar($('#calendar'));
			Index.loadCarousel($('#featured-events-carousel'));
		});
	},

	loadNearbyEvents: function(eventsDiv) {
		var apiUrl = 'http://api.songkick.com/api/3.0/events.json?location=clientip&apikey=gEWc4D3BUdLW76zt&jsoncallback=?';
		$.getJSON(apiUrl, function(json, textStatus) {
			var allEvents = (json.resultsPage.results.event);

			allEvents.length = allEvents.length > 12 ? 12 : allEvents.length;
			
			for(var i = 0; i < allEvents.length; i++) {
				var currentEvent = Utils.eventCreator(allEvents[i]);
				eventsDiv.append(currentEvent);
			}

			Utils.loadEventsImages(allEvents);
			Utils.bindEventClick();
		});
	},

	loadCalendar: function(calendarDiv) {
		var featuredEvents = Index.formatToCLNDR(Index.featuredEvents);

		calendarDiv.clndr({
			events: featuredEvents,
			clickEvents: {
				click: function(target) {
					$('#modal-calendar-event .modal-title').html(target.events[0].title);
					$('#modal-calendar-event .event-click').attr('data-event-id', target.events[0].id);
					$('#modal-calendar-event').modal('show');
				}
			}
		});

		Utils.bindEventClick();
	},

	formatToCLNDR: function(json) { // formats events data to fit CLNDR plugin format
		var formatedJSON = [];

		for(var i = 0; i < json.length; i++) {
			var newEvent = {
				date: json[i].date,
				title: json[i].performer,
				id: json[i].id,
				index: i,
				url: '#'
			}
			formatedJSON.push(newEvent);
		}

		return formatedJSON;
	},

	loadCarousel: function(carouselDiv) {
		var featuredEvents = Index.featuredEvents;

		var indicators = $('.carousel-indicators');
		var events = $('.carousel-inner');

		indicators.html('');
		events.html('');

		for(var i = 0; i < 5; i++) { // show 5 events
			if(i == 0) { // handle first carousel item
				indicators.append('<li data-target="#featured-events-carousel" data-slide-to="' + i + '" class="active"></li>');
			}
			else {
				indicators.append('<li data-target="#featured-events-carousel" data-slide-to="' + i +'" ></li>');
			}
			
			events.append(Index.carouselItemCreator(featuredEvents[i], i));
		}
	},

	carouselItemCreator: function(featuredEvent, index) {
		var HTML = '';
		var firstEvent = '';

		if(index == 0) {
			firstEvent = 'active';
		}

		HTML += '<div class="carousel-item ' + firstEvent + '">'
			 +		'<img src="' + featuredEvent.imgurl + '" alt="' + featuredEvent.performer +'">'
			 +		'<div class="carousel-caption">'
			 +  		'<h4>' + featuredEvent.performer + ' @ ' + featuredEvent.venue + '</h4>'
			 +  		'<p>' + moment(featuredEvent.date).format('DD/MM/YYYY') + '</p>'
			 + 		'</div>'
			 +  '</div>';

		return HTML;
	} 
}

$(document).ready(Index.ctor);