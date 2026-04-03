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

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `
    <h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>
    <div class="emails-content"></div>
  `;
  
  // console.log(base_url);
  // load the targeted mailbox
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        // Print emails
        let emailsContent = document.querySelector('.emails-content');
        emails.forEach(email=>{
          let html = `<p>${email.id}: Subject: ${email.subject} from ${email.sender}</p>`;
          emailsContent.insertAdjacentHTML('afterbegin',html);
        });
        console.log(emails);

        // ... do something else with emails ...
    }).catch( error =>{
      console.log(error);
    });
}

const composeSubmit = document.querySelector('.compose-submit');
composeSubmit.addEventListener('click',function(){

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