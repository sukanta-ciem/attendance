var site_url = "http://www.arishbionaturals.com/attendance/";

var attendanceadmin_id = localStorage.getItem("attendanceadmin_id");
var attendancelogin_id = localStorage.getItem("attendancelogin_id");
var deviceID = localStorage.getItem("deviceID");

document.getElementById("attendanceadmin_id").value = attendanceadmin_id;

var locationOption = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	console.log(navigator.camera);
}

var cameraOptions = {
	sourceType : 1,
	destinationType : 0,
	encodingType : 0,
	quality : 25,
	saveToPhotoAlbum : false,
	cameraDirection : 1
};

function sync(){
	document.getElementById("wrapper").className = "";
	var atdet = localStorage.getItem("attendance_detail");
	if(atdet === null || atdet === "null" || typeof atdet === typeof undefined || atdet == "" || atdet == "[]"){
		//do nothing
		document.getElementById("wrapper").className = "hidden";
	}else{
		$.ajax({
			type: 'post',
			url: site_url+'api/attendance_api.php',
			data: {"attendance" : encodeURIComponent(atdet), "employee_id" : attendanceadmin_id},
			success: function(msg){
				var data = JSON.parse(msg);
				if(data.status === "success"){
					var atten_feedback = JSON.stringify(data.attendance);
					localStorage.setItem("attendance_detail", atten_feedback);
				}else{
					alert("Error Occured!");
				}
				document.getElementById("wrapper").className = "hidden"; 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				document.getElementById("wrapper").className = "hidden"; 
				return false;
			}
		});
	}
}

function syncInBackground(){
	//document.getElementById("wrapper").className = "";
	var atdet = localStorage.getItem("attendance_detail");
	if(atdet === null || atdet === "null" || typeof atdet === typeof undefined || atdet == "" || atdet == "[]"){
		//do nothing
		//document.getElementById("wrapper").className = "hidden";
	}else{
		$.ajax({
			type: 'post',
			url: site_url+'api/attendance_api.php',
			data: {"attendance" : encodeURIComponent(atdet), "employee_id" : attendanceadmin_id},
			success: function(msg){
				var data = JSON.parse(msg);
				if(data.status === "success"){
					var atten_feedback = JSON.stringify(data.attendance);
					localStorage.setItem("attendance_detail", atten_feedback);
				}else{
					//alert("Error Occured!");
				}
				//document.getElementById("wrapper").className = "hidden"; 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//document.getElementById("wrapper").className = "hidden"; 
				return false;
			}
		});
	}
}

$(document).ready(function(){
	document.getElementById("wrapper").className = "";
	setTimeout(function(){ 
		document.getElementById("wrapper").className = "hidden"; 
		sync();
	}, 2000);
	
	//setInterval(function(){ syncInBackground(); }, 4000);
	
	var loggedIn = localStorage.getItem("loggedIn_attendance");
	if(loggedIn === null || loggedIn === "null" || typeof loggedIn === typeof undefined || loggedIn == "" || loggedIn == "[]" || loggedIn != "ok"){
		window.location.href = "index.html";
	}
	
	var atdet = localStorage.getItem("attendance_detail");
	if(atdet === null || atdet === "null" || typeof atdet === typeof undefined || atdet == "" || atdet == "[]"){
		//do nothing
	}else{
		var at_det = JSON.parse(atdet);
		for(var i=0; i< at_det.length; i++){
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
			
			if(at_det[i].date == todayDate && at_det[i].duty_in_time != ""){
				$("#duty_in").addClass("disabledButton");
				var datetime_in = "Duty In Time: " + at_det[i].date + " @ " + at_det[i].duty_in_time;
				$(".duty_in_time_txt").text(datetime_in);
			}
			
			if(at_det[i].date == todayDate && at_det[i].duty_out_time != ""){
				$("#duty_out").addClass("disabledButton");
				var datetime_out = "Duty Out Time: " + at_det[i].date + " @ " + at_det[i].duty_out_time;
				$(".duty_out_time_txt").text(datetime_out);
			}
		}
	}
});

function loggedOut(){
	localStorage.setItem("loggedIn_attendance", "no");
	localStorage.setItem("attendanceadmin_id", "");
	localStorage.setItem("attendancelogin_id", "");
	window.location.href = "index.html";
}

$(document).on("click", "#duty_in", function(){
	if($(this).hasClass("disabledButton")){
		return false;
	}
	var r = confirm("Are you sure you want to duty in?");
	if(r == true){
		navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
		function cameraSuccess(imageData){
			navigator.geolocation.getCurrentPosition(onSuccess, onError, locationOption);
			function onSuccess(position){
			
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!

				var yyyy = today.getFullYear();
				
				var hh = today.getHours();
				var mn = today.getMinutes();
				var ss = today.getSeconds();
				
				if(dd<10){
					dd='0'+dd;
				} 
				if(mm<10){
					mm='0'+mm;
				} 
				var todayDate = dd+'/'+mm+'/'+yyyy;
				
				if(hh<10){
					hh='0'+hh;
				}
				
				if(mn<10){
					mn='0'+mn;
				}
				
				if(ss<10){
					ss='0'+ss;
				}
				
				var datetime = "Duty In Time: " + todayDate + " @ "  
								+ hh + ":"  
								+ mn + ":" 
								+ ss;
				
				//var ts = Math.round((new Date()).getTime() / 1000);
				var ts = hh + ":" + mn + ":" + ss;
				
				var atdet = localStorage.getItem("attendance_detail");
				
				var latitude = position.coords.latitude, 
				longitude = position.coords.longitude, 
				accuracy = position.coords.accuracy;
				
				if(parseInt(accuracy) > 150){
					alert("Your location is not accurate enough!\n Please Turn On your GPS and Internet and try again!");
					return false;
				}
				
				if(atdet === null || atdet === "null" || typeof atdet === typeof undefined || atdet == "" || atdet == "[]"){
					var at_det = [];
					
					var atDetails = {
						"attendanceadmin_id": attendanceadmin_id,
						"attendancelogin_id": attendancelogin_id,
						"deviceID": deviceID,
						"date": todayDate,
						"duty_in_time": ts,
						"duty_out_time": "",
						"camera_in": imageData,
						"camera_out": "",
						"latitude_in": latitude,
						"longitude_in": longitude,
						"accuracy_in": accuracy,
						"latitude_out": "",
						"longitude_out": "",
						"accuracy_out": "",
						"remarks": "",
						"remarks_time": "",
						"flag": 0
					};
					
					at_det.push(atDetails);
					localStorage.setItem("attendance_detail", JSON.stringify(at_det));
					
				}else{
					var at_det = JSON.parse(atdet);
					
					var atDetails = {
						"attendanceadmin_id": attendanceadmin_id,
						"attendancelogin_id": attendancelogin_id,
						"deviceID": deviceID,
						"date": todayDate,
						"duty_in_time": ts,
						"duty_out_time": "",
						"camera_in": imageData,
						"camera_out": "",
						"latitude_in": latitude,
						"longitude_in": longitude,
						"accuracy_in": accuracy,
						"latitude_out": "",
						"longitude_out": "",
						"accuracy_out": "",
						"remarks": "",
						"remarks_time": "",
						"flag": 0
					};
					
					at_det.push(atDetails);
					localStorage.setItem("attendance_detail", JSON.stringify(at_det));
				}
				
				$("#duty_in").addClass("disabledButton");
				$(".duty_in_time_txt").text(datetime);
				sync();
			}
			function onError(){
				alert("Please Turn on your location and retry!");
				return false;
			}
		}
		
		function cameraError(){
			alert("You have to capture your image to duty in!");
			return false;
			
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
		navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
		function cameraSuccess(imageData){
			navigator.geolocation.getCurrentPosition(onSuccess, onError, locationOption);
			function onSuccess(position){
				
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!

				var yyyy = today.getFullYear();
				
				var hh = today.getHours();
				var mn = today.getMinutes();
				var ss = today.getSeconds();
				
				if(dd<10){
					dd='0'+dd;
				} 
				if(mm<10){
					mm='0'+mm;
				} 
				var todayDate = dd+'/'+mm+'/'+yyyy;
				
				if(hh<10){
					hh='0'+hh;
				}
				
				if(mn<10){
					mn='0'+mn;
				}
				
				if(ss<10){
					ss='0'+ss;
				}
				
				var datetime = "Duty Out Time: " + todayDate + " @ "  
								+ hh + ":"  
								+ mn + ":" 
								+ ss;
				
				var atdet = localStorage.getItem("attendance_detail");
				
				var latitude = position.coords.latitude, 
				longitude = position.coords.longitude, 
				accuracy = position.coords.accuracy;
				
				if(parseInt(accuracy) > 150){
					alert("Your location is not accurate enough!\n Please Turn On your GPS and Internet and try again!");
					return false;
				}
				
				if(atdet === null || atdet === "null" || typeof atdet === typeof undefined || atdet == "" || atdet == "[]"){
					alert("Today your Duty In time has not been recorded!");
					return false;
				}else{
					var dutyInFlag = false;
					var at_det = JSON.parse(atdet);
					for(var i=0; i< at_det.length; i++){
						if(at_det[i].date == todayDate && at_det[i].duty_in_time != ""){
							dutyInFlag = true;
							//var ts = Math.round((new Date()).getTime() / 1000);
							var ts = hh + ":" + mn + ":" + ss;
							
							at_det[i].duty_out_time = ts;
							at_det[i].camera_out = imageData;
							at_det[i].latitude_out = latitude;
							at_det[i].longitude_out = longitude;
							at_det[i].accuracy_out = accuracy;
							
							at_det_string = JSON.stringify(at_det);
							localStorage.setItem("attendance_detail", at_det_string);
							
							$("#duty_out").addClass("disabledButton");
							$(".duty_out_time_txt").text(datetime);
							sync();
						}
					}
					
					if(!dutyInFlag){
						alert("Today your Duty In time has not been recorded!");
						return false;
					}
				}
			}
			function onError(){
				alert("Turn on your location and retry!");
				return false;
			}
		}
		function cameraError(){
			alert("You have to capture your image to duty in!");
			return false;
		}
	}
});

function remarksBtn(){
	var atdet = localStorage.getItem("attendance_detail");
	var remarks = $("#remarks").val();
	var at_det = JSON.parse(atdet);
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	
	var hh = today.getHours();
	var mn = today.getMinutes();
	var ss = today.getSeconds();
	
	if(dd<10){
		dd='0'+dd;
	} 
	if(mm<10){
		mm='0'+mm;
	} 
	var todayDate = dd+'/'+mm+'/'+yyyy;
	
	if(hh<10){
		hh='0'+hh;
	}
	
	if(mn<10){
		mn='0'+mn;
	}
	
	if(ss<10){
		ss='0'+ss;
	}
	
	var ts = hh + ":" + mn + ":" + ss;
	
	var dutyInFlag = false;
	if(atdet === null || atdet === "null" || typeof atdet === typeof undefined || atdet == "" || atdet == "[]"){
		alert("To submit a Remark put your Duty In First!");
		return false;
	}else{
		for(var i=0; i< at_det.length; i++){
			if(at_det[i].date == todayDate && at_det[i].duty_in_time != ""){
				dutyInFlag = true;
				at_det[i].remarks = remarks;
				at_det[i].remarks_time = ts;
				
				at_det_string = JSON.stringify(at_det);
				localStorage.setItem("attendance_detail", at_det_string);
				
				$("#remarks").val("");
				alert("Remarks has been saved successfully!");
				sync();
			}
		}
		
		if(!dutyInFlag){
			alert("To submit a Remark put your Duty In First!");
			return false;
		}
	}
	
	
}

$(document).on("click", "#attendance_btn", function(){
	var froms = $("#from").val();
	var to = $("#to").val();
	if(froms==="" || to===""){
		alert("Fill up the required field!");
		return false;
	}
	document.getElementById("wrapper").className = "";
	var formData = $("#viewAttendance").serializeArray();
	$.ajax({
		type: 'post',
		url: site_url+'api/view_attendance_api.php',
		data: formData,
		success: function(msg){
			var data = JSON.parse(msg);
			if(data.status === "success"){
				var docs = data.attendance;
				if(docs.length === 0){
					var jsHtml = '<table width="100%" border="0"  cellspacing="0" cellpadding="0">';
					jsHtml += '<tr>';
					jsHtml += '<tr><td><strong>Not Found</strong></td>';
					jsHtml += '</tr>';
					jsHtml += '</table>';
				}else{
					var jsHtml = '<table width="100%" border="0"  cellspacing="0" cellpadding="0">';
					jsHtml += '<tr>';
					jsHtml += '<td><strong>SL</strong></td>';
					jsHtml += '<td><strong>Date</strong></td>';
					jsHtml += '<td><strong>Duty In</strong></td>';
					jsHtml += '<td><strong>Duty Out</strong></td>';
					jsHtml += '</tr>';
					for(var i=0; i< docs.length; i++){
						jsHtml += '<tr>';
						jsHtml += '<td>'+(i+1)+'</td>';
						jsHtml += '<td>'+docs[i].dutyDate+'</td>';
						jsHtml += '<td>'+docs[i].dutyIn+'</td>';
						jsHtml += '<td>'+docs[i].dutyOut+'</td>';
						jsHtml += '</tr>';
					}
					jsHtml += '</table>';
				}
				$(".view_tbl").html(jsHtml);
				document.getElementById("wrapper").className = "hidden";
			}else{
				alert("Error Occured!");
				document.getElementById("wrapper").className = "hidden";
			}
		},
	    error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert('No Active network Connection is present!');
			document.getElementById("wrapper").className = "hidden";
			return false;
	    }
	});
});

$(document).on("click", "#remarks_btn", function(){
	var froms = $("#from").val();
	var to = $("#to").val();
	if(froms==="" || to===""){
		alert("Fill up the required field!");
		return false;
	}
	document.getElementById("wrapper").className = "";
	var formData = $("#viewRemarks").serializeArray();
	$.ajax({
		type: 'post',
		url: site_url+'api/view_remarks_api.php',
		data: formData,
		success: function(msg){
			var data = JSON.parse(msg);
			if(data.status === "success"){
				var docs = data.attendance;
				if(docs.length === 0){
					var jsHtml = '<table width="100%" border="0"  cellspacing="0" cellpadding="0">';
					jsHtml += '<tr>';
					jsHtml += '<tr><td><strong>Not Found</strong></td>';
					jsHtml += '</tr>';
					jsHtml += '</table>';
				}else{
					var jsHtml = '<table width="100%" border="0"  cellspacing="0" cellpadding="0">';
					jsHtml += '<tr>';
					jsHtml += '<td><strong>SL</strong></td>';
					jsHtml += '<td><strong>Date</strong></td>';
					jsHtml += '<td><strong>Time</strong></td>';
					jsHtml += '<td><strong>Remarks</strong></td>';
					jsHtml += '</tr>';
					for(var i=0; i< docs.length; i++){
						jsHtml += '<tr>';
						jsHtml += '<td>'+(i+1)+'</td>';
						jsHtml += '<td>'+docs[i].dutyDate+'</td>';
						jsHtml += '<td>'+docs[i].dutyTime+'</td>';
						jsHtml += '<td>'+docs[i].remarks+'</td>';
						jsHtml += '</tr>';
					}
					jsHtml += '</table>';
				}
				$(".view_tbl").html(jsHtml);
				document.getElementById("wrapper").className = "hidden";
			}else{
				alert("Error Occured!");
				document.getElementById("wrapper").className = "hidden";
			}
		},
	    error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert('No Active network Connection is present!');
			document.getElementById("wrapper").className = "hidden";
			return false;
	    }
	});
});
