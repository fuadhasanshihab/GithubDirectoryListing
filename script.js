// Update only this data
const fhsRepo = 'github-directory-listing'; // Your repository name
        const fhsOwner = 'fuadhasanshihab'; // Your GitHub username
        const fhsBranch = 'assets'; // Your branch name
// // //



const darkModeToggle = document.getElementById('dark-mode-toggle');

        // Load dark mode preference from localStorage
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });

        let fhsCurrentPath = '';

        async function fhsFetchFiles(path = '') {
            try {
                const url = `https://api.github.com/repos/${fhsOwner}/${fhsRepo}/contents/${path}?ref=${fhsBranch}`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const fhsData = await response.json();
                
                if (!Array.isArray(fhsData)) {
                    throw new Error('Unexpected response format');
                }

                const fhsFileList = document.getElementById('fhs-file-list');
                const fhsBreadcrumb = document.getElementById('fhs-breadcrumb');
                const fhsBackToRootButton = document.getElementById('fhs-back-to-root');
                const fhsFooter = document.getElementById('fhs-footer');

                fhsFileList.innerHTML = '';
                fhsBreadcrumb.innerHTML = '';
                
                // Show the "Back to root" button when not at the root
                fhsBackToRootButton.style.display = path ? 'block' : 'none';

                if (path) {
                    const pathParts = path.split('/').filter(part => part);
                    let fhsAccumulatedPath = '';

                    // Initialize breadcrumb with repository name and current path
                    fhsBreadcrumb.innerHTML = `<a href="#" onclick="fhsNavigateTo('')">${fhsRepo}</a>`;
                    fhsAccumulatedPath = '';
                    pathParts.forEach((part, index) => {
                        fhsAccumulatedPath += (fhsAccumulatedPath ? '/' : '') + part;
                        fhsBreadcrumb.innerHTML += ` <span class="fhs-separator">></span> <a href="#" onclick="fhsNavigateTo('${fhsAccumulatedPath}')">${part}</a>`;
                    });
                } else {
                    // Initialize breadcrumb with repository name only
                    fhsBreadcrumb.innerHTML = `<span>${fhsRepo}</span>`;
                }

                // Add directory and file links
                fhsData.forEach(file => {
                    const fhsListItem = document.createElement('li');
                    const fhsIcon = file.type === 'dir' ? 'folder' : 'insert_drive_file';
                    const fhsFileType = file.type === 'dir' ? 'Folder' : (file.name.split('.').pop() || 'Unknown');
                    const fhsFileSize = file.size ? (file.size / 1024).toFixed(2) + ' KB' : 'N/A';
                    
                    if (file.type === 'dir') {
                        fhsListItem.innerHTML = `<span class="fhs-material-icons">${fhsIcon}</span><a href="#" onclick="fhsNavigateTo('${file.path}')">${file.name}/</a><span class="fhs-file-type">${fhsFileType}</span>`;
                    } else {
                        fhsListItem.innerHTML = `<span class="fhs-material-icons">${fhsIcon}</span><a href="${file.download_url}" target="_blank">${file.name}</a><span class="fhs-file-info"><span class="fhs-file-size">${fhsFileSize}</span><span class="fhs-file-type">${fhsFileType}</span></span>`;
                    }
                    fhsFileList.appendChild(fhsListItem);
                });

                // Update footer with repository, branch, and current time
                const fhsCurrentTime = new Date().toLocaleString();
                fhsFooter.innerHTML = `File fetched from <strong>${fhsRepo}</strong> repository (branch: <strong>${fhsBranch}</strong>) by <strong>${fhsOwner}</strong> from GitHub on <strong>${fhsCurrentTime}</strong>`;
                
            } catch (error) {
                console.error('Error fetching files:', error);
                document.getElementById('fhs-file-list').innerHTML = '<li>Error loading files.</li>';
            }
        }

        function fhsNavigateTo(path) {
            fhsCurrentPath = path;
            fhsFetchFiles(path);
        }

        // Initial load
        fhsFetchFiles();
