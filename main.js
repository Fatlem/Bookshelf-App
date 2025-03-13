let books = JSON.parse(localStorage.getItem('books')) || [];

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function addBook(event) {
    event.preventDefault();

    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value, 10);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const newBook = {
        id: Date.now(),
        title,
        author,
        year,
        isComplete,
    };

    books.push(newBook);
    saveBooks();
    renderBooks();
    document.getElementById('bookForm').reset();
    showNotification('Buku berhasil ditambahkan!');
}

function renderBooks(query = '') {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    books.forEach((book) => {
        if (query && !book.title.toLowerCase().includes(query.toLowerCase())) {
            return;
        }

        const bookItem = createBookItem(book);
        if (book.isComplete) {
            completeBookList.appendChild(bookItem);
        } else {
            incompleteBookList.appendChild(bookItem);
        }
    });
}

function createBookItem(book) {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');

    const bookTitle = document.createElement('h3');
    bookTitle.setAttribute('data-testid', 'bookItemTitle');
    bookTitle.textContent = book.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
    bookAuthor.textContent = `Penulis: ${book.author}`;

    const bookYear = document.createElement('p');
    bookYear.setAttribute('data-testid', 'bookItemYear');
    bookYear.textContent = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement('div');

    const isCompleteButton = document.createElement('button');
    isCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    isCompleteButton.innerHTML = `<i class="fas fa-check"></i> ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}`;
    isCompleteButton.addEventListener('click', () => toggleBookStatus(book.id));

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.innerHTML = `<i class="fas fa-trash"></i> Hapus Buku`;
    deleteButton.addEventListener('click', () => deleteBook(book.id));

    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.innerHTML = `<i class="fas fa-edit"></i> Edit Buku`;
    editButton.addEventListener('click', () => editBook(book.id));

    buttonContainer.appendChild(isCompleteButton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(editButton);

    bookItem.appendChild(bookTitle);
    bookItem.appendChild(bookAuthor);
    bookItem.appendChild(bookYear);
    bookItem.appendChild(buttonContainer);

    return bookItem;
}

function toggleBookStatus(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooks();
        renderBooks();
        showNotification(book.isComplete ? 'Buku ditandai sebagai selesai dibaca!' : 'Buku ditandai sebagai belum selesai dibaca!');
    }
}

function deleteBook(bookId) {
    books = books.filter((b) => b.id !== bookId);
    saveBooks();
    renderBooks();
    showNotification('Buku berhasil dihapus!');
}

function editBook(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;

        const submitButton = document.getElementById('bookFormSubmit');
        submitButton.textContent = 'Simpan Perubahan';

        submitButton.removeEventListener('click', addBook);
        submitButton.addEventListener('click', (event) => {
            event.preventDefault();

            const updatedTitle = document.getElementById('bookFormTitle').value;
            const updatedAuthor = document.getElementById('bookFormAuthor').value;
            const updatedYear = parseInt(document.getElementById('bookFormYear').value, 10);
            const updatedIsComplete = document.getElementById('bookFormIsComplete').checked;

            const updatedBook = {
                id: bookId,
                title: updatedTitle,
                author: updatedAuthor,
                year: updatedYear,
                isComplete: updatedIsComplete,
            };

            books = books.map((b) => (b.id === bookId ? updatedBook : b));
            saveBooks();
            renderBooks();
            document.getElementById('bookForm').reset();
            submitButton.textContent = 'Masukkan Buku ke rak';
            submitButton.removeEventListener('click', (event) => {
                event.preventDefault();
            });
            submitButton.addEventListener('click', addBook);
            showNotification('Buku berhasil diperbarui!');
        });
    }
}

function searchBooks(event) {
    event.preventDefault();
    const query = document.getElementById('searchBookTitle').value;
    renderBooks(query);
}

function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.classList.add('fade-in');

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('fade-in');
        notification.classList.add('fade-out');

        notification.addEventListener('transitionend', () => {
            notificationContainer.removeChild(notification);
        });
    }, 3000);
}

document.getElementById('bookForm').addEventListener('submit', addBook);
document.getElementById('searchBook').addEventListener('submit', searchBooks);

renderBooks();
