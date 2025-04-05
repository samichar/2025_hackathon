# 2025_hackathon

How to import fonts into HTML/CSS:

1) Download font and extract it and add it to whatever branch you are using.

   - Here is Press Start 2P: https://www.fontspace.com/press-start-2p-font-f11591

2) In CSS file, add this ...

@font-face {

    font-family: 'Press Start 2P';
   
    src: url('/press-start-2p-font/PressStart2P-vaV7.ttf') format('truetype');
   
    font-weight: normal; // This can be changed depending on style.
   
    font-style: normal; // ^^
   
}

... where the font family is the name of whatever font and the source url is the path to the font.

3) In CSS file, wherever you want the text to be the font, do this ...

.header-statement {

    font-family: 'Press Start 2P';
   
}

... (this is an example). This should work for any font you download (hopefully, just make sure it's HTML compatible if it doesn't work).
