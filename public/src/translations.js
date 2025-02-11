const translations = {
    en: {
        title: "LITHIUM Access Management System",
        home: "Home",
        contract: "Contract",
        userProfile: "User Profile",
        userAddressLabel: "User Address:",
        userEmailLabel: "User Email:",
        userRoleLabel: "User Role:",
        logoutButton: "Log Out",
        commandLine: "Command Line",
        getUserRole: "Get User Role",
        assignUserRole: "Assign User Role",
        registerUser: "Register User",
        transferOwnership: "Transfer Ownership",
        allUsers: "All Users",
        name: "Name",
        role: "Role",
        contactDev: "Contact with a developer on GitHub",
        version: "Version: 1.0.0"
    },
    kk: {
        title: "LITHIUM Қол жеткізуді басқару жүйесі",
        home: "Басты бет",
        contract: "Келісім",
        userProfile: "Пайдаланушы профилі",
        userAddressLabel: "Пайдаланушы мекенжайы:",
        userEmailLabel: "Пайдаланушының электрондық поштасы:",
        userRoleLabel: "Пайдаланушы рөлі:",
        logoutButton: "Шығу",
        commandLine: "Командалық жол",
        getUserRole: "Пайдаланушы рөлін алу",
        assignUserRole: "Пайдаланушы рөлін тағайындау",
        registerUser: "Пайдаланушыны тіркеу",
        transferOwnership: "Иелікті беру",
        allUsers: "Барлық пайдаланушылар",
        name: "Аты",
        role: "Рөлі",
        contactDev: "GitHub-та әзірлеушімен байланысу",
        version: "Нұсқа: 1.0.0"
    }
};

function changeLang(lang) {
    localStorage.setItem('lang', lang);
    document.querySelectorAll("[id]").forEach(element => {
        if (translations[lang][element.id]) {
            element.textContent = translations[lang][element.id];
        }
    });
}