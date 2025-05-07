document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("releases-container");

    // Create the popup once so it's globally available
    const popupHTML = `
        <div id="staffPopup" class="staff-popup hidden">
            <div class="staff-popup-content">
                <span class="close-popup">&times;</span>
                <h2 id="popupTitle"></h2>
                <div id="popupStaffList"></div> <!-- Using <div> instead of <ul> -->
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    const popup = document.getElementById("staffPopup");
    const closeBtn = popup.querySelector(".close-popup");
    const popupTitle = document.getElementById("popupTitle");
    const popupStaffList = document.getElementById("popupStaffList");

    function showStaffPopup(release) {
        popupTitle.textContent = `${release.episodetitle} - Staff`;

        // Directly use the staff property as HTML content
        popupStaffList.innerHTML = release.staff || "No staff credits available.";
        popup.classList.remove("hidden");
    }

    closeBtn.addEventListener("click", () => {
        popup.classList.add("hidden");
    
        // Remove the ?staff= query parameter from the URL
        const url = new URL(window.location.href);
        url.searchParams.delete("staff"); // Remove the 'staff' query parameter
        window.history.pushState({}, '', url); // Update the URL without reloading the page
    });
    

    // Fetch the JSON file and process it
    fetch("../backend stuff/releases.json")
        .then(response => response.json())
        .then(data => {
            const urlParams = new URLSearchParams(window.location.search);
            const requestedId = urlParams.get("post");
            const staffId = urlParams.get("staff");

            const filteredData = requestedId
                ? data.filter(release => release.id === requestedId && release.hidden !== "true" && release.hidden !== true)
                : data.slice().reverse().filter(release => release.hidden !== "true" && release.hidden !== true && release.releasespage == "yes");

            const isPortuguese = window.location.pathname.includes('/br/');

            filteredData.forEach(release => {
                const releaseDiv = document.createElement("div");
                releaseDiv.classList.add("release");

                const img = document.createElement("img");
                img.src = release.image || "/NNT/ApocalypticSubs/backend stuff/releasephotos/placeholder.png";
                img.alt = `${release.displaytext || "Release"} Image`;
                releaseDiv.appendChild(img);

                const langText = isPortuguese ? release.displaytextbr : release.displaytexten;
                const langLink = isPortuguese ? release.br : release.en;
                const title = isPortuguese ? release.episodetitle : release.episodetitle;

                const downloadLink = document.createElement("a");
                downloadLink.href = langLink || "https://discord.gg/hXPgj7dvM7";
                downloadLink.textContent = langLink
                    ? `${isPortuguese ? "Baixar" : "Download"} ${langText} - ${title} (${isPortuguese ? "PT-BR" : "EN"})`
                    : (isPortuguese
                        ? "Estamos trabalhando duro para o lançamento, por favor, entre no nosso Discord para atualizações"
                        : "We are working on this release, please join our Discord for updates");
                releaseDiv.appendChild(downloadLink);

                // Add "View Staff Credits" button
                const staffButton = document.createElement("button");
                staffButton.textContent = "View Staff Credits";
                staffButton.className = "staff-credit-button";
                staffButton.addEventListener("click", () => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("staff", release.id);
                    window.history.pushState({}, '', url); // Update URL without reload
                    showStaffPopup(release);
                });
                releaseDiv.appendChild(staffButton);

                container.appendChild(releaseDiv);
            });

            if (requestedId && filteredData.length === 0) {
                const noMatchMessage = document.createElement("p");
                noMatchMessage.textContent = "No matching release found.";
                container.appendChild(noMatchMessage);
            }

            // If page opened with ?staff=ID, show the popup
            if (staffId) {
                const matching = data.find(release => release.id === staffId);
                if (matching) showStaffPopup(matching);
            }
        })
        .catch(error => console.error("Error loading releases:", error));
});
