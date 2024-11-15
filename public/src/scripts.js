const profilePanel = document.getElementById('profile');

profilePanel.addEventListener('mouseenter', function() {
    this.classList.add('open');
});

profilePanel.addEventListener('mouseleave', function() {
    this.classList.remove('open');
});

function toggleHelpPanel() {
    var panel = document.getElementById("help-panel");
    panel.classList.toggle("open");
}

function navigate(page) {
    window.location.href = page;
}