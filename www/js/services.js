angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})



  .service('es', ['esFactory', function (esFactory) {
        return esFactory({
            hosts: [
                'localhost:9200'
            ],
            log: 'trace'
        });
    }])
    .factory('searchService', ['es', function (es) {
        return {
            'fullTextSearch': function (from, size, text) {
                return es.search({
                    index: 'searchtest2',
                    type: 'rfp',
                    body: {
    'from': from,
    'size': size,
    "fields": [
        "filename","author"
    ],
    'query': {
        "bool": {
            "must": [
                {
                    "nested": {
                        "path": "couple",
                        "query": {
                            "bool": {
                                "should": [
                                    {
                                        "multi_match": {
                                            "fields":["couple.question","couple.response"] ,
                                                "query": text,
                                                "slop": 50,
                                                "type": "phrase"
                                            }
                                        }
                                    
                                ],
                                "must": [
{
                                        "multi_match": {
                                            "fields":["couple.question","couple.response"] ,
                                                "query": text,
                                                  "minimum_should_match": "50%"
                                            }
                                        }
                                ]
                            }
                        },
                        "inner_hits": {    "highlight": {
                              "pre_tags" : ["<strong>"],
        "post_tags" : ["</strong>"],

"fields": {

"response" : {"fragment_size" :70 },"question" : {"fragment_size" :70 }

}

}}
                    }
                }
            ]
        }
    },
    'facets': {
        "tagslist": {
            "terms": {
                "field": "tags"
            }
        },
"authorlist": {
            "terms": {
                "field": "author"
            }
        }

    }
    
}






                });
            }
        ,

            'autocomplete': function (text) {
                return es.search({
                    index: 'searchtest2',
                    type: 'rfp',
                    body: {
                        'fields': [
                            'tags'
                            
                           
                        ],
                        'query': {"prefix" : { "tags" : text }},
                        'highlight': {
                            'number_of_fragments': 0,
                            'pre_tags': [
                                ''
                            ],
                            'post_tags': [
                                ''
                            ],
                            'fields': {
                                'tags': {}
                            }
                        }
                    }
                });
            }}}]);
