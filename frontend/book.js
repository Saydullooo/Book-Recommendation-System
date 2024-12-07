document.addEventListener("DOMContentLoaded", () => {
    
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

    if (!bookId) {
        document.getElementById("bookDetails").innerHTML = "<p>Book not found.</p>";
        return;
    }

    fetch(`http://localhost:3002/book/${bookId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Book not found in database");
            }
            return response.json();
        })
        .then(data => {
            const bookDetailsDiv = document.getElementById("bookDetails");

            
            bookDetailsDiv.innerHTML = `
                <h2>${data.title || "Unknown Title"}</h2>
                <p><strong>Authors:</strong> ${data.authors || "Unknown"}</p>
                <p><strong>Description:</strong> ${data.description || "No description available."}</p>
                <p><strong>Publisher:</strong> ${data.publisher || "Unknown Publisher"}</p>
                <p><strong>Pages:</strong> ${data.pageCount || "Unknown"}</p>
            `;
        })
        .catch(() => {
           
            fetch(`https://openlibrary.org/works/${bookId}.json`)
                .then(response => response.json())
                .then(data => {
                    const bookDetailsDiv = document.getElementById("bookDetails");

                   
                    bookDetailsDiv.innerHTML = `
                        <h2>${data.title || "Unknown Title"}</h2>
                        <p><strong>Authors:</strong> ${data.authors ? data.authors.map(author => author.name).join(", ") : "Unknown"}</p>
                        <p><strong>Description:</strong> ${data.description ? (typeof data.description === 'string' ? data.description : data.description.value) : "No description available."}</p>
                        <p><strong>Pages:</strong> ${data.pagination || "Unknown"}</p>
                    `;
                })
                .catch(error => {
                    console.error("Error fetching book details from Open Library:", error);
                    document.getElementById("bookDetails").innerHTML = "<p>Error loading book details.</p>";
                });
        });
});