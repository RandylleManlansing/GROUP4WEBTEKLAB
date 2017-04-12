function saveToLS(){
    var request = new XMLHttpRequest();
    request.open("GET", "file.json", true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            var response = this.responseText;
            var data = JSON.stringify(response);
            localStorage.setItem("apparatusArray", data);
        }
    };
        request.send();
}
