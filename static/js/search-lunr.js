// Extract the param value from the URL.
function paramValue(query_param) {
    var results = new RegExp('[\\?&]' + query_param + '=([^&#]*)').exec(window.location.href);
    return results ? results[1] : false;
}

function truncate(title) {
    var length = 100;
    if (title.length > length) {
       title = title.substring(0, length) + ' ...';
    }
    return title;
}

$(document).ready(function () {

    var searchData;
    
    $.getJSON('/site-index.json', function(data) {
        var results = document.getElementById('search-results');
        var index = lunr(function() {
            this.field('id');
            this.field('href');
            this.field('title', { boost: 100 });
            this.field('tags', { boost: 30 });
            this.field('topics', { boost: 30 });
            this.field('content', { boost: 10 });
        });

        data.forEach(function(obj, idx) {
            obj['id'] = idx;
            index.add(obj);
        });

        var matches = index.search(paramValue('q'));
        if (matches.length) {
            results.innerHTML = matches.length + ' Result(s) Found.<br/><br/>';
            matches.forEach(function(result) {
                var item = data[result.ref];
                var str = '<div class="result"><h2 class="search-title"><a href="' + item.href + '">' + item.title + '</a></h2>';
                str += '<p class="search-link"><a href="' + item.href + '">' + item.href + '</a></p>';
                str += '<p class="search-summary">' + truncate(item.content) + '</p>';
                str += '</div>';
                str += '<br/>';
                results.innerHTML += str;
            });
        } else {
            results.innerHTML = '<div class="nothing-found"><h3>No result(s) found. Please click on <a href="/">this link</a> to return to home page or use different search term(s).\
                                 <br/>Thank you for visiting my blog <i class="fa fa-smile-o fa-lg" aria-hidden="true"></i><h3></div>';
        }
    });
});