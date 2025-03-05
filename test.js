import needle from 'needle';

needle.post(
    'http://localhost:3000/add-book',
    {
      bookName: "Harry Potter and the Goblet of Fire",
      isbn: "0-7475-4622-3",
      author: "J.K. Rowling",
      yearPublished: "2000"
    },
    { json: true },
    (err, res) => {
      if (err) {
        console.log('Error:', err);
      } else {
        console.log('Response:', res.body); // { success: true } or { success: false }
      }
    }
  );