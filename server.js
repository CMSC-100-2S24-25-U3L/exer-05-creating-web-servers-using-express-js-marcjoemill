import express from 'express';
import { appendFileSync } from 'node:fs'; // Create file.txt

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.send('Hello! I am die. Thank you forever');

});

// Add books to text file
app.post('/add-book', (req, res) => {
    const { bookName, isbn, author, yearPublished } = req.body; // Destructuring syntax to split the book object

    // Check if all fields are present and not empty
    if (bookName.length != 0 && isbn.length != 0  && author.length != 0  && yearPublished.length != 0){
        const bookData = `${bookName},${isbn},${author},${yearPublished}\n`;
        appendFileSync('text.txt',  bookData, 'utf8');
        return res.json({ success: true });

    } else {
        return res.json({ success: false });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });

