
const duckCustom = {};

const points = { add: {}, remove: {} };

window.onload = () => {

  points.add.dialog = new mdc.dialog.MDCDialog(document.getElementById("add-points-dialog"));
  points.remove.dialog = new mdc.dialog.MDCDialog(document.getElementById("remove-points-dialog"));

  points.add.reason = new mdc.textField.MDCTextField(document.getElementById("add-points-reason"));
  points.remove.reason = new mdc.dialog.MDCDialog(document.getElementById("remove-points-dialog"));

  points.add.menu = new mdc.menu.MDCMenu(document.getElementById("add-points-menu"));
  points.remove.menu = new mdc.menu.MDCMenu(document.getElementById("remove-points-menu"));

  points.add.chipset = new mdc.chips.MDCChipSet(document.getElementById("add-points-chip-set"));
  points.remove.chipset = new mdc.chips.MDCChipSet(document.getElementById("remove-points-chip-set"));

  points.add.count = new mdc.textField.MDCTextField(document.getElementById("add-points-count"));
  points.remove.count = new mdc.textField.MDCTextField(document.getElementById("remove-points-count"));

  if (idExists("duck-customization-menu")) {
    setupDuckCustomization();
  }

  points.add.dialog.listen("MDCDialog:opened", () => {
    points.add.reason.layout();
    points.add.menu.layout();
    points.add.count.layout();
  });

  points.remove.dialog.listen("MDCDialog:opened", () => {
    points.remove.reason.layout();
    points.remove.menu.layout();
    points.remove.count.layout();
  });

  points.add.dialog.listen("MDCDialog:closed", async (action) => {
    if (action.detail.action === "accept") {
      // The user has accepted the prompt
      let points = document.getElementById("add-points-count-text-field").value;
      let reason = document.getElementById("add-points-reason-text-field").value;

      await addPoints(points, reason);
    }
  });

  points.remove.dialog.listen("MDCDialog:closed", async (action) => {
    if (action.detail.action === "accept") {
      // The user has accepted the prompt
      let points = document.getElementById("remove-points-count-text-field").value;
      let reason = document.getElementById("remove-points-reason-text-field").value;

      await removePoints(points, reason);
    }
  });

  points.add.menu.listen("MDCMenu:selected", (data) => {
    points.add.reason.value = data.detail.item.dataset.reason;
    points.add.count.value = data.detail.item.dataset.amount;
  });

  points.remove.menu.listen("MDCMenu:selected", (data) => {
    points.remove.reason.value = data.detail.item.dataset.reason;
    points.remove.count.value = data.detail.item.dataset.amount;
  });

};

function setupDuckCustomization() {

  duckCustom.hat = new mdc.select.MDCSelect(document.getElementById("duck-custom-hat"));
  duckCustom.eyes = new mdc.select.MDCSelect(document.getElementById("duck-custom-eyes"));
  duckCustom.beak = new mdc.select.MDCSelect(document.getElementById("duck-custom-beak"));
  duckCustom.wings = new mdc.select.MDCSelect(document.getElementById("duck-custom-wings"));
  duckCustom.accessories = new mdc.select.MDCSelect(document.getElementById("duck-custom-accessories"));
  duckCustom.body = new mdc.select.MDCSelect(document.getElementById("duck-custom-body"));
  duckCustom.item = new mdc.select.MDCSelect(document.getElementById("duck-custom-item"));
  duckCustom.beakColor = new mdc.select.MDCSelect(document.getElementById("duck-custom-beak-color"));
  duckCustom.bodyColor = new mdc.select.MDCSelect(document.getElementById("duck-custom-body-color"));

  duckCustom.hat.listen("MDCSelect:change", (data) => {
    let selectedItem = document.querySelector("#duck-custom-hat [aria-selected='true']");
    duckCustomMenuEnact(selectedItem);
  });

  duckCustom.eyes.listen("MDCSelect:change", (data) => {
    const selectedItem = document.querySelector("#duck-custom-eyes [aria-selected='true']");
    duckCustomMenuEnact(selectedItem);
  });

  duckCustom.beak.listen("MDCSelect:change", (data) => {
    duckCustomMenuEnact(document.querySelector("#duck-custom-beak [aria-selected='true']"));
  });

  duckCustom.wings.listen("MDCSelect:change", (data) => {
    duckCustomMenuEnact(document.querySelector("#duck-custom-wings [aria-selected='true']"));
  });

  duckCustom.accessories.listen("MDCSelect:change", (data) => {
    duckCustomMenuEnact(document.querySelector("#duck-custom-accessories [aria-selected='true']"));
  });

  duckCustom.body.listen("MDCSelect:change", (data) => {
    duckCustomMenuEnact(document.querySelector("#duck-custom-body [aria-selected='true']"));
  });

  duckCustom.item.listen("MDCSelect:change", (data) => {
    duckCustomMenuEnact(document.querySelector("#duck-custom-item [aria-selected='true']"));
  });

  duckCustom.beakColor.listen("MDCSelect:change", (data) => {
    duckCustomMenuEnact(document.querySelector("#duck-custom-beak-color [aria-selected='true']"));
  });

  duckCustom.bodyColor.listen("MDCSelect:change", (data) => {
    duckCustomMenuEnact(document.querySelector("#duck-custom-body-color [aria-selected='true']"));
  });
}

function duckCustomMenuEnact(element) {
  const code = element.dataset.code;
  const index = element.dataset.index;
  const length = element.dataset.length;

  modifyDuck(code, index, length);
}

async function saveCurrentDuck() {
  // Saves the duck that's currently being displayed to the users profile
  const currentUserProfile = document.getElementById("student-profile-photo");
  let currentProfileUrl = currentUserProfile.style.backgroundImage;
  let currentDuck = currentProfileUrl.replace('url("/duck/', "").replace('")', "");

  const response = await fetch(`/api/student/${student_id}/duck?duckStringQuery=${currentDuck}`, { method: "POST" });

  if (response.status !== 201) {
    console.error(response);
    // TODO: Add snackbar
  }

  generateSuccessSnackbar("Successfully saved changes to your Duck.");
}

function modifyDuck(itemCode, itemIndex, itemLength) {
  const currentUserProfile = document.getElementById("student-profile-photo");
  let currentProfileUrl = currentUserProfile.style.backgroundImage;
  let currentDuck = currentProfileUrl.replace('url("/duck/', "").replace('")', "");
  let changedDuck = stringInsert(parseInt(itemIndex), itemCode, itemLength, currentDuck);

  currentUserProfile.style.backgroundImage = `url("/duck/${changedDuck}")`;
}

function stringInsert(idx, val, valLength, full_val) {
  return full_val.slice(0, idx) + val + full_val.slice(idx + Math.abs(valLength));
}

async function addPoints(points, reason) {
  const response = await fetch(`/api/student/${student_id}/points?points=${points}&reason=${reason}`, { method: "POST" });

  if (response.status !== 201) {
    console.error(response);
    // TODO: Add snackbar
  }

  generateSuccessSnackbar(`Successfully added '${points}' Points to Student ${student_id}.`);
}

async function removePoints(points, reason) {
  const response = await fetch(`/api/student/${student_id}/points?points=${points}&reason=${reason}`, { method: "DELETE" });

  if (response.status !== 204) {
    console.error(response);
    // TODO: Make this a snackbar
  }

  generateSuccessSnackbar(`Successfully removed '${points}' Points from Student ${student_id}.`);
}

function chipPointChange(action, count) {
  if (action === "add") {
    points.add.count.value = count;
  } else if (action === "remove") {
    points.remove.count.value = count;
  }
}

function generateSuccessSnackbar(msg) {
  document.getElementById("snackbar-container").innerHTML = `
  <aside class="mdc-snackbar">
    <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
      <div class="mdc-snackbar__label" aria-atomic="false">
        ${msg}
      </div>
      <div class="mdc-snackbar__actions" aria-atomic="true">
        <button type="button" class="mdc-icon-button mdc-snackbar__action mdc-snackbar__dismiss material-icons" title="Dismiss">
          close
        </button>
      </div>
    </div>
  </aside>
  `;

  const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector(".mdc-snackbar"));

  snackbar.open();
}

function idExists(id) {
  const element = document.getElementById(id);

  if (element) {
    return true;
  } else {
    return false;
  }
}
