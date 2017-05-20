var topics = ["Michael Jackson", "Mark Cuban", "Denzel Washington", "J Lo", "Usher", "Lebron James", "Mark Zuckerberg", "Kate Hudson", "Jesus", "Peter Griffin", "Saul Goodman", "Jon Taffer", "Robert Downey Jr.", "Puff Daddy", "Jack Black", "Ben Stiller", "Michael Scott", "Napolean Dynamite", "Gordon Ramsey"];

var switchState = function() {

	var currentState = $(this).attr("state");
	
	if (currentState == "still") {
        var x = $(this).attr("animated");
        $(this).attr({
        	src: x,
       		state: "animated",
       		alt: "animated gif image"
       	});
      } else {
        var x = $(this).attr("still");
        $(this).attr({
        	src: x,
       		state: "still",
       		alt: "still gif image"
       	});
      }
}

var createGifs = function(object) {
	// Clear existing image divs
	$(".imgDivs").remove();

	// Iterate through data object array to pull individual gif values
	for (i = 0; i < object.data.length; i++) {

		// Create div with unique id, append to imageSection div
		$("<div>").attr({class: "imgDivs", id: "div-" + i}).appendTo("#imageSection");
		
		// Create img elements, set attrtibutes, append to newly created div
		$("<img/>", {
			class: "gifImages",
			id: "gifImage-" + i,
			animated: object.data[i].images.original.url,
			still: object.data[i].images.original_still.url,
			state: "still",
			src: object.data[i].images.original_still.url,
			alt: "still gif image"
		}).appendTo("#div-" + i)
		  // Add onclick event listener to call switchState function
		  .on("click", switchState);

		// Append rating after image
		$("#div-" + i).append("<p>Rating: " + object.data[i].rating + "</p>");
	}
}

var searchForTopic = function(value) {
	
	// Sets AJAX call parameters for API search
	// Split term into array to address multi-word searches 
	var term = value.split(" ");
	// Rejoin term array with "+" separator per giphy API specs
	var formattedTerm = term.join("+");
	var limit = 10;
	var rating = "pg-13";
	var api_key = "dc6zaTOxFJmzC";

	// Asynchronous call to Giphy API with parameters defined above
	$.ajax({
		url: "http://api.giphy.com/v1/gifs/search?q=" + formattedTerm + 
			 "&limit=" + limit + 
			 "&rating=" + rating + 
			 "&api_key=" + api_key,
		type: "GET",
		// On successful API call, pass response to createGifs function
		success: function(response){
			createGifs(response);	
		}
	// Upon completion of the API call, console log completion statement
	}).done(function(response){
		console.log("AJAX call complete");
	});
}

var buttonMaker = function() {
	// Clears contents from buttonDiv (prep for new button loop)
	$("#buttonDiv").html("");

	// Iterates through array and creates buttons with attributes including individual IDs to be called later
	for (i=0; i < topics.length; i++) {
		// Sets click event for each button to run searchForTopic function passing element value
		var newButton = $("<button/>", {
			text: topics[i],
			class: "btn btn-primary",
			id: 'btn-' + i,
			value: topics[i],
			click: function() {
				searchForTopic(this.value);
			}
		})
		// Adds new buttons to buttonDiv
		$("#buttonDiv").append(newButton);
	}
}

var addTopic = function() {
	// Prevent browser default submit action
	event.preventDefault();

	// Fetch value in searchTerm text box and trim for whitespace
	var term = $("#searchTerm").val().trim();
	// Split term into array of strings for capitalization
	var splitTerm = term.split(" ");
	// Initialize array for capitalized strings
	var capitalizedTerm = [];

	// Iterate through each string, capitalize the first character of string and attach the remaining slice of string
	for (i = 0; i < splitTerm.length; i++) {
		capitalizedTerm.push(splitTerm[i].charAt(0).toUpperCase() + splitTerm[i].slice(1));
	}

	// Re-join capitalized string array into a new string
	var newTerm = capitalizedTerm.join(" ");
	
	// Add new string to topics Array
	topics.push(newTerm);

	// Reset text box display
	$("#searchTerm").val("");
	
	// Call buttonMaker function to generate buttons
	buttonMaker();
}

$(document).ready(function() {
	// Runs buttonMaker for initial buttons based on initial topics Array
	buttonMaker();
	// Adds event listener for "Add A Person" form, runs addTopic function on click
	$("#addTopicButton").click(addTopic);
});


