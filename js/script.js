// JavaScript Document
  $(function(){
	  
	  $('.box_outer').each(function(){ 
	  var left= -(Math.floor(Math.random()*5) * 150);
	  var top = -(Math.floor(Math.random()*5) * 150);
	  $(this).css('background-position', left + 'px ' + top + 'px' );
	  });
	  // Bind the event.
	  $(window).hashchange( function(){
	  	// Alerts every time the hash changes!
		
		$('#box_container').removeClass();
		if (location.hash)
		{	
			var page = location.hash.substr(2);
			$('#box_container').addClass(page+"_content");
		}
		$('#box_container').addClass('loaded');
	  });
	  
	  // Trigger the event (useful on page load).
	  $(window).hashchange();
	  });