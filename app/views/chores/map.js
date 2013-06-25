function(doc){
	if(doc._id != ""){
		emit(doc._id,{
            "id":doc._id,
            "rev":doc._rev,
			"who":doc.who,
			"chore": doc.chore,
			"due": doc.due,
			"amount": doc.amount,
			"payto": doc.payto		
		});
	
	}


}