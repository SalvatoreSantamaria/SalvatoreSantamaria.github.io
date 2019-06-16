$(document).ready(function(){
  var randomQuote;
   var randomNum;
   var author;
   getQuote();
 function getQuote(){
 var quotes = ["Jerry, just remember, it's not a lie if you believe it.", "Hi, my name is George, I'm unemployed and I live with my parents.", "He fires people like it's a bodily function!","You know I always wanted to pretend I was an architect.","Only I could fail at failing.","Boy, these pretzels are makin' me thirsty. ","Little Jerry Seinfeld. Yeah I named my chicken after you.","Here's to feeling good all the time.","I can't believe he's in a coma. He's got my vacuum cleaner.","You're an anti-Dentite!","Hello, Newman.", "If you know what happened in the Mets game don't tell me, I taped it! Hello?","I had a dream last night that a hamburger was eating me.","Boy, a little too much chlorine in that gene pool.","Let's watch them slice this fat bastard up. ","I'm not a lesbian. I hate men, but I'm not a lesbian. ","Get out!","Why does everything have to be so... jokey with you? ","I’ll go, if I don’t have to talk.","You’re bald! I don’t like this thing! And here’s what I’m doing with it!",] //array
 var author1 = ["-George Costanza", "-George Costanza",  "-George Costanza", "-George Costanza", "-George Costanza", "-Kramer",  "-Kramer", "-Kramer", "-Kramer", "-Kramer", "-Jerry Seinfeld", "-Jerry Seinfeld", "-Jerry Seinfeld", "-Jerry Seinfeld", "-Jerry Seinfeld",  "-Elaine Benes",  "-Elaine Benes", "-Elaine Benes", "-Elaine Benes", "-Elaine Benes",]//array
 
  randomNum = Math.floor((Math.random()*quotes.length));//generates random quote
  randomQuote = quotes[randomNum];
  author = author1[randomNum];
   
 $(".quote").text(randomQuote); //targets quote class in html
 $(".author").text(author);//targets author class in html
   
 }
   $("#newQuote").on("click",function(){//targets button, calls  the function get quote on click
     getQuote();
        });
   
     $('#tweet').on("click", function(){//targets tweet button, calls new window to open with a tweet window with the random quote variable
       window.open("https://twitter.com/intent/tweet?text="+randomQuote + " " + author);
   });
   });