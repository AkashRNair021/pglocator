/**
 * data.js
 * Handles mock data and LocalStorage initialization.
 */

const mockPGData = [
    {
        id: "pg-001",
        name: "Elite Skyline Men's PG",
        city: "Bangalore",
        area: "Koramangala",
        address: "123, 4th Cross, 5th Block, Koramangala, Bangalore - 560095",
        price: 8500,
        gender: "boys",
        roomType: "shared",
        occupancy: 2,
        amenities: ["WiFi", "Food", "AC", "Laundry", "Power Backup", "TV", "Housekeeping"],
        facilities: ["Attached Bathroom", "Balcony", "Study Table", "Wardrobe", "Geyser"],
        rules: ["No smoking inside", "Gates close at 11 PM", "No loud music after 10 PM", "Visitors allowed in lobby only"],
        landmarks: ["2 mins from Oasis Mall", "10 mins from Sony World Signal", "5 mins to Bus Stop"],
        owner: { name: "Rajesh Kumar", phone: "+91 9876543210", email: "rajesh@example.com" },
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1c24240f38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        reviews: [
            { user: "Amit S.", rating: 5, comment: "Amazing place, very clean and good food!" },
            { user: "Vikram", rating: 4, comment: "Decent PG for the price, location is perfect." }
        ],
        rating: 4.8,
        popularity: 95,
        availability: "Available",
        ownerId: "owner-1"
    },
    {
        id: "pg-002",
        name: "Serene Spaces Women's PG",
        city: "Bangalore",
        area: "Indiranagar",
        address: "45, 100ft Road, Indiranagar, Bangalore - 560038",
        price: 9200,
        gender: "girls",
        roomType: "single",
        occupancy: 1,
        amenities: ["WiFi", "Security", "Food", "AC", "Laundry", "Parking"],
        facilities: ["CCTV", "Biometric Entry", "Attached Bathroom", "Washing Machine"],
        rules: ["Boys not allowed", "No alcohol", "Inform before night outs"],
        landmarks: ["Near Metro Station", "Next to Toit"],
        owner: { name: "Sunita Reddy", phone: "+91 9988776655", email: "sunita@example.com" },
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        gallery: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1c24240f38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        reviews: [],
        rating: 4.9,
        popularity: 98,
        availability: "Available",
        ownerId: "owner-2"
    },
    {
        id: "pg-003",
        name: "Oasis Co-living Studio",
        city: "Mumbai",
        area: "Andheri West",
        address: "Oasis Tower, Andheri West, Mumbai",
        price: 15000,
        gender: "unisex",
        roomType: "single",
        occupancy: 1,
        amenities: ["WiFi", "AC", "Power Backup", "Security", "Parking", "Gym"],
        facilities: ["Fully Furnished", "Pool", "Lounge Area"],
        rules: ["Respect personal space", "Clean up after cooking"],
        landmarks: ["5 mins from Station"],
        owner: { name: "Oasis Management", phone: "1800-123-456", email: "contact@oasis.com" },
        image: "https://images.unsplash.com/photo-1502672260266-1c1c24240f38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        gallery: [
            "https://images.unsplash.com/photo-1502672260266-1c1c24240f38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        reviews: [],
        rating: 4.7,
        popularity: 85,
        availability: "Few Left",
        ownerId: "owner-3"
    }
];

function initializeDatabase() {
    // Only overwrite if it doesn't exist, or if we want to reset for testing we can remove the check.
    // For demo purposes, we'll overwrite it to ensure the rich data is present.
    localStorage.setItem('pgListings', JSON.stringify(mockPGData));
    
    if (!localStorage.getItem('pgFavorites')) {
        localStorage.setItem('pgFavorites', JSON.stringify([]));
    }

    if (!localStorage.getItem('currentUserRole')) {
        localStorage.setItem('currentUserRole', 'guest');
    }
}

initializeDatabase();

window.PGData = {
    getListings: () => JSON.parse(localStorage.getItem('pgListings')),
    getRole: () => localStorage.getItem('currentUserRole'),
    setRole: (role) => localStorage.setItem('currentUserRole', role)
};
