import express from 'express';
import { appendFileSync, readFileSync } from 'node:fs';

const app = express();
const PORT = 3000;

//const fs = require('fs');
//const rows = data.split('\n').map(row => row.trim()).filter(row => row);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.send('Hello! I am die. Thank you forever');

});

// Add books to text file
app.post('/add-book', (req, res) => {
    const { bookName, isbn, author, yearPublished } = req.body; // Destructuring syntax to split the book object

    // Check if all fields are present and not empty
    if (bookName != null && isbn != null && author != null && yearPublished != null && bookName.length != 0 && isbn.length != 0 && author.length != 0 && yearPublished.length != 0){

        let books = []; // For storing books

        // Read the existing books from books.txt
        try {
            const data = readFileSync('books.txt', 'utf8'); // Read file content
            books = data.split('\n').map(line => line.trim()).filter(line => line); // Convert to array and remove empty lines
        } catch (err) {
            if (err.code !== 'ENOENT') { // Ignore error if file does not exist
                return res.json({ success: false, message: "Error reading the file." });
            }
        }

        // Extract all existing ISBNs from the file
        const existingIsbns = books.map(line => {
            const bookDetails = line.split(','); 
            return bookDetails[1]; // Get the ISBN (2nd value in CSV)
        });

        // Check if the new ISBN already exists in the list
        const isDuplicate = existingIsbns.includes(isbn);

        
        if (isDuplicate) {
            return res.json({ success: false, message: "ISBN already exists." });
        }

        const bookData = `${bookName},${isbn},${author},${yearPublished}\n`;
        appendFileSync('books.txt',  bookData, 'utf8');
        return res.json({ success: true });

    } else {
        return res.json({ success: false });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });

