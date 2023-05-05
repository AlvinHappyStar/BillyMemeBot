import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const TelegramBot = require('node-telegram-bot-api');
const Canvas = require('canvas');
const fs = require('fs');

// Replace the value below with the Telegram token you receive from @BotFather
const token = '6077558302:AAEdbmdWX9ZvfmAV_ie1fUFe5E-IZEpSmoo';

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

//message count
let count = 0;

let firstmessage = "";


// Listen for incoming messages
bot.on('message', (msg) => {
    // Load the meme image template from file
    if (count == 0) {
        firstmessage = msg.text;
        count++;
    }

    else {
        const memeImage = new Canvas.Image();
        memeImage.src = fs.readFileSync('./meme_template.jpg');

        // Create an empty canvas to draw on using the same dimensions as the image template
        const canvas = Canvas.createCanvas(memeImage.width, memeImage.height);
        const ctx = canvas.getContext('2d');

        
        // Draw the meme image onto the canvas
        ctx.drawImage(memeImage, 0, 0, memeImage.width, memeImage.height);

        // Parse the text message sent by the user
        const messageText = msg.text;
        console.log(messageText);

        // Define the font and color for the text
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';

        // Calculate the position of the text on the image
        const x1 = 210;
        const y1 = memeImage.height / 2 + 80;

        const x2 = memeImage.width / 2 + 100;
        const y2 = memeImage.height / 2 + 120;


        const lineHeight = 20;


        let words = firstmessage.split(' ');
        let line = '';
        let lines = [];
        for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > 200 && i > 0) {
                lines.push(line);
                line = words[i] + ' ';
            }
            else {
                line = testLine;
            }
        }
        lines.push(line);

        // Write the text onto the canvas
        ctx.textAlign = 'center';
        for (let i = 0; i < lines.length && i * lineHeight < 100; i++) {
            ctx.fillText(lines[i], x1, y1 + i * lineHeight);
        }

        words = messageText.split(' ');
        line = '';
        lines = [];
        for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > 100 && i > 0) {
                lines.push(line);
                line = words[i] + ' ';
            }
            else {
                line = testLine;
            }
        }
        lines.push(line);

        // Write the text onto the canvas
        ctx.textAlign = 'center';
        for (let i = 0; i < lines.length && i * lineHeight < 100; i++) {
            ctx.fillText(lines[i], x2, y2 + i * lineHeight);
        }

        
        // Get the modified image data as a Buffer
        const modifiedImageData = canvas.toBuffer('image/png');

        // Send the modified image back to the user
        bot.sendPhoto(msg.chat.id, modifiedImageData, { caption: `Learning about money` });
        
        count = 0;
    }

});


