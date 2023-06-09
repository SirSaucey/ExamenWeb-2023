// Initialize Firebase
// Your web app's Firebase configuration
const ratingFirebaseConfig  = {
    apiKey: "AIzaSyDQmBk0PJ7aDgrODulRWZeIqeFa-DzMlzM",
    authDomain: "rating-bf622.firebaseapp.com",
    databaseURL: "https://rating-bf622-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "rating-bf622",
    storageBucket: "rating-bf622.appspot.com",
    messagingSenderId: "342024220188",
    appId: "1:342024220188:web:9f416ab871ee3c29cc39d9"
  };
  
  const rating = firebase.initializeApp(ratingFirebaseConfig);
  const ratingDatabase = rating.database();
  var reviewsRef = firebase.database().ref('reviews');
  
  function showReviews() {
    reviewsRef.on('value', function(snapshot) {
      var reviews = snapshot.val();
      var reviewsContainer = document.getElementById('reviews-container');
      reviewsContainer.innerHTML = ''; // Clear previous reviews
  
      for (var key in reviews) {
        if (reviews.hasOwnProperty(key)) {
          var review = reviews[key];
          var card = createReviewCard(review);
          reviewsContainer.appendChild(card);
        }
      }
    });
  }
  
  function createReviewCard(review) {
    var card = document.createElement('div');
    card.classList.add('review-card');
  
    var name = document.createElement('h4');
    name.textContent = review.name;
  
    var rating = document.createElement('div');
    rating.classList.add('stars');
  
    for (var i = 1; i <= 5; i++) {
      var star = document.createElement('span');
      star.classList.add('star');
  
      if (i <= review.stars) {
        star.classList.add('selected');
      }
  
      rating.appendChild(star);
    }
  
    var message = document.createElement('p');
    message.textContent = review.message;
  
    card.appendChild(name);
    card.appendChild(rating);
    card.appendChild(message);
  
    return card;
  }  
  
// Show the pop-up when the "Rate Us" button is clicked
var rateUsButton = document.querySelector('.rate-us-button');
rateUsButton.addEventListener('click', function() {
  var popup = document.getElementById('rating-popup');
  popup.style.display = 'block';
  document.body.classList.add('modal-open');
  blurMainContainer(true); // Add blur effect
});

// Close the pop-up when the "Close" button is clicked
var closeButton = document.querySelector('.close');
closeButton.addEventListener('click', function() {
  closePopup();
});

// Close the pop-up when the user clicks outside the pop-up
window.addEventListener('click', function(event) {
  var popup = document.getElementById('rating-popup');
  if (event.target === popup) {
    closePopup();
  }
});

function closePopup() {
  var popup = document.getElementById('rating-popup');
  popup.style.display = 'none';
  document.body.classList.remove('modal-open');
  blurMainContainer(false); // Remove blur effect
}

function blurMainContainer(blur) {
  var mainContainer = document.getElementById('main-container');
  if (blur) {
    mainContainer.classList.add('blur');
  } else {
    mainContainer.classList.remove('blur');
  }
}

  // Handle the "Submit Rating" button click
  var submitRatingButton = document.getElementById('submit-rating-button');
  submitRatingButton.addEventListener('click', function() {
    submitRating();
  });
  
  var starContainer = document.querySelector('.stars');
  starContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('star')) {
      var selectedStars = event.target.getAttribute('data-value');
      selectStars(selectedStars);
    }
  });
  
  function selectStars(stars) {
    var starElements = document.querySelectorAll('.stars .star');
    starElements.forEach(function(star) {
      var starValue = star.getAttribute('data-value');
      if (starValue <= stars) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
  }
  
  function submitRating() {
    var nameInput = document.getElementById('name-input');
    var messageInput = document.getElementById('message-input');
    var selectedStars = parseInt(document.querySelector('.stars input[type="radio"]:checked').getAttribute('data-value'));
  
    if (isNaN(selectedStars)) {
      console.error('Invalid star value');
      return;
    }
    
    var name = nameInput.value.trim();
    if (name.length > 30) {
      name = name.slice(0, 30);
    }


    var message = messageInput.value.trim();
    if (message.length > 150) {
      message = message.slice(0, 150);
    }
  
    var newReview = {
      name: name,
      stars: selectedStars,
      message: message
    };
  
    // Store the new review in Firebase
    reviewsRef.push().set(newReview, function(error) {
      if (error) {
        console.log('Error submitting rating:', error);
      } else {
        // Clear the inputs after successful submission
        nameInput.value = '';
        messageInput.value = '';
        clearSelectedStars();
  
        // Close the pop-up
        closePopup();
  
        // Refresh the reviews display
        showReviews();
      }
    });
  }
  
  
  

// Handle star selection
var starInputs = document.querySelectorAll('.stars input[type="radio"]');
var starLabels = document.querySelectorAll('.stars .star');

starLabels.forEach(function(starLabel) {
  starLabel.addEventListener('click', function() {
    var selectedStars = parseInt(starLabel.getAttribute('data-value'));
    clearSelectedStars();
    selectStarsUpToRating(selectedStars);
  });
});

function clearSelectedStars() {
  starLabels.forEach(function(starLabel) {
    starLabel.classList.remove('selected');
  });
}

function selectStarsUpToRating(rating) {
  for (var i = 0; i < rating; i++) {
    starLabels[i].classList.add('selected');
  }
}

// Initially select stars based on the radio button value
starInputs.forEach(function(starInput) {
  starInput.addEventListener('change', function() {
    var selectedStars = parseInt(this.getAttribute('data-value'));
    clearSelectedStars();
    selectStarsUpToRating(selectedStars);
  });
});

  // Load initial reviews
  showReviews();
  