const http = require('http');

const PORT = 3000;

// Dummy HTML data for testing
const dummyHtml = `
    <h2 class="latest-stories__item-headline">Story 1</h2>
    <a href="/2024/09/01/story1">Link to Story 1</a>
    <h2 class="latest-stories__item-headline">Story 2</h2>
    <a href="/2024/09/01/story2">Link to Story 2</a>
    <h2 class="latest-stories__item-headline">Story 3</h2>
    <a href="/2024/09/01/story3">Link to Story 3</a>
    <h2 class="latest-stories__item-headline">Story 4</h2>
    <a href="/2024/09/01/story4">Link to Story 4</a>
    <h2 class="latest-stories__item-headline">Story 5</h2>
    <a href="/2024/09/01/story5">Link to Story 5</a>
    <h2 class="latest-stories__item-headline">Story 6</h2>
    <a href="/2024/09/01/story6">Link to Story 6</a>
`;

http.createServer((req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);

    if (req.url === '/getTimeStories' && req.method === 'GET') {
        console.log('Using dummy HTML data for testing');
        const stories = parseStories(dummyHtml);
        console.log('Parsed stories:', stories);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stories));
    } else {
        console.log('Endpoint not found');
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/getTimeStories`);
});

// Function to parse HTML and extract the latest 6 stories
function parseStories(html) {
    const stories = [];
    const regexHeadline = /<h2[^>]*class="[^"]*latest-stories__item-headline[^"]*"[^>]*>(.*?)<\/h2>/g;
    const regexLink = /<a href="(\/\d{4}\/\d{2}\/\d{2}\/[^"]*)"/g;
    let matchHeadline, matchLink;

    while ((matchHeadline = regexHeadline.exec(html)) !== null && stories.length < 6) {
        const title = matchHeadline[1].replace(/<.*?>/g, '').trim();
        
        // Extract link corresponding to the headline
        matchLink = regexLink.exec(html);
        const link = matchLink ? `https://time.com${matchLink[1]}` : '';

        if (title && link) {
            stories.push({ title, link });
        }
    }

    return stories;
}
