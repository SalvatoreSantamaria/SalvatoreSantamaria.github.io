//Book Constructor
function Book(t, a, i) {
  this.title = t;
  this.author = a;
  this.isbn = i;
}

//UI Constructor
function UI() {}

//Adds book to list.
//Adds "addBookToList to prototype"
UI.prototype.addBookToList = function(book) {
  const list = document.getElementById('book-list');
  //Creates tr Element
  const row = document.createElement('tr');
  //Inserts cols with template literal
  row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href='#' class ='delete'>X<a></td>
  `;
  list.appendChild(row);
}

// Shows alert when one of the fields is left blank
UI.prototype.showAlert = function(themessage, className) {
  //Constructs Element for the error message
  let div = document.createElement('div');
  //Add classes to div. Below adds the class name "alert", and also adds in the classname that is passed in by the function
  div.className = `alert ${className}`;
  //Adds text by adding a text node. Actual text is the text coming in from the function
  div.appendChild(document.createTextNode(themessage));
  //Insert into the DOM. 
  //Get parent, which is the containter
  const container = document.querySelector('.container');
  //Get the form, because we want to put the error before the form
  const form = document.querySelector('#book-form');
  //Take container, which is parent, and insert div and what we want to insert before, which is form.
  container.insertBefore(div, form);
  //Set timeout after 3 seconds. Set timeout is part of the window object. Second parameter is number of milliseconds
  setTimeout(function(){
    document.querySelector('.alert').remove();
  }, 3000);
}

//Delete book
UI.prototype.deleteBook = function(target){
  if(target.className === 'delete') {
    //First parent element is td, second parent element is tr
    target.parentElement.parentElement.remove();
  }
}

//Clears field method
UI.prototype.clearfields = function(){
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}

//Event Listeners
//Event Listener for adding a book
document.getElementById('book-form').addEventListener('submit', 
  function(e) {

    //Gets form values
    let t = document.getElementById('title').value,
    a = document.getElementById('author').value,
    i = document.getElementById('isbn').value
   //Creates book
   let book = new Book(t, a, i);

   //Creates a UI object
   const ui = new UI();
   console.log(ui);
   // Uncomment to see the dynamically added classes we have added as prototypes
   
   //Validate that the forms have content
   if(t === '' || a === '' || i === '') {
   
   //Error Alert
   ui.showAlert('Please fill in all fields', 'error');

   } else {

   //Adds book to list
   ui.addBookToList(book);
   //Shows success message when book is successfully added
   ui.showAlert('Book Added!', 'success');

   //Clears input fields
   ui.clearfields();

   }

//prevents initial behavior
  e.preventDefault();
});

//Event Listener for deleting a book. Function takes in event, which is e.
document.getElementById('book-list').addEventListener('click', function(e){
//Target delete X from within prototype method in the UI
//creates "ui"
const ui = new UI();
//calls ui method of deleteBook and passes in the target
ui.deleteBook(e.target);
//Shows alert of 'Book removed' using the class of success
ui.showAlert('Book Removed', 'success');

  e.preventDefault();
});
