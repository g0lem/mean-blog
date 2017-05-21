(function() {
    // Adding upload button to Trix toolbar on initialization
    document.addEventListener('trix-initialize', function(e) {
        trix = e.target;
        toolBar = trix.toolbarElement;

        // Creation of the button
        button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("class", "attach");
        button.setAttribute("data-trix-action", "x-attach");
        button.setAttribute("title", "Attach a file");
        button.setAttribute("tabindex", "-1");
        button.innerText = "Attach a file";

        // Attachment of the button to the toolBar
        uploadButton = toolBar.querySelector('.button_group.block_tools').appendChild(button);

        // When the button is clicked
        uploadButton.addEventListener('click', function() {
            // Create a temporary file input
            fileInput = document.createElement("input");
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute("multiple", "");
            // Add listener on change for this file input
            fileInput.addEventListener("change", function(event) {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    // Getting files
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        // pushing them to Trix
                        _results.push(trix.editor.insertFile(file));
                    }
                    return _results;
                }),
                // Then virtually click on it
                fileInput.click()
        });
        return;
    });
    document.addEventListener('trix-attachment-remove', function(e) {
        // file = e.attachment;
        // Here you could send a request to your app to delete the file
        window.onbeforeunload = function() {};
    });
}).call(this);

/* 
HANDLE UPLOAD
attachment = the trix attachment object
baseUrl    = the base url of your future uploaded file
uploadUrl  = the url you're sending the actual file to
*/
uploadAttachment = function(attachment, baseUrl, uploadUrl) {
    window.onbeforeunload = function(e) {
        var e = e || window.event;
        var warn = 'Uploads are pending. If you quit this page they may not be saved.';
        if (e) {
            e.returnValue = warn;
        }
        return warn;
    };
    var file, form, xhr;
    file = attachment.file;
    if (file.size == 0) {
        window.onbeforeunload = function() {};
        attachment.remove();
        alert("The file you submitted looks empty.");
        return;
        // You may personalize max_file_size
    } else if (file.size > 37000000) {
        window.onbeforeunload = function() {};
        attachment.remove();
        alert("Your file seems too big for uploading.");
        return;
    }
    form = new FormData;
    form.append("Content-Type", file.type);
    form.append("file", file);
    xhr = new XMLHttpRequest;
    xhr.open("POST", uploadUrl, true);
    xhr.upload.onprogress = function(event) {
        var progress;
        progress = event.loaded / event.total * 100;
        return attachment.setUploadProgress(progress);
    };
    xhr.onload = function() {
        var href, url;
        if (xhr.status === 200) {
            window.onbeforeunload = function() {};
            url = href = baseUrl + '/' + xhr.responseText;
            return attachment.setAttributes({
                url: url,
                href: href
            });
        } else {
            window.onbeforeunload = function() {};
            attachment.remove();
            alert("Upload failed. Try to reload the page.");
        }
    };
    return xhr.send(form);
};

// To actually use the uploadAttachment function, do :
(function() {
    document.addEventListener("trix-attachment-add", function(event) {
        var attachment;
        attachment = event.attachment;
        if (attachment.file) {
            return uploadAttachment(attachment, "/getPhoto", "/upload/photos/");
        }
    });
}).call(this);