let submitForm = document.getElementById("submitForm");
let groupNumbers = document.getElementById("groupNumbers");


submitForm.onclick = async function () {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let groupData = {};
    groupData.groupName = document.getElementById("groupName").value;
    groupData.numberList = document.getElementById("numberList").value;

    if (groupData.groupName === "") {
        document.getElementById("errorId").innerHTML = "Please enter group name";
        return false;
    } else if (groupData.numberList === "") {
        document.getElementById("errorId").innerHTML = "Please enter contact numbers";
        return false;
    }

    document.getElementById("groupName").value = "";
    document.getElementById("numberList").value = "";
    document.getElementById("errorId").innerHTML = "";

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: createGroup,
        args: [groupData],
    });

    return false;
}


// // The body of this function will be executed as a content script inside the
// // current page
async function createGroup(groupData) {

    console.log("Inside createGroup");

    const timer = (ms) => {
        return new Promise((res) => setTimeout(res, ms));
    };

    const scriptId = "scriptId1234abcd";

    var scriptElem = document.getElementById(scriptId);

    if (!scriptElem) {

        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('script.js');
        s.id = scriptId;
        (document.head || document.documentElement).appendChild(s);
        await timer(1000);
    }

    /* Example: Send data from the page to your Chrome extension */
    document.dispatchEvent(new CustomEvent('WA_createGroupEvent', {
        detail: groupData
    }));
}


groupNumbers.onclick = async function () {

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getGroupNumbers,
    });

    return false;
}

async function getGroupNumbers() {
    const triggerMouseEvent = (node, eventType) => {
        var clickEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
    },
        timer = (ms) => {
            return new Promise((res) => setTimeout(res, ms));
        },

        mouseEvents = ["mouseover", "mousedown", "mouseup", "click"],

        groupNameSelector = '[class="_21nHd"]',
        groupSelector = '[class="_24-Ff"]',
        scrollSelector = '[class="_3Bc7H g0rxnol2 thghmljt p357zi0d rjo8vgbg ggj6brxn f8m0rgwh gfz4du6o ag5g9lrv bs7a17vp"]',
        viewAllSelector = '[class="ggj6brxn ljrqcn24 jq3rn4u7"]',
        groupContactListSelector = '[class="tt8xd2xn dl6j7rsh mpdn4nr2 avk8rzj1"]',
        allContactsSelector = '[class="_3Bc7H g0rxnol2 thghmljt p357zi0d rjo8vgbg ggj6brxn f8m0rgwh gfz4du6o ag5g9lrv bs7a17vp"]',
        allNumbersSelector = '[class="ggj6brxn gfz4du6o r7fjleex g0rxnol2 lhj4utae le5p0ye3 l7jjieqr i0jNr"]',
        closeButtonSelector = '[aria-label="Close"]'

    messages = (async () => {
        csv = '';
        groupName = document.querySelectorAll(groupNameSelector)[0].innerText;
        groupButton = document.querySelectorAll(groupSelector)[0];
        mouseEvents.map((event) => triggerMouseEvent(groupButton, event));
        await timer(500);
        scrollButton = document.querySelectorAll(scrollSelector)[0];
        scrollButton.scrollTo(scrollButton.scrollWidth, scrollButton.scrollHeight);
        viewAllButton = document.querySelectorAll(viewAllSelector)[0];


        if (viewAllButton) {
            mouseEvents.map((event) => triggerMouseEvent(viewAllButton, event));
            await timer(500);
            allContacts = document.querySelectorAll(allContactsSelector)[0];
        } else {
            allContacts = document.querySelectorAll(groupContactListSelector)[0];
        }


        currentScrollHeight = -1000;
        numberList = [];
        while (currentScrollHeight <= allContacts.scrollHeight) {
            console.log(currentScrollHeight);
            console.log(allContacts.scrollHeight);
            allNumbers = allContacts.childNodes[0].querySelectorAll(allNumbersSelector);
            allNumbers.forEach(num => numberList.push(num.innerText));
            allContacts.scrollBy(allContacts.scrollWidth, 1000);
            await timer(1000);
            currentScrollHeight += 1000;
        }

        contactsCloseButton = document.querySelectorAll(closeButtonSelector)[0];
        groupCloseButton = document.querySelectorAll(closeButtonSelector)[1];

        if (contactsCloseButton) {
            mouseEvents.map((event) => triggerMouseEvent(contactsCloseButton, event));
        }

        if (groupCloseButton) {
            mouseEvents.map((event) => triggerMouseEvent(groupCloseButton, event));
        }


        numberSet = [...new Set(numberList)];
        numberSet.forEach(number => csv += number + '\n');

        console.log(csv);

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = groupName + '  numbers.csv';
        hiddenElement.click();
    })();
}