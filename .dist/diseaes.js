document.getElementById('diseaseForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const form = document.getElementById('diseaseForm');
    const formData = new FormData(form); // Automatically gathers all form fields including files
  
    try {
      const res = await fetch('/report-disease', {
        method: 'POST',
        body: formData
      });
  
      const data = await res.json();
      const resultEl = document.getElementById('result');
  
      if (res.ok && data.message) {
        resultEl.textContent = data.message;
        resultEl.style.color = 'green';
        form.reset();
      } else {
        resultEl.textContent = data.error || 'Failed to submit report.';
        resultEl.style.color = 'red';
      }
    } catch (err) {
      document.getElementById('result').textContent = 'An error occurred while submitting the report.';
    }
  });