var validator = {
	name: {
		presence: {
			allowEmpty: false,
			message: ';Inserisci un nome'
		},
		length: { maximum: 255, tooLong: ';Il nome e troppo lungo' },
	},
	address: {
		length: { maximum: 255, tooLong: ';L\'indirizzo e troppo lungo' },
	},
};

export default validator;
