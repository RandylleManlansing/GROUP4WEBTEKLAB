var checkoutItems = new Array();
var checkinItems = new Array();
var jsonData;

window.onload = function () {
	var data = localStorage.getItem("apparatusArray");
	if (data == null || data == "undefined" || data == "" ){
		loadJSON();
	}else{
	   jsonData = JSON.parse(localStorage.getItem("apparatusArray"))["apparatusArray"];
	   var checkouts = document.getElementById("checkouts");
	   if (checkouts != null){
		document.getElementById("checkouts").innerHTML = getCheckouts();
        }
	   loadApparatusList();
    }
};

function loadJSON() {
	var request = new XMLHttpRequest();
	request.open("GET", "file.json", true);
	request.setRequestHeader("Content-type", "application/json");
	request.onreadystatechange = function() {
		if (request.readyState == XMLHttpRequest.DONE ) {
			var jsonData = JSON.parse(request.response);
        		    if(localStorage.getItem("apparatusArray") == undefined)
           		    localStorage.setItem('apparatusArray', request.response);
           		    localStorage.setItem("APPARATUS_ID_COUNTER", 0);
       		  	    if (document.getElementById("checkouts").innerHTML != null){
				document.getElementById("checkouts").innerHTML = getCheckouts();	
			}
			jsonData = JSON.parse(localStorage.getItem("apparatusArray"))["apparatusArray"];
			loadApparatusList();
        }
    };
    request.send();
}

function GenerateList(){
    var htmlString = "";
    var aList;
    var ID = 1;
    var listDiv = document.getElementById('showList');
	var jsonData = JSON.parse(localStorage.getItem("apparatusArray"));
     or (var i = 0; i < jsonData["apparatusArray"].length ; i++) {
		var id = jsonData["apparatusArray"][i].id;
        htmlString += 
            "<a href = '#'>"+"<button id='button-" +  id + "' class='app' onclick = 'toggleInfo(this)'>"+ jsonData["apparatusArray"][i].name + "</button>" + 
            "<div style='display:none' id='newpost'>" + "<input type='number' required value='1' name='quantity' min='1' max='100' class='quantity' id='quantity-" + id + "'>" + 
                "<button id='confirm-" +  id + "' class='confirmB' onclick='addRow(" + id + ")'>" + "Confirm" + "</button>" +
            "</div>"+ "</a>"+"<br>";   
    }
    listDiv.insertAdjacentHTML('afterbegin', htmlString);        
}

function loadApparatusList(){
    var hString = "";
    var checklist;
    var leDiv = document.getElementById('showList');
	var jsonlsData = JSON.parse(localStorage.getItem("apparatusArray"));

    for (var i = 0; i < jsonlsData["apparatusArray"].length ; i++) {
		var idApp = jsonlsData["apparatusArray"][i].id;
        hString += 
            "<a href = '#' style =  'text-decoration: none'>" +"<button id='button-" +  idApp + "' class='app infoButton' onclick = 'toggleInfo(this)'>"+ jsonlsData["apparatusArray"][i].name + "</button>" +
            "<div style='display:none' id='newpost'>" +"<span class = 'format'>"+ "Category: " +  jsonlsData["apparatusArray"][i].category + "<br>" + "Stock Available: "+  jsonlsData["apparatusArray"][i].stock + "<br>" +
			"Type: "+  jsonlsData["apparatusArray"][i].type + "<br>" +"</span>"+
          "</div>"+ "</a>" + "<br>";   
    }
    leDiv.insertAdjacentHTML('afterbegin', hString);        
}

function editQuantity(){
    var showSomething = document.getElementById('showSomething');
    var div = document.getElementById('newpost');
    if (div.style.display !== 'none') {
        div.style.display = 'none';
    }
    else {
        div.style.display = 'block';
    }
}

function getCheckouts(){
	var dict = {};
	var innerHTML = "";
	for (var i = 0; i < parseInt(localStorage.getItem("APPARATUS_ID_COUNTER")) ; i++) {
		var item = JSON.parse(localStorage.getItem(i));
		if (dict[item.userid] == null || dict[item.userid] == 'undefined'){
			dict[item.userid] = new Array();
		}
		dict[item.userid].push(item);
	}
	console.dir(dict);
	var keys = [];
	for (var key in dict) {
	  if (dict.hasOwnProperty(key)) {
		keys.push(key);
	  }
	}
	for (var key in keys){
		console.log("key: " + key);
		var hasItems = hasCheckoutItem(keys[key]) ? "*" : "";
		innerHTML += "<button>" + "<a href='check-in.html?user=" +  keys[key] + "' class='anchorCheckOutStyle'>" + keys[key] + hasItems + "</a>" +"</button><br>";
		var array = dict[keys[key]];
	}
	
	return innerHTML;
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

function CheckAndLoad(){
    var list = document.getElementById("showList");
       if(list==null || list.innerHTML == ''){
           GenerateList();
    }else{
        document.getElementById("showList").reset;
    }
}

function getApparatusJSON(apparatusId){
	var jsonData = JSON.parse(localStorage.getItem("apparatusArray"));
	for (var i = 0; i < jsonData["apparatusArray"].length ; i++) {
		if (jsonData["apparatusArray"][i].id == apparatusId){
			return jsonData["apparatusArray"][i];
		}
	}
}
function addRow(apparatusId) {
    var summaryTable = document.getElementById('sTable');
	var apparatus = getApparatusJSON(apparatusId);
	var quantity = document.getElementById("quantity-" + apparatusId).value;
	addCheckoutItem(apparatusId, quantity);
    summaryString = 
		"<tr id='rowCell' class='trStyle'>"+
			"<td class='tdNameStyle'>" + apparatus.name + "</td>" + 
			"<td class='tdNameStyle' style='font-family: arial'>" + quantity + "</td>" +
			"<td class='tdQStyle'>" + "" + "<button onclick='delete_row(this)' class='app infoButton' value='Cancel' name='Cancel'>Cancel</button>" + "</td>" + 
		"</tr>";
    summaryTable.insertAdjacentHTML('beforeend', summaryString);
}

function getCheckouts(){
	var innerHTML = "";
	for (var i = 0; i < parseInt(localStorage.getItem("APPARATUS_ID_COUNTER")) ; i++) {
		var item = JSON.parse(localStorage.getItem(i));
		innerHTML += "User: " + item.userid + "<br/>" + "Apparatus: " + getApparatus(item.apparatusId).name + "<br/>" + "Quantity: " + item.quantity + "<br/>" + "Date: " + item.timestamp;
	}
	return innerHTML;
}

function getApparatus(id){
	var jsonData = JSON.parse(localStorage.getItem("apparatusArray"));
	console.log("This is the app id: " + id);
	console.log("array size: " + jsonData["apparatusArray"].length);
	for (var i = 0; i < jsonData["apparatusArray"].length; i++){
		if (jsonData["apparatusArray"][i].id == id){
			return jsonData["apparatusArray"][i];
		}
	}
}
function delete_row(r){
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("sTable").deleteRow(i);
}

function checkout(apparatusId, userid, quantity, classcode){
	var counter = localStorage.getItem("APPARATUS_ID_COUNTER");
	var text = '{' +
			'"checkoutId": ' + counter  + ','+
			'"apparatusId": ' + apparatusId + ','+
			'"userid": ' + '"' + userid  + '"' + ','+
			'"quantity": ' + quantity + ','+
			'"timestamp": ' + '"' + (new Date()) + '"' + ','+
			'"classcode": ' + '"' + classcode  + '"' +
		'}';
    localStorage.setItem("APPARATUS_ID_COUNTER", parseInt(counter) + 1);
	localStorage.setItem(counter, text);
	console.dir(localStorage);
}

function save(){
    var idNumber = document.getElementById('idnum').value
    var cCode = document.getElementById('classCode').value
    if (cCode==="" || idNumber===""){
      alert("Please Fill All Required Fields");
      return false;
    }else if (isNaN(idNumber)){
        alert("Invalid input");
        return false;
    }else{
		for (var i = 0; i < checkoutItems.length; i++) {
            checkout(checkoutItems[i].apparatusId, idNumber, checkoutItems[i].quantity, cCode)
		}
	  
function getCurrentUser(){
	return localStorage.getItem("user");
}

function setCurrentUser(user){
localStorage.setItem("user", user);
}

function hasCheckoutItem(apparatusId){
    for (var i = 0; i < checkoutItems.length; i++){
        if (checkoutItems[i].apparatusId == apparatusId){
            return true;
        }
    }
    return false;
}

function addCheckoutItem(appId, quan){
    checkoutItems.push({apparatusId:appId, quantity:quan});
}


function addCheckoutItem(appId, quan){
	checkoutItems.push({apparatusId:appId, quantity:quan});
}
function deleteCheckoutRow(appId){
	for (var i = 0; i < checkoutItems.length; i++){
		if (checkoutItems[i].apparatusId == appId){
			checkoutItems.splice(i, 1);
			return true;
		}
	}
	return false;
}
	    
function delete_row(r, appId){
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("sTable").deleteRow(i);
	deleteCheckoutRow(appId);
}
	    
function generateCheckinTableForUser(user, container){
	var html = "<br/><h1 class='h1StyleCheckIn'>Check-In Items for </h1><br/>" + "<table style='width: 100%'>" + 
	"<tr class='trStyle'>" +
	   "<td class='tdASumStyle'>" + "Apparatus" + "</td>" +
		"<td class='tdASumStyle'>" + "Checkout Quantity" + "</td>" +
		"<td class='tdASumStyle'>" + "Checkin Quantity" + "</td>" +
    "</tr>";
	for (var i = 0; i < parseInt(localStorage.getItem("APPARATUS_ID_COUNTER")) ; i++) {
		var item = JSON.parse(localStorage.getItem(i));
		if (item.userid == user){
			html += "<tr>" + 
			"<td class='tdASumStyle'>" + getApparatus(item.apparatusId).name + "</td>" + 
			"<td class='tdASumStyle'>" + item.quantity  + "</td>" +
			"<td class='tdASumStyle'>" + "<input type='text' class='qBoxCheckIn' value=" + item.quantity + " />" + "</td>" + 
		"</tr>";
		}
	}
	html += "</table>";
	container.innerHTML = html;
}

function saveApparatus() {
            var form = document.getElementById("apparatusRecord");
            var Atype = form.type.value; // maybe change this to a dropdown form? and or just add valdation for numerical value
            var price = form.price.value;
            var Aname = form.name.value;
            var categ = form.categ.value;
            var stock = form.stock.value;
	    var index = b.length + 1;
	    
	    var jsonString = {"id":  index , "name":  Aname , "category": category , "type": type , "stock": stock , "price": price};
       
    if (Aname=="" || category==""|| type=="" || stock=="" || price=="") {
      alert("Please Fill All Required Fields");
      return false;
    } else if (isNaN(stock) || isNaN(price)) {
        alert("Invalid input");
        return false;
    }else{
        b[b.length] = jsonString;
        var bracket = {"apparatusArray":b};
        localStorage.setItem("apparatusArray", JSON.stringify(bracket));
        form.reset();
    } 
}
function search() {
    var innerCon, filter, outerCon, inner, a, i;
    innerCon = document.getElementById("myInput");
    filter = innerCon.value.toUpperCase();
    outerCon = document.getElementById("showList");
    inner = outerCon.getElementsByTagName("a");
    for (i = 0; i < inner.length; i++) {
        a = inner[i].getElementsByTagName("button")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            inner[i].style.display = "";
        } else {
            inner[i].style.display = "none";

        }
    }
}

function find() {
    var innerCon, filter, outerCon, inner, a, i;
    innerCon = document.getElementById("sean");
    filter = innerCon.value.toUpperCase();
    outerCon = document.getElementById("checkouts");
    inner = outerCon.getElementsByTagName("button");
    for (i = 0; i < inner.length; i++) {
        a = inner[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            inner[i].style.display = "";
        } else {
            inner[i].style.display = "none";

        }
    }
}

function toggleInfo(e){ 
        var leInfo = e.nextSibling;
        var displaySetting = leInfo.style.display;
        //var apparatus = getApparatusJSON(apparatusId);
	    //var quantity = document.getElementById("quantity-" + apparatusId).value = '1';
        
        var infoButton = document.getElementsByClassName('gen');

        if (displaySetting == 'block') { 
          leInfo.style.display = 'none';
          infoButton.innerHTML = 'Show info';
        }
        else { 
          leInfo.style.display = 'block';
          infoButton.innerHTML = 'Hide info';
        }
}
		

		

function cancelTransaction(){
    location.reload();
}

function clearBox(){
    document.getElementById("showList").innerHTML = "";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function cancel() {
    document.getElementById("form").style.width = "0";
}

function add() {
    document.getElementById("form").style.width = "100%";
}
