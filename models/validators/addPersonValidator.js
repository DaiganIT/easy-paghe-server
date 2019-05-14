var validator = {
	firstName: {
		presence: {
			allowEmpty: false,
			message: ';Inserisci un nome'
		},
		length: { maximum: 255, tooLong: ';Il nome e troppo lungo' },
  },
  lastName: {
		presence: {
			allowEmpty: false,
			message: ';Inserisci un cognome'
		},
		length: { maximum: 255, tooLong: ';Il cognome e troppo lungo' },
  },
  phone: {
    numericality: {
			onlyInteger: true,
			message: ';Il numero di telefono non e valido'
    },
		length: { maximum: 255, tooLong: ';Il numero di telefono e troppo lungo' },    
  },
  address: {
		length: { maximum: 255, tooLong: ';L\'indirizzo e troppo lungo' },
  },
  email: {
    email: {
      message: ';L\'email non e valida'
    }
  }
};

export default validator;
