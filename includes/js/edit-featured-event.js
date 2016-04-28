var EditEvent = {
	ctor: function() {
		EditEvent.loadEvent();
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
				$('#form-edit-event-performer-name').val(currentEvent.performer);
				$('#event-date').html(Utils.formatDate(currentEvent.date));
				$('#form-edit-event-price').val(currentEvent.price);
				$('#form-edit-event-location').val(currentEvent.venue);
				$('#form-edit-event-website').val(currentEvent.website);
				$('#form-edit-event-img').val(currentEvent.imgurl);
				$('#form-edit-event-buy-tickets').val(currentEvent.buyTickets);
				$('#form-edit-event-content').val(currentEvent.content)

				EditEvent.bindDateTimePicker(currentEvent.date, currentEvent.time);
				EditEvent.bindEditEventForm($('#form-edit-event'));
			});
		}
	},

	bindDateTimePicker: function(date, time) {
		var formatedDate = new Date(date + ' ' + time);

		$('.datetimepicker').daterangepicker({
			singleDatePicker: true,
			timePicker24Hour: true,
			minDate: new Date(),
			startDate: new Date(formatedDate),
			timePicker: true,
			locale: {
            	format: 'DD/MM/YYYY HH:mm'
        	}
	    })
	},

	bindEditEventForm: function(form) {
		form.submit(function(event) {
			event.preventDefault();
			var formId = $(this).attr('id');
			var data = $(this).serializeArray();
			var isValid = Utils.validateData(formId, data);

			if(isValid) {
				var formData = {
					id: Utils.getUrlVars('id'),
					performer: $("#form-edit-event-performer-name").val(),
					date: $("#form-edit-event-date-time").val().substring(0,10),
					time: $("#form-edit-event-date-time").val().substring(11,16) ,
					img: $("#form-edit-event-img").val(),
					venue:	$("#form-edit-event-location").val(),
					website: $("#form-edit-event-website").val(),
					buyTickets: $("#form-edit-event-buy-tickets").val(),
					contect: $("#form-edit-event-content").val(),
					price: $("#form-edit-event-price").val()
				}

				formData.date = moment(formData.date).format('YYYY-MM-DD'); // fix date before going to DB

				var jsonData = JSON.stringify(formData);

				$.ajax({
					url: "server/edit-event.php",
					type: 'POST',
					dataType: 'json',
					data: jsonData
				})
				.success(function() {
					location.href = 'admin.html';
				});
			}
		});
	}
}

$(document).ready(EditEvent.ctor);