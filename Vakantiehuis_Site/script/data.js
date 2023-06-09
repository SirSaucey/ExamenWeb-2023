fetch('script/data.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('description-content').innerText = data.description;

    var facilitiesList = document.getElementById('facilities-list');
    data.facilities.forEach(facility => {
      var listItem = document.createElement('li');
      var iconElement = document.createElement('i');
      iconElement.classList.add('fas');

      // Assign icon classes based on the facility type
      if (facility.includes('Living met open keuken')) {
        iconElement.classList.add('fa-couch');
      } else if (facility.includes('Microgolf heteluchtoven, vaatwasser, wasmachine en droogkast')) {
        iconElement.classList.add('fa-utensils');
      } else if (facility.includes('1 slaapkamers met tweepersoonsbed')) {
        iconElement.classList.add('fa-bed');
      } else if (facility.includes('1 slaapkamer met 2 eenpersoonsbedden')) {
        iconElement.classList.add('fa-bed');
      } else if (facility.includes('2 badkamers met douches, lavabo en toilet')) {
        iconElement.classList.add('fa-bath');
      } else if (facility.includes('Afgesloten inpandig terras en groot zonnige dakterras')) {
        iconElement.classList.add('fa-sun');
      } else if (facility.includes('Gemeenschappelijk zwembad')) {
        iconElement.classList.add('fa-swimmer');
      } else if (facility.includes('Parking voorzien rechtover het appartement.')) {
        iconElement.classList.add('fa-parking');
      }

      listItem.appendChild(iconElement);
      listItem.innerHTML += facility.replace(iconElement.classList[1], ''); // Remove the icon class from the facility text
      facilitiesList.appendChild(listItem);
    });
  })
  .catch(error => console.error('Error loading JSON file:', error));
