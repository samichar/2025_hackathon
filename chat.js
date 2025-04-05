let currentChatroom = ''; // Global variable to store the selected chatroom
let juryText = {
    '1': "Wow! Great point!",
    '2': "I agree with you!",
    '3': "I think you are right!",
    '4': "I like your point of view!",
    '5': "I'm not sure about that...",
    '6': "I don't think so...",
    '7': "I disagree with you!",
    '8': "Something feels off about that...",
    '9': "I wonder what's for lunch...",
    '10': "I wonder what's for dinner...",
    '11': "Did you finish the new season of Severance?",
    '12': "Can you elaborate?",
    '13': "Awesome point!",
    '14': "Ohhhhhhhhhhh...",
    '15': "Can you please speak up?",
    '16': "I see.",
    '17': "Interesting.",
    '18': "Okay.",
    '19': "Please be more specific.",
    '20': "I'm not convinced.",
    '21': "I don't know about that...",
    '22': ".......",
    '23': "*yawns*",
    '24': "That was rude.",
    '25': "YEAHHHH!!!!!!!",
    '26': "What are you trying to say?",
    '27': "I don't understand.",
    '28': "Try again later.",
    '29': "For real?",
    '30': "Wow!"
}
let furryText = {
    '1': "That's pawsome!",
    '2': "Fur real?",
    '3': "I'm feline good about that!",
    '4': "Purrfectly said!",
    '5': "That sounds wruff...",
    '6': "I'm not kitten around!",
    '7': "Can you pawlease speak up?",
    '8': "You've got me by the scruff!",
    '9': "That's a tail of a story!",
    '10': "I'm all ears!",
    '11': "That's a purrfect point!",
}

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
    currentChatroom = chatroom; // Store the selected chatroom
    document.getElementById('content').innerHTML = `
         <div id="chat_container" style="display: flex; flex-direction: column; height: 100vh;">
            <div id="chat_header" style="position: fixed; top: 0; right: 0; padding: 10px; z-index: 10;">
                <span style="font-weight: bold; font-family: Arial, sans-serif;">Chatroom: ${chatroom}</span>
                <button id="neutral_message_button" onclick="post_neutral_message()" style="background: #808080; color: white; border: none; padding: 10px; cursor: pointer; margin-left: 10px;">Neutral Message</button>
            </div>
            <div id="neutral_message_container" style="position: fixed; top: 50px; left: 50%; transform: translateX(-50%); background: #f1f1f1; color: #333; padding: 10px 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif; font-size: 14px; text-align: center; z-index: 9; display: none;">
                <!-- Neutral message will appear here -->
            </div>
            <div id="chat_messages" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column-reverse; padding: 10px 10px 80px 10px; box-sizing: border-box; margin-top: 50px;">
                <table id="chats" width="100%"></table>
            </div>
            <div id="chat_input" style="position: fixed; bottom: 0; left: 0; width: 100%; background: #808080; display: flex; padding: 10px; box-sizing: border-box;">
                <textarea id="chat_text" oninput="auto_grow_text_area(this)" style="flex: 1; box-sizing: border-box; resize: none;"></textarea>
                <button onclick="on_post_message()" style="margin-left: 10px;">Post</button>
            </div>
         </div>`;
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function post_neutral_message() {
    neutral_message = juryText[getRandomInt(1, 30)];

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

setInterval(fetch_messages, 500);

window.onload = () => {
    main();
    setInterval(fetch_messages, 500);

    // Scroll to the bottom on load
    let chat_messages = document.getElementById('chat_messages');
    chat_messages.scrollTop = chat_messages.scrollHeight;
};