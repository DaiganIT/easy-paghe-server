var validator = {
	name: {
		presence: true,
		length: { maximum: 255 },
	},
	fiscalCode: {
		format: {
			pattern: /^[A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Za-z]{1}$/,
			message: ';Il codice fiscale non e valido'
		},
	},
	ivaCode: {
		length: { is: 11, wrongLength: ';La partita IVA non e valida' },
	},
	address: {
		length: { maximum: 255, tooLong: ';L\'Indirizzo e troppo lungo' },
	},
	inpsRegistrationNumber: {
		length: { is: 10, wrongLength: ';Il Codice INPS non e valido' },
		numericality: {
			onlyInteger: true,
			message: ';Il Codice INPS non e valido'
		},
	},
	inailRegistrationNumber: {
		length: { is: 10, wrongLength: ';Il Codice INAIL non e valido' },
		numericality: {
			onlyInteger: true,
			message: ';Il Codice INAIL non e valido'
		},
	},
};

export default validator;
