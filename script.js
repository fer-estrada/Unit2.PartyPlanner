const COHORT = "2502-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    parties: []
};

const eventsList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvents");
addEventForm.addEventListener("submit", addEvent);

// ===================================================================================

async function render() {
    await getEvents();
    renderEvents();
}

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.parties = json.data;
    } catch (error) {
        console.log(error);
    }
}

async function addEvent(event) {
    event.preventDefault();
    
    let newDate = `${addEventForm.date.value}:00Z`
    
    await createEvent(
        addEventForm.name.value,
        newDate,
        addEventForm.location.value,
        addEventForm.description.value
    );
}

async function createEvent(name, date, location, description) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, date, location, description})
    });
        const json = await response.json();
        render();
    } catch (error) {
        console.log(error);
    }
}

async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        render();
    } catch (error) {
        console.log(error);
    }
}

async function renderEvents() {
    if (!state.parties.length) {
        eventsList.innerHTML =
        `<li>No events scheduled`;
        return;
    }

    const eventElements = state.parties.map((party) => {
        const eventElement = document.createElement("li");
        eventElement.classList.add("event")
        eventElement.innerHTML = `
        <h3>${party.name}</h3>
        <p>${party.date}</p>
        <p>${party.location}</p>
        <p>${party.description}</p>
        `;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        eventElement.append(deleteButton);
        deleteButton.addEventListener("click", () => deleteEvent(party.id));

        return eventElement;
    });
    eventsList.replaceChildren(...eventElements);
}

render();