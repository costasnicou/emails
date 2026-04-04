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
  const composeSubmit = document.querySelector('.compose-submit');
  composeSubmit.addEventListener('click',function(e){
    // e.preventDefault();
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
          // Print result
          console.log(result);
    
      });
  });


  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

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
      console.log(emails);

      // ... do something else with emails ...
  }).catch( error =>{
    console.log(error);
  });

  
  load_email();

}


function load_email(){

  // email selection
  const emailsWraper = document.querySelector('.emails-wraper');

  emailsWraper.addEventListener('click',(event)=>{
    const closestChild = event.target.closest('p');
    const childdiv = event.target.closest('.email');
    if(closestChild || childdiv) {
      // console.log("Email clicked");
        const emailID = childdiv.getAttribute('id');
        // console.log(emailID);
      

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
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#single-email').style.display = 'block';

        
          const singleEmailView = document.querySelector('#single-email');
          const html =`
            
            <div id="${email.id}" class="email-wraper">
              <h2><strong>Subject: </strong>${email.subject}</h2>
              <p><strong>Sender: </strong>${email.sender}</p>
              <p><strong>Recipients: </strong>${email.recipients}</p>
              <p><strong>Body: </strong>${email.body}</p>
              <p><strong>Timestamp: </strong>${email.timestamp}</p>

            </div>
          `;

          const singleEmails = document.querySelectorAll('.email-wraper')
          // if (!singleEmailID == email.id){

          // }
          singleEmails.forEach(singleemail => {
            singleemail.style.display = "none";
          });

        
          singleEmailView.insertAdjacentHTML("afterbegin",html);

          const singleEmailID = document.querySelector(`#${email.id}`);
          if (singleEmailID.getAttribute('id')==email.id){
            singleEmailID.style.display="block";
          }
      
          // ... do something else with email ...
        });
    }


    else{
      console.log("not working");
    }
  });

 
}



