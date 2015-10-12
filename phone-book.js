'use strict';

var phoneBook = [];

module.exports.add = function add(name, phone, email) {

    name  = name.trim();
    phone = phone.trim();
    email = email.trim();

    var phoneDigits = phone.match(/\d/g);
    
    if (phoneDigits) {
        var MIN_PHONE_LENGTH = 8;
        var MAX_PHONE_LENGTH = 15;
        var phoneLength = phoneDigits.length;
        if (phoneLength < MIN_PHONE_LENGTH || phoneLength > MAX_PHONE_LENGTH) {
            return;
        }
    }
    else {
        return;
    }
    
    var validPhone = /^(\+?\s*\d+\s*)?(\(\d+\)|\d+)(\s*\-?\s*\d+){1,}$/;;
    
    if (!validPhone.test(phone)) {
        return;
    }
    else {
        phone = phoneDigits.join('');
    }
    
    var validEmail = /^[\w\.!#$%&'*+\-\/=?\^_`{|}~]+@[\w\-]+(\.[\w]+){1,}$/;
    
    var invalidEmails = [
        "^\\.|\\.@|\\.\\.",
        "@.+-\\.|@-"
        ];
    
    if (!validEmail.test(email)) {
        return;
    }
    for (var i = 0; i < invalidEmails.length; i++) {
        var patt = new RegExp(invalidEmails[i]);
        if (patt.test(email)) {
            return;
        }
    }

    var phoneBookEntry = {
        name:  name,
        phone: phone,
        email: email
    };

    phoneBook.push(phoneBookEntry);
    return true;
};

function formatPhone(phone) {
    var formattedPhone = "";
    var parsedPhone = phone.match(/^(\d+)?(\d{3})(\d{3})(\d{1})(\d{3})$/);
    if (!parsedPhone) {
        return phone;
    }
    if (parsedPhone[1]) {
        formattedPhone += '+' + parsedPhone[1] + ' ';
    }
    formattedPhone += '(' + parsedPhone[2] + ') ';
    formattedPhone += [parsedPhone[3], parsedPhone[4], parsedPhone[5]].join('-');
    return formattedPhone;
}

module.exports.find = function find(query) {

    if (!query) {
        for (var i = 0; i < phoneBook.length; i++) {
            var phoneBookEntry = phoneBook[i];
            
            console.log([
                phoneBookEntry.name,
                formatPhone(phoneBookEntry.phone),
                phoneBookEntry.email
                ].join(', '));
        }
        return;
    }

    for (var i = 0; i < phoneBook.length; i++) {
        var matchFound = false;
        var phoneBookEntry = phoneBook[i];
        var phoneBookEntryKeys = Object.keys(phoneBookEntry);
        for (var j = 0; j < phoneBookEntryKeys.length; j++) {
            var key = phoneBookEntryKeys[j];
            if (phoneBookEntry[key].indexOf(query) != -1) {
                matchFound = true;
            }
            if (key === 'phone') {
                var formattedPhone = formatPhone(phoneBookEntry[key]);
                if (formattedPhone.indexOf(query) != -1) {
                   matchFound = true; 
                }
            }
            if (matchFound) {
                console.log([
                    phoneBookEntry.name,
                    formatPhone(phoneBookEntry.phone),
                    phoneBookEntry.email
                    ].join(', '));
                break;
            }
        }
    }
};

module.exports.remove = function remove(query) {

    var entriesRemoved = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        var matchFound = false;
        var phoneBookEntry = phoneBook[i];
        var phoneBookEntryKeys = Object.keys(phoneBookEntry);
        for (var j = 0; j < phoneBookEntryKeys.length; j++) {
            var key = phoneBookEntryKeys[j];
            if (phoneBookEntry[key].indexOf(query) != -1) {
                matchFound = true;
            }
            if (key === 'phone') {
                var formattedPhone = formatPhone(phoneBookEntry[key]);
                if (formattedPhone.indexOf(query) != -1) {
                   matchFound = true; 
                }
            }
            if (matchFound) {
                phoneBook.splice(i, 1);
                i -= 1;
                entriesRemoved += 1;
                break;
            }
        }
    }
    console.log(entriesRemoved + ' contact(s) have been deleted!');
};

module.exports.importFromCsv = function importFromCsv(filename) {
    
    var contactsAdded = 0;
    var data = require('fs').readFileSync(filename, 'utf-8');
    var dataLines = data.split('\n');
    for (var i = 0; i < dataLines.length; i++) {
        var dataLine = dataLines[i].replace('\r', '');
        var dataLineFields = dataLine.split(';');
        
        var name  = dataLineFields[0];
        var phone = dataLineFields[1];
        var email = dataLineFields[2];
        
        if (exports.add(name, phone, email)) {
            contactsAdded += 1;
        }
    }
    console.log(contactsAdded + ' contact(s) have been added!');
};

module.exports.showTable = function showTable(filename) {

    var header = {
        name:  'Name',
        phone: 'Phone',
        email: 'Email'
    }

    var tableData = [header].concat(phoneBook);
    var nameColumnWidth  = 0;
    var phoneColumnWidth = 0;
    var emailColumnWidth = 0;

    for (var i = 0; i < tableData.length; i++) {
        var tableDataEntry = tableData[i];
        tableDataEntry.phone = formatPhone(tableDataEntry.phone);
        if (tableDataEntry.name.length > nameColumnWidth) {
            nameColumnWidth = tableDataEntry.name.length;
        }
        if (tableDataEntry.phone.length > phoneColumnWidth) {
            phoneColumnWidth = tableDataEntry.phone.length;
        }
        if (tableDataEntry.email.length > emailColumnWidth) {
            emailColumnWidth = tableDataEntry.email.length;
        }
    }
    
    var tableWidth = nameColumnWidth + phoneColumnWidth + emailColumnWidth + 10;
    var emptyTableRow = '▓' + 
        Array(nameColumnWidth  + 2).join(' ') + ' │' +
        Array(phoneColumnWidth + 2).join(' ') + ' │' +
        Array(emailColumnWidth + 2).join(' ') + ' ▓';
    
    console.log(Array(tableWidth + 1).join('░'));

    for (var i = 0; i < tableData.length; i++) {
        var tableDataEntry = tableData[i];
        
        var nameCellData  = tableDataEntry.name;
        var phoneCellData = tableDataEntry.phone;
        var emailCellData = tableDataEntry.email;

        var nameCellOffset  = nameColumnWidth  - nameCellData.length + 1;
        var phoneCellOffset = phoneColumnWidth - phoneCellData.length + 1;
        var emailCellOffset = emailColumnWidth - emailCellData.length + 1;
        
        var nameCell  = nameCellData  + Array(nameCellOffset).join(' ');
        var phoneCell = phoneCellData + Array(phoneCellOffset).join(' ');
        var emailCell = emailCellData + Array(emailCellOffset).join(' ');
        
        var tableRow = '▓ ' + [nameCell, phoneCell, emailCell].join(' │ ') + ' ▓';

        console.log(emptyTableRow);
        console.log(tableRow);
        
        var HEADER_INDEX = 0;
        if (i === HEADER_INDEX) {
            console.log(emptyTableRow);
            console.log('░' + Array(tableWidth - 1).join('═') + '░');
        }
    }
    console.log(emptyTableRow);
    console.log(Array(tableWidth + 1).join('░'));
};
