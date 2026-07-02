const screen = document.getElementById("screen");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

let step = 0;

const vehicleOptions = [
  {
    name: "Saturn V",
    desc: "Launch vehicle. Maximum historical power.",
    model: "./saturn-v.glb"
  },
  {
    name: "Lunar Module Eagle",
    desc: "Landing craft. Built for impossible precision.",
    model: "./eagle.glb"
  },
  {
    name: "Orion",
    desc: "Crew capsule for deep-space missions.",
    model: "./orion.glb"
  },
  {
    name: "Starship",
    desc: "Reusable heavy-lift spacecraft concept.",
    model: "./starship.glb"
  }
];

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
  return vehicleOptions.find(v => v.name === data.vehicle);
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
        <div class="card vehicle-card ${data.vehicle === opt.name ? "selected" : ""}" onclick="selectCard('vehicle', '${opt.name}')">
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
  const options = ["Book", "Monster Can", "Curiosity", "Courage", "Luck", "Engineering Brain"];

  screen.innerHTML = `
    <h2>STEP 03 // LOAD PAYLOAD</h2>
    <p>Select at least one mission payload.</p>
    <div class="grid">
      ${options.map(opt => `
        <div class="card ${data.payload.includes(opt) ? "selected" : ""}" onclick="togglePayload('${opt}')">
          <h3>${opt}</h3>
        </div>
      `).join("")}
    </div>
  `;
}

function renderVehiclePreview() {
  const selected = getSelectedVehicle();

  screen.innerHTML = `
    <h2>STEP 04 // VEHICLE BLUEPRINT</h2>

    <div class="vehicle-wrap">
      <div>
        <model-viewer
          class="vehicle-model preview-model"
          src="${selected.model}"
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
  screen.innerHTML = `
    <h2>MISSION SUCCESSFUL</h2>
    <div class="result">
      <p><strong>Mission:</strong> ${data.mission}</p>
      <p><strong>Vehicle:</strong> ${data.vehicle}</p>
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