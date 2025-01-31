document.getElementById('eventForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let eventName = document.getElementById('eventName').value;
    let eventDate = document.getElementById('eventDate').value;
    let eventLocation = document.getElementById('eventLocation').value;
    
    if (eventName && eventDate && eventLocation) {
        let eventList = document.getElementById('eventList');
        let listItem = document.createElement('li');
        listItem.textContent = `${eventName} - ${eventDate} at ${eventLocation}`;
        eventList.appendChild(listItem);
        
        document.getElementById('eventForm').reset();
    }
});

function displayformsports(){
    window.location.href="sport.ejs"
}
function displayformculture(){
    window.location.href="cultural.ejs"
}
function displayformseminarlogin(){
    window.location.href="seminar.ejs"
}
function displayformworkshop(){
    window.location.href="workshop.ejs"
}


