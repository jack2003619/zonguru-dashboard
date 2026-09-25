(function () {
  const API_URL = "https://zonguru-jack-api.onrender.com";

  function token(){ return localStorage.getItem("zonguru_token"); }
  function esc(v){ const d=document.createElement("div"); d.textContent=String(v??""); return d.innerHTML; }
  function msg(id,text,ok){
    const e=document.getElementById(id); if(!e)return;
    e.innerHTML='<div style="margin-top:12px;padding:12px;border-radius:10px;background:'+
      (ok?'#ecfdf5':'#fef2f2')+';color:'+(ok?'#15803d':'#b91c1c')+
      ';font-weight:bold">'+esc(text)+'</div>';
  }
  async function req(path,options){
    const t=token(); if(!t){location.href="login.html";throw Error("Not logged in");}
    const r=await fetch(API_URL+path,{...options,headers:{
      "Content-Type":"application/json","Authorization":"Bearer "+t,...(options?.headers||{})
    }});
    const d=await r.json();
    if(r.status===401){localStorage.removeItem("zonguru_token");location.href="login.html";throw Error("Session expired");}
    if(!r.ok||!d.success)throw Error(d.message||"Request failed");
    return d;
  }

  function setup(){
    const note=document.getElementById("withdrawNote");
    if(!note||document.getElementById("withdrawMethod"))return;
    const wrap=document.createElement("div");
    wrap.className="form-group";
    wrap.innerHTML='<label>Withdrawal Method</label><select id="withdrawMethod" style="width:100%;padding:13px;border:1px solid #ddd;border-radius:10px;font-size:15px"><option value="crypto">Crypto</option><option value="bank">Bank</option></select>';
    note.parentElement.parentElement.insertBefore(wrap,note.parentElement);

    const details=document.createElement("div");
    details.innerHTML=`
      <div id="cryptoDetails">
        <div class="form-group"><label>Wallet Address</label><input id="cryptoWallet" placeholder="Enter crypto wallet address"></div>
        <div class="form-group"><label>Network</label><input id="cryptoNetwork" placeholder="e.g. TRC20 / ERC20"></div>
      </div>
      <div id="bankDetails" style="display:none">
        <div class="form-group"><label>Bank Name</label><input id="bankName" placeholder="Enter bank name"></div>
        <div class="form-group"><label>Account Name</label><input id="bankAccountName" placeholder="Account holder name"></div>
        <div class="form-group"><label>Account Number</label><input id="bankAccountNumber" placeholder="Account number"></div>
        <div class="form-group"><label>Branch / Bank Details</label><input id="bankBranch" placeholder="Optional branch details"></div>
      </div>`;
    note.parentElement.parentElement.insertBefore(details,note.parentElement);

    document.getElementById("withdrawMethod").onchange=function(){
      const c=this.value==="crypto";
      document.getElementById("cryptoDetails").style.display=c?"block":"none";
      document.getElementById("bankDetails").style.display=c?"none":"block";
    };

    const wb=document.querySelector('[onclick="submitWithdraw()"]');
    if(wb){wb.id="withdrawBtn";wb.insertAdjacentHTML("afterend",'<div id="withdrawResult"></div>');}
  }

  window.submitDeposit=async function(){
    const amount=Number(document.getElementById("depositAmount")?.value);
    const note=document.getElementById("depositNote")?.value.trim()||"";
    const b=document.querySelector('[onclick="submitDeposit()"]');
    if(!Number.isFinite(amount)||amount<=0){msg("depositResult","Please enter a valid deposit amount.",false);return;}
    if(b){b.disabled=true;b.textContent="Submitting...";}
    try{
      await req("/api/deposits",{method:"POST",body:JSON.stringify({amount,note})});
      msg("depositResult","Deposit submitted successfully — pending admin review.",true);
      document.getElementById("depositAmount").value="";
      document.getElementById("depositNote").value="";
      if(typeof loadTransactions==="function")await loadTransactions();
    }catch(e){msg("depositResult",e.message,false);}
    finally{if(b){b.disabled=false;b.textContent="Submit Deposit Request";}}
  };

  window.submitWithdraw=async function(){
    setup();
    const amount=Number(document.getElementById("withdrawAmount")?.value);
    const note=document.getElementById("withdrawNote")?.value.trim()||"";
    const method=document.getElementById("withdrawMethod")?.value||"crypto";
    const b=document.getElementById("withdrawBtn");
    if(!Number.isFinite(amount)||amount<=0){msg("withdrawResult","Please enter a valid withdrawal amount.",false);return;}
    let details={};
    if(method==="crypto"){
      details.walletAddress=document.getElementById("cryptoWallet")?.value.trim()||"";
      details.network=document.getElementById("cryptoNetwork")?.value.trim()||"";
      if(!details.walletAddress){msg("withdrawResult","Please enter your crypto wallet address.",false);return;}
    }else{
      details.bankName=document.getElementById("bankName")?.value.trim()||"";
      details.accountName=document.getElementById("bankAccountName")?.value.trim()||"";
      details.accountNumber=document.getElementById("bankAccountNumber")?.value.trim()||"";
      details.branch=document.getElementById("bankBranch")?.value.trim()||"";
      if(!details.bankName||!details.accountName||!details.accountNumber){
        msg("withdrawResult","Please enter bank name, account name, and account number.",false);return;
      }
    }
    if(b){b.disabled=true;b.textContent="Submitting...";}
    try{
      await req("/api/withdrawals",{method:"POST",body:JSON.stringify({amount,note,method,details})});
      msg("withdrawResult","Withdrawal submitted successfully — pending admin review.",true);
      document.getElementById("withdrawAmount").value="";
      document.getElementById("withdrawNote").value="";
      ["cryptoWallet","cryptoNetwork","bankName","bankAccountName","bankAccountNumber","bankBranch"].forEach(id=>{const e=document.getElementById(id);if(e)e.value="";});
      if(typeof loadTransactions==="function")await loadTransactions();
    }catch(e){msg("withdrawResult",e.message,false);}
    finally{if(b){b.disabled=false;b.textContent="Submit Withdrawal Request";}}
  };

  window.addEventListener("load",function(){
    setup();
    const b=document.querySelector('[onclick="submitDeposit()"]');
    if(b&&!document.getElementById("depositResult"))b.insertAdjacentHTML("afterend",'<div id="depositResult"></div>');
  });
})();