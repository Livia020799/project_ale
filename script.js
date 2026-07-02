const screen = document.getElementById("screen");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

let step = 0;

const vehicleOptions = [
  {
    id: "saturn",
    name: "SATURN V",
    desc: "Heavy-lift launch vehicle developed for the Apollo program.",
    model: "./saturn-v.glb"
  },
  {
    id: "eagle",
    name: 'LUNAR MODULE "EAGLE"',
    desc: "Crewed lunar lander used during the Apollo 11 mission.",
    model: "./eagle.glb"
  },
  {
    id: "orion",
    name: "ORION MPCV",
    desc: "NASA crew vehicle designed for Artemis deep-space missions.",
    model: "./orion.glb"
  },
  {
    id: "starship",
    name: "SPACEX STARSHIP",
    desc: "Fully reusable spacecraft for lunar and interplanetary missions.",
    model: "./starship.glb"
  }
];

const payloadOptions = [
  "Book",
  "Monster Energy",
  "Curiosity",
  "Courage",
  "Luck",
  "Engineering Brain"
];

const payloadIcons = {
  "Book": "📘",
  "Monster Energy": "🥤⚡",
  "Curiosity": "🧐",
  "Courage": "🔥",
  "Luck": "🍀",
  "Engineering Brain": "⚙️🧠"
};

const data = {
  mission: "",
  vehicle: "",
  payload: []
};

const steps = [
  renderIntro,
  renderMission,
  renderVehicle,
  renderPayload,
  renderVehiclePreview,
  renderLaunch,
  renderFinal
];

function canGoNext() {
  if (step === 1) return data.mission !== "";
  if (step === 2) return data.vehicle !== "";
  if (step === 3) return data.payload.length > 0;
  return true;
}

function updateButtons() {
  backBtn.style.display = step === 0 ? "none" : "inline-block";
  nextBtn.style.display = step === steps.length - 1 ? "none" : "inline-block";
  nextBtn.textContent = step === steps.length - 2 ? "LAUNCH" : "NEXT";
  nextBtn.disabled = !canGoNext();
}

function render() {
  steps[step]();
  updateButtons();
}

function selectCard(type, value) {
  data[type] = value;
  render();
}

function togglePayload(value) {
  if (data.payload.includes(value)) {
    data.payload = data.payload.filter(item => item !== value);
  } else {
    data.payload.push(value);
  }
  render();
}

function getSelectedVehicle() {
  return vehicleOptions.find(v => v.id === data.vehicle);
}

function renderIntro() {
  screen.innerHTML = `
    <h2>WELCOME, COMMANDER</h2>
    <p>Your mission has been scheduled for launch on <strong>02 JULY</strong>.</p>
    <p>Complete the mission design protocol to receive final clearance.</p>
    <p class="small">STATUS: AWAITING CONFIGURATION</p>
  `;
}

function renderMission() {
  const options = ["Lunar Landing", "Deep Space Probe", "Mars Expedition", "Asteroid Survey"];

  screen.innerHTML = `
    <h2>STEP 01 // SELECT MISSION TYPE</h2>
    <div class="grid">
      ${options.map(opt => `
        <div class="card ${data.mission === opt ? "selected" : ""}" onclick="selectCard('mission', '${opt}')">
          <h3>${opt}</h3>
          <p>${getMissionText(opt)}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function getMissionText(opt) {
  return {
    "Lunar Landing": "Precision, courage, and controlled descent.",
    "Deep Space Probe": "A silent mission beyond familiar orbit.",
    "Mars Expedition": "Long-range exploration and survival.",
    "Asteroid Survey": "Navigation, sampling, and unknown terrain."
  }[opt];
}

function renderVehicle() {
  screen.innerHTML = `
    <h2>STEP 02 // SELECT VEHICLE</h2>
    <div class="grid">
      ${vehicleOptions.map(opt => `
        <div class="card vehicle-card ${data.vehicle === opt.id ? "selected" : ""}" onclick="selectCard('vehicle', '${opt.id}')">
          <h3>${opt.name}</h3>
          <p>${opt.desc}</p>

          <model-viewer
            class="vehicle-model"
            src="${opt.model}"
            auto-rotate
            rotation-per-second="20deg"
            camera-controls
            disable-zoom
            shadow-intensity="1"
            exposure="0.9"
            environment-image="neutral"
            interaction-prompt="none">
          </model-viewer>

          <div class="model-platform"></div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderPayload() {
  screen.innerHTML = `
    <h2>STEP 03 // LOAD PAYLOAD</h2>
    <p>Select at least one mission payload.</p>

    <div class="grid">
      ${payloadOptions.map(opt => `
        <div class="card payload-card ${data.payload.includes(opt) ? "selected" : ""}" onclick="togglePayload('${opt}')">
          <div class="payload-icon">${payloadIcons[opt]}</div>
          <h3>${opt}</h3>
        </div>
      `).join("")}
    </div>
  `;
}

function renderPayloadLoading() {
  screen.innerHTML = `
    <h2>PAYLOAD TRANSFER // IN PROGRESS</h2>
    <p class="small">MISSION CARGO IS BEING LOADED INTO THE VEHICLE</p>

    <div class="loading-scene">
      <div class="payload-stream">
        ${data.payload.map((item, index) => `
          <div class="flying-payload" style="animation-delay: ${index * 0.45}s">
            ${payloadIcons[item]}
          </div>
        `).join("")}
      </div>

      <div class="cargo-ship">
        <div class="ship-nose"></div>
        <div class="ship-body"></div>
        <div class="ship-window"></div>
        <div class="ship-flame"></div>
      </div>

      <p class="small loading-text">LOADING SELECTED PAYLOAD...</p>
    </div>
  `;

  nextBtn.style.display = "none";
  backBtn.style.display = "none";

  const duration = data.payload.length * 450 + 1800;

  setTimeout(() => {
    step++;
    render();
  }, duration);
}

function renderVehiclePreview() {
  const selected = getSelectedVehicle();

  screen.innerHTML = `
    <h2>STEP 04 // VEHICLE INSPECTION</h2>

    <div class="vehicle-wrap">
      <div>
        <model-viewer
          class="vehicle-model preview-model clickable-model"
          src="${selected.model}"
          auto-rotate
          rotation-per-second="20deg"
          camera-controls
          disable-zoom
          shadow-intensity="1"
          exposure="0.9"
          environment-image="neutral"
          interaction-prompt="none"
          onclick="openModelModal()">
        </model-viewer>

        <div class="model-platform"></div>

        <p class="small" style="text-align:center; margin-top:16px;">
          TAP MODEL TO INSPECT
        </p>
      </div>

      <div class="result">
        <h3>${selected.name}</h3>
        <p><strong>Mission:</strong> ${data.mission}</p>
        <p><strong>Payload:</strong> ${data.payload.join(", ")}</p>
        <p><strong>Launch Date:</strong> 02 July</p>
        <p class="small">VEHICLE STATUS: APPROVED</p>
      </div>
    </div>
  `;
}

function openModelModal() {
  const selected = getSelectedVehicle();

  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal" onclick="closeModelModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeModelModal()">CLOSE</button>

        <model-viewer
          class="modal-model"
          src="${selected.model}"
          auto-rotate
          rotation-per-second="18deg"
          camera-controls
          shadow-intensity="1"
          exposure="1"
          environment-image="neutral"
          interaction-prompt="none">
        </model-viewer>

        <p class="small">${selected.name} // INTERACTIVE INSPECTION MODE</p>
      </div>
    </div>
  `);
}

function closeModelModal() {
  const modal = document.querySelector(".modal");
  if (modal) modal.remove();
}

function renderLaunch() {
  screen.innerHTML = `
    <h2>FINAL STEP // LAUNCH SEQUENCE</h2>
    <div class="countdown" id="countdown">READY</div>
    <p class="small">ALL SYSTEMS NOMINAL</p>
    <p class="small">PRESS LAUNCH TO INITIATE COUNTDOWN</p>
  `;
}

function startLaunchSequence() {
  let count = 5;

  nextBtn.style.display = "none";
  backBtn.style.display = "none";

  document.getElementById("countdown").textContent = `T-${count}`;

  const interval = setInterval(() => {
    count--;

    document.getElementById("countdown").textContent =
      count > 0 ? `T-${count}` : "LIFTOFF";

    if (count === 0) {
      clearInterval(interval);

      setTimeout(() => {
        step++;
        render();
      }, 1200);
    }
  }, 900);
}

function renderFinal() {
  const selected = getSelectedVehicle();

  screen.innerHTML = `
    <h2>MISSION SUCCESSFUL</h2>
    <div class="result">
      <p><strong>Mission:</strong> ${data.mission}</p>
      <p><strong>Vehicle:</strong> ${selected.name}</p>
      <p><strong>Payload:</strong> ${data.payload.join(", ")}</p>
      <p><strong>Launch Date:</strong> 02 July</p>
      <br>
      <h3>Happy Birthday, Commander.</h3>
      <p>Your next great mission starts now.</p>
    </div>
  `;
}

nextBtn.onclick = () => {
  if (!canGoNext()) return;

  if (step === 3) {
    renderPayloadLoading();
    return;
  }

  if (step === steps.length - 2) {
    startLaunchSequence();
    return;
  }

  step++;
  render();
};

backBtn.onclick = () => {
  if (step > 0) {
    step--;
    render();
  }
};

render();