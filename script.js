function saveToLS(){
    var request = new XMLHttpRequest();
    request.open("GET", "file.json", true);
    request.setRequestHeader("Content-type", "application/json")
    request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            var response = this.responseText;
            var data = JSON.stringify(response);
            localStorage.setItem("apparatusArray", data);
        }
    };
        request.send();
}

// addition starts here
// this is the function that saves the added apparatus to the local storage

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
