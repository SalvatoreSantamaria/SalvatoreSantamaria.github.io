//jQuery
$(document).ready(function(){
  //When search is clicked, code runs
  $("#search").click(function(){
    //Search Input
    var searchTerm=$("#searchTerm").val();
    //API URL from FCC instructions page. 
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ searchTerm +"&format=json&callback=?";

    $.ajax({
      type:"GET",
      url:url, 
      contentType: "application/json; charset=utf-8",
      async:false,
      dataType: "json",
      success: function(data){
      //console.log(data[1][0]);
      //console.log(data[2][0]);
      //console.log(data[3][0]);
        $('#output').html(' ')//this sets the results to blank(so that a search result doesnt stay on the page further down)
        for(var i=0; i<data[1].length;i++){
        $('#output').prepend("<li><a href= "+data[3][i]+">"+data[1][i]+"<a/><p>"+data[2][i]+"</p></li>");
        }
        $("#searchTerm").val(' ');//this targets the search bar value and sets it to be empty
    },
      error: function(errorMessage){
      alert("Error");
      
    }
    });
  });
  $("#searchTerm").keypress(function(e){
    if(e.which==13){
      $("#search").click();
    }
    //outside of the ajax call, targets search term. target the search term because we don't want you to be able to hit enter anywhere else and nothing get displayed
  });
});