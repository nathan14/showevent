var Admin = {	
	ctor: function() {
		Admin.loadAdmin();
	},

	loadAdmin: function() {
		var adminEventsDiv = $('#admin-events');
		adminEventsDiv.html('');
		$.ajax({
			url: 'server/get-all-events.php',
			method: 'GET'
		})
		.success(function(json) {
			for(var i = 0; i < json.length; i++) {
				var currentEvent = Admin.adminEventCreator(json[i]);
				adminEventsDiv.append(currentEvent);
				var deleteBtnId = json[i].id;
				$('#delete-btn-' + deleteBtnId).click(function() {
					Admin.deleteEvent($(this).attr('id'));
				});
			}
		});
	},

	adminEventCreator: function (event) {
		var HTML = '';
		HTML += '<article class="col-xs-12" id="admin-event-' + event.id + '">'
				+	'<div class="card back-white">'
				+		'<h4 class="col-lg-4 card-title admin-card-title">'
				+ 			event.performer
				+		'</h4>'
				+		'<div class="card-text col-md-8">'					
				+			'<div class="col-lg-3 col-xs-6 card-text admin-card-content">'
				+				'<p>'
				+ 					'<i class="fa fa-calendar"></i> ' + Utils.formatDate(event.date)
				+				'</p>'
				+			'</div>'
				+			'<div class="col-lg-3 col-xs-6 card-text admin-card-content">'
				+				'<p>'
				+ 					'<i class="fa fa-clock-o"></i> ' + event.time
				+				'</p>'
				+			'</div>'
				+			'<div class="col-lg-3 col-xs-6 float-right">'
				+				'<button class="btn btn-lg admin-icons admin-icons-delete" id="delete-btn-' + event.id + '" type="button">'
				+					'<i class="fa fa-trash"></i></button>'
				+			'</div>'						
				+			'<div class="col-lg-3 col-xs-6 float-right">'
				+				'<a href="edit-featured-event.html?id=' + event.id + '" class="btn btn-lg admin-icons admin-icons-edit" type="button"><i class="fa fa-pencil"></i></a>'
				+			'</div>'
				+		'</div>'
				+		'<div class="clear"></div>'
				+	'</div>'
				+'</article>';

		return HTML;
	},

	deleteEvent: function(eventId) {
		eventId = eventId.substring(11);
		var formData = {
			id: eventId
		}
		
		var jsonData = JSON.stringify(formData);

		$.ajax({
			url: 'server/event-delete.php',
			type: 'POST',
			dataType: 'json',
			data: jsonData
		})
		.success(function() {
			var eventToDelete = $('#admin-event-' + eventId);
			eventToDelete.remove();
		});
	}
}

$(document).ready(Admin.ctor);