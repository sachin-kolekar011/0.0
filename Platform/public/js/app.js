let flatmateRequests = [];

// Fetch flatmate requests from the server
function fetchFlatmates() {
    fetch('/api/flatmates')
        .then(response => response.json())
        .then(data => {
            flatmateRequests = data;
            displayFlatmates();
        })
        .catch(error => console.error('Error fetching flatmate data:', error));
}

// Handle Flatmate Request Submission (with backend)
document.getElementById('flatmateRequestForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const college = document.getElementById('college').value;
    const location = document.getElementById('location').value;
    const ownerName = document.getElementById('ownerName').value;
    const ownerPhone = document.getElementById('ownerPhone').value;
    const facilities = document.getElementById('facilities').value;
    const flatType = document.getElementById('flatType').value;
    const rent = document.getElementById('rent').value;

    const newRequest = {
        name,
        phone,
        college,
        location,
        ownerName,
        ownerPhone,
        facilities,
        flatType,
        rent
    };

    // Send the new request to the backend
    fetch('/api/flatmates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRequest)
    })
    .then(response => response.json())
    .then(data => {
        // Clear form and update flatmate list
        document.getElementById('flatmateRequestForm').reset();
        fetchFlatmates();
    })
    .catch(error => console.error('Error sending flatmate request:', error));
});

// Display Flatmate Requests (after fetching from server)
function displayFlatmates() {
    const flatmatesList = document.getElementById('flatmatesList');
    flatmatesList.innerHTML = '';

    flatmateRequests.forEach(request => {
        const flatmateCard = document.createElement('div');
        flatmateCard.classList.add('flatmate-card');
        
        flatmateCard.innerHTML = `
            <div>
                <strong>${request.name}</strong><br>
                Phone: ${request.phone}<br>
                College: ${request.college}<br>
                Location: ${request.location}<br>
                Owner: ${request.ownerName}<br>
                Owner Phone: ${request.ownerPhone}<br>
                Facilities: ${request.facilities}<br>
                Flat Type: ${request.flatType}<br>
                Rent: ${request.rent}
            </div>
            <button class="request-btn" onclick="sendRequest(${request.id})">Request Flatmate</button>
        `;

        flatmatesList.appendChild(flatmateCard);
    });
}

// Send Flatmate Request (for simplicity, just a basic alert)
function sendRequest(id) {
    const request = flatmateRequests.find(r => r.id === id);
    alert(`Request sent to ${request.name} for flatmate!`);
}

// Fetch the initial list of flatmate requests on page load
fetchFlatmates();
