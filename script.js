document.addEventListener('DOMContentLoaded', () => {
    let books = [  // Sample book data
        { id: 1, title: 'Властелин колец', author: 'Толкин', category: 'Фэнтези', year: 1954, price: 15.99, stock: 5 },
        { id: 2, title: 'Гордость и предубеждение', author: 'Джейн Остин', category: 'Классика', year: 1813, price: 9.99, stock: 3 },
        { id: 3, title: '1984', author: 'Джордж Оруэлл', category: 'Антиутопия', year: 1949, price: 12.50, stock: 7 }
    ];

    let isAdminMode = false;  // Flag to track admin mode
    let nextBookId = 4;  // Next available ID for new books

    // Get DOM elements
    const userInterface = document.getElementById('user-interface');
    const adminInterface = document.getElementById('admin-interface');
    const userModeBtn = document.getElementById('user-mode-btn');
    const adminModeBtn = document.getElementById('admin-mode-btn');
    const bookList = document.getElementById('book-list');
    const adminBookList = document.getElementById('admin-book-list');
    const sortBySelect = document.getElementById('sort-by');
    const addBookBtn = document.getElementById('add-book-btn');
    const bookModal = document.getElementById('book-modal');
    const bookForm = document.getElementById('book-form');
    const bookIdInput = document.getElementById('book-id');
    const modalTitle = document.getElementById('modal-title');
    const saveBookBtn = document.getElementById('save-book-btn');
    const bookInfoModal = document.getElementById('book-info-modal');

    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const categoryInput = document.getElementById('category');
    const yearInput = document.getElementById('year');
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');

    const infoTitle = document.getElementById('info-title');
    const infoAuthor = document.getElementById('info-author');
    const infoCategory = document.getElementById('info-category');
    const infoYear = document.getElementById('info-year');
    const infoPrice = document.getElementById('info-price');
    const infoStock = document.getElementById('info-stock');

    const rentalOptions = document.getElementById('rental-options');
    const buyBookBtn = document.getElementById('buy-book-btn');

    // Event listeners for mode switching
    userModeBtn.addEventListener('click', () => {
        isAdminMode = false;
        updateUI();
    });

    adminModeBtn.addEventListener('click', () => {
        isAdminMode = true;
        updateUI();
    });

    // Event listener for adding a book
    addBookBtn.addEventListener('click', () => {
        openBookModal();
    });

    // Event listener for saving a book
    bookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saveBook();
    });

    // Event listener for sorting
    sortBySelect.addEventListener('change', () => {
        sortBooks(sortBySelect.value);
    });

      // Add event listener for rent buttons
      rentalOptions.addEventListener('click', (event) => {
        if (event.target.classList.contains('rent-button')) {
            const duration = event.target.dataset.duration;
            rentBook(currentBookId, duration);  // Pass duration to the function
        }
    });

    // Add event listener for buy button
    buyBookBtn.addEventListener('click', () => {
        buyBook(currentBookId);
    });

    // Event listener for closing the modal
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            closeModal();
        });
    });

    // Function to update the UI based on the mode
    function updateUI() {
        if (isAdminMode) {
            userInterface.style.display = 'none';
            adminInterface.style.display = 'block';
            renderAdminBookList();
        } else {
            userInterface.style.display = 'block';
            adminInterface.style.display = 'none';
            renderBookList();
        }
    }

    // Function to render the book list
    function renderBookList() {
        bookList.innerHTML = '';
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.textContent = book.title;
            bookItem.addEventListener('click', () => showBookInfo(book.id)); // Event listener to show book info
            bookList.appendChild(bookItem);
        });
    }

    // Function to render the admin book list
    function renderAdminBookList() {
        adminBookList.innerHTML = '';
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.textContent = book.title;
            bookItem.addEventListener('click', () => openBookModal(book.id)); // Event listener to edit the book
            adminBookList.appendChild(bookItem);
        });
    }

    // Function to sort books
    function sortBooks(sortBy) {
        switch (sortBy) {
            case 'category':
                books.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'author':
                books.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case 'year':
                books.sort((a, b) => a.year - b.year);
                break;
        }
        renderBookList(); // Re-render the book list after sorting
    }

     // Variables to store the ID of the current book being viewed/edited
     let currentBookId = null;

    // Function to open the book modal
    function openBookModal(bookId) {
        currentBookId = bookId;
        if (bookId) {
            // Editing an existing book
            const book = books.find(b => b.id === bookId);
            bookIdInput.value = book.id;
            titleInput.value = book.title;
            authorInput.value = book.author;
            categoryInput.value = book.category;
            yearInput.value = book.year;
            priceInput.value = book.price;
            stockInput.value = book.stock;
            modalTitle.textContent = 'Редактировать книгу';
        } else {
            // Adding a new book
            bookForm.reset();
            bookIdInput.value = '';
            modalTitle.textContent = 'Добавить книгу';
        }
        bookModal.style.display = 'block';
    }

    // Function to save the book
    function saveBook() {
        const bookId = bookIdInput.value;
        const bookData = {
            id: bookId ? parseInt(bookId) : nextBookId++,  // Use nextBookId for new books
            title: titleInput.value,
            author: authorInput.value,
            category: categoryInput.value,
            year: parseInt(yearInput.value),
            price: parseFloat(priceInput.value),
            stock: parseInt(stockInput.value)
        };

        if (bookId) {
            // Editing an existing book
            const index = books.findIndex(b => b.id === parseInt(bookId));
            if (index !== -1) {
                books[index] = bookData;
            }
        } else {
            // Adding a new book
            books.push(bookData);
        }

        closeModal();
        updateUI(); // Update the UI to reflect changes
    }


   // Function to display book information in the modal
   function showBookInfo(bookId) {
    currentBookId = bookId;  // Store the current book ID
    const book = books.find(b => b.id === bookId);

    infoTitle.textContent = book.title;
    infoAuthor.textContent = `Автор: ${book.author}`;
    infoCategory.textContent = `Категория: ${book.category}`;
    infoYear.textContent = `Год: ${book.year}`;
    infoPrice.textContent = `Цена: $${book.price}`;
    infoStock.textContent = `В наличии: ${book.stock} шт.`;

    bookInfoModal.style.display = 'block';
}

    // Function to rent a book
    function rentBook(bookId, duration) {
        const book = books.find(b => b.id === bookId);
        if (book && book.stock > 0) {
            // Update stock and handle rental logic
            book.stock--;
            alert(`Вы арендовали "${book.title}" на ${duration} месяц(а/ев).`);
            infoStock.textContent = `В наличии: ${book.stock} шт.`;
            updateUI();
        } else {
            alert('Книга недоступна для аренды.');
        }
        closeModal();
    }

    // Function to buy a book
    function buyBook(bookId) {
        const book = books.find(b => b.id === bookId);
        if (book && book.stock > 0) {
            // Update stock and handle purchase logic
            book.stock--;
            alert(`Вы купили "${book.title}". Спасибо за покупку!`);
            infoStock.textContent = `В наличии: ${book.stock} шт.`;
            updateUI();
        } else {
            alert('Книга недоступна для покупки.');
        }
        closeModal();
    }


    // Function to close the modal
    function closeModal() {
        bookModal.style.display = 'none';
        bookInfoModal.style.display = 'none';
    }


    // Initial UI update
    updateUI();
});
