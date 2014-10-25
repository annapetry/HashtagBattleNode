# Hashtag Battleground

### Many will enter - only one will _WIN_

#### A fun little Twitter Hashtag Battle app using Node.js.

##### See it live [HERE](http://hashtag-battleground.herokuapp.com)

##### Key Features:
  - Uses Socket.IO to maintain connection to Twitter API to access streaming tweets.
  - Instantly updates counters to reflect increasing number of tweets with the specified hashtags.
  - Restricts Users to one vote per contest. No cheating!

##### Under the Hood:
Node.js, Bootstrap, HTML5, CSS3

##### TODO:
   - Allow for multiple visitors (currently only one web dyno exists)
    - Don't allow visitors to add/reset hashtags if a battle is in progress
    - OR
    - Let each visitor have their own battle (add more dynos)