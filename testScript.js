function loadApparatus(){
    var containerList = document.getElementById("showList");
    var request = new XMLHttpRequest();
    request.open("GET", "file2.json");
    request.onload = function(){
    var data = JSON.parse(request.responseText);
    renderHTML(data);
};
request.send(); 
function renderHTML(adata){
    var htmlString = "";
     
    for(i=0;i<adata.length;i++){
        htmlString += "<button id='app' class='infoButton' onclick='toggleInfo()'>" + adata[i].name + "</button>" + "<div id='info' class='hidden'>" + "<p>" + adata[i].category + "" + adata[i].type + "<button>"+ "Something" + "</button>"+"</p>" + "</div>" + "<br>";
    }
    
    containerList.insertAdjacentHTML('beforeend', htmlString);
}
}
function toggleInfo(){ 
        var leInfo = document.getElementById('info');

        var displaySetting = leInfo.style.display;

        var infoButton = document.getElementsByClassName('infoButton');

        if (displaySetting == 'block') { 
          leInfo.style.display = 'none';
          infoButton.innerHTML = 'Show info';
        }
        else { 
          leInfo.style.display = 'block';
          infoButton.innerHTML = 'Hide info';
        }
}