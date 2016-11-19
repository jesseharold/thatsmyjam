# project-1 That's My Jam
Group Project

An app that lets a user see their friends' restaurant reviews on a map, in order find nearby restaurants they'd like to try.
Users can see their friends' instagram food photos that were taken in that location.
Users can also add their own instragram food photos, using #thatsmyjam so their friends in the area can see how good their food was.

using google map API
and instragram API
and firebase


## program flow:

### to add an instagram photo
* user takes a food photo and posts in their instagram account 
* user must use the hashtag #thatsmyjam 
* and have a location set for the post

### user logs in w instagram:
* look up their IG username in our DB of users, add if new user
* retrieve their user info and friends list from IG
* add / update their user info and friends list in our DB
* retrieve their tagged photos from IG, add to the DB if new
* get their friends' tagged photos from IG, add to the DB if new
* populate the current location map w their own and friends reviews

### logged in users can:
* filter displayed reviews by author
* add a new (no photo) review from the map + button or link
* change the location of the map

### Features for future development:
* have celebrities as optional "friends" to add curated content to your maps as well
* if a user puts the hastag but doesn't add a location, the app prompts them to add location info
* integrate google places to make adding a new location easier/more accurate
* ability to save your friends filter state for next login
* ability to invite friends
* update DB of photos from instagram in real time, not just on log in

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
