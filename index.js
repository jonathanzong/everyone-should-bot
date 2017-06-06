var Twit = require('twit');
var T = new Twit(require('botfiles/config.js'));

exports.handler = function myBot(event, context) {

  T.get('statuses/user_timeline', { screen_name: 'EveryoneBot', count: 1, trim_user: true, exclude_replies: true }, function(err, data, response) {
    var search_params = {
      q: '"everyone should" -filter:retweets',
      result_type: 'recent',
      include_entities: false
    };

    //
    var most_recent = null;
    if (data.length) {
      most_recent = data[0].id_str;
    }
    if (most_recent) {
      search_params['since_id'] = most_recent;
    }
    //

    T.get('search/tweets', search_params, function(err, data, response) {
      data.statuses.some(function(tweet) {
        if (tweet.text.toLowerCase().indexOf("everyone should") == 0) {
          console.log(tweet.id);
          console.log(tweet.text);
          T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
            console.log(data);
          });
          return true;
        }
        return false;
      });
    })
  });  
  
};
