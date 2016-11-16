# project-1 That's My Jam
Group Project

An app that lets a user see their friends' restaurant reviews on a map, in order find nearby restaurants they'd like to try.
Users can see their friends' instagram food photos that were taken in that location.
Users can also add their own instragram food photos, using #thatsmyjam so their friends in the area can see how good their food was.

using google map API
and instragram API
and firebase


program flow:

## user logs in w instagram
* look up their IG username in our DB of users, add if new
* retrieve their friends list from IG
* add / update in our DB on their user object
* get their friends' reviews and photos from the DB
* populate the map w friends reviews
* check IG to see if there are new photos from their friends
* update the DB with new reviews
* update the map
* check to see if they have new instagram photos with the hashtag
* add new photos to our DB as reviews
* prompt them to add text reviews to the photos
* if any tagged photos are missing location information, prompt them to add it, possibly from google places data

## all users
* have map ready to filter displayed reviews by author
* have map ready to add a new review from the map button
* when adding a new review, is it possible to use the instagram api to add a new photo???
* have app ready to change the location of the map


## our sandbox instagram users:
* ontopofspaghetti - added, content added
* quinoadreams - added, content added
* picklesandlace - added, content added
* cauliflower_king - added - LA content added
* garlicbodybutter - added - san francisco content added
* tofugees - added - sf - san francisco content added
* leatherandkale
* iheart2nom
* peebeenjayjay