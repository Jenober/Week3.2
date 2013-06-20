function(doc){
	if(doc._id != ""){
		emit(doc._id,{
			"who":doc.who,
			"chore": doc.chore,
			"due": doc.due,
			"amount": doc.amount,
			"payto": doc.payto		
		});
	
	}


}