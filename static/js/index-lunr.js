var fs = require('fs')
var site_index = JSON.parse(fs.readFileSync('../../public/site-index.json', 'utf8'));

var elasticlunr = require('elasticlunr');

var index = elasticlunr(function() {
    this.addField('id');
    this.addField('href');
    this.addField('title', { boost: 100 });
    this.addField('tags', { boost: 30 });
    this.addField('topics', { boost: 30 });
    this.addField('content', { boost: 10 });
    this.saveDocument(false);
});

site_index.forEach(function(obj, idx) {
	obj['id'] = idx;
	index.addDoc(obj);
});

var search_index = JSON.stringify(index);

fs.writeFile("../../public/search-index.json", search_index, 'utf8', function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});