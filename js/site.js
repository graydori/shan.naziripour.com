// JavaScript Document
var handleHashChange = function(){
	
 	var removeActive = ($('.active').length && (!location.hash || location.hash == '#'));
	$('.active').transition({rotateY:-180}, function() {
		$(this).removeClass('active');
		if (removeActive)
		{
			$('body').removeClass('switching');
			$('.views').fadeOut('fast',function() { $(this).addClass('inactive'); });
		}
	});
	
	$('.loaded').removeClass('loaded');
	
	if (location.hash && location.hash != '#')
	{	
		var page = location.hash;
		$('body').addClass('switching');
		$('.views').fadeIn('fast',
			function(){
				$(page).transition({rotateY:0}).addClass("active");
				setTimeout(function(){ 
					$(".active").addClass('loaded'); 
				},1000);
			});
	}

};
$('body').addClass('page-loaded');
$(function(){
		$('body').removeClass('switching');
		
		if($.browser.msie){
			handleHashChange();
		} else {
			//setup the views as hidden
	  		$('.view').transition({rotateY:-180}, handleHashChange);
		}
		
	  // Bind the event.
	  $(window).hashchange(handleHashChange);
});