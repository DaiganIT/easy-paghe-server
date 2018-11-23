var validator = {
	name: {
		presence: true,
		length: { maximum: 255 },
	},
	fiscalCode: {
		format: /^[A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Za-z]{1}$/,
		length: { is: 16 },
	},
	ivaCode: {
		length: { is: 11 },
	},
	address: {
		length: { maximum: 255 },
	},
	inpsRegistrationNumber: {
		length: { is: 10 },
		numericality: true,
	},
	inailRegistrationNumber: {
		length: { is: 10 },
		numericality: true,
	},
};

export default validator;
