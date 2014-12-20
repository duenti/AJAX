
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $street = $('#street');
    var $city = $('#city');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var location = $street.val() + ', ' + $city.val();
    var googlemapString = '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + location + '">';
    
    $greeting.text('Legal, você então gostaria de viver em ' + location + '?');
    $body.append(googlemapString);

    //NYT Ajax Request
    var nytURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + $city.val() + '&sort=newest&api-key=fff2468a20028d791e2e12a93f676ec5:0:70497627';
    $.getJSON(nytURL,function(data){
        $nytHeaderElem.text('Matérias do New York Times sobre ' + $city.text());

        articles = data.response.docs;
        for(var i = 0; i < articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="' + article.web_url+'">'+article.headline.main+
                '</a>'+
                '<p>'+article.snippet+'</p>'+    
                '</li>');
        }
    }).error(function(){

        $nytHeaderElem.text('Erro ao carregar as matérias do New York Times');
    });
    
    //Wikipedia Ajax Request
    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + $city.val() + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Falha em estabelecer conexão com a Wikipedia.');
    },8000);//8000ms

    $.ajax({
        url: wikiURL,
        dataType: 'jsonp',
        success: function(response){
            var articleList = response[1];

            for(var i = 0; i < articleList.length; i++){
                var articleStr = articleList[i];
                var url = 'http://en.Wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            }

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);

// loadData();
