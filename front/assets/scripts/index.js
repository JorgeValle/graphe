import * as d3 from 'd3';

// MathJax config
MathJax.Hub.Config({
  tex2jax: {
    inlineMath: [ ['$','$'], ["\\(","\\)"] ],
    processEscapes: true
  }
});


// Accept cookies
(function() {

  var cookieConsent = document.getElementById('cookie-consent'),
      acceptCookies = document.getElementById('accept-cookies');

  // Check for cookie flag
  if (localStorage.getItem('jv-accept-cookies') == 'true') {
    
    // Hide
    cookieConsent.style.display = 'none';
  }

  acceptCookies.onclick = function() {

    localStorage.setItem('jv-accept-cookies', 'true');

    // Hide
    cookieConsent.style.display = 'none';
  }
})();

// Facebook SDK
(function() {
  // Facebook SDK
  window.fbAsyncInit = function() {
    FB.init({
      appId            : '347038975858578',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v3.2'
    });
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  } (document, 'script', 'facebook-jssdk'));
})();

// Google Analytics
(function(i,s,o,g,r,a,m) {i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-65509004-1', 'auto'); ga('send', 'pageview');

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/front/assets/scripts/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}