(function () {
    const API_URL = '/api/contacts'; // use absolute path to avoid relative path issues
    const ERR_GENERAL = 'Some error occurred, please try again later.';

    // DOM cache (filled on DOMContentLoaded)
    let tableContainer;
    let tableBody;
    let emptyAlert;
    let getDataBtn;
    let loadingIndicator;

    // Keep track of the last fetch so we can cancel it if a new one starts
    let currentAbortController = null;

    /**
     * Safe version of querySelector that returns null on invalid selectors
     * @param selector
     * @returns {HTMLAnchorElement|HTMLElement|HTMLAreaElement|HTMLAudioElement|HTMLBaseElement|HTMLQuoteElement|HTMLBodyElement|HTMLBRElement|HTMLButtonElement|HTMLCanvasElement|HTMLTableCaptionElement|HTMLTableColElement|HTMLDataElement|HTMLDataListElement|HTMLModElement|HTMLDetailsElement|HTMLDialogElement|HTMLDivElement|HTMLDListElement|HTMLEmbedElement|HTMLFieldSetElement|HTMLFormElement|HTMLHeadingElement|HTMLHeadElement|HTMLHRElement|HTMLHtmlElement|HTMLIFrameElement|HTMLImageElement|HTMLInputElement|HTMLLabelElement|HTMLLegendElement|HTMLLIElement|HTMLLinkElement|HTMLMapElement|HTMLMenuElement|HTMLMetaElement|HTMLMeterElement|HTMLObjectElement|HTMLOListElement|HTMLOptGroupElement|HTMLOptionElement|HTMLOutputElement|HTMLParagraphElement|HTMLPictureElement|HTMLPreElement|HTMLProgressElement|HTMLScriptElement|HTMLSelectElement|HTMLSlotElement|HTMLSourceElement|HTMLSpanElement|HTMLStyleElement|HTMLTableElement|HTMLTableSectionElement|HTMLTableCellElement|HTMLTemplateElement|HTMLTextAreaElement|HTMLTimeElement|HTMLTitleElement|HTMLTableRowElement|HTMLTrackElement|HTMLUListElement|HTMLVideoElement|null}
     */
    function safeQuery(selector) {
        try {
            return document.querySelector(selector);
        } catch (e) {
            return null;
        }
    }

    function createOrGetModal() {
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
                  <div class="modal-body" id="alertModalBody"></div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>`;
            document.body.appendChild(modal);
        }
        return modal;
    }

    function showBootstrapModal(message) {
        const modal = createOrGetModal();
        const body = modal.querySelector('#alertModalBody');
        if (body) body.textContent = message;
        // Use bootstrap's JS API if available
        if (window.bootstrap && typeof window.bootstrap.Modal === 'function') {
            const instance = new window.bootstrap.Modal(modal);
            instance.show();
        } else {
            // Fallback: simple alert
            alert(message);
        }
    }

    function setLoading(isLoading) {
        if (!getDataBtn) return;
        getDataBtn.disabled = !!isLoading;
        if (!loadingIndicator && getDataBtn) {
            loadingIndicator = document.createElement('span');
            loadingIndicator.className = 'spinner-border spinner-border-sm ms-2';
            loadingIndicator.setAttribute('role', 'status');
            loadingIndicator.style.display = 'none';
            getDataBtn.appendChild(loadingIndicator);
        }
        if (loadingIndicator) loadingIndicator.style.display = isLoading ? '' : 'none';
    }

    async function fetchContacts() {
        // Cancel previous if running
        if (currentAbortController) {
            currentAbortController.abort();
        }
        currentAbortController = new AbortController();
        const signal = currentAbortController.signal;
        const res = await fetch(API_URL, { signal });
        if (!res.ok) {
            const text = await res.text().catch(() => res.statusText || '');
            throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        currentAbortController = null;
        return data;
    }

    function clearTableBody() {
        if (tableBody) tableBody.innerHTML = '';
    }

    function renderTable(data) {
        clearTableBody();
        if (!Array.isArray(data) || data.length === 0) return false;
        data.forEach((item, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${idx + 1}</th>
                <td>${escapeHtml(item.firstName) || ''}</td>
                <td>${escapeHtml(item.lastName) || ''}</td>
                <td>${escapeHtml(item.phone) || ''}</td>
                <td>${escapeHtml(item.email) || ''}</td>
                <td>
                  <button class="btn btn-sm btn-danger btn-delete" data-id="${item.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        return true;
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    async function fetchAndDisplayContacts() {
        if (!tableContainer || !tableBody || !emptyAlert) return;
        setLoading(true);
        emptyAlert.style.display = 'none';
        try {
            const data = await fetchContacts();
            const hasRows = renderTable(data);
            tableContainer.style.display = hasRows ? '' : 'none';
            emptyAlert.style.display = hasRows ? 'none' : '';
            if (!hasRows) emptyAlert.textContent = 'No contacts found.';
        } catch (err) {
            // Ignore abort errors caused by rapid refreshes
            if (err.name === 'AbortError') return;
            tableContainer.style.display = 'none';
            emptyAlert.style.display = '';
            emptyAlert.textContent = `${ERR_GENERAL} ${err.message || ''}`;
        } finally {
            setLoading(false);
        }
    }

    async function deleteContactById(id) {
        if (!id) return false;
        try {
            const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' });
            // Accept 200, 202, 204 as successful delete
            if (res.status === 204 || res.status === 200 || res.status === 202) return true;
            // Try to read body for error message
            const txt = await res.text().catch(() => '');
            throw new Error(txt || `HTTP ${res.status}`);
        } catch (err) {
            throw err;
        }
    }

    // Use event delegation to handle deletes
    function setupDeleteHandler() {
        if (!tableBody) return;
        tableBody.addEventListener('click', async (ev) => {
            const btn = ev.target.closest('.btn-delete');
            if (!btn) return;
            const id = btn.getAttribute('data-id');
            if (!id) return;
            if (!confirm('Are you sure you want to delete this contact?')) return;
            btn.disabled = true;
            try {
                const ok = await deleteContactById(id);
                if (ok) {
                    // refresh
                    await fetchAndDisplayContacts();
                } else {
                    showBootstrapModal(ERR_GENERAL);
                }
            } catch (err) {
                showBootstrapModal(`${ERR_GENERAL} ${err.message || ''}`);
            } finally {
                btn.disabled = false;
            }
        });
    }

    // Attach event listeners on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function () {
        tableContainer = safeQuery('#db-table-container');
        tableBody = safeQuery('#db-table tbody');
        emptyAlert = safeQuery('#db-empty');
        getDataBtn = safeQuery('#getdata');

        // Guard: if no tableBody found, create a fallback container so code doesn't break
        if (!tableBody) {
            const fakeTable = document.createElement('table');
            fakeTable.id = 'db-table';
            const tb = document.createElement('tbody');
            fakeTable.appendChild(tb);
            document.body.appendChild(fakeTable);
            tableBody = tb;
        }

        if (getDataBtn) {
            getDataBtn.addEventListener('click', fetchAndDisplayContacts);
        }

        setupDeleteHandler();
    });

})();
