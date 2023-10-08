const duckCustom = {};

window.addEventListener("load", () => {
  setupDuckCustomization();
});

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
