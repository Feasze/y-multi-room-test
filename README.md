# y-multi-room-test
an test with multiple rooms from Yjs. The server fills the room with data before connecting the client

## start up
 - run `npm update` and `bower update`
 - run `node server.js`
 - open the index.html in your browser
 
The rooms get loaded with dummy data. In every rooms there should be an y-array with 5 y-maps. In the y-maps are 2 y-text objects.
When reloading not all the rooms have these data. When checking on the server-side you can see that the rooms are filled.
 
 ## problem
 the problem is that when creating multiple rooms at the same time not all the rooms are synced.
