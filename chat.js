let currentChatroom = ''; // Global variable to store the selected chatroom

// Generate a unique identifier for each tab
if (!localStorage.getItem('tab_id')) {
    localStorage.setItem('tab_id', Math.floor(Math.random() * 10000000));
}
const tab_id = localStorage.getItem('tab_id');

// Track the order of tabs
if (!localStorage.getItem('tab_order')) {
    localStorage.setItem('tab_order', 0);
}
const tab_order = parseInt(localStorage.getItem('tab_order')) + 1;
localStorage.setItem('tab_order', tab_order);
let username = '';

function startSession() {
    username = document.getElementById('username').value;
    if (username) {
        document.getElementById('content').innerHTML = `
         <div id="chatroom_selection" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif;">
            <h2>Select a Courtroom</h2>
            <ul id="chatroom_list" style="list-style: none; padding: 0;">
                <li><button onclick="joinChatroom('Arkansas')" style="padding: 10px 20px; margin: 5px;">Arkansas</button></li>
                <li><button onclick="joinChatroom('Texas')" style="padding: 10px 20px; margin: 5px;">Texas</button></li>
                <li><button onclick="joinChatroom('New York')" style="padding: 10px 20px; margin: 5px;">New York</button></li>
                <li><button onclick="joinChatroom('California')" style="padding: 10px 20px; margin: 5px;">California</button></li>
            </ul>
         </div>`;
    } else {
        alert('Please enter a username');
    }
}

function joinChatroom(chatroom) {
    currentChatroom = chatroom;

    document.getElementById('content').innerHTML = `
    <div style="position: relative; width: 100vw; height: 100vh; overflow: hidden; background-image: url('fury-jury.png'); background-size: cover; background-position: center;">
  
      <!-- chat overlay container -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 20px; box-sizing: border-box; z-index: 2;">
  
    <!-- chat messages area at bottom -->
        <div id="chat_messages" style="
        position: absolute;
        bottom: 60px;         
        left: 0;
        width: 100%;
        max-height: 357px;     
        overflow-y: auto;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
        ">
        <table id="chats" style="width: 100%; max-width: 700px;"></table>
        </div>
  
    <!-- chat input bar at bottom -->
        <div id="chat_input" style="
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: rgba(50, 50, 50, 0.8);
        padding: 10px;
        display: flex;
        gap: 10px;
        box-sizing: border-box;
        ">
      <textarea id="chat_text" oninput="auto_grow_text_area(this)" 
        style="flex: 1; resize: none; height: 40px; padding: 10px; border-radius: 6px; border: none;"></textarea>
      <button onclick="on_post_message()" 
        style="padding: 10px 20px; border-radius: 6px; border: none; background: #0a9396; color: white; font-weight: bold;">Post</button>
    </div>
      </div>
  
    </div>
  `;

  setTimeout(() => {
    fetch_messages();
    main();
  }, 50);
}

function scrub(text) {
    if (!text) {
        text = '';
    }
    text = text.replace(/&/g, '&amp;');
    text = text.replace(/>/g, '&gt;');
    text = text.replace(/</g, '&lt;');
    text = text.replace(/\n/g, '<br>');
    text = text.replace(/  /g, ' &nbsp;');
    return text;
}

function post_neutral_message() {
    const neutral_message = "This is a neutral message.";

    // Get the neutral message container
    const neutral_message_container = document.getElementById('neutral_message_container');

    // Update the content of the neutral message container
    neutral_message_container.innerHTML = neutral_message;

    // Show the container
    neutral_message_container.style.display = 'block';

    // Automatically hide the message after 5 seconds
    setTimeout(() => {
        neutral_message_container.style.display = 'none';
    }, 10000);
}

function post_message(is_me, text, username) {
    text = scrub(text);
    username = scrub(username);
    let chats_table = document.getElementById('chats');
    let new_row = chats_table.insertRow(); // Insert at the bottom of the table
    let cell = new_row.insertCell(0);
    let s = [];
    s.push('<div class="');
    s.push(is_me ? 'bubble_right' : 'bubble_left');
    s.push('">');
    s.push(`<span class="username" style="font-weight: bold; font-family: Helvetica, sans-serif;">${username}</span>`); // Username section
    s.push(`<br>`);
    s.push(`<span class="message_text" style="font-family: 'Monaco', monospace;">${text}</span>`); // Message text section
    s.push(`</div>`);
    cell.innerHTML = s.join('');

    // Scroll to the bottom of the chat container
    let chat_messages = document.getElementById('chat_messages');
    chat_messages.scrollTop = chat_messages.scrollHeight;
}

async function on_post_message() {
    let text_area = document.getElementById('chat_text');
    const message = {
        tab_id: tab_id,
        tab_order: tab_order,
        chatroom: currentChatroom, // Include the current chatroom
        timestamp: new Date().toISOString(),
        text: text_area.value,
        username: username // Ensure username is included
    };
    const response = await fetch('/ajax', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    });
    const data = await response.json();
    if (data.status === 'ok') {
        post_message(true, message.text, message.username); // Pass username to post_message
        text_area.value = '';
        text_area.style.height = 'auto'; // Reset the height of the textbox
        auto_grow_text_area(text_area);
    }
}

async function fetch_messages() {
    const response = await fetch('/ajax');
    const data = await response.json();
    document.getElementById('chats').innerHTML = '';
    data.forEach(message => {
        if (message.chatroom === currentChatroom) { // Only show messages from the current chatroom
            const is_me = message.tab_id === tab_id && message.tab_order === tab_order;
            post_message(is_me, message.text, message.username); // Ensure username is passed
        }
    });
}

function auto_grow_text_area(el) {
    el.style.height = "5px";
    el.style.height = (el.scrollHeight) + "px";

    // Adjust chat messages container height
    let chat_messages = document.getElementById('chat_messages');
    chat_messages.style.paddingBottom = (el.scrollHeight + 30) + "px"; // Increased base padding for spacing
    chat_messages.scrollTop = chat_messages.scrollHeight; // Keep scrolled to the bottom
}

function main() {
    // Set up the compose area
    let chat_text = document.getElementById('chat_text');
    if (chat_text) {
        auto_grow_text_area(chat_text);
    }
}

window.onload = () => {
    main();
    setInterval(fetch_messages, 500);

    // Scroll to the bottom on load
    let chat_messages = document.getElementById('chat_messages');
    chat_messages.scrollTop = chat_messages.scrollHeight;
};