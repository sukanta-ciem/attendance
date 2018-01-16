var site_url = "http://www.arishbionaturals.com/attendance/";

var attendanceadmin_id = localStorage.getItem("attendanceadmin_id");
var attendancelogin_id = localStorage.getItem("attendancelogin_id");

function loggedOut(){
	localStorage.setItem("loggedIn", "no");
	localStorage.setItem("attendanceadmin_id", "");
	localStorage.setItem("attendancelogin_id", "");
	window.location.href = "index.html";
}

$(document).on("click", "#duty_in", function(){

	var r = confirm("Are you sure you want to duty in?");
	if(r == true){
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		function onSuccess(){
			var currentdate = new Date(); 
			var datetime = "Duty In Time: " + currentdate.getDate() + "/"
							+ (currentdate.getMonth()+1)  + "/" 
							+ currentdate.getFullYear() + " @ "  
							+ currentdate.getHours() + ":"  
							+ currentdate.getMinutes() + ":" 
							+ currentdate.getSeconds();
							
			$("#duty_in").addClass("disabledButton");
			$(".duty_in_time_txt").text(datetime);
		}
		function onError(){
			alert("Turn on your location and retry!");
			return false;
		}
		
		
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){
			dd='0'+dd;
		} 
		if(mm<10){
			mm='0'+mm;
		} 
		var todayDate = dd+'/'+mm+'/'+yyyy;
		
		var ts = Math.round((new Date()).getTime() / 1000);
		
		var atdet = localStorage.getItem("attendance_detail");
		
		var latitude, longitude, accuracy;
		
		if(atdet === null || atdet === "null" || typeof atdet === typeof undefined || atdet == "" || atdet == "[]"){
			var at_det = [];
			
			var atDetails = {
				"attendanceadmin_id": attendanceadmin_id,
				"attendancelogin_id": attendancelogin_id,
				"date": todayDate,
				"duty_in_time": ts,
				"duty_out_time": "",
				"latitude": latitude,
				"longitude": longitude,
				"accuracy": accuracy,
				"flag": 0
			};
			
			at_det.push(atDetails);
			localStorage.setItem("attendance_detail", JSON.stringify(at_det));
			
		}else{
			var at_det = JSON.parse(atdet);
			
			var atDetails = {
				"attendanceadmin_id": attendanceadmin_id,
				"attendancelogin_id": attendancelogin_id,
				"date": todayDate,
				"duty_in_time": ts,
				"duty_out_time": "",
				"latitude": latitude,
				"longitude": longitude,
				"accuracy": accuracy,
				"flag": 0
			};
			
			at_det.push(atDetails);
			localStorage.setItem("attendance_detail", JSON.stringify(at_det));
		}
	}
});

$(document).on("click", "#duty_out", function(){
	if(!$("#duty_in").hasClass("disabledButton")){
		alert("Please press duty in first!");
		return false;
	}
	var r = confirm("Are you sure you want to duty Out?");
	if(r == true){
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		function onSuccess(){
			var currentdate = new Date(); 
			var datetime = "Duty Out Time: " + currentdate.getDate() + "/"
							+ (currentdate.getMonth()+1)  + "/" 
							+ currentdate.getFullYear() + " @ "  
							+ currentdate.getHours() + ":"  
							+ currentdate.getMinutes() + ":" 
							+ currentdate.getSeconds();
							
			$("#duty_out").addClass("disabledButton");
			$(".duty_out_time_txt").text(datetime);
		}
		function onError(){
			alert("Turn on your location and retry!");
			return false;
		}
	}
});

function remarksBtn(){
	$("#remarks").val("");
	alert("Remarks has been saved successfully!");
}
