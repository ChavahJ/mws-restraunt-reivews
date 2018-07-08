/**
 * Common database helper functions.
 */
class DBHelper {

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get DATABASE_URL() {
        const port = 1337; // Change this to your server port
        return `http://localhost:${port}/restaurants`;
    }

    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants(callback) {
        const dbName = 'restaurantDb';
        let request = indexedDB.open(dbName, 1);
        request.onerror = function(event) {
            alert("Database error: " + event.target.errorCode);
        };

        fetch(DBHelper.DATABASE_URL).then(function(response){
                const data = response.json();
                console.log(data);
                request.onupgradeneeded = function(event) {
                    const db = event.target.result;
                    const objectStore = db.createObjectStore("restaurants", { keyPath: "id" });
                    objectStore.createIndex("cuisine", "cuisine", { unique: false });
                    objectStore.createIndex("neighborhood", "neighborhood", { unique: false });

                    objectStore.transaction.oncomplete = function() {
                        const restaurantObjectStore = db.transaction("restaurants", "readwrite").objectStore("restaurants");
                        data.forEach(function(restaurant) {
                            restaurantObjectStore.add(restaurant);
                            console.log(restaurant.name);
                        });
                    };

                };
                callback(null, restaurants);
            })
            .catch(error => console.error('Error:', error))
            .then(response => console.log('Success:', response));
    }

    /**
     * Fetch a restaurant by its ID.
     */
    // static fetchRestaurantById(id, callback) {
    //     // fetch all restaurants with proper error handling.
    //     DBHelper.fetchRestaurants((error, restaurants) => {
    //         if (error) {
    //             callback(error, null);
    //         } else {
    //             const restaurant = restaurants.find(r => r.id == id);
    //             if (restaurant) { // Got the restaurant
    //                 callback(null, restaurant);
    //             } else { // Restaurant does not exist in the database
    //                 callback('Restaurant does not exist', null);
    //             }
    //         }
    //     });
    // }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    // static fetchRestaurantByCuisine(cuisine, callback) {
    //     // Fetch all restaurants  with proper error handling
    //     DBHelper.fetchRestaurants((error, restaurants) => {
    //         if (error) {
    //             callback(error, null);
    //         } else {
    //             // Filter restaurants to have only given cuisine type
    //             const results = restaurants.filter(r => r.cuisine_type == cuisine);
    //             callback(null, results);
    //         }
    //     });
    // }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    // static fetchRestaurantByNeighborhood(neighborhood, callback) {
    //     // Fetch all restaurants
    //     DBHelper.fetchRestaurants((error, restaurants) => {
    //         if (error) {
    //             callback(error, null);
    //         } else {
    //             // Filter restaurants to have only given neighborhood
    //             const results = restaurants.filter(r => r.neighborhood == neighborhood);
    //             callback(null, results);
    //         }
    //     });
    // }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
                callback(null, uniqueCuisines);
            }
        });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        return (`/img/${restaurant.photograph}`);
    }

    /**
     * Restaurant small image URL.
     */
    static smallImageUrlForRestaurant(restaurant) {
        return (`/img/${restaurant.photograph_small}`);
    }

    /**
     * Map marker for a restaurant on home page.
     */
    static mapMarkerForRestaurant(restaurant, newMap) {
        // https://leafletjs.com/reference-1.3.0.html#marker
        const marker = new L.marker(
            [restaurant.latlng.lat, restaurant.latlng.lng],
            {
                title: restaurant.name,
                alt: restaurant.name,
                url: DBHelper.urlForRestaurant(restaurant)
            }
        );
        marker.addTo(newMap);
        return marker;
    }

    /**
     * Map marker for a restaurant on info page.
     */
    static mapMarkerForRestaurantInfo(restaurant, newMap) {
        // https://leafletjs.com/reference-1.3.0.html#marker
        const marker = new L.marker(
            [restaurant.latlng.lat, restaurant.latlng.lng],
            {
                alt: restaurant.name,
            }
        );
        marker.addTo(newMap);
        marker.bindPopup(restaurant.name);

        return marker;
    }
}

