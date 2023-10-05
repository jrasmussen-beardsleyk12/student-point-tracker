let addPointsDialog, removePointsDialog, addPointsReason, removePointsReason,
  addPointsMenu, removePointsMenu, addPointsChipSet, removePointsChipSet,
  addPointsCount, removePointsCount;

const duckCustom = {};

window.onload = () => {

  addPointsDialog = new mdc.dialog.MDCDialog(document.getElementById("add-points-dialog"));
  removePointsDialog = new mdc.dialog.MDCDialog(document.getElementById("remove-points-dialog"));

  addPointsReason = new mdc.textField.MDCTextField(document.getElementById("add-points-reason"));
  removePointsReason = new mdc.textField.MDCTextField(document.getElementById("remove-points-reason"));

  addPointsMenu = new mdc.menu.MDCMenu(document.getElementById("add-points-menu"));
  removePointsMenu = new mdc.menu.MDCMenu(document.getElementById("remove-points-menu"));

  addPointsChipSet = new mdc.chips.MDCChipSet(document.getElementById("add-points-chip-set"));
  removePointsChipSet = new mdc.chips.MDCChipSet(document.getElementById("remove-points-chip-set"));

  addPointsCount = new mdc.textField.MDCTextField(document.getElementById("add-points-count"));
  removePointsCount = new mdc.textField.MDCTextField(document.getElementById("remove-points-count"));

  duckCustom.hat = new mdc.select.MDCSelect(document.getElementById("duck-custom-hat"));
  duckCustom.eyes = new mdc.select.MDCSelect(document.getElementById("duck-custom-eyes"));
  duckCustom.beak = new mdc.select.MDCSelect(document.getElementById("duck-custom-beak"));
  duckCustom.wings = new mdc.select.MDCSelect(document.getElementById("duck-custom-wings"));
  duckCustom.accessories = new mdc.select.MDCSelect(document.getElementById("duck-custom-accessories"));
  duckCustom.body = new mdc.select.MDCSelect(document.getElementById("duck-custom-body"));
  duckCustom.item = new mdc.select.MDCSelect(document.getElementById("duck-custom-item"));
  duckCustom.beakColor = new mdc.select.MDCSelect(document.getElementById("duck-custom-beak-color"));
  duckCustom.bodyColor = new mdc.select.MDCSelect(document.getElementById("duck-custom-body-color"));

  addPointsDialog.listen("MDCDialog:opened", () => {
    addPointsReason.layout();
    addPointsMenu.layout();
    addPointsCount.layout();
  });

  removePointsDialog.listen("MDCDialog:opened", () => {
    removePointsReason.layout();
    removePointsMenu.layout();
    removePointsCount.layout();
  });

  addPointsDialog.listen("MDCDialog:closed", async (action) => {
    if (action.detail.action === "accept") {
      // The user has accepted the prompt
      let points = document.getElementById("add-points-count-text-field").value;
      let reason = document.getElementById("add-points-reason-text-field").value;

      await addPoints(points, reason);
    }
  });

  removePointsDialog.listen("MDCDialog:closed", async (action) => {
    if (action.detail.action === "accept") {
      // The user has accepted the prompt
      let points = document.getElementById("remove-points-count-text-field").value;
      let reason = document.getElementById("remove-points-reason-text-field").value;

      await removePoints(points, reason);
    }
  });

  addPointsMenu.listen("MDCMenu:selected", (data) => {
    addPointsReason.value = data.detail.item.dataset.reason;
    addPointsCount.value = data.detail.item.dataset.amount;
  });

  removePointsMenu.listen("MDCMenu:selected", (data) => {
    removePointsReason.value = data.detail.item.dataset.reason;
    removePointsCount.value = data.detail.item.dataset.amount;
  });

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
};

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
    addPointsCount.value = count;
  } else if (action === "remove") {
    removePointsCount.value = count;
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
