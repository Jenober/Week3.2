// Houston Bennett
// ASD 1306
var editKey;

$(document).on('pageinit','#homePage',function(){
    var contentDiv = $('#contentDiv');
    //Will fetch data from storage as soon as there is some to fetch
    //getLocal(contentDiv);
    console.log("Calling getRemote()");
    getRemote(contentDiv);

    console.log("adding click event for editbtn");

    $('.editBtn').on('click', function () {
        console.log('CLICKY CLICKY!!')
        editKey = $(this).data('id');
        console.log(editKey);
    });

    $('.delBtn').on('click', function(){
        console.log("deleteItem function has been called by: " + this);
        var key = $(this).data('id');
        console.log("deleting item at key: "+ key);
        localStorage.removeItem(key);
        //alert('The item #' + key + ' had been deleted!!');


    });


});
$('#homePage').on('pageinit', function(){


});

$(document).on('pageinit','#addNew', function(){

console.log('addNew page init GOOD');

var addForm = $('#addNewForm');

    addForm.validate({
        invalidHandler: function (form, validator){
            alert('You must have missed a required input. TRY AGAIN!')
        },
        submitHandler: function(){
            console.log('Validation Successful! Serializing form.');
            var formData = addForm.serializeArray();
            console.log('The following is the serialized data: '+ formData);
            console.log('Sending data to storage!');
            storeData();
        }
    });


});

$('#editPage').on('pageinit',function(){
    console.log('Edit page init GOOD');

    var editForm = $('#editForm'),
        data = localStorage.getItem(editKey),
        fieldValues = JSON.parse(data);

    editForm.validate({
        invalidHandler: function (form, validator){
            alert('You must have missed a required input. TRY AGAIN!')
        },
        submitHandler: function(){
            console.log('Validation Successful! Serializing form.');
            var formData = editForm.serializeArray();
            console.log('The following is the serialized data: '+ formData);
            console.log('Sending data to storage!');
            saveEdits(editKey);

        }
    });

    $('#editWho').val(fieldValues.who[1]);
    $('#editChore').val(fieldValues.chore[1]);
    $('#editDueDate').val(fieldValues.due[1]);
    $('#editAmount').val(fieldValues.amount[1]);
    $('#editPayable').val(fieldValues.payto[1]);


});

$('.xmlBtn').on('click', function(){
    var contentDiv = $('#contentDiv');
    console.log('XML BUTTON CLICKED!')
    //Remove list from initial page load
    contentDiv.empty();
    //Fill in new list from XML file!
    getXML(contentDiv);
});

$('.jsonBtn').on('click', function(){
    var contentDiv = $('#contentDiv');
    //Remove list from initial page load
    contentDiv.empty();
    //Fill in new list from JSON file!
    getJSON(contentDiv);
});


var getLocal = function(choreDiv){

    if (localStorage.length === 0){

        alert('THERE IS NO DATA IN LOCAL STORAGE!')

    }else{

        for(var i = 0, len = localStorage.length; i< len;i++){
            choreDiv.append('<ul data-role="listview" data-theme="a" id="choreList"></ul>');
            var key = localStorage.key(i),
                localData = localStorage.getItem(key),
                parsedData = JSON.parse(localData),
                choreList = $('#choreList');
            console.log('After parse:' + parsedData);

            $.each(parsedData, function(z, value){
                console.log('Value: ' + value);
                var listItem = value[0]+ ' ' + value[1];

                choreList.append('<li>'+ listItem +'</li>')
            });

            choreList.append("<li><a href='#editPage' data-theme='a' class='editBtn' data-id="+ key +">Edit Item</a></li>");
            choreList.append("<li><a href='#' data-inline='true' data-id="+key+" class = 'delBtn'> Delete Item</a></li>");
            choreList.append("<p></p>");
        }
        //choreList.listview('refresh');

    }


};

var storeData = function(){
    //create unique key
    var itemID = Math.floor(Math.random() * 10001);

    var formData = {};
    formData._id = itemID;
    formData.who =  $('#inputWho').val();
    formData.chore =  $('#inputChore').val();
    formData.due = $('#inputDueDate').val();
    formData.amount = $('#inputAmount').val();
    formData.payto =$('#inputPayable').val();

    console.log("Begin Couch call!");
    console.log(formData);

    $.couch.db("choredb").saveDoc(formData,{
        success: function(data) {
            console.log("couch call successful!")
        console.log(data);
        },
        error: function(status) {
            console.log("couch call FAILED!")
        console.log(status)
        }
        });
    //localStorage.setItem(itemID, JSON.stringify(formData));
    alert('Save Complete!');



};

var saveEdits = function(key){
    var formData = {};

    formData.who = ["Responsible Party: ", $('#editWho').val()];
    formData.chore = ["Chore/Bill: ", $('#editChore').val()];
    formData.due = ["Due Date: ", $('#editDueDate').val()];
    formData.amount = ["Amount Due: ", $('#editAmount').val()];
    formData.payto = ["Payable To: ", $('#editPayable').val()];

    console.log('formData = '+ formData);
    localStorage.setItem(key, JSON.stringify(formData));
    alert('Save Complete!');

};

var getXML = function(choreDiv){

    console.log('getXML called!');
    choreDiv.append('<ul data-role="listview" data-theme="a" id="choreList"></ul>');

    $.ajax({
        url: 'choreXML.xml',
        type: 'GET',
        dataType: 'xml',
        success: function(xml){
            console.log("AJAX call successful");
            console.log(xml);

            $(xml).find('chore').each(function(){

                var doc = $(this),
                    choreList = $('#choreList');

                var listItem = "Responsible Party: "+ doc.find('who').text();
                choreList.append('<li>'+listItem+'</li>');

                listItem = "Chore/Bill: "+ doc.find('chore').text();
                choreList.append('<li>'+listItem+'</li>');

                listItem = "Due Date: "+ doc.find('due').text();
                choreList.append('<li>'+listItem+'</li>');

                listItem = "Amount Due: "+ doc.find('amount').text();
                choreList.append('<li>'+listItem+'</li>');

                listItem = "Payable To: "+ doc.find('payto').text();
                choreList.append('<li>'+listItem+'</li>');
                choreList.append('<p></p>')

            });
            //$('choreList').listview('refresh');


        },
        error: function(error, parsererror){
            alert("someting went wrong!");
            console.log(error);
            console.log(parsererror);
        }


    })


};

var getJSON = function(choreDiv){
    console.log('getXML called!');
    choreDiv.append('<ul data-role="listview" data-theme="a" id="choreList"></ul>');

    $.ajax({
        url: 'Default.json',
        type: 'GET',
        dataType: 'json',
        success: function(json){
            console.log("AJAX call successful");
            console.log(json);
            var chorelist = $('#choreList');
            for(var key in json){
                var each = json[key];
                for (var chore in each){
                    chorelist.append("<li>"+each[chore][0]+" "+ each[chore][1]+"</li>")
                }
                chorelist.append('<p></p>');
            }


        },
        error: function(error, parsererror){
            alert("someting went wrong!");
            console.log(error);
            console.log(parsererror);
        }


    })

};

var getRemote = function(choreDiv){
console.log("getRemote call successful!")
//New couch plugin code
console.log('beginning couch.db code!')
    $.couch.db("choredb").view("app/chores",{
        success: function(data){
            console.log(data);
            choreDiv.append("<ul data-role='listview' data-theme='a' id='choreList'></ul>");
            var choreList = $('#choreList');

            $.each(data.rows,function(index,chore){

                var key = chore.id,
                rev = chore.value.rev;
                console.log('The key is: ' + key);
                console.log('The revision #: '+ rev);
                console.log('The index is: '+ index);
                console.log(chore);
                choreList.append("<li>"+chore.value.who[0]+" "+chore.value.who[1]+"</li>");
                choreList.append("<li>"+chore.value.chore[0]+" "+chore.value.chore[1]+"</li>");
                choreList.append("<li>"+chore.value.due[0]+" "+chore.value.due[1]+"</li>");
                choreList.append("<li>"+chore.value.amount[0]+" "+chore.value.amount[1]+"</li>");
                choreList.append("<li>"+chore.value.payto[0]+" "+chore.value.payto[1]+"</li>");
                choreList.append($('<li>').append(
                    $('<a>')
                        .attr('href','editPage.html?key='+key)
                        .attr('data-theme','a')
                        .attr('class','editBtn')
                        .text('Edit Item')
                ));
                choreList.append("<li><a href='#' data-inline='true' data-id="+key+" class = 'delBtn'> Delete Item</a></li>");
                choreList.append("<p></p>");
            });

        }



    });


//Old Ajax code
    /*
    $.ajax({
        "url": "_view/chores",
        "dataType":"json",
        "success": function(data){
            choreDiv.append("<ul data-role='listview' data-theme='a' id='choreList'></ul>");
            var choreList = $('#choreList');
            $.each(data.rows,function(index,chore){
                var key = chore.id;
                console.log(chore);
                choreList.append("<li>"+chore.value.who[0]+" "+chore.value.who[1]+"</li>");
                choreList.append("<li>"+chore.value.chore[0]+" "+chore.value.chore[1]+"</li>");
                choreList.append("<li>"+chore.value.due[0]+" "+chore.value.due[1]+"</li>");
                choreList.append("<li>"+chore.value.amount[0]+" "+chore.value.amount[1]+"</li>");
                choreList.append("<li>"+chore.value.payto[0]+" "+chore.value.payto[1]+"</li>");
                choreList.append("<li><a href='#editPage' data-theme='a' class='editBtn' data-id="+ key +">Edit Item</a></li>");
                choreList.append("<li><a href='#' data-inline='true' data-id="+key+" class = 'delBtn'> Delete Item</a></li>");
                choreList.append("<p></p>");
            });
            choreList.listview('refresh');
        }


    });
    */


};