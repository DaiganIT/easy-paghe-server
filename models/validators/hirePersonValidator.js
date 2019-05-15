var validator = {
	startDate: {
		presence: {
			allowEmpty: false,
			message: ';Inserisci la data di inizio dell\'assunzione'
		},
		datetime: {
			dateOnly: true,
			message: ';Deve essere una data valida'
		}
  },
  endDate: {
		datetime: {
			dateOnly: true,
			message: ';Deve essere una data valida'
		},
		isGreaterThanStartDate: { }
  },
  holidays: {
    numericality: {
			greaterThan: 0,
			notGreaterThan: ';Il numero di giorni di vacanza deve essere maggiore di 0',
			notValid: ';Il numero di giorni di vacanza non e valido',
    },
	},
	weekHours: {
    numericality: {
			greaterThan: 0,
			lessThan: 48,
			notValid: ';Il numero di ore a settimana non e valido',
			notGreaterThan: ';Il numero di ore a settimana deve essere maggiore di 0',
			notLessThan: ';Il numero di ore a settimana deve essere minore di 48'
    },
	},
	companyBaseId: {
		numericality: {
			onlyInteger: true,
			greaterThan: 0,
			message: ';L\'azienda non e valida'
		}
	},
	personId: {
		numericality: {
			onlyInteger: true,
			greaterThan: 0,
			message: ';La persona non e valida'
		}
	},
	ccnlId: {
		numericality: {
			onlyInteger: true,
			greaterThan: 0,
			message: ';Il CCNL non e valido'
		}
	},
	salaryTableId: {
		numericality: {
			onlyInteger: true,
			greaterThan: 0,
			message: ';Il livello di assunzione non e valido'
		}
	}
};

export default validator;
