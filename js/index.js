var site_url = "http://www.arishbionaturals.com/attendance/";
var loggedIn = localStorage.getItem("loggedIn_attendance");
	(function() {
	   // your page initialization code here
	   // the DOM will be available here
		document.getElementById("wrapper").className = "";
		setTimeout(function(){ document.getElementById("wrapper").className = "hidden"; }, 2000);		
	})();
	
	function loginNow(){
		var user_name = $("#user_name").val();
		var user_password = $("#user_password").val();
		if(user_name==="" || user_password===""){
			alert("Fill up the required field!");
			return false;
		}
		document.getElementById("wrapper").className = "";
		var formData = $("#loginForm").serializeArray();
		$.ajax({
			type: 'post',
			url: site_url+'api/login_api.php',
			data: formData,
			success: function(msg){
				var data = JSON.parse(msg);
				if(data.status === "success"){
					var user_id = data.user_id;
					localStorage.setItem("loggedIn_attendance", "ok");
					localStorage.setItem("attendanceadmin_id", user_id);
					localStorage.setItem("attendancelogin_id", user_name);
					
					window.location.href = "home.html";
				}else{
					alert("Wrong Username or Password!");
					document.getElementById("wrapper").className = "hidden";
				}
			}
		});
	}
	
	// onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    var onSuccess = function(position) {
        /*alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');*/
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        /*alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');*/
    }

    
	
	document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        var deviceID = device.uuid;
		//alert(deviceID);
		localStorage.setItem("deviceID", deviceID);
		
		var contactsNo = "No Sim Info!";
		localStorage.setItem("contacts", contactsNo);
		hasReadPermission();
		
		// Android only: check permission
		function hasReadPermission() {
			window.plugins.sim.hasReadPermission(function(res){ 
				if(!res){
					requestReadPermission();
				}else{
					window.plugins.sim.getSimInfo(successCallback, errorCallback);
				}
			}, function(obj){
				console.log(obj);
			});
		}

		// Android only: request permission
		function requestReadPermission() {
			window.plugins.sim.requestReadPermission(function(obj){
				window.plugins.sim.getSimInfo(successCallback, errorCallback);
			}, function(obj){
				console.log(obj);
			});
		}
		
		
		
		function successCallback(result) {
		  //console.log(result);
		  var simInfo = result.cards;
		  contactsNo = simInfo[0].phoneNumber;
		  if(!contactsNo){
			  contactsNo = "No Sim Info!";
		  }
		  localStorage.setItem("contacts", contactsNo);
		  
		  console.log("navigator.geolocation works well");
		  console.log(navigator.camera);
		  navigator.geolocation.getCurrentPosition(onSuccess, onError);
		}

		function errorCallback(error) {
		  console.log(error);
		}
		
		if(loggedIn === "ok"){
			window.location.href = "home.html";
		}
    }