const schemes = [
    {
      id: 1,
      name: "PM Kisan Credit Card (KCC)",
      shortDesc: "Credit for seeds, fertilizers, etc.",
      fullDesc: "Provides short-term credit at low interest rates to farmers for agricultural input purchases.",
      eligibility: "All land-holding farmers",
      documents: "Aadhar, Land records, Bank Passbook",
      image: "pm-kisan-credit-card.jpg"
    },
    {
      id: 2,
      name: "Solar Pump Subsidy Yojana",
      shortDesc: "Up to 60% subsidy on solar irrigation pumps.",
      fullDesc: "Government offers financial aid for solar pump installation to reduce electricity usage.",
      eligibility: "Farmers with land and irrigation needs",
      documents: "Aadhar, Land Proof, Power Bill",
      image: "solar-pump-yojana.jpg"
    },
    {
      id: 3,
      name: "NABARD Agri Loan",
      shortDesc: "Loan for equipment and agri-business.",
      fullDesc: "Long-term loans via banks for agricultural equipment and modernization.",
      eligibility: "Registered individual farmers or SHGs",
      documents: "Aadhar, Bank Details, Project Proposal",
      image: "nabard-agriloan.jpeg"
    },
    {
      id: 4,
      name: "Fasal Bima Yojana",
      shortDesc: "Crop insurance for natural disasters.",
      fullDesc: "Provides insurance to protect against crop failure due to climate events.",
      eligibility: "All farmers enrolled before sowing",
      documents: "Aadhar, Land Ownership, Sowing Certificate",
      image: "fasal-bhima-yojan.png"
    },
    {
      id: 5,
      name: "Soil Health Card Scheme",
      shortDesc: "Free testing of soil quality.",
      fullDesc: "Free soil testing and customized fertilizer recommendation for better yields.",
      eligibility: "Farmers with agricultural land",
      documents: "Aadhar, Land Ownership Proof",
      image: "soil-health-card.png"
    },
    {
      id: 6,
      name: "Agricultural Infrastructure Fund",
      shortDesc: "Credit for storage and agri-infrastructure.",
      fullDesc: "Loan with interest subvention for warehouses, cold storage, grading units, etc.",
      eligibility: "Farmer groups, FPOs, co-ops",
      documents: "Project Plan, Aadhar, Registration Certificate",
      image: "agri-infra-fund.jpg"
    }
  ];
  
  // DOM elements
  const loanList = document.getElementById("loan-list");
  const detailView = document.getElementById("detail-view");
  const applyFormContainer = document.getElementById("apply-form-container");
  
  const detailTitle = document.getElementById("detail-title");
  const detailDescription = document.getElementById("detail-description");
  const detailEligibility = document.getElementById("detail-eligibility");
  const detailDocuments = document.getElementById("detail-documents");
  const detailImage = document.getElementById("detail-image");
  const selectedScheme = document.getElementById("selectedScheme");
  
  // Render schemes
  schemes.forEach((scheme) => {
    const div = document.createElement("div");
    div.className = "loan-card";
    div.innerHTML = `
      <img src="${scheme.image}" alt="${scheme.name}" />
      <div>
        <h3>${scheme.name}</h3>
        <p>${scheme.shortDesc}</p>
      </div>`;
    div.onclick = () => showDetails(scheme);
    loanList.appendChild(div);
  });
  
  // Show details
  function showDetails(scheme) {
    detailTitle.textContent = scheme.name;
    detailDescription.textContent = scheme.fullDesc;
    detailEligibility.textContent = scheme.eligibility;
    detailDocuments.textContent = scheme.documents;
    detailImage.src = scheme.image;
    selectedScheme.value = scheme.name;
  
    loanList.style.display = "none";
    detailView.classList.remove("hidden");
    applyFormContainer.classList.add("hidden");
  }
  
  // Back button
  document.getElementById("back-btn").onclick = () => {
    detailView.classList.add("hidden");
    loanList.style.display = "block";
  };
  
  // Apply button
  document.getElementById("apply-btn").onclick = () => {
    detailView.classList.add("hidden");
    applyFormContainer.classList.remove("hidden");
  };
  
  // Form submission
  document.getElementById("applicationForm").onsubmit = function (e) {
    e.preventDefault();
  
    const data = {
      scheme: selectedScheme.value,
      name: document.getElementById("farmerName").value,
      mobile: document.getElementById("mobile").value,
      aadhar: document.getElementById("aadhar").value,
      state: document.getElementById("state").value,
      landSize: document.getElementById("landSize").value,
      cropType: document.getElementById("cropType").value,
      loanPurpose: document.getElementById("loanPurpose").value,
      amount: document.getElementById("amount").value
    };
  
    console.log("Application submitted:", data);
  
    document.getElementById("confirmation").innerHTML = `
      <p>✅ Application for <strong>${data.scheme}</strong> submitted successfully!</p>
      <p>Thank you, <strong>${data.name}</strong>. Our team will contact you at <strong>${data.mobile}</strong>.</p>
    `;
  
    document.getElementById("applicationForm").reset();
  };