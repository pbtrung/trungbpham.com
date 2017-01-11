// Extract the param value from the URL.
function paramValue(query_param) {
    var results = new RegExp('[\\?&]' + query_param + '=([^&#]*)').exec(window.location.href);
    return results ? results[1] : false;
}

$(document).ready(function () {

    var searchData;

    window.index = lunr(function() {
        this.field('id');
        this.field('href');
        this.field('title', { boost: 40 });
        this.field('tags', { boost: 30 });
        this.field('topics', { boost: 30 });
        this.field('content', { boost: 10 });
    });
    var indexLocation = "/site-index.json";
    var searchReq = new XMLHttpRequest();
    searchReq.open('GET', indexLocation, true);
    searchReq.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            searchData = JSON.parse(this.response);
            searchData.forEach(function(obj, index) {
                obj['id'] = index;
                console.log(obj);
                window.index.add(obj);
            });
        } else {
            console.log("Failed status for site-index.json.");
        }
    };
    searchReq.onerror = function() {
        console.log("Error when attempting to load site-index.json.");
    }
    searchReq.send();

    var query_param = 'q';
    var query = paramValue(query_param);
    if (query.length > 2) {
        var matches = window.index.search(query);
        console.log(query);
        console.log(matches);
        console.log(window.index);
        var searchResults = document.getElementById('search-results');
        if (matches.length) {
            matches.forEach(function(result) {
                var item = searchData[result.ref];
                var appendString = item.title + ' ';
                searchResults.innerHTML += appendString;
            });
        } else {
            searchResults.innerHTML = 'No results found';
        }
    }

});