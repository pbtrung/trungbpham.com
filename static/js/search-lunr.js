// Extract the param value from the URL.
function paramValue(query_param) {
    var results = new RegExp('[\\?&]' + query_param + '=([^&#]*)').exec(window.location.href);
    return results ? results[1] : false;
}

$(document).ready(function () {

    var searchData;
    
    $.getJSON('/site-index.json', function(data) {
        var results = document.getElementById('search-results');
        results.append(data.length + ' Result(s) Found.');

        var index = lunr(function() {
            this.field('id');
            this.field('href');
            this.field('title', { boost: 40 });
            this.field('tags', { boost: 30 });
            this.field('topics', { boost: 30 });
            this.field('content', { boost: 10 });
        });

        data.forEach(function(obj, index) {
            obj['id'] = index;
            index.add(obj);
        });

        console.log(index);
    });
});