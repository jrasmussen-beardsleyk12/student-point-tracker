let addPointsDialog, removePointsDialog, addPointsSlider, removePointsSlider, addPointsReason, removePointsReason, addPointsMenu, removePointsMenu;

window.onload = () => {

  addPointsDialog = new mdc.dialog.MDCDialog(document.getElementById("add-points-dialog"));
  removePointsDialog = new mdc.dialog.MDCDialog(document.getElementById("remove-points-dialog"));

  addPointsSlider = new mdc.slider.MDCSlider(document.getElementById("add-points-slider"));
  removePointsSlider = new mdc.slider.MDCSlider(document.getElementById("remove-points-slider"));

  addPointsReason = new mdc.textField.MDCTextField(document.getElementById("add-points-reason"));
  removePointsReason = new mdc.textField.MDCTextField(document.getElementById("remove-points-reason"));

  addPointsMenu = new mdc.menu.MDCMenu(document.getElementById("add-points-menu"));
  removePointsMenu = new mdc.menu.MDCMenu(document.getElementById("remove-points-menu"));

  addPointsDialog.listen("MDCDialog:opened", () => {
    addPointsSlider.layout();
    addPointsReason.layout();
    addPointsMenu.layout();
  });

  removePointsDialog.listen("MDCDialog:opened", () => {
    removePointsSlider.layout();
    removePointsReason.layout();
    removePointsMenu.layout();
  });

  addPointsDialog.listen("MDCDialog:closed", async (action) => {
    if (action.detail.action === "accept") {
      // The user has accepted the prompt
      let points = addPointsSlider.inputs[0].value;
      let reason = document.getElementById("add-points-reason-text-field").value;

      await addPoints(points, reason);
    }
  });

  removePointsDialog.listen("MDCDialog:closed", async (action) => {
    if (action.detail.action === "accept") {
      // The user has accepted the prompt
      let points = removePointsSlider.inputs[0].value;
      let reason = document.getElementById("remove-points-reason-text-field").value;

      await removePoints(points, reason);
    }
  });

  addPointsMenu.listen("MDCMenu:selected", (data) => {
    addPointsReason.value = data.detail.item.dataset.reason;
    addPointsSlider.setValue(data.detail.item.dataset.amount);
  });

  removePointsMenu.listen("MDCMenu:selected", (data) => {
    removePointsReason.value = data.detail.item.dataset.reason;
    removePointsSlider.setValue(data.detail.item.dataset.amount);
  })
};

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
