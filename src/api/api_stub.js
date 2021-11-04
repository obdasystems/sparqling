export function getHighlights(ontologyName, ontologyVersion, clickedIRI) {
	switch(clickedIRI) {
		case "http://www.datiopen.istat.it/Ontologie/RBI#Persona_in_vita":
			return {
			  "selectedClasses": [
			    "http://www.datiopen.istat.it/Ontologie/RBI#Persona_in_vita"
			  ],
			  "highlightedEntities": {
			    "classes": [
            Persona_non_in_vita?,
            Maschio?
            Femmina?
            Figlio id madre?
            Persona giuridica?
            "http://www.datiopen.istat.it/Ontologie/RBI#Cittadino_straniero",
            "http://www.datiopen.istat.it/Ontologie/RBI#Residente",
            "http://www.datiopen.istat.it/Ontologie/RBI#Persona_minorenne",
            "http://www.datiopen.istat.it/Ontologie/RBI#Persona_maggiorenne",
            "http://www.datiopen.istat.it/Ontologie/RBI#Apolide",
            "http://www.datiopen.istat.it/Ontologie/RBI#Non_residente",
            "http://www.datiopen.istat.it/Ontologie/RBI#Cittadino_italiano",
            "http://www.datiopen.istat.it/Ontologie/RBI#Persona_over_sessantacinque",
            "http://www.datiopen.istat.it/Ontologie/RBI#Persona_ultracentenaria",
            "http://www.datiopen.istat.it/Ontologie/RBI#Camminante",
            "http://www.datiopen.istat.it/Ontologie/RBI#Senza_fissa_dimora"            
			    ],
			    "objectProperties": [
			      {
			        "objectPropertyIRI": "rbi:ha_titolo_di_studio_",
			        "relatedClasses": [
			          "rbi:Titolo_di_studio"
			        ]
			      },
            {
              "objectPropertyIRI": "rbi:ha_grado_di_istruzione_attuale",
              "relatedClasses": [
                "rbi:Grado_di_istruzione"
              ]
            },
            {
              "objectPropertyIRI": "rbi:ha_tipo_stato_civile_attuale",
              "relatedClasses": [
                "rbi:Tipo_stato_civile"
              ]
            },
            {
              "objectPropertyIRI": "rbi:ha_stato_civile",
              "relatedClasses": [
                "rbi:Stato_civile"
              ]
            },
            {
              "objectPropertyIRI": "rbi:ha_precedente_stato_civile",
              "relatedClasses": [
                "rbi:Stato_civile"
              ]
            },
            {
              "objectPropertyIRI": "rbi:appartiene_a_famiglia_o_convivenza",
              "relatedClasses": [
                ???
              ]
            },
            {
              "objectPropertyIRI": "rbi:appartiene_a_nucleo",
              "relatedClasses": [
                "rbi:Nucleo"
              ]
            },
            {
              "objectPropertyIRI": "rbi:appartiene_a_classe_di_eta",
              "relatedClasses": [
                "rbi:Classe_di_eta"
              ]
            },
            {
              "objectPropertyIRI": "rbi:ha_grado_di_istruzione",
              "relatedClasses": [
                "rbi:Storico_grado_istruzione"
              ]
            },
            {
              "objectPropertyIRI": "rbi:ha_cittadinanza_di_persona",
              "relatedClasses": [
                "rbi:Cittadinanza_di_persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:in_relazione_con",
              "relatedClasses": [
                "rbi:Persona"
                domain or range?
              ]
            },
            {
              "objectPropertyIRI": "rbi:ha_residenza",
              "relatedClasses": [
                "rbi:Residenza"
              ]
            },
            {
              "objectPropertyIRI": "rbi:nato_in_stato",
              "relatedClasses": [
                "rsbl:Stato"
              ]
            },
            {
              "objectPropertyIRI": "rbi:nato_in_comune",
              "relatedClasses": [
                "rsbl:Comune"
              ]
            },
            {
              "objectPropertyIRI": "rsbl:ha_titolare",
              "relatedClasses": [
                "rsbl:Storico_unita_immobiliare_per_titolo"
              ]
            },
            {
              "objectPropertyIRI": "rsbl:ha_tipo_titolare",
              "relatedClasses": [
                "rsbl:Tipo_titolare"
              ]
            }
			    ],
			    "dataProperties": [
			      "rbi:data_inizio_stato_civile_attuale",
            "rbi:eta",
            "rbi:denominazione_sesso",
            "rbi:codice_sesso",
            "rbi:data_nascita",
            "rbi:codice_individuo"
          ]
			  }
			}
      default: throw Error(`${clickedIRI} not found!`)
	}
}