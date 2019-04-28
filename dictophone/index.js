let mic = require('mic-stream');
let speaker = require('audio-speaker');

mic().pipe(speaker());
