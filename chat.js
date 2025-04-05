let currentChatroom = ''; // Global variable to store the selected chatroom
let neutralMessageTimeout;
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
            <h2 class="entry-text">Select a Courtroom</h2>
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
    <div id="courtroom-name" class="courtroom-name">${chatroom}</div>
    <div style="position: relative; width: 100vw; height: 100vh; overflow: hidden; background-image: url('fury-jury.png'); background-size: cover; background-position: center;">
  
        <!-- Invisible jury buttons -->
        <!-- Button 1 -->
        <button onclick="post_neutral_message(false, this)" style="
            position: absolute;
            top: 1.96%;
            left: 7.5%;
            width: 11.74%;
            height: 42.87%;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0;
            z-index: 10;
        "></button>

        <!-- Button 2 -->
        <button onclick="post_neutral_message(false, this)" style="
            position: absolute;
            top: 1.96%;
            left: 26%;
            width: 11.74%;
            height: 42.87%;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0;
            z-index: 10;
        "></button>

        <!-- Button 3 -->
        <button onclick="post_neutral_message(false, this)" style="
            position: absolute;
            top: 1.96%;
            left: 44%;
            width: 11.74%;
            height: 42.87%;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0;
            z-index: 10;
        "></button>

        <!-- Button 4 (Furry) -->
        <button onclick="post_neutral_message(true, this)" style="
            position: absolute;
            top: 0%;
            left: 58.5%;
            width: 19.57%;
            height: 44.83%;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0;
            z-index: 10;
        "></button>

        <!-- Button 5 -->
        <button onclick="post_neutral_message(false, this)" style="
            position: absolute;
            top: 1.63%;
            left: 80.25%;
            width: 11.74%;
            height: 42.2%;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0;
            z-index: 10;
        "></button>

        <!-- Neutral message container -->
        <div id="neutral_message_container" style="
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(0%, -125%);
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            padding: 10px 15px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            font-family: 'Press Start 2P', Arial, sans-serif;
            font-size: 10px;
            text-align: center;
            z-index: 20;
            display: none; /* Initially hidden */
        "></div>
  
        <!-- chat overlay container -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 20px; box-sizing: border-box; z-index: 2;">
  
            <!-- chat messages area at bottom -->
            <div id="chat_messages" style="
            position: absolute;
            bottom: 0px;         
            left: 0;
            width: 100%;
            max-height: 53.8%;     
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
            <button onclick="on_post_message()" >Post</button>
            </div>
        </div>
    </div>
    `;

    setTimeout(() => {
        fetch_messages(); // fetch initial messages once
        main();           // reinitialize chat box & listeners

        // 🔁 Restart message polling
        if (fetchInterval) clearInterval(fetchInterval);
        fetchInterval = setInterval(fetch_messages, 500);
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function post_neutral_message(furry, button) {
    // Get jury message
    let neutral_message = '';
    if (furry === true) {
        neutral_message = furryText[getRandomInt(1, 11)];
    } else {
        neutral_message = juryText[getRandomInt(1, 30)];
    }

    const neutral_message_container = document.getElementById('neutral_message_container');
    const buttonRect = button.getBoundingClientRect();


    // Update the content of the neutral message container
    neutral_message_container.innerHTML = neutral_message;

    // Temporarily make the container visible to calculate its width
    neutral_message_container.style.display = 'block';

    // Recalculate the container's width after updating its content
    const containerWidth = neutral_message_container.offsetWidth;

    // Position the neutral message container below the button and align its center with the button's center
    neutral_message_container.style.top = `${buttonRect.bottom + window.scrollY + 10}px`; // 10px below the button
    neutral_message_container.style.left = `${buttonRect.left + window.scrollX + buttonRect.width / 2 - containerWidth / 2}px`; // Center align

    // Clear any existing timeout
    if (neutralMessageTimeout) {
        clearTimeout(neutralMessageTimeout);
    }

    // Set a new timeout to hide the message after 10 seconds
    neutralMessageTimeout = setTimeout(() => {
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

        //keydown listener for Enter to send message
        //new line if shift is pressed
        chat_text.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault(); 
                on_post_message();   
            }
        });
    }

    chat_text.focus(); //automatically makes you be able to write stuff 
    setInterval(fetch_messages, 500);
}

window.onload = () => {
    main();
    setInterval(fetch_messages, 500);

    // Scroll to the bottom on load
    let chat_messages = document.getElementById('chat_messages');
    chat_messages.scrollTop = chat_messages.scrollHeight;
};

