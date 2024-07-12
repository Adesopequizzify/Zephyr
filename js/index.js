document.addEventListener("DOMContentLoaded", function () {
    const coinImage = document.querySelector(".coin-image img");
    const farmingAmount = document.querySelector(".farming-amount");
    const startFarmingBtn = document.createElement("button");
    const claimBtn = document.getElementById("claim-btn");
    const balanceSpan = document.querySelector(".balance");

    let initialBalance = 5000;
    let farmingReward = 1500;

    startFarmingBtn.textContent = "Start Farming";
    startFarmingBtn.classList.add("start-farming-btn"); // Add a class for styling
    farmingAmount.parentNode.insertBefore(startFarmingBtn, farmingAmount); // Insert before farmingAmount

    startFarmingBtn.addEventListener("click", () => {
        startFarmingBtn.style.display = "none"; // Hide the Start Farming button
        farmingAmount.textContent = `Farming: ${farmingReward.toFixed(2)} NX`; // Show reward amount

        // Create progress bar
        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");
        const progressBarFill = document.createElement("div");
        progressBarFill.classList.add("progress-bar-fill");
        progressBar.appendChild(progressBarFill);
        farmingAmount.parentNode.insertBefore(progressBar, farmingAmount); // Insert before farmingAmount

        // Start progress bar animation (simulating 1 hour)
        progressBarFill.style.width = "100%";

        // Set timeout for 1 hour (simulation)
        setTimeout(() => {
            progressBar.remove();
            claimBtn.style.display = "block"; // Show Claim button
        }, 3600000); // 1 hour = 3600000 milliseconds
    });

    claimBtn.addEventListener("click", () => {
        initialBalance += farmingReward;
        balanceSpan.textContent = `${initialBalance.toFixed(2)} NX`;
        claimBtn.style.display = "none";
        farmingAmount.textContent = "Farming: ₦20.00"; // Reset farming amount text
        startFarmingBtn.style.display = "block"; // Show the Start Farming button again
    });
});
