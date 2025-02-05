// Array to store quote objects
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Attitude" }
];

// Simulate server URL (JSONPlaceholder for demo purposes)
const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

// Load quotes from local storage when the application initializes
window.onload = async function() {
  if (localStorage.getItem('quotes')) {
    quotes = JSON.parse(localStorage.getItem('quotes'));
  }
  populateCategories();
  createAddQuoteForm();
  const lastCategory = localStorage.getItem('selectedCategory');
  if (lastCategory) {
    document.getElementById('categoryFilter').value = lastCategory;
    filterQuotes();
  }
  await fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 60000); // Fetch quotes from server every minute
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    const serverQuoteObjects = serverQuotes.map(q => ({ text: q.title, category: 'Server' }));
    const newQuotes = serverQuoteObjects.filter(sq => !quotes.some(lq => lq.text === sq.text));
    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      alert('New quotes fetched from server!');
    }
    updateQuoteList();
  } catch (error) {
    console.error('Error fetching quotes:', error);
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to add a new quote
async function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();

    // Post the new quote to the server
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
      });
      const result = await response.json();
      console.log('Quote added to server:', result);
    } catch (error) {
      console.error('Error posting quote to server:', error);
    }

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('New quote added!');
    populateCategories();
    updateQuoteList(); // Optional: update the display of all quotes if you want to show them
  } else {
    alert('Please enter both quote and category.');
  }
}

// Function to create and add the quote form dynamically
function createAddQuoteForm() {
  const formDiv = document.createElement('div');
  formDiv.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
    <button onclick="exportToJsonFile()">Export Quotes</button>
    <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
  `;
  document.body.appendChild(formDiv);
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
    updateQuoteList(); // Optional: update the display of all quotes if you want to show them
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to populate the categories dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear the current content
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `<p>"${quote.text}"</p><p> - ${quote.category}</p>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Event listener for 'Show New Quote' button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Optional: Function to display all quotes (if you want to show a list of all quotes)
function updateQuoteList() {
  filterQuotes(); // Filter quotes based on the current selection
}
