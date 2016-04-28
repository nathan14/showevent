var ContactUs = {
	ctor: function() {
		ContactUs.bindContactUsForm($('#from-contact-us'));
	},

	bindContactUsForm: function(form) {
		form.submit(function(event) {
			event.preventDefault();
			var formId = $(this).attr('id');
			var data = $(this).serializeArray();
			var dataString = $(this).serialize();
			var isValid = Utils.validateData(formId, data);

			if(isValid) {
				form.find('input, textarea').val('');
				var submitBtn = $('#form-contact-us-submit');
				submitBtn.html('Thanks! Sent');
				setTimeout(function() {
					submitBtn.html('Send');
				}, 1500);
			}
		});
	}
}

$(document).ready(ContactUs.ctor);