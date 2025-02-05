// Array to store quote objects
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Attitude" },
  // Add more predefined quotes as needed
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerHTML = `<p>"${quote.text}"</p><p> - ${quote.category}</p>`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('New quote added!');
    updateQuoteList(); // Optional: update the display of all quotes if you want to show them
  } else {
    alert('Please enter both quote and category.');
  }
}

// Event listener for 'Show New Quote' button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Optional: Function to display all quotes (if you want to show a list of all quotes)
function updateQuoteList() {
  const quoteList = document.getElementById('quoteDisplay');
  quoteList.innerHTML = ''; // Clear the current content
  quotes.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `<p>"${quote.text}"</p><p> - ${quote.category}</p>`;
    quoteList.appendChild(quoteElement);
  });
}
