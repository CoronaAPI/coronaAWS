//= require ../lib/_lunr
//= require ../lib/_jquery
//= require ../lib/_jquery.highlight
;(function () {
  'use strict';

  var content, searchResults;
  var highlightOpts = { element: 'span', className: 'search-highlight' };
  var searchDelay = 0;
  var timeoutHandle = 0;

  var index = new lunr.Index();

  index.ref('id');
  index.field('title', { boost: 10 });
  index.field('body');
  index.pipeline.add(lunr.trimmer, lunr.stopWordFilter);

  $(populate);
  $(bind);

  function populate() {
    window.refHash = {}
    window.tokens.forEach(function(token){
      index.add(token)
      window.refHash[token.id] =token
    });

    determineSearchDelay();
  }
  function determineSearchDelay() {
    if(index.tokenStore.length>5000) {
      searchDelay = 300;
    }
  }

  function bind() {
    content = $('.content');
    searchResults = $('.search-results');

    $('#input-search').on('keyup',function(e) {
      var wait = function() {
        return function(executingFunction, waitTime){
          clearTimeout(timeoutHandle);
          timeoutHandle = setTimeout(executingFunction, waitTime);
        };
      }();
      wait(function(){
        search(e);
      }, searchDelay );
    });
  }

  function search(event) {

    var searchInput = $('#input-search')[0];

    unhighlight();
    searchResults.addClass('visible');

    // ESC clears the field
    if (event.keyCode === 27) searchInput.value = '';

    if (searchInput.value) {
      var results = index.search(searchInput.value).filter(function(r) {
        return r.score > 0.0001;
      });
      if (results.length) {
        searchResults.empty();
        var prefix =  window.location.toString().indexOf('/docs') > -1 ? '' : '/docs.html';
        $.each(results, function (index, result) {
          var elem = document.getElementById(result.ref);
          searchResults.append("<li><a href='"+prefix+"#" + result.ref + "'>" + window.refHash[result.ref].title+ "</a></li>");
        });
        highlight.call(searchInput);
      } else {
        searchResults.html('<li></li>');
        $('.search-results li').text('No Results Found for "' + searchInput.value + '"');
      }
    } else {
      unhighlight();
      searchResults.removeClass('visible');
    }
  }

  function highlight() {
    if (this.value) content.highlight(this.value, highlightOpts);
  }

  function unhighlight() {
    content.unhighlight(highlightOpts);
  }
})();
