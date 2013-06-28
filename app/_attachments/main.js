// Houston Bennett
// ASD 1306
var editID, editRev;

$(document).on('pageinit','#homePage',function(){
    var contentDiv = $('#contentDiv');
    //Will fetch data from storage as soon as there is some to fetch
    //getLocal(contentDiv);
    console.log("Calling getRemote()");
    getRemote(contentDiv);
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
            location.replace('index.html')
        }
    });



});

$(document).on('pageinit','#editPage',function(){
    console.log('Edit page init GOOD');

    var editForm = $('#editForm');

    editForm.validate({
        invalidHandler: function (form, validator){
            alert('You must have missed a required input. TRY AGAIN!')
        },
        submitHandler: function(){
            console.log('Validation Successful! Serializing form.');
            var formData = editForm.serializeArray();
            console.log('The following is the serialized data: '+ formData);
            console.log('Sending data to storage!');
            saveEdits(editID);
            location.replace('index.html')
        }
    });


    console.log("Global Var editID:")
    console.log(editID);
    console.log("Global Var editRev:")
    console.log(editRev);
    $.couch.db("choredb").view("app/chores",{
        key: editID,
        success: function(data){
            console.log(data);
            $.each(data.rows,function(index,chore){
                $('#editWho').val(chore.value.who);
                $('#editChore').val(chore.value.chore);
                $('#editDueDate').val(chore.value.due);
                $('#editAmount').val(chore.value.amount);
                $('#editPayable').val(chore.value.payto);

            });

        }



    });


});

$(document).on('click','.editBtn', function () {
    console.log('CLICKY CLICKY!!')
    editID = $(this).data('id');
    editRev = $(this).data('rev');
    console.log(editID);
});

$(document).on('click','.delBtn', function(){
    console.log("deleteItem function has been called by: " + this);
    editID = $(this).data('id');
    editRev = $(this).data('rev');
    console.log("deleting item at key: "+ editID);
    //alert('The item #' + key + ' had been deleted!!');
    if(confirm('Are you sure you want to delete this item?')){
        console.log(editID)
        console.log(editRev)
        $.couch.db("choredb").removeDoc({_id:editID,_rev:editRev});
        alert('The item has been deleted!')
        location.reload(true);
    }else{
        alert('Good idea.')
    }



});


$('#submit').on('click',function(){



});

var parseUrl = function(){
    var wholeUrl = $($.mobile.activePage).data("url");
    console.log("Var wholeUrl contains:")
    console.log(wholeUrl);
    var splitUrl = wholeUrl.split('?');
    console.log("Var splitUrl contains:")
    console.log(splitUrl);
    var urlPairs = splitUrl[1].split('&');
    console.log("Var urlPairs contains:")
    console.log(urlPairs);
    var urlKeyVal = {};

    for(var i in urlPairs){
        var keyVal = urlPairs[pair].split('=');
        var key = decodeURIComponent(keyVal[0]);
        var val = decodeURIComponent(keyVal[1]);
        urlKeyVal[key]= val;

    }
    return urlKeyVal;



};
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
    formData._id = "chore"+ itemID;
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

    alert("saveEdit function is being passed: "+ key)
    var formData = {};
    formData._id = key;
    formData.who =  $('#editWho').val();
    formData.chore =  $('#editChore').val();
    formData.due = $('#editDueDate').val();
    formData.amount = $('#editAmount').val();
    formData.payto =$('#editPayable').val();

    console.log("Begin Couch call!");
    console.log(formData);

    $.couch.db("choredb").removeDoc({_id:editID,_rev:editRev});

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
                choreList.append("<li>"+chore.value.who+"</li>");
                choreList.append("<li>"+chore.value.chore+"</li>");
                choreList.append("<li>"+chore.value.due+"</li>");
                choreList.append("<li>"+chore.value.amount+"</li>");
                choreList.append("<li>"+chore.value.payto+"</li>");
                choreList.append($('<li>').append(
                    $('<a>')
                        .attr('href','#editPage')
                        .attr('data-theme','a')
                        .attr('class','editBtn')
                        .attr('data-id',key)
                        .attr('data-rev',rev)
                        .text('Edit Item')
                ));
                choreList.append($('<li>').append(
                    $('<a>')
                        .attr('href','#')
                        .attr('data-theme','a')
                        .attr('class','delBtn')
                        .attr('data-id',key)
                        .attr('data-rev',rev)
                        .text('Delete Item')
                ));

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