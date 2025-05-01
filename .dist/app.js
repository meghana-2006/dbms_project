// script.js
function navigate(page) {
  switch (page) {
    case 'Drone-Rentals':
      window.location.href = 'Drone-Rentals.html';
      break;
    case 'crop-recommendations':
      window.location.href = 'crop-recommendations.html';
      break;
    case 'disease-reports':
      window.location.href = 'disease-reports.html';
      break;
    case 'yield-predictions':
      window.location.href = 'yield-predictions.html';
      break;
    case 'Manure-Supply':
      window.location.href = 'Manure-Supply.html';
      break;
    case 'Loans-and-Subsidies':
      window.location.href = 'Loans-and-Subsidies.html';
      break;
    case 'retailer-orders':
        window.location.href = 'retailer-orders.html';
        break;
    default:
      alert('Page under construction!');
  }
}
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
      {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,ta,te,kn,bn,gu,mr,ml,pa',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      },
      'languageSelect'
  );
}
// Add the disease route
app.use('/api/diseases', require('./routes/diseases'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
