document.addEventListener('DOMContentLoaded', (event) => {
    if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    }

    var db;
    var request = indexedDB.open("MyTestDatabase");
    request.onerror = function(event) {
        alert("Database error: " + event.target.errorCode);
    };
    request.onsuccess = function(event) {
        db = event.target.result;
    };
});
