function fetchBooks() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) {
        alert("Please enter a search query!");
        return;
    }

    fetch(`https://openlibrary.org/search.json?q=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById("resultsContainer");
            resultsContainer.innerHTML = "";

            if (!data.docs || data.docs.length === 0) {
                resultsContainer.innerHTML = "<p>No books found matching your search.</p>";
                return;
            }

            data.docs.forEach(book => {
               
                const bookCard = document.createElement("div");
                bookCard.classList.add("book-card");

                const bookId = book.key.split('/').pop(); 

                bookCard.innerHTML = `
                    <h3>${book.title || "Unknown Title"}</h3>
                    <p>${book.author_name ? book.author_name.join(", ") : "Unknown Author"}</p>
                    <a href="book.html?id=${bookId}" target="_blank">View Details</a>
                `;

                resultsContainer.appendChild(bookCard);

                
                saveBookToDatabase(book);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Unable to fetch books at this time.");
        });
}

function saveBookToDatabase(book) {

    fetch('http://localhost:3002/addBook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: book.key.split('/').pop(), 
            title: book.title || "Unknown Title",
            authors: book.author_name ? book.author_name.join(", ") : "Unknown Author",
            publisher: book.publisher ? book.publisher.join(", ") : "Unknown Publisher",
            description: book.first_sentence ? book.first_sentence.value || "No description available." : "No description available.",
            pageCount: book.number_of_pages_median || 0
        })
    }).then(response => {
        if (response.ok) {
            console.log('Book saved successfully');
        } else {
            console.error('Failed to save book');
        }
    }).catch(error => {
        console.error('Error saving book:', error);
    });
}
