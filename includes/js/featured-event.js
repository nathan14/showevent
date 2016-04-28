var FeaturedEvent = {
	ctor: function() {
		FeaturedEvent.loadEvent();
	},

	loadEvent: function() {
		var eventId = Utils.getUrlVars('id');

		if(eventId) {
			$.ajax({
				method: 'GET',
				url: 'server/get-event-by-id.php?id=' + eventId,
			})
			.success(function(json) {
				var currentEvent = json[0];
				$('#event-title').html(currentEvent.performer);
				$('#event-date').html(Utils.formatDate(currentEvent.date));
				$('#event-venue').html(currentEvent.venue);
				$('#event-content').html(currentEvent.content);
				$('#event-performer-website').attr('href', currentEvent.website);
				$('#event-jumbotron').css('background-image', 'url("' + currentEvent.imgurl + '")');
				$('#event-jumbotron').css('background-position', 'top');

				// Check if tickets are avillable for this event
				if(currentEvent.buyTickets) {
					$('#event-performer-buy-tickes').attr('href', currentEvent.buyTickets);
				}
				else {
					$('#event-performer-buy-tickes').hide();
				}

				$.ajax({
					method: 'GET',
					url: 'server/get-hottest-events.php',
				})
				.success(function(json) {
					var hottestEvents = json;
					console.log(hottestEvents);
					for(var i = 0; i < hottestEvents.length; i++) {
						if(hottestEvents[i].id == eventId) {
							var hotIcon = '&nbsp<i class="fa fa-fire"></i>';
							$('#event-title').append(hotIcon);
						}
					}
				});
			});
		}
	}
}

$(document).ready(FeaturedEvent.ctor);
