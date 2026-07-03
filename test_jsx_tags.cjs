const fs = require('fs');
const content = fs.readFileSync('src/pages/admin/AvatarUploadScreen.tsx', 'utf8');
const openTags = (content.match(/<[A-Za-z]+[^>]*[^/]>/g) || []).map(t => t.split(' ')[0].replace('<', '').replace('>', ''));
const closeTags = (content.match(/<\/[A-Za-z]+>/g) || []).map(t => t.replace('</', '').replace('>', ''));

let counts = {};
for(let t of openTags) {
    if(t.includes('=')) t = t.split('=')[0];
    counts[t] = (counts[t] || 0) + 1;
}
for(let t of closeTags) {
    counts[t] = (counts[t] || 0) - 1;
}
console.log(counts);
