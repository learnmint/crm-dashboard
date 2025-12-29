const API = "https://script.google.com/macros/s/AKfycbwsPolAAlxfGPjxefx2b2OTQ3SY27_6jmEZnazITPZ7LEFsZSbfE1TRndF1Hcp2ycWD/exec";

fetch("components/sidebar.html")
  .then(r=>r.text())
  .then(t=>document.getElementById("sidebar")?.innerHTML=t);

function login(){
  fetch(API,{
    method:"POST",
    body:JSON.stringify({
      action:"login",
      email:email.value,
      password:password.value
    })
  })
  .then(r=>r.json())
  .then(d=>{
    if(d.success){
      sessionStorage.setItem("token",d.token);
      sessionStorage.setItem("role",d.role);
      sessionStorage.setItem("team",d.team);
      location.href="dashboard.html";
    } else msg.innerText="Invalid Login";
  });
}

function api(action,data={}){
  return fetch(API,{
    method:"POST",
    body:JSON.stringify({
      action,
      token:sessionStorage.getItem("token"),
      ...data
    })
  }).then(r=>r.json());
}

function loadKPIs(){
  api("getDashboardKPIs").then(d=>{
    leads.innerText="Leads: "+d.leads;
    revenue.innerText="Revenue: ₹"+d.revenue;
    conversion.innerText="Conversion: "+d.conversion+"%";
  });
}

function addLead(){
  api("addLead",{name:name.value,phone:phone.value}).then(()=>getLeads());
}

function getLeads(){
  api("getLeads").then(d=>{
    leadsTable.innerHTML=d.map(r=>`<tr><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("");
  });
}

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
