'use strict';

var phoneBook = [];

module.exports.add = function add(name, phone, email) {

    name = name.trim();
    phone = phone.trim();
    email = email.trim();

    var phoneDigits = phone.match(/\d/g);
    
    if (phoneDigits) {
        var phoneLength = phoneDigits.length;
        if (phoneLength <= 7 || phoneLength >= 15) {
            return;
        }
    }
    else {
        return;
    }
    
    var invalidPhones = [
        "[^\\s\\+\\(\\)\\-\\d]",
        ".+\\+",
        "^[\\d\\s\\-\\+]+\\)|\\([\\d\\s\\-]+$",
        "^\-|\-$"
        ];

    for (var i = 0; i < invalidPhones.length; i++) {
        var patt = new RegExp(invalidPhones[i]);
        if (patt.test(phone)) {
            return;
        }
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
        name: name,
        phone: phone,
        email: email
    };

    phoneBook.push(phoneBookEntry);
};

module.exports.find = function find(query) {

    var searchPatt = new RegExp(query);
    for (var i = 0; i < phoneBook.length; i++) {
        var phoneBookEntry = phoneBook[i];
        var phoneBookEntryKeys = Object.keys(phoneBookEntry);
        for (var j = 0; j < phoneBookEntryKeys.length; j++) {
            var key = phoneBookEntryKeys[j];
            if (searchPatt.test(phoneBookEntry[key])) {
                break;
            }
        }
    }
};

module.exports.remove = function remove(query) {

    var searchPatt = new RegExp(query);
    for (var i = 0; i < phoneBook.length; i++) {
        var phoneBookEntry = phoneBook[i];
        var phoneBookEntryKeys = Object.keys(phoneBookEntry);
        for (var j = 0; j < phoneBookEntryKeys.length; j++) {
            var key = phoneBookEntryKeys[j];
            if (searchPatt.test(phoneBookEntry[key])) {
                phoneBook.splice(i, 1);
                break;
            }
        }
    }
};

module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    var dataLines = data.split('\n');
    for (var i = 0; i < dataLines.length; i++) {
        var dataLine = dataLines[i].replace('\r', '');
        var dataLineFields = dataLine.split(';');
        var name = dataLineFields[0];
        var phone = dataLineFields[1];
        var email = dataLineFields[2];
        exports.add(name, phone, email);
    }
};

module.exports.showTable = function showTable(filename) {
    
    var header = {
        name: 'Name',
        phone: 'Phone',
        email: 'Email'
    }

    var tableData = [header].concat(phoneBook);
    var nameColumnWidth = 0;
    var phoneColumnWidth = 0;
    var emailColumnWidth = 0;

    for (var i = 0; i < tableData.length; i++) {
        var tableDataEntry = tableData[i];
        if (tableDataEntry['name'].length > nameColumnWidth) {
            nameColumnWidth = tableDataEntry['name'].length;
        }
        if (tableDataEntry['phone'].length > phoneColumnWidth) {
            phoneColumnWidth = tableDataEntry['phone'].length;
        }
        if (tableDataEntry['email'].length > emailColumnWidth) {
            emailColumnWidth = tableDataEntry['email'].length;
        }
    }
    
    var tableWidth = nameColumnWidth + phoneColumnWidth + emailColumnWidth + 10;
    var emptyTableRow = '▓' + 
        Array(nameColumnWidth + 2).join(' ') + ' │' +
        Array(phoneColumnWidth + 2).join(' ') + ' │' +
        Array(emailColumnWidth + 2).join(' ') + ' ▓';
    
    console.log(Array(tableWidth+1).join('░'));
    for (var i = 0; i < tableData.length; i++) {
        var nameCellData = tableData[i].name;
        var phoneCellData = tableData[i].phone;
        var emailCellData = tableData[i].email;
        var nameCellOffset = nameColumnWidth - nameCellData.length + 1;
        var phoneCellOffset = phoneColumnWidth - phoneCellData.length + 1;
        var emailCellOffset = emailColumnWidth - emailCellData.length + 1;
        var nameCell = '▓ ' + nameCellData + Array(nameCellOffset + 1).join(' ') + '│';
        var phoneCell = ' ' + phoneCellData + Array(phoneCellOffset + 1).join(' ') + '│';
        var emailCell = ' ' + emailCellData + Array(emailCellOffset + 1).join(' ') + '▓';
        var tableRow = nameCell + phoneCell + emailCell;
        console.log(emptyTableRow);
        console.log(tableRow);
        
        var HEADER_INDEX = 0;
        if (i === HEADER_INDEX) {
            console.log(emptyTableRow);
            console.log('░' + Array(tableWidth - 1).join('═') + '░');
        }
    }
    console.log(emptyTableRow);
    console.log(Array(tableWidth+1).join('░'));
};
