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

    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const college = document.getElementById('college').value;
    const location = document.getElementById('location').value;
    const ownerName = document.getElementById('ownerName').value;
    const ownerPhone = document.getElementById('ownerPhone').value;
    const facilities = document.getElementById('facilities').value;
    const flatType = document.getElementById('flatType').value;
    const rent = document.getElementById('rent').value;

    // Input validation
    if (!validateForm(name, phone, college, location, ownerName, ownerPhone, facilities, flatType, rent)) {
        return; // Stop form submission if validation fails
    }

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
            <div class="flat-list-div">
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
            <button class="btn btn-outline-success" onclick="sendRequest(${request.id})">Request Flatmate</button>
        `;

        flatmatesList.appendChild(flatmateCard);
    });
}

// Send Flatmate Request (for simplicity, just a basic alert)
function sendRequest(id) {
    const request = flatmateRequests.find(r => r.id === id);
    alert(`Request sent to ${request.name} for flatmate!`);
}

// Filter flatmates based on the search bar input
function filterFlatmates() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const filteredRequests = flatmateRequests.filter(request => {
        return (
            request.college.toLowerCase().includes(searchTerm) ||
            request.location.toLowerCase().includes(searchTerm) ||
            request.flatType.toLowerCase().includes(searchTerm)
        );
    });
    displayFilteredFlatmates(filteredRequests);
}

// Display filtered flatmates
function displayFilteredFlatmates(filteredRequests) {
    const flatmatesList = document.getElementById('flatmatesList');
    flatmatesList.innerHTML = '';

    filteredRequests.forEach(request => {
        const flatmateCard = document.createElement('div');
        flatmateCard.classList.add('flatmate-card');
       
        flatmateCard.innerHTML = `
            <div class='flat-list-div'>
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

// Sort flatmates by rent
function sortFlatmates() {
    const sortOrder = document.getElementById('sortRent').value;
    const sortedRequests = [...flatmateRequests];

    sortedRequests.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.rent - b.rent;
        } else {
            return b.rent - a.rent;
        }
    });

    displayFilteredFlatmates(sortedRequests);
}

// Show the flatmate request form
document.getElementById('postRequestBtn').addEventListener('click', function() {
    document.getElementById('introImageContainer').style.display = 'none';
    document.getElementById('flatmateForm').style.display = 'block';
    document.getElementById('searchSection').style.display = 'none';
});

// Show the flatmate search section
document.getElementById('searchFlatmatesBtn').addEventListener('click', function() {
    document.getElementById('introImageContainer').style.display = 'none';
    document.getElementById('flatmateForm').style.display = 'none';
    document.getElementById('searchSection').style.display = 'block';
    fetchFlatmates();
});

// Input Validation Function
function validateForm(name, phone, college, location, ownerName, ownerPhone, facilities, flatType, rent) {
    if (!name || !/^[A-Za-z\s]+$/.test(name)) {
        alert('Please enter a valid name (only letters and spaces).');
        return false;
    }
    if (!phone || !/^\d{10}$/.test(phone)) {
        alert('Please enter a valid phone number (10 digits).');
        return false;
    }
    if (!college) {
        alert('Please enter the college name.');
        return false;
    }
    if (!location) {
        alert('Please enter the flat location.');
        return false;
    }
    if (!ownerName) {
        alert('Please enter the owner\'s name.');
        return false;
    }
    if (!ownerPhone || !/^\d{10}$/.test(ownerPhone)) {
        alert('Please enter a valid owner phone number (10 digits).');
        return false;
    }
    if (!facilities) {
        alert('Please enter the facilities.');
        return false;
    }
    if (!flatType) {
        alert('Please select the flat type.');
        return false;
    }
    if (!rent || isNaN(rent) || rent <= 0) {
        alert('Please enter a valid rent amount.');
        return false;
    }

    return true;
}