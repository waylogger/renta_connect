
$('#receiveTimeRange').bind('input', transferReceiveTime);
$('#returnTimeRange').bind('input', transferReturnTime);
$('#bookButtonId').bind('click', bookCar);
$(`#${customerPhone.id}`).bind('change', inputHandler(customerPhone,validationPhone));
$(`#${customerName.id}`).bind('change', inputHandler(customerName,validationName));
$(`#${proofOfAgeAndExperience.id}`).bind('click',lawAgreementHandlerAgeExpr());
$(`#${agreementWithPolicy.id}`).bind('click',lawAgreementHandlerAgreePolicy());
$(`#receivePlaceSelect`).bind('click',receivePlaceHandle);
$(`#returnPlaceSelect`).bind('click',returnPlaceHandle);






