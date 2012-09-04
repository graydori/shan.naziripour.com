// JavaScript Document
function IS_POSITION_FIXED_SUPPORTED(){
  var container = document.body;
  
  if (document.createElement && container && container.appendChild && container.removeChild) {
    var el = document.createElement('div');
    
    if (!el.getBoundingClientRect) return null;
        
    el.innerHTML = 'x';
    el.style.cssText = 'position:fixed;top:100px;';
    container.appendChild(el);

    var originalHeight = container.style.height,
        originalScrollTop = container.scrollTop;

    container.style.height = '3000px';
    container.scrollTop = 500;

    var elementTop = el.getBoundingClientRect().top;
    container.style.height = originalHeight;
    
    var isSupported = (elementTop === 100);
    container.removeChild(el);
    container.scrollTop = originalScrollTop;

    return isSupported;
  }
  return null;
}
var fixed_support = IS_POSITION_FIXED_SUPPORTED();
if (fixed_support)
{
	$('body').addClass('fixed-support');
}
$('body').addClass('page-loaded');
var scroll = null;
$(function(){
		$('body').removeClass('switching');
		/* Mozilla Doesn't do Sizing */
		if ($.browser.mozilla) {
			$('#resume iframe').height($(window).height()*0.80);
			$(window).resize(function() {
				$('#resume iframe').height($(window).height()*0.80);
			});
		}
		
		//setup the views as hidden
	  $('.view').transition({rotateY:-180}, function() { 
	  		$(window).hashchange();
		});
	  // Bind the event.
	  $(window).hashchange( function(){
		
	 	var removeActive = ($('.active').length && !location.hash);
	
		$('.active').transition({rotateY:-180}, function() {
			$(this).removeClass('active');
			if (scroll)
			{
				scroll.destroy();
				scroll = null;
			}
			if (removeActive)
			{
				$('body').removeClass('switching switched');
				$('.views').fadeOut('fast',function() { $(this).addClass('inactive'); });
			}
		});
		
		$('.loaded').removeClass('loaded');
		
		if (location.hash)
		{	
			var page = location.hash;
			$('body').addClass('switching');
			$('.views').fadeIn('fast',
				function(){
					$(page).transition({rotateY:0},function(){
						$('body').addClass('switched');}).addClass("active");
					setTimeout(function(){ 
						$(".active").addClass('loaded'); 
						if (!fixed_support) {
						var scrollingElement = page +'-inner';
						if ($(scrollingElement).length) {
							scroll = new iScroll(scrollingElement.substring(1));
						}
						}
					},1000);
				});

		}

	  });
	  
	  });