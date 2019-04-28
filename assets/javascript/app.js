$(document).ready(function () {

	//var config = {
	//	apiKey: "AIzaSyCqtt05C0fFeKaulOp0wGFM000q0o_GtJ0",
	//	authDomain: "train-scheduler-92160.firebaseapp.com",
	//	databaseURL: "https://train-scheduler-92160.firebaseio.com",
	//	projectId: "train-scheduler-92160",
	//	storageBucket: "train-scheduler-92160.appspot.com",
	//	messagingSenderId: "736108279519"
	//	};
	//firebase.initializeApp(config);

	//database = firebase.database();

	// Link to Firebase
	var database = new Firebase("https://train-scheduler-92160.firebaseio.com/");

	// Button for adding Trains
	$("#addTrainBtn").on("click", function () {

		// Grabs user input and assign to variables
		var trainName = $("#trainNameInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");;
		var frequencyInput = $("#frequencyInput").val().trim();

		// Creates object for holding train data
		// Will push this to firebase
		var newTrain = {
			name: trainName,
			destination: destination,
			trainTime: trainTimeInput,
			frequency: frequencyInput,
		}

		// pushing trainInfo to Firebase
		database.push(newTrain);

		// clear text-boxes
		$("#trainNameInput").val("");
		$("#destinationInput").val("");
		$("#trainInput").val("");
		$("#frequencyInput").val("");

		// Prevents page from refreshing
		return false;
	});

	database.on("child_added", function (childSnapshot, prevChildKey) {

		console.log(childSnapshot.val());

		// assign firebase variables to snapshots.
		var firebaseName = childSnapshot.val().name;
		var firebaseDestination = childSnapshot.val().destination;
		var firebaseTrainTimeInput = childSnapshot.val().trainTime;
		var firebaseFrequency = childSnapshot.val().frequency;

		var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");
		var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency;
		var minutes = firebaseFrequency - timeRemainder;

		var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A");

		// Test for correct times and info
		console.log(minutes);
		console.log(nextTrainArrival);
		console.log(moment().format("hh:mm A"));
		console.log(nextTrainArrival);
		console.log(moment().format("X"));

		// Append train info to table on page
		$("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");
	});
});