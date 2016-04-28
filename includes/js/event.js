var Event = {
	ctor: function() {
		Event.loadEvent();
	},

	loadEvent: function() {
		var eventId = Utils.getUrlVars('id');
		
		if(eventId) {
			var apiUrl = 'http://api.songkick.com/api/3.0/events/' + eventId + '.json?apikey=gEWc4D3BUdLW76zt&jsoncallback=?';

			$.getJSON(apiUrl , function(json, textStatus) {
				var currentEvent = (json.resultsPage.results.event);
				$('#event-title').html(currentEvent.performance[0].displayName);
				$('#event-date').html(Utils.formatDate(currentEvent.start.date));
				$('#event-venue').html(currentEvent.venue.displayName);
				$('#event-more-info').attr('href', currentEvent.uri)
			});
		}
	}
}

$(document).ready(Event.ctor);