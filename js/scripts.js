// Function to load content based on tab click
function loadTab(tab) {
    // Get all tabs
    const tabs = document.querySelectorAll('.tab-content');
    
    // Hide all tabs
    tabs.forEach(tabContent => {
        tabContent.classList.remove('active');  // Hide all tabs
    });

    // Show the selected tab
    const selectedTab = document.getElementById(tab);
    if (selectedTab) {
        selectedTab.classList.add('active');  // Show the selected tab
    }

    // Dynamically load the corresponding CSS file for the active tab
    const tabStylesheet = document.getElementById('tab-stylesheet');
    switch (tab) {
        case 'home':
            tabStylesheet.href = 'style/home.css';
            break;
        case 'editor':
            tabStylesheet.href = 'style/editor.css';
            break;
        case 'about':
            tabStylesheet.href = 'style/about.css';
            break;
        case 'contact':
            tabStylesheet.href = 'style/contact.css';
            break;
        case 'dragdrop':
            tabStylesheet.href = 'style/dragdrop.css';
            break;
        default:
            tabStylesheet.href = 'style/home.css';
    }
}

// Sidebar toggle logic
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main-content');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('closed');
    main.classList.toggle('expanded');
  });
});

// Load home tab on page load
window.onload = function() {
  loadTab('home');
};
