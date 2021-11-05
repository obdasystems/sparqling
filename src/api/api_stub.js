export function getHighlights(ontologyName, ontologyVersion, clickedIRI) {
  switch (clickedIRI) {
    case "rbi:Persona_in_vita":
      return {
        "selectedClasses": [
          "rbi:Persona_in_vita"
        ],
        "highlightedEntities": {
          "classes": [
            "rbi:Maschio",
            "rbi:Femmina",
            "rbi:Figlio_di_madre",
            "rbi:Cittadino_straniero",
            "rbi:Residente",
            "rbi:Persona_minorenne",
            "rbi:Persona_maggiorenne",
            "rbi:Apolide",
            "rbi:Non_residente",
            "rbi:Cittadino_italiano",
            "rbi:Persona_over_sessantacinque",
            "rbi:Persona_ultracentenaria",
            "rbi:Camminante",
            "rbi:Senza_fissa_dimora"
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
                "rbi:Convivenza",
                "rbi:Famiglia"
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
              "objectPropertyIRI": "rbi:ha_cittadinanza_di_persona_prevalente",
              "relatedClasses": [
                "rbi:Cittadinanza_di_persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:ha_cittadinanza_di_persona_acquisita",
              "relatedClasses": [
                "rbi:Cittadinanza_di_persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:in_relazione_con",
              "cyclic": true,
              "relatedClasses": [
                "rbi:Persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:in_coppia",
              "cyclic": true,
              "relatedClasses": [
                "rbi:Persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:relazione_parentale",
              "cyclic": true,
              "relatedClasses": [
                "rbi:Persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:coniuge_di",
              "cyclic": true,
              "relatedClasses": [
                "rbi:Persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:fratello_di",
              "cyclic": true,
              "relatedClasses": [
                "rbi:Persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:nipote_di",
              "cyclic": true,
              "relatedClasses": [
                "rbi:Persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:nonno_di",
              "cyclic": true,
              "relatedClasses": [
                "rbi:Persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:genitore_di",
              "cyclic": true,
              "relatedClasses": [
                "rbi:Persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:figlio_di",
              "relatedClasses": [
                "rbi:Figlio_di_madre"
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
            },
            {
              "objectPropertyIRI": "rbi:è_attualmente_cittadino",
              "relatedClasses": [
                "rsbl:Cittadinanza"
              ]
            },
            {
              "objectPropertyIRI": "rbi:è_attualmente_prevalentemente_cittadino",
              "relatedClasses": [
                "rsbl:Cittadinanza"
              ]
            },
            {
              "objectPropertyIRI": "rbi:è_attualmente_cittadino_acquisito",
              "relatedClasses": [
                "rsbl:Cittadinanza"
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
    case "rbi:Cittadinanza_di_persona":
      return {
        "selectedClasses": [
          "rbi:Cittadinanza_di_persona"
        ],
        "highlightedEntities": {
          "classes": [
          ],
          "objectProperties": [
            {
              "objectPropertyIRI": "rbi:Cittadinanza_di_persona",
              "relatedClasses": [
                "rbi:Persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:cittadinanza_in",
              "relatedClasses": [
                "rsbl:Cittadinanza"
              ]
            },
            {
              "objectPropertyIRI": "rbi:ha_tipo_evento_apertura_cittadinanza",
              "relatedClasses": [
                "rbi:Tipo_evento_apertura_cittadinanza"
              ]
            },
            {
              "objectPropertyIRI": "rbi:ha_tipo_evento_chiusura_cittadinanza",
              "relatedClasses": [
                "rbi:Tipo_evento_chiusura_cittadinanza"
              ]
            }
          ],
          "dataProperties": [
            "rbi:data_inizio_validità_citt",
            "rbi:data_fine_validità_citt"
          ]
        }
      }
    case "rsbl:Cittadinanza":
      return {
        "selectedClasses": [
          "rsbl:Cittadinanza"
        ],
        "highlightedEntities": {
          "classes": [
          ],
          "objectProperties": [
            {
              "objectPropertyIRI": "rbi:cittadinanza_in",
              "relatedClasses": [
                "rbi:Cittadinanza_di_persona"
              ]
            },
            {
              "objectPropertyIRI": "rbi:è_attualmente_cittadino",
              "relatedClasses": [
                "rbi:Persona_in_vita"
              ]
            },
            {
              "objectPropertyIRI": "rbi:è_attualmente_prevalentemente_cittadino",
              "relatedClasses": [
                "rbi:Persona_in_vita"
              ]
            },
            {
              "objectPropertyIRI": "rbi:è_attualmente_cittadino_acquisito",
              "relatedClasses": [
                "rbi:Persona_in_vita"
              ]
            },
            {
              "objectPropertyIRI": "rbi:cittadinanza_al_decesso",
              "relatedClasses": [
                "rbi:Persona_non_in_vita"
              ]
            },
            {
              "objectPropertyIRI": "rsbl:attuale_stato_della_cittadinanza",
              "relatedClasses": [
                "rsbl:Stato"
              ]
            }
          ],
          "dataProperties": [
            "rsbl:denominazione_inglese_di_cittadinanza",
            "rsbl:denominazione_italiana_di_cittadinanza",
            "rsbl:codice_cittadinanza"
          ]
        }
      }
    case "rbi:Grado_di_istruzione":
      return {
        "selectedClasses": [
          "rbi:Grado_di_istruzione"
        ],
        "highlightedEntities": {
          "classes": [
            "string"
          ],
          "objectProperties": [
            {
              "objectPropertyIRI": "rbi:ha_grado_di_istruzione_attuale",
              "relatedClasses": [
                "rbi:Persona_in_vita"
              ]
            },
            {
              "objectPropertyIRI": "rbi:ha_ultimo_grado_di_istruzione",
              "relatedClasses": [
                "rbi:Persona_non_in_vita"
              ]
            },
            {
              "objectPropertyIRI": "rbi:relativo_a_grado_di_istruzione",
              "relatedClasses": [
                "rbi:Storico_grado_istruzione"
              ]
            },
            {
              "objectPropertyIRI": "rbi:abilita",
              "relatedClasses": [
                "rbi:Titolo_di_studio"
              ]
            }
          ],
          "dataProperties": [
            "rbi:codice_grado_istruzione",
            "rbi:denominazione_grado_istruzione"
          ]
        }
      }
    default: throw Error(`${clickedIRI} not found!`)
  }
}