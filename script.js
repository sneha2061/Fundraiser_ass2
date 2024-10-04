// Common functions

function fetchFundraisers() {
    clearErrors();
    const fundraisersContainer = document.getElementById('fundraisers-container');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    fetch('http://localhost:3000/fundraisers')
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            if (data.length > 0) {
                data.forEach(fundraiser => {
                    const card = renderFundraiserCard(fundraiser);
                    fundraisersContainer.appendChild(card);
                });
            } else {
                fundraisersContainer.innerHTML = '<p>No active fundraisers available.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching fundraisers:', error);
            errorMessage.innerHTML = 'Failed to load fundraisers. Please try again later.';
        });
}

// Fetch fundraiser details along with donations by ID
function fetchFundraiserDetails(fundraiserId) {
    const fundraiserDetails = document.getElementById('fundraiser-details');
    const donationsList = document.getElementById('donations-list'); // Element to display the donations

    fetch(`http://localhost:3000/fundraiser/${fundraiserId}`)
        .then(response => response.json())
        .then(fundraiser => {
            if (fundraiser) {
                // Display fundraiser details
                const progressPercentage = (fundraiser.CURRENT_FUNDING / fundraiser.TARGET_FUNDING) * 100;
                fundraiserDetails.innerHTML = `
                    <h2>${fundraiser.CAPTION}</h2>
                    <p>Organizer: ${fundraiser.ORGANIZER}</p>
                    <p>City: ${fundraiser.CITY}</p>
                    <p>Category: ${fundraiser.category_name}</p>
                    <p>Description: ${fundraiser.DESCRIPTION}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progressPercentage}%"></div>
                    </div>
                    <p>Raised: ${fundraiser.CURRENT_FUNDING} AUD of ${fundraiser.TARGET_FUNDING} AUD</p>
                `;

                // Display the list of donations
            if (fundraiser.donations.length > 0) {
                    fundraiser.donations.forEach(donation => {
                        const donationItem = document.createElement('li');
                        donationItem.innerHTML = `
                            <p>Donor: ${donation.DONOR_NAME}</p>
                            <p>Amount: ${donation.AMOUNT} AUD</p>
                        `;
                        donationsList.appendChild(donationItem);
                    });
                } else {
                    donationsList.innerHTML = '<p>No donations yet.</p>';
                }
            } else {
                fundraiserDetails.innerHTML = '<p>Fundraiser not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching fundraiser details:', error);
            fundraiserDetails.innerHTML = '<p>Failed to load fundraiser details.</p>';
        });
        const donateButton = document.getElementById('donate-button');
        donateButton.href = `donation.html?fundraiser_id=${fundraiserId}`;
}

// Call the fetch function on page load
document.addEventListener('DOMContentLoaded', () => {
    const fundraiserId = getQueryParam('id'); // Assuming fundraiser ID is passed as query parameter
    fetchFundraiserDetails(fundraiserId);
});


function searchFundraisers(organizer, city, category) {
    clearErrors();
    let query = `http://localhost:3000/search?`;
    if (organizer) query += `organizer=${organizer}&`;
    if (city) query += `city=${city}&`;
    if (category) query += `category=${category}`;
    query = query.slice(-1) === '&' ? query.slice(0, -1) : query;

    const searchResults = document.getElementById('search-results');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    loading.style.display = 'block';
    searchResults.innerHTML = '';
    fetch(query)
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            if (data.length > 0) {
                data.forEach(fundraiser => {
                    const card = renderFundraiserCard(fundraiser);
                    searchResults.appendChild(card);
                });
            } else {
                searchResults.innerHTML = '<p>No fundraisers found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching fundraisers:', error);
            errorMessage.innerHTML = 'Failed to fetch fundraisers. Please try again later.';
        });
}

function populateCategories() {
    const categorySelect = document.getElementById('category');

    fetch('http://localhost:3000/categories')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.CATEGORY_ID;
                option.textContent = category.NAME;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function renderFundraiserCard(fundraiser) {
    const card = document.createElement('div');
    card.classList.add('fundraiser-card');
    const progressPercentage = (fundraiser.CURRENT_FUNDING / fundraiser.TARGET_FUNDING) * 100;

    card.innerHTML = `
        <h3>${fundraiser.CAPTION}</h3>
        <p>Organizer: ${fundraiser.ORGANIZER}</p>
        <p>City: ${fundraiser.CITY}</p>
        <Category: ${fundraiser.category_name}</p>
        <div class="progress-bar">
            <div class="progress" style="width: ${progressPercentage}%;"></div>
        </div>
        <p>Raised: ${fundraiser.CURRENT_FUNDING} AUD of ${fundraiser.TARGET_FUNDING} AUD</p>
        <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}" class="details-button">View Details</a>
    `;
    return card;
}

// Function to donate to a fundraiser
function donateToFundraiser(fundraiserId, amount) {
    return fetch(`http://localhost:3000/fundraiser/${fundraiserId}/donate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
    });
}

// Function to validate the donation amount
function validateDonationAmount(amount) {
    if (!amount || isNaN(amount) || amount <= 0) {
        document.getElementById('error-message').textContent = 'Please enter a valid donation amount.';
        return false;
    }
    return true;
}

function clearErrors() {
    document.getElementById('error-message').textContent = '';
}

// Execute on page load
document.addEventListener('DOMContentLoaded', () => {
    const fundraiserId = getFundraiserId();
    fetchFundraiserDetails(fundraiserId);
});

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active'); // Toggle the active class
}
