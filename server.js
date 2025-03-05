import express from 'express';
import { appendFileSync, readFileSync } from 'node:fs';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.send('Hello! I am die. Thank you forever.');

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
            books = data.split('\n'); // Convert to array 
        } catch (err) {
            if (err.code !== 'ENOENT') { // Ignore error if file does not exist, added so code will not crash if books.txt is not yet
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
        return res.json({ success: true, message: "Successfully added."});

    } else {
        return res.json({ success: false, message: "Invalid details." });
    }
});


app.get('/find-by-isbn-author', (req, res) => { // FIND BY ISBN AND AUTHOR

    // Check query
    console.log("Received query", req.query); 

    const bookFound = []; // Store book if found
    const bookList = readFileSync('books.txt', 'utf8'); // Read books.txt
    const books = bookList.split('\n'); // Make array of books

    for(let i = 0; i < books.length; i++){
        let bookDetails = books[i].split(','); // Get book details

        // Remake object
        let book = {
            bookName: bookDetails[0],
            isbn: bookDetails[1],
            author: bookDetails[2],
            yearPublished: bookDetails[3]
        };

        // Check for matching details
        if(req.query.isbn == book.isbn  && req.query.author == book.author){
            bookFound.push(book); // Append if found
        }
    }

    // Log the found books
    console.log('Found books:', bookFound);
    return res.json(bookFound); // Show in server
});

app.get('/find-by-author', (req, res) => { // FIND BY AUTHOR

    // Check query
    console.log("Received query", req.query); 

    const bookFound = []; // Store book if found
    const bookList = readFileSync('books.txt', 'utf8'); // Read books.txt
    const books = bookList.split('\n'); // Make array of books

    for(let i = 0; i < books.length; i++){
        let bookDetails = books[i].split(','); // Get book details

        // Remake object
        let book = {
            bookName: bookDetails[0],
            isbn: bookDetails[1],
            author: bookDetails[2],
            yearPublished: bookDetails[3]
        };

        // Check for matching details
        if(req.query.author == book.author){
            bookFound.push(book); // Append if found
        }
    }

    // Log the found books
    console.log('Found books:', bookFound);
    return res.json(bookFound); // Show in server
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });

