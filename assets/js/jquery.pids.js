jQuery(document).ready(function($) {

  var authenticate_script = '/pbsoauth/authenticate/';
  var loginform = window.location.protocol + '//' + window.location.hostname + '/pbsoauth/loginform/';
  var joinlink = "/donate/";
  var userinfolink = '/pbsoauth/userinfo/';
  var activatelink = '/pbsoauth/activate/';
  var station_call_letters_lc = 'wnet';
  var learnmorelink = '/passport/';

  if (typeof pbs_passport_authenticate_args !== "undefined"){
    authenticate_script = pbs_passport_authenticate_args.laas_authenticate_script;
    loginform = pbs_passport_authenticate_args.loginform;
    joinlink = pbs_passport_authenticate_args.joinurl;
    userinfolink = pbs_passport_authenticate_args.userinfolink;
    activatelink = pbs_passport_authenticate_args.activatelink;
    if (typeof pbs_passport_authenticate_args.station_call_letters_lc !== "undefined"){
       station_call_letters_lc = pbs_passport_authenticate_args.station_call_letters_lc;
    }
  }

  /* in case the loginform url has no protocol */
  if (!/^https?:\/\//i.test(loginform)) {
    /* in case the loginform url starts with '//' */
    loginform = loginform.replace(/^(\/\/)/, '');
    loginform = window.location.protocol + '//' + loginform;
  }

 
  function loginToPBS(event) {
    event.preventDefault();
    if (window.location != loginform) {
      document.cookie='pbsoauth_login_referrer=' + window.location + '?dontcachme=' + Math.random() + ';domain=' + window.location.hostname + ';path=/';
    }
    window.location = loginform;
  }

  function joinPBS(event) {
    event.preventDefault();
    if (window.location != loginform) {
      document.cookie='pbsoauth_login_referrer=' + window.location + '?dontcachme=' + Math.random() + ';domain=' + window.location.hostname + ';path=/';
    }
    window.location = joinlink;
  }

  function activatePBS(event) {
    event.preventDefault();
    if (window.location != loginform) {
      document.cookie='pbsoauth_login_referrer=' + window.location + '?dontcachme=' + Math.random() + ';domain=' + window.location.hostname + ';path=/';
    }
    window.location = activatelink;
  }

  function learnMorePassport(event) {
    event.preventDefault();
    if (window.location != loginform) {
      document.cookie='pbsoauth_login_referrer=' + window.location + '?dontcachme=' + Math.random() + ';domain=' + window.location.hostname + ';path=/';
    }
    window.location = learnmorelink;
  }

 
  function checkPBSLogin() {
    user = Cookies.getJSON('pbs_passport_userinfo');
    if ( typeof(user) !== "undefined" && typeof(user.membership_info) !== "undefined") {
        updateLoginVisuals(user);
      } else {
        $('.pbs_passport_authenticate button.launch, .pbs_passport_authenticate_logged_in_hide').hide();
        retrievePBSLoginInfoViaAJAX();
      }
	if (user.pid) {dataLayer = [{'userID': user.pid }];}
	console.log(dataLayer);
  }

  function retrievePBSLoginInfoViaAJAX() {
    $.ajax({
      url: authenticate_script,
      data: null,
      type: 'POST',
      dataType: 'json',
      success: function(response) {
        user = response;
        updateLoginVisuals(user);
      }
    });
  }

  //function updateLoginVisuals(user){
  updateLoginVisuals = function(user) {
    if (user){
      // if somehow still on loginform after logging in, redirect to userinfo page
      if (window.location == loginform) { window.location = userinfolink; }

      /*  status = On: member has not been disabled or expired
       *  offer = not null:  member is in mvault and activated
       *  status = Off + offer = null: default -- visitor not activated
       *  status = On + offer = not null: member activated and valid for video
       *  status = Off + offer = not null: activated member is expired
       *  status = On + offer = null: should not be possible, but not valid
      */ 
   
		if (user.membership_info.status == 'On') {passportIcon = 'passport-link-icon';}
		else {passportIcon = 'passport-alert-icon';} 

    if (typeof user.membership_info.offer !== 'undefined' && user.membership_info.offer) {
      $('.pbs_passport_authenticate_activated_hide').hide();
    }

    $('.pbs_passport_authenticate button.launch, .pbs_passport_authenticate_logged_in_hide').hide();
    thumbimage = '';
    if (user.thumbnail_URL) {
      thumbimage = "<a href='" + userinfolink + "' class='userthumb'><img src=" + user.thumbnail_URL + " /></a>"; 
    }	
		welcomestring = thumbimage + '<a href="' + userinfolink + '" class="' + passportIcon + '"><span class="welcome">' + user.first_name + '</span></a> <a class="signout">Sign Out</a>';
     
      $('.pbs_passport_authenticate div.messages').html(welcomestring);
	  
      
      $('.pbs_passport_authenticate a.signout').click(logoutFromPBS);
	  
		  // update thumb overlays
		  if ($(".passport-video-thumb")[0]){
			  $('.passport-video-thumb').each(function( index ) {
				  if (user.membership_info.status == 'Off') {
					  $('.passport-thumb-signin', this).html('ACTIVATE TO WATCH');
  				}
	  			else {
		  			$('.passport-thumb-signin', this).remove();  	
			  		$(this).removeClass('passport-video-thumb');  	
				  }	
  		  });
	  	}	  
		  // end update thumb overlays
	  
  		// if user signed in, but not activated. change video overlay link.
	  	if ($(".pp-sign-in.pbs_passport_authenticate")[0] && user.membership_info.status == 'Off'){
		  	$('.pp-sign-in.pbs_passport_authenticate').html('<a href="' + activatelink + '" class="passport-activate"><span>ACTIVATE ACCOUNT</span></a>');
  		}
		
	  	//passport player.
      if (user.membership_info.status == 'On'){
        $(".passportcoveplayer").each(function (i) {
          if (typeof($(this).data('window')) !== 'undefined') {
            var videoWindow = $(this).data('window');
            var videoID = $(this).data('media'); 
            if (videoWindow != 'public' && videoWindow != '' && !$(this).hasClass("playing")) {
              $(this).html('<div class="embed-container video-wrap"><iframe id="partnerPlayer_'+ i +'" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen="allowfullscreen" src="//player.pbs.org/widget/partnerplayer/'+videoID+'/?chapterbar=false&uid='+user.pid+'&callsign='+station_call_letters_lc+'"></iframe></div>');
              $(this).addClass('playing');
            }
          }
        });
      }
	  	// end passport player.
	  
    } else {
      setTimeout(function() {
        $('.pbs_passport_authenticate button.launch, .pbs_passport_authenticate_logged_in_hide').show();
        $('.pbs_passport_authenticate button.launch, .pbs_passport_authenticate_login').click(loginToPBS);
        $('.pbs_passport_authenticate_join').click(joinPBS);
        $('.pbs_passport_authenticate_activate').click(activatePBS);
        $('.pbs_passport_authenticate .learn-more').click(learnMorePassport);
      }, 500);
    }
  }

  function logoutFromPBS(event) {
    event.preventDefault();
    $.ajax({
      url: authenticate_script,
      data: 'logout=true',
      type: 'POST',
      dataType: 'json',
      success: function(response) {
        window.location.href = window.location.protocol + '//' + window.location.host;
      }
    });
  }

  $(function() {
    checkPBSLogin();
  });
  
  
     /* optin challenge */
	$( "#passport-confirm-optin" ).click(function() {
		if ($('input#pbsoauth_optin').prop('checked')) {
			if (user) {
				// if user already logged in
				var memberid = getQueryStringParamPBS('membership_id');
				$.ajax({
					url: activatelink,
					data: 'membership_id=' + memberid + '',
					type: 'POST',
					dataType: 'json',
					success: function(response) {
						var destination = Cookies.getJSON('pbsoauth_login_referrer');
						if (destination == null) {var destination = '/';}
						if (destination.indexOf("pbsoauth") > -1) {window.location.href = "/";}
						else {window.location.href = destination; }
				      }
			    });
			}
			else {
				// else user not logged in
				$('.add-login-fields').removeClass('hide');
				if ($(".passport-optin-challenge")[0]){$('.passport-optin-challenge').hide();}
			}	
		}
		else {
			// else checkbox not checked
			$('.passport-optin-error').html('<p class="passport-error">Sorry, you must check the checkbox to continue.</p>');
		}
	});
  	/* end optin challenge */
  
  	function getQueryStringParamPBS(sParam) {
	    var sPageURL = window.location.search.substring(1);
    	var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) {
        	var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) {return sParameterName[1];}
    	}
	}
  
  
});

