const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const inputs = document.querySelectorAll(".details input");

// Enable editing when 'Edit' is clicked
editBtn.addEventListener("click", () => {
  inputs.forEach(input => input.disabled = false);  // Unlock inputs
  editBtn.classList.add("hidden");                 // Hide Edit button
  saveBtn.classList.remove("hidden");              // Show Save button
});

// Disable editing when 'Save' is clicked
saveBtn.addEventListener("click", () => {
  inputs.forEach(input => input.disabled = true);   // Lock inputs
  saveBtn.classList.add("hidden");                 // Hide Save button
  editBtn.classList.remove("hidden");              // Show Edit button
  alert("Profile saved successfully!");
});
