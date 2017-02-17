$(window).ready(function(){
	
	var scrollPos = 0;
	$(document).scroll(function(){
		current_scroll = $(this).scrollTop();
		if(current_scroll < 600){
			$('body').css('background-image', '-webkit-gradient(linear, right top, left top, from(rgba(0,0,0,' + current_scroll/1000 + ')), to(rgba(0,0,0,' + current_scroll/1000 + '))), url("./images/background1.jpg")')
		} else {
			$('body').css('background-image', '-webkit-gradient(linear, right top, left top, from(rgba(0,0,0,' + 600/1000 + ')), to(rgba(0,0,0,' + 600/1000 + '))), url("./images/background1.jpg")')	
		}
	});
});

var choice = -1;
function showDescription(val){
	if(choice == val){
		document.getElementById("proj-description"+val).innerHTML = "";
		choice = -1;
		return;
	}

  if(choice != -1){
    document.getElementById("proj-description"+choice).innerHTML = "";
    choice = -1;
  }

	if(val == 1) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>Guest book - Interactive solution (LiU), 2016</h3><p><b>Course:</b><i> Advanced Interaction Design</i></br> This was a group project at master level aiming to find a better solution for a guest book placed in a museum. You can see in the video how the already existing solution transforms into our design solution. The purpose of the course was to get a better understanding for creative thinking and find interactive solutions where the users are the main focus. To achieve this, we read a lot of articles about user experience, prototyping and testing.</p></div>";
    } else if (val == 2){
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>highPRunner - A running app (EPFL), 2016</h3><p><b>Course:</b><i> Personal Interaction Studio</i><br> This is a concept of a running app that gives you personal recommendations on what tracks you should take based on your fitness. The film shows the concept and how the app might look like if it was developed and what it can do. <br>Real data from a runner were tested through the project to get an understanding on what it can be used for. A web-app was created to try some visualizations and to experiment with the data. The goal with this course was to create a 5D map. <a href='https://github.com/cecla/highPRunner' target='blank' class='image fit'>GitHub, for more information.</a></p></div>";
    } else if (val == 3) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>[just,say,hi] - Film Project (EPFL), 2016</h3><p><b>Course:</b><i> Artistic Practices II</i></br> The purpose of this project was to create something artistic that would change the way we look at things. In this case, how do people look at the metro in Lausanne? Is it possible to see the metro as something more than just an underground subway? This film was made to evoke a feeling in people to be more open and hopefully they will take the next step and say hi to a stranger.</p></div>";
    } else if (val == 4) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>WeCan - Health app concept (EPFL), 2016</h3><p><b>Course:</b><i> Human Computer Interaction</i></br> This course was about learning more about the field HCI. We had a project in this course which was about developing an app to gain peoples health. My group were focusing on the students' mental health and came up with the idea WeCan. It is an app for fast achievements that you and your friends can do together, and in the long-run this will gain students' mental health. The project is based on methods used in HCI and research about mental health.</p></div>";
    } else if (val == 5) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>Medusa - 3D Scanner (LiU), 2015</h3><p><b>Course:</b><i> Bachelor Project</i></br> Medusa is a 3D scanner using Kinect cameras to do a full-body scan. The criteria for the project was to develop a scanner that is easy enough to use for users so there is no need for assistance. It should be connected and controlled by an iPad. The aim of the course was to do a semester project using agile methods. <a href='https://github.com/tistatos/Medusa' target='blank' class='image fit'>GitHub</a></p></div>";
    } else if (val == 6) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>Quadcopter - Modelling Project (LiU), 2015</h3><p><b>Course:</b><i> Modelling Project</i></br> This was a project combining the course modeling and simulation with media technology (visualization/ simulation). We decided to develop a web application simulating a quadcopter that you can control using the keyboard. The quadcopter follows the physics laws with only small modifications to make it more stable. <a href='http://trevligheten.se/quadproject/' target='blank' class='image fit'>The quadcopter</a></p></div>";
    } else if (val == 7) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>Flappa Freqt - Sound Game (LiU), 2014</h3><p><b>Course:</b><i> Physics of Sound</i></br> A web-application inspired by the game Flappy Bird, but instead of using your fingers to play, you use your voice. By analyzing the frequency of the voice, the program determines if the \"ear\" should move up- or downwards. <a href='http://danielronnkvist.github.io/flappy-wueeaaaoooo/' target='blank' class='image fit'>Try Flappa Freqt, here!</a></p></div>";
    } else if (val == 8) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>Lagerwall Consulting - Web Site, 2015</h3><p>A web site developed for the company Lagerwall Consulting. The tool Wordpress was used for this project. This gave the company the possibility to change some of the texts by themselves. I have designed the theme for this site using PHP, HTML, CSS and a HTML5 template. Bootstrap was used to make it responsive. <a class='dark-text' href='http://www.lagerwallconsulting.se/' target='blank' class='image fit'>Take a look, here!</a></p></div>";
    } else if (val == 9) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>Solas - 3D Project (LiU), 2014</h3><p><b>Course:</b><i> 3-D Computer Graphics</i></br> This is a game demo about the character Solas who is trying to light up the world again after the dark demons have taken over it. A light over his head creates a surrounding area around him, and everything inside the area comes to life while everything outside is dead and dark. The game engine Unity was used to develop the game and 3ds Max to create and animate all the characters and objects. <a href='https://github.com/Porraryd/Solas' target='blank' class='image fit'>GitHub</a></p></div>";
    } else if (val == 10) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>Fire simulation (LiU), 2016</h3><p><b>Course:</b><i> Advanced Game Programming</i></br>A particle system created in WebGL. Based on my own imagination and not on science. The purpose was to get more knowledge in computer graphics and how WebGL works.</p>";
    } else if (val == 11) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>INRC - Web Site, 2016</h3><p>A web site developed for the company International Reconsultants. The tool Wordpress was used for this project. This gave the company the possibility to change some of the texts by themselves. I have designed the theme for this site using PHP, HTML and CSS. Bootstrap was used to make it responsive. <a class='dark-text' href='http://internationalreconsultants.com/' target='blank' class='image fit'>Take a look, here!</a></p></div>";
    } else if (val == 12) {
      document.getElementById("proj-description" + val).innerHTML = "<div class='white-background'><h3>Advent Calendar - Web Application, 2016</h3><p>A fun project developed for my friends. A calendar including games, funny jokes, riddles etc. The site is using simple HTML, PHP, CSS, JavaScript and Bootstrap to make the site responsive. <a href='http://cecilialagerwall.se/julkalendern/'>Take a look, here!</a></p></div>";
    } else {
      document.getElementById("proj-description" + val).innerHTML = "NOPE";
    }
    choice = val;
}