let selectedDroneName = '';
let selectedDroneCost = '';

function calculateHoursAndCost(droneId, droneName, acresPerHour, ratePerHour) {
    const input = document.getElementById(`acres-${droneId}`);
    const hoursOutput = document.getElementById(`hours-${droneId}`);
    const costOutput = document.getElementById(`cost-${droneId}`);
    const orderBtn = document.getElementById(`orderBtn-${droneId}`);
    const acres = parseFloat(input.value);

    if (!isNaN(acres) && acres > 0) {
        const hours = (acres / acresPerHour).toFixed(2);
        const totalCost = (hours * ratePerHour).toFixed(2);

        hoursOutput.innerText = `⏳ Time: ${hours} hours`;
        costOutput.innerText = `💵 Cost: ₹${totalCost}`;

        orderBtn.style.display = "inline-block";
    } else {
        hoursOutput.innerText = "⚠ Enter valid acres.";
        costOutput.innerText = "";
        orderBtn.style.display = "none";
    }
}

function showOrderForm(droneName, costElementId) {
    selectedDroneName = droneName;
    selectedDroneCost = document.getElementById(costElementId).innerText;

    document.getElementById('orderSection').style.display = 'block';
    document.getElementById('selectedDrone').innerText = `Drone: ${selectedDroneName}`;
    document.getElementById('selectedCost').innerText = `${selectedDroneCost}`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('farmerName').value.trim();
        const phone = document.getElementById('farmerPhone').value.trim();
        const address = document.getElementById('farmerAddress').value.trim();

        if (name && phone && address) {
            document.getElementById('orderConfirmation').innerText = `✅ Order placed for ${selectedDroneName}!`;
            document.getElementById('orderForm').reset();
            setTimeout(() => {
                document.getElementById('orderSection').style.display = 'none';
                document.getElementById('orderConfirmation').innerText = '';
            }, 5000);
        } else {
            alert('Please fill all details.');
        }
    });
});