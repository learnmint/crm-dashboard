const API = "https://script.google.com/macros/s/AKfycbwsPolAAlxfGPjxefx2b2OTQ3SY27_6jmEZnazITPZ7LEFsZSbfE1TRndF1Hcp2ycWD/exec";

/* Load sidebar safely */
fetch("components/sidebar.html")
  .then(r => r.text())
  .then(t => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.innerHTML = t;
  });

/* LOGIN */
function login(){
  console.log("LOGIN CLICKED");
  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const msg = document.getElementById("msg");

  if(!emailEl || !passwordEl){
    alert("Email or Password field missing");
    return;
  }

  msg.innerText = "Logging in...";

  fetch(API,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      action: "login",
      email: emailEl.value.trim(),
      password: passwordEl.value
    })
  })
  .then(r => r.json())
  .then(d => {
    if(d.success){
      sessionStorage.setItem("token", d.token);
      sessionStorage.setItem("role", d.role);
      sessionStorage.setItem("team", d.team);
      location.href = "dashboard.html";
    } else {
      msg.innerText = d.error || "Invalid email or password";
    }
  })
  .catch(err => {
    console.error(err);
    msg.innerText = "Server error. Check console.";
  });
}

/* GENERIC API CALL */
function api(action,data={}){
  return fetch(API,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      action,
      token:sessionStorage.getItem("token"),
      ...data
    })
  }).then(r=>r.json());
}

/* DASHBOARD */
function loadKPIs(){
  api("getDashboardKPIs").then(d=>{
    leads.innerText="Leads: "+d.leads;
    revenue.innerText="Revenue: ₹"+d.revenue;
    conversion.innerText="Conversion: "+d.conversion+"%";
  });
}

/* LEADS */
function addLead(){
  api("addLead",{name:name.value,phone:phone.value}).then(()=>getLeads());
}

function getLeads(){
  api("getLeads").then(d=>{
    leadsTable.innerHTML=d.map(r=>`<tr><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("");
  });
}

/* PAYMENTS */
function createPayment(){
  api("createPaymentLink",{
    customer:customer.value,
    amount:amount.value,
    phone:"9999999999"
  }).then(d=>window.open(d.link));
}

function getPayments(){
  api("getPayments").then(d=>{
    paymentsTable.innerHTML=d.map(r=>`<tr><td>${r[2]}</td><td>${r[6]}</td></tr>`).join("");
  });
}

/* FOLLOW UPS */
function addFollowup(){
  api("addFollowup",{
    lead:lead.value,
    note:note.value,
    date:date.value
  }).then(()=>getFollowups());
}

function getFollowups(){
  api("getFollowups").then(d=>{
    followupList.innerHTML=d.map(r=>`<li>${r[1]} - ${r[2]}</li>`).join("");
  });
}
window.login = login;
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("loginBtn");
  if (btn) btn.addEventListener("click", login);
});


