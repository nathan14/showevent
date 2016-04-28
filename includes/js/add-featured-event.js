var AddNewEvent = {
	ctor: function() {
		AddNewEvent.bindDateTimePicker();
		AddNewEvent.bindAddNewEventForm($('#form-new-event'));
	},

	bindDateTimePicker: function() {
		$('.datetimepicker').daterangepicker({
			singleDatePicker: true,
			timePicker24Hour: true,
			minDate: new Date(),
			timePicker: true,
			locale: {
            	format: 'DD/MM/YYYY HH:mm'
        	}
	    })
	},

	bindAddNewEventForm: function(form) {
		form.submit(function(event) {
			event.preventDefault();
			var formId = $(this).attr('id');
			var data = $(this).serializeArray();
			var isValid = Utils.validateData(formId, data);

			if(isValid) {
				var formData = {
					performer: $("#form-new-event-performer-name").val(),
					date: $("#form-new-event-date-time").val().substring(0,10),
					time: $("#form-new-event-date-time").val().substring(11,16),
					img: $("#form-new-event-img").val(),
					venue:	$("#form-new-event-location").val(),
					website: $("#form-new-event-website").val(),
					buyTickets: $("#form-new-event-buy-tickets").val(),
					contect: $("#form-new-event-content").val(),
					price: $("#form-new-event-price").val()
				}

				// Format date before insert to DB
				var day = formData.date.substring(0, 2);
				var month = formData.date.substring(3, 5);
				var year = formData.date.substring(6);
				formData.date = year + '-' + month + '-' + day;

				var jsonData = JSON.stringify(formData);

				$.ajax({
					url: "server/post-new-event.php",
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

$(document).ready(AddNewEvent.ctor);