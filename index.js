// /* === API Variable ===
// 1. Need to initiate the API variable
// */

// /* === Empty Array and Variable ===
// 1. Need empty parties Array
// 2. Need empty variable to hold selectedParty
// */

// /* === Fetch from API ===
// Need to fetch from the API the following:
// 1. Array of parties (fetch => try{}catch{})
// 2. Array details per selected party by ID (fetch => try{}catch{})
// */

// /* === Display, Logic, & Requests ===
// 1. Display component that stores the party list array to the left of the Screen
// -- This component will call the getParties function/fetch
// -- Display the following DOM script & then render function
// ---- Party name

// 2. A second display component for the selectedParty
// -- This component CHECK PREVIOUS EXAMPLES but my guess is that I need to check the getPartyDetails function but make sure that the call matches the ID of the selectedParty. then run it through the display
// - question, does selectedParty need to hold the ID or the name?
// -- Display the following DOM script & then render function:
// ---- Party Name
// ---- ID
// ---- Date
// ---- Description
// ---- Location

// 3. Event listener on party name in Display Component from party array/list
// -- Which will do the following:
// ---- On click action on specific party item from Array
// ---- Grab the ID and run it through the by ID function/fetch
// ---- Runs the selectedParty variable through another Display Component for the specific party selected details
// */

// /* === Needs to Render ===
// 1. Render the list of party names from the display component
// 2. Needs to render a default message on the right if a party is not selected "Select a party is none is selected."
// 3. Needs to render the specific party selected on the right from the event listener click
// */

/* === Code Start === */

/**
 * @typedef Party
 * @property {number} id
 * @property {string} name
 * @property {number} date
 * @property {string} description
 * @property {string} location
 */

/* === Constants === */
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2026-FTB-CT-WEB-PT";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

/* === States === */
let parties = [];
let selectedParty;
let rsvps = [];
let guests = [];

/** Updates state with all events/parties from the API*/
async function getParties() {
  try {
    let res = await fetch(API);
    let json = await res.json();
    parties = json.data;
  } catch (err) {
    console.error(err);
  }
}

/** Updates state with the selected party details from the API*/
async function getPartyDetails(id) {
  try {
    let res = await fetch(`${API}/${id}`);
    let json = await res.json();
    selectedParty = json.data;
    render();
  } catch (err) {
    console.error(err);
  }
}

/** Updates state with the rsvps from the API */
async function getRsvps() {
  try {
    let res = await fetch(`${BASE}${COHORT}/rsvps`);
    let json = await res.json();
    rsvps = json.data;
  } catch (err) {
    console.error(err);
  }
}

/** Updates state with all guests from the API */
async function getGuests() {
  try {
    let res = await fetch(`${BASE}${COHORT}/guests`);
    let json = await res.json();
    guests = json.data;
  } catch (err) {
    console.error(err);
  }
}

/* === Components === */

/** Party name that shows more details about the party when selected  */
function partyListItem(party) {
  if (!party) return;

  const $list = document.createElement("li");
  $list.textContent = party.name;

  // if (selectedParty && selectedParty.id === party.id)
  /* More improved from the example */
  if (party.id === selectedParty?.id) {
    $list.classList.add("selected");
  }

  // $list.addEventListener("click", async function () {
  //   await getPartyDetails(party.id);
  // });

  /* More improved from the example */
  $list.addEventListener("click", () => getPartyDetails(party.id));
  return $list;
}

/** List of all the parties */
function displayPartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("parties-list");

  /* Removed the below and updated the loop also removed the argument */
  //   $parties.innerHTML = `
  // <h2>Upcoming Parties</h2>
  // <ul></ul>
  // `;

  const $parties = parties.map(partyListItem);
  $ul.replaceChildren(...$parties);
  return $ul;
}

/* Detailed information about the selected party */
function displayPartyDetails(party) {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = `Please select a party to view its details`;
    return $p;
  }

  const $party = document.createElement("section");
  $party.classList.add("party-details");
  $party.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <time datetime="${selectedParty.date}">
      ${selectedParty.date.slice(0, 10)}
    </time>
    <address>${selectedParty.location}</address>
    <p>${selectedParty.description}</p>
    <button type="button">Delete party</button>
`;

  /* I want to take the selected party run it through the delete btn event listener 
use the DELETE action to update the state and api*/
  const $deleteBtn = $party.querySelector("button");
  $deleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = selectedParty.id;
    try {
      let res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        selectedParty = null;
        await getParties();
      }
    } catch (err) {
      console.error(err);
    }
  });

  return $party;
}

/** List of guests attending the selected party */
function guestList() {
  const $ul = document.createElement("ul");

  if (!selectedParty) return $ul;

  const guestsAtParty = guests.filter((guest) => {
    return rsvps.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id,
    );
  });

  const $guests = guestsAtParty.map((guest) => {
    const $guest = document.createElement("li");
    $guest.textContent = guest.name;
    return $guest;
  });

  $ul.replaceChildren(...$guests);

  return $ul;
}

/** Form that allows users to add a new party by submitting a form */
function partyForm() {
  // step 1: create a form element
  // step 2: define inputs for form + submit button
  // step 3: event listener logic to capture form inputs and then create an event on page and in api
  const $form = document.createElement("form");
  $form.classList.add("event-form");

  const eventName = document.createElement("label");
  eventName.textContent = "Name";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = "event-name";
  nameInput.placeholder = "name";
  eventName.append(nameInput);

  const desc = document.createElement("label");
  desc.textContent = "Description";
  const descInput = document.createElement("input");
  descInput.type = "text";
  descInput.name = "description";
  descInput.placeholder = "description";
  desc.append(descInput);

  const date = document.createElement("label");
  date.textContent = "Date";
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.name = "date";
  date.append(dateInput);

  const loc = document.createElement("label");
  loc.textContent = "Location";
  const locInput = document.createElement("input");
  locInput.type = "text";
  locInput.name = "location";
  locInput.placeholder = "location";
  loc.append(locInput);

  const btn = document.createElement("button");
  btn.type = "submit";
  btn.textContent = "Add party";
  btn.title = "Add party";

  $form.append(eventName, desc, date, loc, btn);

  $form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData($form);
    const rawDate = data.get("date");
    const isoDate = new Date(rawDate).toISOString();

    const input = {
      name: data.get("event-name").trim(),
      description: data.get("description").trim(),
      date: isoDate,
      location: data.get("location").trim(),
    };

    try {
      let res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        await getParties();
      }
    } catch (err) {
      console.error(err);
    }
  });

  return $form;
}

/* === Render === */
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
      <main>
        <section>
          <h2>Upcoming Parties</h2>
          <displayPartyList></displayPartyList>
          <div class="event-form">
            <h3>Add a new party</h3>
            <partyForm></partyForm>
          </div>
        </section>
        <section class="party-details">
          <h2>Party Details</h2>
          <displayPartyDetails></displayPartyDetails>
          <br>
          <guestList></guestList>
        </section>
      </main>
`;

  $app.querySelector("displayPartyList").replaceWith(displayPartyList());
  $app.querySelector("displayPartyDetails").replaceWith(displayPartyDetails());
  $app.querySelector("partyForm").replaceWith(partyForm());
  $app.querySelector("guestList").replaceWith(guestList());
}

async function init() {
  await getParties();
  await getRsvps();
  await getGuests();
  render();
}

init();
