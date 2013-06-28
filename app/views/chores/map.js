function(doc){

	if(doc._id.substr(0,5) == "chore"){
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