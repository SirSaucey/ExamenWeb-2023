// Initialize Firebase
    const bookingFirebaseConfig = {
        apiKey: "AIzaSyDtfJ21B_ONkFrsSvQsq0RESaNj_33iiAw",
        authDomain: "booking-98d89.firebaseapp.com",
        databaseURL: "https://booking-98d89-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "booking-98d89",
        storageBucket: "booking-98d89.appspot.com",
        messagingSenderId: "522326080572",
        appId: "1:522326080572:web:55dd5306b7d3afffe09739"
    };

    const booking = firebase.initializeApp(bookingFirebaseConfig, 'booking');
    const bookingDatabase = booking.database();
    

// Get the booking form elements
const nameInput = document.getElementById("booking-name");
const emailInput = document.getElementById("booking-email");
const checkInInput = document.getElementById("check-in");
const checkOutInput = document.getElementById("check-out");
const bookingButton = document.getElementById("booking-button");

// Define the character limit for the name
const nameCharacterLimit = 30;

// Add event listener to the booking button
bookingButton.addEventListener("click", () => {
  // Get the values from the form inputs
  const name = nameInput.value;
  const email = emailInput.value;
  const checkIn = checkInInput.value;
  const checkOut = checkOutInput.value;

  // Check if the selected dates are already booked
  const bookingsRef = bookingDatabase.ref("bookings");
  bookingsRef.once("value", function(snapshot) {
    const bookings = snapshot.val();
    const isBooked = checkBookingAvailability(bookings, checkIn, checkOut);

    if (isBooked) {
      alert("The selected dates are already booked. Please choose different dates.");
    } else if (!email.includes("@")) {
      alert("Please enter a valid email address.");
    } else if (name.length > nameCharacterLimit) {
      alert(`Name should not exceed ${nameCharacterLimit} characters.`);
    } else {
      // Store the data in the Realtime Database
      const newBookingRef = bookingsRef.push();
      newBookingRef
        .set({
          name: name,
          email: email,
          checkIn: checkIn,
          checkOut: checkOut,
        })
        .then(() => {
          console.log("Booking stored with ID: ", newBookingRef.key);
          location.reload(); // Refresh the page
        })
        .catch((error) => {
          console.error("Error storing booking: ", error);
        });
    }
  });
});



// Function to check if the selected dates are already booked
function checkBookingAvailability(bookings, checkIn, checkOut) {
  for (const key in bookings) {
    if (bookings.hasOwnProperty(key)) {
      const booking = bookings[key];
      const bookedCheckIn = booking.checkIn;
      const bookedCheckOut = booking.checkOut;

      // Compare the selected dates with the booked dates
      if (
        (checkIn >= bookedCheckIn && checkIn <= bookedCheckOut) ||
        (checkOut >= bookedCheckIn && checkOut <= bookedCheckOut) ||
        (checkIn <= bookedCheckIn && checkOut >= bookedCheckOut)
      ) {
        return true; // Dates are already booked
      }
    }
  }

  return false; // Dates are available
}

function createBookingCard(booking) {
    const card = document.createElement("div");
    card.classList.add("booking-card");
  
    const name = document.createElement("h4");
    name.textContent = "Naam: " + booking.name;
  
    const email = document.createElement("h4");
    email.textContent = "Email: " + booking.email;
  
    const date1 = document.createElement("p");
    date1.textContent = "Check-In Datum: " + booking.checkIn;

    const date2 = document.createElement("p");
    date2.textContent = "Check-Out Datum: " + booking.checkOut;
  
    card.appendChild(name);
    card.appendChild(email);
    card.appendChild(date1);
    card.appendChild(date2);
  
    return card;
  }
  
  function displayBookings(bookings) {
    const bookingsContainer = document.getElementById("bookings-container");
    bookingsContainer.innerHTML = "";
  /*
    for (const key in bookings) {
      if (bookings.hasOwnProperty(key)) {
        const booking = bookings[key];
        const card = createBookingCard(booking);
        bookingsContainer.appendChild(card);
      }
    }
    */
  }
  
  // Fetch bookings from the database
  const bookingsRef = bookingDatabase.ref("bookings");
  bookingsRef.on("value", function(snapshot) {
    const bookings = snapshot.val();
    displayBookings(bookings);
  });
  
  // Initialize FullCalendar
document.addEventListener("DOMContentLoaded", function() {
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      events: [], // Initial events array
    });
  
    calendar.render();
  
    // Fetch bookings from the database
    const bookingsRef = bookingDatabase.ref("bookings");
    bookingsRef.on("value", function(snapshot) {
      const bookings = snapshot.val();
      displayBookings(bookings);
      updateCalendarEvents(bookings);
    });
  
    function updateCalendarEvents(bookings) {
      const calendarEvents = [];
    
      for (const key in bookings) {
        if (bookings.hasOwnProperty(key)) {
          const booking = bookings[key];
          const event = {
            title: booking.name,
            start: booking.checkIn,
            end: booking.checkOut,
            color: "lightblue",
            bookingData: booking, // Add the booking data to the event object
          };
          calendarEvents.push(event);
        }
      }
    
      calendar.removeAllEvents();
      calendar.addEventSource(calendarEvents);
    
      // Add event click listener to the calendar
      calendar.on("eventClick", function (info) {
        const bookingData = info.event.extendedProps.bookingData;
        displayBookingPopup(bookingData);
      });
    }
    
    function displayBookingPopup(booking) {
      // Create and display the popup with the booking card
      const popup = document.createElement("div");
      popup.classList.add("booking-popup");
    
      const card = createBookingCard(booking);
      popup.appendChild(card);
    
      // Add a close button to the popup
      const closeButton = document.createElement("button");
      closeButton.textContent = "Sluiten";
      closeButton.addEventListener("click", closePopup);
      popup.appendChild(closeButton);
    
      // Append the popup to the body
      document.body.appendChild(popup);
    
      // Add the overlay and click outside listener
      addOverlay();
      addClickOutsideListener();
    }
    
    function closePopup() {
      const popup = document.querySelector(".booking-popup");
      popup.remove();
    
      // Remove the overlay and click outside listener
      removeOverlay();
      removeClickOutsideListener();
    }
    
    function addOverlay() {
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      document.body.appendChild(overlay);
    }
    
    function removeOverlay() {
      const overlay = document.querySelector(".overlay");
      overlay.remove();
    }
    
    function addClickOutsideListener() {
      const overlay = document.querySelector(".overlay");
      overlay.addEventListener("click", closePopup);
    }
    
    function removeClickOutsideListener() {
      const overlay = document.querySelector(".overlay");
      overlay.removeEventListener("click", closePopup);
    }    
  });
  
