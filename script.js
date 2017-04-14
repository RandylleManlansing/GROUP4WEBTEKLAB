var checkoutItems = new Array();

window.onload = function () {
	var data = localStorage.getItem("apparatusArray");
	if (data == null || data == 'undefined' || data == '' ){
		loadJSON();
	}
	document.getElementById("main").innerHTML = getCheckouts();
};

function loadJSON() {
	var request = new XMLHttpRequest();
	request.open("GET", "file.json", true);
	request.setRequestHeader("Content-type", "application/json");
	request.onreadystatechange = function() {
		if (request.readyState == XMLHttpRequest.DONE ) {
			var jsonData = JSON.parse(request.response);
			localStorage.setItem('apparatusArray', request.response);
			localStorage.setItem("APPARATUS_ID_COUNTER", 0);
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
        
    for (var i = 0; i < jsonData["apparatusArray"].length ; i++) {
        htmlString += "<button id='button-" +  jsonData["apparatusArray"][i].id + "' class='app infoButton' onclick = 'addRow(" + jsonData["apparatusArray"][i].id + ")'>"+ jsonData["apparatusArray"][i].name + "</button>" + "<div id='newpost'>" + "<input type='number' name='quantity' min='1' max='100' class='quantity' id='quantity-" + jsonData["apparatusArray"][i].id + "'>" + "</div>"+ "<br>";   
    }
    listDiv.insertAdjacentHTML('afterbegin', htmlString);        
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
	for (var i = 0; i < checkoutItems.length; i++) {
		checkout(checkoutItems[i].apparatusId, document.getElementById('idnum').value, checkoutItems[i].quantity, document.getElementById('classCode').value)
	}
}

function saveApparatus() {

            var form = document.getElementById("apparatusRecord");
            var Atype = form.type.value; // maybe change this to a dropdown form? and or just add valdation for numerical value
            var price = form.price.value;
            var Aname = form.name.value;
            var categ = form.categ.value;
            var stock = form.stock.value;

            var jsonString = " {  '"+Aname+"': { 'categ':'"+categ+"','type':'"+Atype+"',  'stock':'"+stock+"',  'price':'"+price+"' } } ";
                jsonString = jsonString.replace(/'/g, "\"");
        
            localStorage.setItem(Aname, jsonString);
}

// addition to saveApparatus function to work
(function(event){saveApparatus()
})

//displaying the added function
function displayNote() {
            var Aname = document.getElementById("apparatusID").value;
            var n = JSON.parse(localStorage.getItem(Aname));
            document.getElementById("name").innerHTML = Aname;
            document.getElementById("categ").innerHTML = n[Aname].categ;
            document.getElementById("type").innerHTML = n[Aname].type;
            document.getElementById("stock").innerHTML = n[Aname].stock;
            document.getElementById("price").innerHTML = n[Aname].price;
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
