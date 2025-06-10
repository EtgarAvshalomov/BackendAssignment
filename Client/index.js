const getEvent = () => {
    const id = document.getElementById("getEvent-id").value;
    const getEventURL = `http://localhost:5240/api/Events/${id}`;

    fetch(getEventURL) 
        .then(response => { 
            if (!response.ok) { 
                throw new Error(`HTTP error ${response.status}`); } return response.json(); 
            }
        ).then(data => { 
            console.log('Events: ', data);

            let container = document.querySelector("#get-event-container");
            container.innerHTML = "";

            let newEvent = document.createElement("div");
            newEvent.classList.add("event");
            newEvent.id = data.id;

            let text = document.createElement("p");
            text.innerHTML += `Id: ${data.id}, `;
            text.innerHTML += `Name: ${data.name}, `;
            text.innerHTML += `Start Date: ${data.startDate}, `;
            text.innerHTML += `End Date: ${data.endDate}, `;
            text.innerHTML += `Max Registrations: ${data.maxRegistrations}, `;
            text.innerHTML += `Location: ${data.location}, `;
            newEvent.appendChild(text);

            let location = document.createElement("a");
            location.innerHTML = "Google Maps Location";
            location.href = `https://google.com/maps?daddr=${data.location}`;
            location.target = "_blank";
            newEvent.appendChild(location);

            container.appendChild(newEvent);

        }
        ).catch(function (error) { 
            console.log(error); 
        });
}

const getEventUsers = () => {
    const id = document.getElementById("getEventUsers-id").value;
    const getEventUserURL = `http://localhost:5240/api/Events/${id}/registration`;

    fetch(getEventUserURL) 
        .then(response => { 
            if (!response.ok) { 
                throw new Error(`HTTP error ${response.status}`); } return response.json(); 
            }
        ).then(data => { 
            console.log('Event Users: ', data);

            let container = document.querySelector("#get-event-users-container");
            container.innerHTML = "";

            for(let user of data) {
                let newEventUser = document.createElement("div");
                newEventUser.classList.add("event-user");
                newEventUser.id = user.id;

                let text = document.createElement("p");
                text.innerHTML += `Id: ${user.id}, `;
                text.innerHTML += `Name: ${user.name}, `;
                text.innerHTML += `Date Of Birth: ${user.dateOfBirth}, `;
                newEventUser.appendChild(text);

                console.log(container);
                container.appendChild(newEventUser);
            }

        }
        ).catch(function (error) { 
            console.log(error); 
        });
}

const getEventsSchedule = () => {
    const startDate = document.getElementById("getEventsSchedule-startDate").value;
    const endDate = document.getElementById("getEventsSchedule-endDate").value;
    const getEventsScheduleURL = `http://localhost:5240/api/Events/schedule?startDate=${startDate}&endDate=${endDate}`;

    fetch(getEventsScheduleURL) 
        .then(response => { 
            if (!response.ok) { 
                throw new Error(`HTTP error ${response.status}`); } return response.json(); 
            }
        ).then(data => { 
            console.log('Events: ', data);

            let container = document.querySelector("#get-events-schedule-container");
            container.innerHTML = "";

            for(let event of data) {
                let newEvent = document.createElement("div");
                newEvent.classList.add("event");
                newEvent.id = event.id;

                let text = document.createElement("p");
                text.innerHTML += `Id: ${event.id}, `;
                text.innerHTML += `Name: ${event.name}, `;
                text.innerHTML += `Start Date: ${event.startDate}, `;
                text.innerHTML += `End Date: ${event.endDate}, `;
                text.innerHTML += `Max Registrations: ${event.maxRegistrations}, `;
                text.innerHTML += `Location: ${event.location}, `;
                newEvent.appendChild(text);

                let location = document.createElement("a");
                location.innerHTML = "Google Maps Location";
                location.href = `https://google.com/maps?daddr=${event.location}`;
                location.target = "_blank";
                newEvent.appendChild(location);

                container.appendChild(newEvent);
            }

        }
        ).catch(function (error) { 
            console.log(error); 
        });
}

const getEventWeather = () => {
    const id = document.getElementById("getEventWeather-id").value;
    const getEventWeatherURL = `http://localhost:5240/api/Events/${id}/weather`;

    fetch(getEventWeatherURL) 
        .then(response => { 
            if (!response.ok) { 
                throw new Error(`HTTP error ${response.status}`); } return response.json(); 
            }
        ).then(data => { 
            console.log('Weather: ', data);

            let container = document.querySelector("#get-event-weather-container");
            container.innerHTML = "";

            let newWeather = document.createElement("div");
            newWeather.classList.add("weather");
            newWeather.id = data.id;

            let text = document.createElement("p");
            text.innerHTML += `City: ${data.city}, `;
            text.innerHTML += `Temperature: ${data.temperature}, `;
            text.innerHTML += `Weather Description: ${data.weatherDescription}, `;
            text.innerHTML += `Wind Speed: ${data.windSpeed}, `;
            newWeather.appendChild(text);

            container.appendChild(newWeather);

        }
        ).catch(function (error) { 
            console.log(error); 
        });
}

const createNewEvent = () => {
    const name = document.getElementById("createEvent-name").value;
    const startDate = document.getElementById("createEvent-startDate").value;
    const endDate = document.getElementById("createEvent-endDate").value;
    const maxRegistrations = parseInt(document.getElementById("createEvent-maxRegistrations").value);
    const location = document.getElementById("createEvent-location").value;

    const newEventDetails = {
        name: name,
        startDate: startDate,
        endDate: endDate,
        maxRegistrations: maxRegistrations,
        location: location
    }

    const jsonString = JSON.stringify(newEventDetails);

    const createEventURL = `http://localhost:5240/api/Events/`;

    const postEventsOptions = { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: jsonString 
    };

    fetch(createEventURL, postEventsOptions) 
        .then(response => { 
            if (!response.ok) { 
                throw new Error(`HTTP error ${response.status}`); } return response.json(); 
            }
        ).then(data => { 
            console.log('New Event: ', data);

            let container = document.querySelector("#create-event-container");
            container.innerHTML = "";

            let newEvent = document.createElement("div");
            newEvent.classList.add("event");
            newEvent.id = data.id;

            let successMessage = document.createElement("p");
            successMessage.innerHTML += "Event Created Successfully!";
            newEvent.appendChild(successMessage);

            let text = document.createElement("p");
            text.innerHTML += `Id: ${data.id}, `;
            text.innerHTML += `Name: ${data.name}, `;
            text.innerHTML += `Start Date: ${data.startDate}, `;
            text.innerHTML += `End Date: ${data.endDate}, `;
            text.innerHTML += `Max Registrations: ${data.maxRegistrations}, `;
            text.innerHTML += `Location: ${data.location}, `;
            newEvent.appendChild(text);

            container.appendChild(newEvent);

        }
        ).catch(function (error) { 
            console.log(error); 
        });
}

const registerToEvent = () => {
    const id = document.getElementById("registerToEvent-id").value;
    const getEventUserURL = `http://localhost:5240/api/Events/${id}/registration`;

    const name = document.getElementById("registerToEvent-name").value;
    const dateOfBirth = document.getElementById("registerToEvent-dateOfBirth").value;

    const newUserDetails = {
        name: name,
        dateOfBirth: dateOfBirth
    }

    const jsonString = JSON.stringify(newUserDetails);

    const postEventsOptions = { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: jsonString 
    };

    fetch(getEventUserURL, postEventsOptions) 
        .then(response => { 
            if (!response.ok) { 
                throw new Error(`HTTP error ${response.status}`); } return response.statusText; 
            }
        ).then(() => { 

            let container = document.querySelector("#register-to-event-container");
            container.innerHTML = "";

            let newUser = document.createElement("div");
            newUser.classList.add("user");

            let successMessage = document.createElement("p");
            successMessage.innerHTML += "You Registered Successfully!";
            newUser.appendChild(successMessage);

            container.appendChild(newUser);
        }
        ).catch(function (error) { 
            console.log(error); 
        });
}

const updateEvent = () => {
    const id = document.getElementById("updateEvent-id").value;
    const createEventURL = `http://localhost:5240/api/Events/${id}`;

    const name = document.getElementById("updateEvent-name").value;
    const startDate = document.getElementById("updateEvent-startDate").value;
    const endDate = document.getElementById("updateEvent-endDate").value;
    const maxRegistrations = parseInt(document.getElementById("updateEvent-maxRegistrations").value);
    const location = document.getElementById("updateEvent-location").value;

    const updatedEventDetails = {
        name: name,
        startDate: startDate,
        endDate: endDate,
        maxRegistrations: maxRegistrations,
        location: location
    }

    const jsonString = JSON.stringify(updatedEventDetails);

    const putEventsOptions = { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: jsonString 
    };

    fetch(createEventURL, putEventsOptions) 
        .then(response => { 
            if (!response.ok) { 
                throw new Error(`HTTP error ${response.status}`); } return response.statusText; 
            }
        ).then(() => { 

            let container = document.querySelector("#update-event-container");
            container.innerHTML = "";

            let newMessage = document.createElement("div");
            newMessage.classList.add("message");

            let successMessage = document.createElement("p");
            successMessage.innerHTML += "Event Updated Successfully!";
            newMessage.appendChild(successMessage);

            container.appendChild(newMessage);
        }
        ).catch(function (error) { 
            console.log(error); 
        });
}

const deleteEvent = () => {
    const id = document.getElementById("deleteEvent-id").value;
    const getEventURL = `http://localhost:5240/api/Events/${id}`;

    const deleteEventsOptions = { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' }
    };

    fetch(getEventURL, deleteEventsOptions) 
        .then(response => { 
            if (!response.ok) { 
                throw new Error(`HTTP error ${response.status}`); } return response.statusText; 
            }
        ).then(() => {
            
            let container = document.querySelector("#delete-event-container");
            container.innerHTML = "";

            let newMessage = document.createElement("div");
            newMessage.classList.add("message");

            let successMessage = document.createElement("p");
            successMessage.innerHTML += "Event Deleted Successfully!";
            newMessage.appendChild(successMessage);

            container.appendChild(newMessage);
        }
        ).catch(function (error) { 
            console.log(error); 
        });
}