/*eslint-disable no-redeclare */
var selectedClass = null;
var totalLength = 0;
var id_name = "EventId";

for (var i=0, len=localStorage.length; i<len; i++) {
    var inner_length = localStorage.getItem(localStorage.key(i)).split(',').length;
    document.getElementById(localStorage.key(i)).innerHTML = inner_length;
    if (document.getElementById(localStorage.key(i))) {
        totalLength += inner_length;
    }
}
document.getElementById('spantotal').innerHTML = totalLength;
document.querySelector("#elem").data = data;
document.querySelector("#elem").atlasUrl = "/static/atlas.png";

document.getElementById("elem").addEventListener("click", function(e) {
    var rects = document.getElementById("elem").shadowRoot.getElementById("vis").shadowRoot.getElementById("holder").querySelectorAll("rect")
    for (var i=0, len=rects.length; i<len; i++) {
        if (rects[i].className.baseVal === "rotate") {
            rects[i].style.strokeWidth = "0.05px";
            rects[i].style.x = -0.65;
            rects[i].style.y = -0.65;
            rects[i].style.width = 1.23;
            rects[i].style.height = 1.23;
            rects[i].style.stroke = '#ea184d'
        }
    }
    
    var dds = document.getElementById("elem").shadowRoot.getElementById("infoCard").shadowRoot.querySelectorAll("dd");
    for (var i=0, len=dds.length; i<len; i++) {
        dds[i].style.wordWrap = "break-word";
    }

    if (selectedClass) {
        if (e.shiftKey) {
            var metadata = document.getElementById("elem").shadowRoot.getElementById("infoCard").shadowRoot.querySelectorAll("dt");
            for (var i=0; i<metadata.length; i++){
                if (metadata[i].innerHTML === id_name) {
                    var theAnchorTextToRemove = metadata[i].nextSibling.innerHTML;
                }
            }
            for (var is=0; is<localStorage.length; is++) {
                var tempKeyVal = localStorage.key(is);
                var itemListPreFix = localStorage.getItem(tempKeyVal);
                var itemized = itemListPreFix.split(',');
                var itemListFixed = [];
                var was_removed = false;
                    for (var itemnum=0; itemnum<itemized.length; itemnum++) {
                        if (itemized[itemnum] !== theAnchorTextToRemove) {
                            itemListFixed.push(itemized[itemnum]);
                        }
                        if (itemized[itemnum] === theAnchorTextToRemove) {
                            was_removed = true;
                        }
                    }
                if (was_removed) {
                    totalLength -= 1;
                    var counter_element = document.getElementById(selectedClass);
                    counter_element.innerHTML = itemListFixed.length;
                    var total_element = document.getElementById("spantotal");
                    total_element.innerHTML = totalLength;
                }
                localStorage.setItem(tempKeyVal, itemListFixed.join());
            }
        }
        if (e.ctrlKey || e.metaKey) {
            var keyVal = selectedClass;
            var metadata = document.getElementById("elem").shadowRoot.getElementById("infoCard").shadowRoot.querySelectorAll("dt");
            for (var i=0; i<metadata.length; i++){
                if (metadata[i].innerHTML === id_name) {
                    var theAnchorText = metadata[i].nextSibling.innerHTML;
                }
            }
            var existingItem = localStorage.getItem(keyVal);
            var found = false;
            for (var i=0; i<localStorage.length; i++){ 
                var tempKeyVal = localStorage.key(i);
                var tempExistingItem = localStorage.getItem(tempKeyVal);
                if (tempExistingItem) {
                    var itemList = tempExistingItem.split(',');
                    for (var ii=0; ii<itemList.length && !found; ii++) {
                        if (itemList[ii] === theAnchorText) {
                            found = true;
                            break;
                        }
                    }
                }
            }

            if (!found) {
                totalLength += 1;
                if (!existingItem) {
                    existingItem = theAnchorText;
                } else {
                    existingItem = (existingItem || "") + "," + theAnchorText;
                }
                localStorage.setItem(keyVal, existingItem);
                var counter_element = document.getElementById(selectedClass);
                counter_element.innerHTML = existingItem.split(",").length;
                var total_element = document.getElementById("spantotal");
                total_element.innerHTML = totalLength;
                for (var ij=0; ij<data.length; ij++) {
                    if (data[ij]['Id'] === theAnchorText) {
                        data[ij]['SessionLabel'] = keyVal;
                    }
                }                                                      
            }
        }
    }
});

document.getElementById("reset-button").addEventListener("click", function() {
    var total_element = document.getElementById("spantotal");
    total_element.innerHTML = "0";
    localStorage.clear();

    var counterIds = document.getElementsByClassName('spanclass-counter');
    for (var ii=0; ii<counterIds.length; ii++) {
        counterIds[ii].innerHTML = "0";
    }
    document.getElementById('spantotal').innerHTML = "0";
    totalLength = 0;
});

document.getElementById("export-labels").addEventListener("click", function() {
    var labels = {};
    var label_metadata = {};
    for (var i=0, len=localStorage.length; i<len; i++) {
        key = localStorage.key(i);
        value = localStorage.getItem(key);
        labels[key] = value;
        
        var split_labels = value.split(',');
        for (var j=0, len_labels=split_labels.length; j<len_labels; j++) {
            for (var d=0, len_data=data.length; d<len_data; d++) {
                if (data[d]['EventId'] == split_labels[j]) {
                    var data_insert = data[d];
                    data_insert['SelectedClass'] = key.replace('spanclass-', '');
                    label_metadata[split_labels[j]] = data[d];
                }
            }
        }
    }
    
    const xhr_labels = new XMLHttpRequest()
    xhr_labels.open('POST', '/export_labels')
    xhr_labels.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr_labels.send(JSON.stringify(labels))
    
    const xhr_labels_metadata = new XMLHttpRequest()
    xhr_labels_metadata.open('POST', '/export_labels_metadata')
    xhr_labels_metadata.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr_labels_metadata.send(JSON.stringify(label_metadata))
});

var classname = document.getElementsByClassName("button-class");
for (var i=0; i<classname.length; i++) {
    classname[i].addEventListener('click', function() {
        selectedClass = this.value;
        for (var j=0; j<classname.length; j++) {
            if (classname[j].value != selectedClass) {
                classname[j].style.backgroundColor = '#CFD5DC';
            } else {
                classname[j].style.backgroundColor = '#93C83D';
            }
        }
    });
}