var handlerFunction = function (e) { createNewGroup(e.detail); };
console.log("executed");
document.addEventListener('WA_createGroupEvent', handlerFunction);

function createNewGroup(groupData) {

    console.log("Inside createNewGroup");
    console.log(groupData);

    const triggerMouseEvent = (node, eventType) => {
        var clickEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
    },
        timer = (ms) => {
            return new Promise((res) => setTimeout(res, ms));
        },

        groupDetails = {
            groupName: groupData.groupName,
            contactNumbers: groupData.numberList
        },

        contactNumbersLineSeparated = groupDetails.contactNumbers.replaceAll(",","\n"),
        contactNumbersList = contactNumbersLineSeparated.split("\n"),
        mouseEvents = ["mouseover", "mousedown", "mouseup", "click"],

        menuButtonSelector = '[aria-label="Menu"]',
        newGroupButtonSelector = '[aria-label="New group"]',
        contactInputSelector = '[placeholder="Type contact name"]',
        contactSelector = '[style="z-index: 0; transition: none 0s ease 0s; height: 72px; transform: translateY(0px);"]',
        mainContactSelector = '[data-testid="cell-frame-container"]',
        arrowButtonSelector = '[data-testid="arrow-forward"]',
        groupSubjectSelector = '[role="textbox"]',
        groupSelectDivSelector = '[style="transform: scale(1); opacity: 1;"]',
        groupSelectButtonSelector = '[role="button"]',
        messageInputTextSelector = '[title="Type a message"]',
        sendButtonSelector = '[class = "_4sWnG"]',
        inviteToGroupButtonSelector = '[class="_20C5O _2Zdgs"]',
        inviteToGroupMessageSelector = '[role="textbox"]',
        inviteToGroupSendButtonSelector = '[class="_165_h _2HL9j"]',

        sleepTime = 800,
        leastSleepTime = 100,

        messages = (async () => {
            var addedContactNumbers = [];
            var unaddedContactNumbers = [];
            var invitedContactNames = [];
            var csv = 'Added Numbers,Unadded Numbers,Invited Names\n';
            menuButtonNode = document.querySelectorAll(menuButtonSelector)[0];
            mouseEvents.map((event) => triggerMouseEvent(menuButtonNode, event));
            await timer(sleepTime);
            newGroupButtonNode = document.querySelectorAll(newGroupButtonSelector)[0];
            mouseEvents.map((event) => triggerMouseEvent(newGroupButtonNode, event));
            await timer(sleepTime);
            contactInputText = document.querySelectorAll(contactInputSelector)[0];
            contactInputTextProperties = Object.getOwnPropertyNames(contactInputText);
            reactPropsProperty = contactInputTextProperties.filter(prop => prop.startsWith("__reactProps"));
            contactNumbersList.forEach((contact) => {
                contact = contact.trim();
                e = { target: { value: contact } };
                contactInputText[reactPropsProperty].onChange(e);
                contactNode = document.querySelectorAll(contactSelector);
                if (contactNode.length != 0) {
                    contactNode = contactNode[0];
                    mainContact = contactNode.querySelectorAll(mainContactSelector);
                    if (mainContact.length != 0) {
                        mainContact = mainContact[0];
                        mouseEvents.map((event) => triggerMouseEvent(mainContact, event));
                        addedContactNumbers.push(contact);
                    }
                } else {
                    unaddedContactNumbers.push(contact);
                }
            });
            arrowButton = document.querySelectorAll(arrowButtonSelector)[0];
            mouseEvents.map((event) => triggerMouseEvent(arrowButton, event));
            await timer(leastSleepTime);
            groupSubject = document.querySelectorAll(groupSubjectSelector)[0];
            groupSubject.innerHTML = groupDetails.groupName;
            groupSubject[reactPropsProperty].onInput(groupSubject);
            await timer(sleepTime);
            groupSelectDiv = document.querySelectorAll(groupSelectDivSelector)[0];
            groupSelectButton = groupSelectDiv.querySelectorAll(groupSelectButtonSelector)[0];
            mouseEvents.map((event) => triggerMouseEvent(groupSelectButton, event));
            await timer(2 * sleepTime);
            inviteToGroupButtonList = document.querySelectorAll(inviteToGroupButtonSelector);
            if (inviteToGroupButtonList.length != 0) {
                invitedContactMessage = document.getElementsByClassName("_2Nr6U")[0].innerHTML;
                console.log(invitedContactMessage);
                mouseEvents.map((event) => triggerMouseEvent(inviteToGroupButtonList[0], event));
                await timer(sleepTime);
                inviteToGroupSendButton = document.querySelectorAll(inviteToGroupSendButtonSelector)[0];
                // Uncomment below line to automatically send invite link
                // mouseEvents.map((event) => triggerMouseEvent(inviteToGroupSendButton, event));
                invitedContactMessage = invitedContactMessage.split('.')[0];
                invitedContactNames = invitedContactMessage.substring(invitedContactMessage.lastIndexOf("add ") + 4).split(',');
                lastInvitedContactNames = invitedContactNames.pop().split(" and ");
                invitedContactNames = invitedContactNames.concat(lastInvitedContactNames);
            }
            var maxLength = (invitedContactNames.length > unaddedContactNumbers.length) ? invitedContactNames.length : unaddedContactNumbers.length;
            maxLength = (maxLength > addedContactNumbers.length) ? maxLength : addedContactNumbers.length;
            for (var i = 0; i < maxLength; i++) {
                if (i < addedContactNumbers.length) {
                    csv += addedContactNumbers[i];
                } else {
                    csv += ' ';
                }
                csv += ',';

                if (i < unaddedContactNumbers.length) {
                    csv += unaddedContactNumbers[i];
                } else {
                    csv += ' ';
                }
                csv += ',';

                if (i < invitedContactNames.length) {
                    csv += invitedContactNames[i];
                } else {
                    csv += ' ';
                }

                csv += '\n';
            }
            console.log(csv);
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_blank';
            hiddenElement.download = groupDetails.groupName + '-status.csv';
            hiddenElement.click();
        })();
}