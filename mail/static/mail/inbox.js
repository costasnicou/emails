document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
  
});

function compose_email() {
    // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#single-email').style.display = 'none';
  
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

 
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-email').style.display = 'none';
  document.querySelector('#single-email').style.display = 'none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `
    <h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>
    <div class="emails-wraper"></div>
  `;
  
 
    // load the targeted mailbox
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        // Print emails
        // emails.sort((a,b)=> a.id - b.id);
        let emailsWraper = document.querySelector('.emails-wraper');
        emails.forEach(email=>{
          let emailstatus ="";

          if(email.read){
            emailstatus="read";
          }
          else{
            emailstatus="unread";
          }


          let html = `<div id="${email.id}" class="email ${emailstatus}"><p><strong>${email.sender}</strong> Subject: ${email.subject} <span class="timestamp">${email.timestamp}</span></p></div>`;
          emailsWraper.insertAdjacentHTML('beforeend',html);
          
        });
        // console.log(emails);

        // ... do something else with emails ...
    }).catch( error =>{
      console.log(error);
    });

   
    load_email(mailbox);
 
}

// LOAD EMAIL DETAILS
function load_email(mailbox){

  let currentEmailId = null;
  const emailsWraper = document.querySelector('.emails-wraper');
  const archiveBtn = document.querySelector('.not-archived');
  const unarchiveBtn = document.querySelector('.archived');
  if(mailbox==="inbox"){
    unarchiveBtn.style.display="none";
    archiveBtn.style.display="block";
  
  }else if(mailbox==="archive"){
    unarchiveBtn.style.display="block";
    archiveBtn.style.display="none";
  }
  else if(mailbox==="sent"){
    unarchiveBtn.style.display="none";
    archiveBtn.style.display="none";
  }
  emailsWraper.addEventListener('click',(event)=>{
    const closestChild = event.target.closest('p');
    const childdiv = event.target.closest('.email');
    if(closestChild || childdiv) {

      const emailID = childdiv.getAttribute('id');

      currentEmailId = emailID.replace('mail-', '');

      fetch(`/emails/${emailID}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })

      fetch(`/emails/${emailID}`)
      .then(response => response.json())
      .then(email => {
          // Print email
          // Show the mail and hide other views
          console.log(email);
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#single-email').style.display = 'block';

        
          const singleEmailView = document.querySelector('#single-email');
          const html =`
            
            <div id="mail-${email.id}" class="email-wraper">
              <h2><strong>Subject: </strong>${email.subject}</h2>
              <p><strong>Sender: </strong>${email.sender}</p>
              <p><strong>Recipients: </strong>${email.recipients}</p>
              <p><strong>Body: </strong>${email.body}</p>
              <p><strong>Timestamp: </strong>${email.timestamp}</p>

            </div>
          `;

          const singleEmails = document.querySelectorAll('.email-wraper')

          singleEmails.forEach(single_email => {
            single_email.style.display = "none";
          });

        
          singleEmailView.insertAdjacentHTML("afterbegin",html);

          const singleEmailel = document.querySelector(`#mail-${email.id}`);
          singleEmailel.style.display="block";

          if (email.archived === false){
            archiveBtn.onclick = function () {
              fetch(`/emails/${emailID}`, {
                method: 'PUT',
                body: JSON.stringify({
                  archived: true
                })
              })
              .then(() => load_mailbox('inbox'));
            };
          }else if(email.archived===true){
             unarchiveBtn.onclick = function () {
              fetch(`/emails/${emailID}`, {
                method: 'PUT',
                body: JSON.stringify({
                  archived: false
                })
              })
              .then(() => load_mailbox('inbox'));
            };
          }


         
      
          // ... do something else with email ...
        });
   


        return currentEmailId;
    }


    else{
      console.log("not working");
    }
  });

  
}
// SEND EMAIL
const composeSubmit = document.querySelector('.compose-submit');
composeSubmit.addEventListener('click',function(e){
  e.preventDefault();
  const recipientsValue = document.querySelector('#compose-recipients').value;
  const subjectValue =  document.querySelector('#compose-subject').value;
  const composeBodyValue = document.querySelector('#compose-body').value;

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipientsValue,
          subject: subjectValue,
          body: composeBodyValue,
      })
    })
    .then(response => response.json())
    .then(result => {
      load_mailbox('sent');
      //  
    });

    
    
});


