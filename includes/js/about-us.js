var AboutUs = {
	ctor: function(){
		AboutUs.EmployeeDetails();
	},

	EmployeeDetails: function(event) {
		var employeeDetailsDiv = $('#employee-details');

		$('.employee-image').mouseenter(function(event) {
			var employeeName = $(this).attr('data-name');
			var employeeNameParsed = AboutUs.nameParser(employeeName);
			employeeDetailsDiv.html('<h2>About ' + employeeNameParsed +'</h2>');
			employeeDetailsDiv.append('<p id="employee-details">');
			switch(employeeName) {
				case 'nathan-brudnik':
				employeeDetailsDiv.append('as Front-end Director Nathan responsible to create the best UX to our worldwide customers and improve our communication with BE.')				 
				break;
				case 'aviya-oren':
				employeeDetailsDiv.append('Responsible for ShowEvent product strategy, management, and roadmap, Aviya brings more than 10 years of experience in both developing and system design.')
				break;
				case 'elad-latovitz':
				employeeDetailsDiv.append('As VP Product Management, Elad is responsible for ensuring that ShowEvent product and marketing activities meet business needs with Sales, R&D and Operations.')
			}
			employeeDetailsDiv.append('</p>');
		})
		.mouseleave(function(event) {
		  	employeeDetailsDiv.html('<span class="hover-directions">HOVER OUR EMPLOYEES TO KNOW MORE ABOUT THEM!</span>');
		});
	},

	nameParser: function(name) {
		var splitedName = name.split('-');
		return splitedName[0].charAt(0).toUpperCase() + splitedName[0].slice(1);
	}
}

$(document).ready(AboutUs.ctor);

