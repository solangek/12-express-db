(function () {
    const URL = './api/contacts';
    const ERR_GENERAL = "Some error occured, please try again later.";

    /**
     * example of fetch based on async/await syntax
     * More readable code: The code reads more like synchronous code, improving readability and maintainability.
     * Cleaner error handling: The try...catch block provides a centralized way to handle errors, making the code more concise and less prone to error chains.
     */
    async function fetchAndDisplayContacts() {
        const dataElement = document.getElementById("data");
        const tableContainer = document.getElementById("db-table-container");
        const tableBody = document.querySelector("#db-table tbody");
        const emptyAlert = document.getElementById("db-empty");
        try {
            const response = await fetch(URL);
            if (response.status !== 200)
                throw new Error(response.statusText);
            const data = await response.json();
            // Clear previous content
            tableBody.innerHTML = '';
            if (Array.isArray(data) && data.length > 0) {
                data.forEach((item, idx) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${idx + 1}</th>
                        <td>${item.firstName || ''}</td>
                        <td>${item.lastName || ''}</td>
                        <td>${item.phone || ''}</td>
                        <td>${item.email || ''}</td>
                        <td>
                          <button class="btn btn-sm btn-danger" data-id="${item.id}" onclick="deleteContact(event)">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                tableContainer.style.display = '';
                emptyAlert.style.display = 'none';
            } else {
                tableContainer.style.display = 'none';
                emptyAlert.style.display = '';
            }
        } catch (err) {
            tableContainer.style.display = 'none';
            emptyAlert.style.display = '';
            emptyAlert.textContent = `${ERR_GENERAL} ${err.message}`;
        }
    }

    // Bootstrap modal for alerts
    function showBootstrapModal(message) {
        let modal = document.getElementById('alertModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.innerHTML = `
            <div class="modal fade" id="alertModal" tabindex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="alertModalLabel">Alert</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body" id="alertModalBody">
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>`;
            document.body.appendChild(modal);
        }
        document.getElementById('alertModalBody').textContent = message;
        var modalInstance = new bootstrap.Modal(document.getElementById('alertModal'));
        modalInstance.show();
    }

    window.deleteContact = async function(event) {
        const btn = event.currentTarget;
        const id = btn.getAttribute('data-id');
        if (!id) return;
        if (!confirm('Are you sure you want to delete this contact?')) return;
        try {
            const response = await fetch(`${URL}/${id}`, { method: 'DELETE' });
            if (response.status === 204) {
                fetchAndDisplayContacts();
            } else {
                showBootstrapModal(ERR_GENERAL);
            }
        } catch (err) {
            showBootstrapModal(ERR_GENERAL);
        }
    }

    // Attach event listener to the button
    document.addEventListener('DOMContentLoaded', function() {
        const btn = document.getElementById('getdata');
        if (btn) {
            btn.addEventListener('click', fetchAndDisplayContacts);
        }
    });

})();