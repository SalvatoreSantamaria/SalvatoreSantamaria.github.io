// //Event bubbling
// document.querySelector('.card-title').addEventListener('click', function(){
//   console.log('card title');
// });

// document.querySelector('.card-content').addEventListener('click', function(){
//   console.log('card content');
// });

//EVENT DELEGATION
//use when an element was dynamically added to a page after the page was loaded. essentially it's adding an event listener on the parent of what you are looking for,  and then putting a condition in to find the target. then do the functionality.