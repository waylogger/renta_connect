

$(document).ready(() => {
	$('#receiveTimeRange').bind('input', transferReceiveTime);
	$('#returnTimeRange').bind('input', transferReturnTime);
	$('#receiveTimeRange').bind('input', datePreview);
	$('#returnTimeRange').bind('input', datePreview );
	$('#bookButtonId').bind('click', bookCar);
	$(`#${customerPhone.id}`).bind('change', inputHandler(customerPhone, validationPhone));
	$(`#${customerName.id}`).bind('change', inputHandler(customerName, validationName));
	$(`#${proofOfAgeAndExperience.id}`).bind('click', lawAgreementHandlerAgeExpr());
	$(`#${agreementWithPolicy.id}`).bind('click', lawAgreementHandlerAgreePolicy());
	$(`#receivePlaceSelect`).bind('change', receivePlaceHandle);
	$(`#receivePlaceSelect`).bind('change', costPreview);
	$(`#returnPlaceSelect`).bind('change', returnPlaceHandle);
	$(`#returnPlaceSelect`).bind('change', costPreview);
	$('#dateListener').bind('click', carPreview);




});