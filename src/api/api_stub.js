export function getHighlights(ontologyName, ontologyVersion, clickedClassIRI) {
  switch (clickedClassIRI) {
    case "rbi:Persona_in_vita":
      return {
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
    case "rbi:Cittadinanza_di_persona":
      return {
        "classes": [
        ],
        "objectProperties": [
          {
            "objectPropertyIRI": "rbi:ha_cittadinanza_di_persona",
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
    case "rsbl:Cittadinanza":
      return {
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
    case "rbi:Grado_di_istruzione":
      return {
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
    default: throw Error(`${clickedClassIRI} not found!`)
  }
}

const graph0 = {
  "filters": [],
  "optionals": [],
  "graph": {
    "children": [],
    "entity": {
      "iri": "rbi:Persona_in_vita",
      "labels": null,
      "prefixedIri": "rbi:Persona_in_vita",
      "type": "class"
    },
    "id": 0
  },
  "head": [
    "Persona_in_vita"
  ],
  "sparql":
    `SELECT ?Persona_in_vita 
WHERE { 
  ?Persona_in_vita a rbi:Persona_in_vita.
}`
}

const graph1 = {
  "filters": [],
  "optionals": [],
  "graph": {
    "children": [
      {
        "children": [
          {
            "children": [],
            "entity": {
              "iri": "rbi:Cittadinanza_di_persona",
              "labels": null,
              "prefixedIri": "rbi:Cittadinanza_di_persona",
              "type": "class"
            },
            "id": 2
          }
        ],
        "entity": {
          "iri": "rbi:ha_cittadinanza_di_persona",
          "labels": null,
          "prefixedIri": "rbi:ha_cittadinanza_di_persona",
          "type": "objectProperty"
        },
        "id": 1
      },
    ],
    "entity": {
      "iri": "rbi:Persona_in_vita",
      "labels": null,
      "prefixedIri": "rbi:Persona_in_vita",
      "type": "class"
    },
    "id": 0
  },
  "head": [
    "Persona_in_vita"
  ],
  "sparql":
    `SELECT ?Persona_in_vita 
WHERE { 
  ?Persona_in_vita a rbi:Persona_in_vita.
  ?Persona_in_vita rbi:ha_cittadinanza_di_persona ?Cittadinanza_di_persona.
  ?Cittadinanza_di_persona a rbi:Cittadinanza_di_persona.
}`
}

const graph2 = {
  "filters": [],
  "optionals": [],
  "graph": {
    "children": [
      {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "children": [],
                    "entity": {
                      "iri": "rsbl:Cittadinanza",
                      "labels": null,
                      "prefixedIri": "rsbl:Cittadinanza",
                      "type": "class"
                    },
                    "id": 4
                  }
                ],
                "entity": {
                  "iri": "rbi:cittadinanza_in",
                  "labels": null,
                  "prefixedIri": "rbi:cittadinanza_in",
                  "type": "objectProperty"
                },
                "id": 3
              }
            ],
            "entity": {
              "iri": "rbi:Cittadinanza_di_persona",
              "labels": null,
              "prefixedIri": "rbi:Cittadinanza_di_persona",
              "type": "class"
            },
            "id": 2
          }
        ],
        "entity": {
          "iri": "rbi:ha_cittadinanza_di_persona",
          "labels": null,
          "prefixedIri": "rbi:ha_cittadinanza_di_persona",
          "type": "objectProperty"
        },
        "id": 1
      },
    ],
    "entity": {
      "iri": "rbi:Persona_in_vita",
      "labels": null,
      "prefixedIri": "rbi:Persona_in_vita",
      "type": "class"
    },
    "id": 0
  },
  "head": [
    "Persona_in_vita"
  ],
  "sparql":
    `SELECT ?Persona_in_vita 
WHERE { 
  ?Persona_in_vita a rbi:Persona_in_vita.
  ?Persona_in_vita rbi:ha_cittadinanza_di_persona ?Cittadinanza_di_persona.
  ?Cittadinanza_di_persona a rbi:Cittadinanza_di_persona.
  ?Cittadinanza_di_persona rbi:cittadinanza_in ?Cittadinanza.
  ?Cittadinanza a rsbl:Cittadinanza.
}`
}

const graph3 = {
  "filters": [],
  "optionals": [],
  "graph": {
    "children": [
      {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "children": [
                      {
                        "children": [],
                        "entity": {
                          "iri": "rsbl:denominazione_italiana_di_cittadinanza",
                          "labels": null,
                          "prefixedIri": "rsbl:denominazione_italiana_di_cittadinanza",
                          "type": "dataProperty"
                        },
                        "id": 5
                      }
                    ],
                    "entity": {
                      "iri": "rsbl:Cittadinanza",
                      "labels": null,
                      "prefixedIri": "rsbl:Cittadinanza",
                      "type": "class"
                    },
                    "id": 4
                  }
                ],
                "entity": {
                  "iri": "rbi:cittadinanza_in",
                  "labels": null,
                  "prefixedIri": "rbi:cittadinanza_in",
                  "type": "objectProperty"
                },
                "id": 3
              }
            ],
            "entity": {
              "iri": "rbi:Cittadinanza_di_persona",
              "labels": null,
              "prefixedIri": "rbi:Cittadinanza_di_persona",
              "type": "class"
            },
            "id": 2
          }
        ],
        "entity": {
          "iri": "rbi:ha_cittadinanza_di_persona",
          "labels": null,
          "prefixedIri": "rbi:ha_cittadinanza_di_persona",
          "type": "objectProperty"
        },
        "id": 1
      }
    ],
    "entity": {
      "iri": "rbi:Persona_in_vita",
      "labels": null,
      "prefixedIri": "rbi:Persona_in_vita",
      "type": "class"
    },
    "id": 0
  },
  "head": [
    "Persona_in_vita",
    "denominazione_italiana_di_cittadinanza"
  ],
  "sparql":
    `SELECT ?Persona_in_vita ?denominazione_italiana_di_cittadinanza 
WHERE { 
  ?Persona_in_vita a rbi:Persona_in_vita.
  ?Persona_in_vita rbi:ha_cittadinanza_di_persona ?Cittadinanza_di_persona.
  ?Cittadinanza_di_persona a rbi:Cittadinanza_di_persona.
  ?Cittadinanza_di_persona rbi:cittadinanza_in ?Cittadinanza.
  ?Cittadinanza a rsbl:Cittadinanza.
  ?Cittadinanza rsbl:denominazione_italiana_di_cittadinanza ?denominazione_italiana_di_cittadinanza.
}`
}

const graph4 = {
  "filters": [],
  "optionals": [],
  "graph": {
    "children": [
      {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "children": [
                      {
                        "children": [],
                        "entity": {
                          "iri": "rsbl:denominazione_italiana_di_cittadinanza",
                          "labels": null,
                          "prefixedIri": "rsbl:denominazione_italiana_di_cittadinanza",
                          "type": "dataProperty"
                        },
                        "id": 5
                      }
                    ],
                    "entity": {
                      "iri": "rsbl:Cittadinanza",
                      "labels": null,
                      "prefixedIri": "rsbl:Cittadinanza",
                      "type": "class"
                    },
                    "id": 4
                  }
                ],
                "entity": {
                  "iri": "rbi:cittadinanza_in",
                  "labels": null,
                  "prefixedIri": "rbi:cittadinanza_in",
                  "type": "objectProperty"
                },
                "id": 3
              }
            ],
            "entity": {
              "iri": "rbi:Cittadinanza_di_persona",
              "labels": null,
              "prefixedIri": "rbi:Cittadinanza_di_persona",
              "type": "class"
            },
            "id": 2
          }
        ],
        "entity": {
          "iri": "rbi:ha_cittadinanza_di_persona",
          "labels": null,
          "prefixedIri": "rbi:ha_cittadinanza_di_persona",
          "type": "objectProperty"
        },
        "id": 1
      },
      {
        "children": [
          {
            "children": [],
            "entity": {
              "iri": "rbi:Grado_di_istruzione",
              "labels": null,
              "prefixedIri": "rbi:Grado_di_istruzione",
              "type": "class"
            },
            "id": 7
          }
        ],
        "entity": {
          "iri": "rbi:ha_grado_di_istruzione_attuale",
          "labels": null,
          "prefixedIri": "rbi:ha_grado_di_istruzione_attuale",
          "type": "objectProperty"
        },
        "id": 6
      }
    ],
    "entity": {
      "iri": "rbi:Persona_in_vita",
      "labels": null,
      "prefixedIri": "rbi:Persona_in_vita",
      "type": "class"
    },
    "id": 0
  },
  "head": [
    "Persona_in_vita",
    "denominazione_italiana_di_cittadinanza"
  ],
  "sparql":
    `SELECT ?Persona_in_vita ?denominazione_italiana_di_cittadinanza 
WHERE { 
  ?Persona_in_vita a rbi:Persona_in_vita.
  ?Persona_in_vita rbi:ha_cittadinanza_di_persona ?Cittadinanza_di_persona.
  ?Cittadinanza_di_persona a rbi:Cittadinanza_di_persona.
  ?Cittadinanza_di_persona rbi:cittadinanza_in ?Cittadinanza.
  ?Cittadinanza a rsbl:Cittadinanza.
  ?Cittadinanza rsbl:denominazione_italiana_di_cittadinanza ?denominazione_italiana_di_cittadinanza.
  ?Persona_in_vita rbi:ha_grado_di_istruzione_attuale ?Grado_di_istruzione.
  ?Grado_di_istruzione a rbi:Grado_di_istruzione.
}`
}

const graph5 = {
  "filters": [],
  "optionals": [],
  "graph": {
    "children": [
      {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "children": [
                      {
                        "children": [],
                        "entity": {
                          "iri": "rsbl:denominazione_italiana_di_cittadinanza",
                          "labels": null,
                          "prefixedIri": "rsbl:denominazione_italiana_di_cittadinanza",
                          "type": "dataProperty"
                        },
                        "id": 5
                      }
                    ],
                    "entity": {
                      "iri": "rsbl:Cittadinanza",
                      "labels": null,
                      "prefixedIri": "rsbl:Cittadinanza",
                      "type": "class"
                    },
                    "id": 4
                  }
                ],
                "entity": {
                  "iri": "rbi:cittadinanza_in",
                  "labels": null,
                  "prefixedIri": "rbi:cittadinanza_in",
                  "type": "objectProperty"
                },
                "id": 3
              }
            ],
            "entity": {
              "iri": "rbi:Cittadinanza_di_persona",
              "labels": null,
              "prefixedIri": "rbi:Cittadinanza_di_persona",
              "type": "class"
            },
            "id": 2
          }
        ],
        "entity": {
          "iri": "rbi:ha_cittadinanza_di_persona",
          "labels": null,
          "prefixedIri": "rbi:ha_cittadinanza_di_persona",
          "type": "objectProperty"
        },
        "id": 1
      },
      {
        "children": [
          {
            "children": [
              {
                "children": [],
                "entity": {
                  "iri": "rbi:denominazione_grado_istruzione",
                  "labels": null,
                  "prefixedIri": "rbi:denominazione_grado_istruzione",
                  "type": "dataProperty"
                },
                "id": 8
              }
            ],
            "entity": {
              "iri": "rbi:Grado_di_istruzione",
              "labels": null,
              "prefixedIri": "rbi:Grado_di_istruzione",
              "type": "class"
            },
            "id": 7
          }
        ],
        "entity": {
          "iri": "rbi:ha_grado_di_istruzione_attuale",
          "labels": null,
          "prefixedIri": "rbi:ha_grado_di_istruzione_attuale",
          "type": "objectProperty"
        },
        "id": 6
      }
    ],
    "entity": {
      "iri": "rbi:Persona_in_vita",
      "labels": null,
      "prefixedIri": "rbi:Persona_in_vita",
      "type": "class"
    },
    "id": 0
  },
  "head": [
    "Persona_in_vita",
    "denominazione_italiana_di_cittadinanza",
    "denominazione_grado_istruzione"
  ],
  "sparql":
    `SELECT ?Persona_in_vita ?denominazione_italiana_di_cittadinanza ?denominazione_grado_istruzione
WHERE { 
  ?Persona_in_vita a rbi:Persona_in_vita.
  ?Persona_in_vita rbi:ha_cittadinanza_di_persona ?Cittadinanza_di_persona.
  ?Cittadinanza_di_persona a rbi:Cittadinanza_di_persona.
  ?Cittadinanza_di_persona rbi:cittadinanza_in ?Cittadinanza.
  ?Cittadinanza a rsbl:Cittadinanza.
  ?Cittadinanza rsbl:denominazione_italiana_di_cittadinanza ?denominazione_italiana_di_cittadinanza.
  ?Persona_in_vita rbi:ha_grado_di_istruzione_attuale ?Grado_di_istruzione.
  ?Grado_di_istruzione a rbi:Grado_di_istruzione.
  ?Grado_di_istruzione rbi:denominazione_grado_istruzione ?denominazione_grado_istruzione.
}`
}

export function getQueryGraphNode(ontologyName, ontologyVersion, clickedClassIRI) {
  if (clickedClassIRI === 'rbi:Persona_in_vita') {
    return graph0
  } else throw new Error('Start from rbi:Persona_in_vita')
}

export function putQueryGraphNodeObjectProperty(ontologyName, ontologyVersion, graphNodeId, sourceClassIRI, predicateIRI, targetClassIRI, isPredicateCyclicDirect) {
  switch (graphNodeId) {
    case 0:
      switch (predicateIRI) {
        case 'rbi:ha_cittadinanza_di_persona': return graph1
        case 'rbi:ha_grado_di_istruzione_attuale': return graph4
        default: throw Error('Out of the stub!!!')
      }
    case 2: return graph2
    default: throw Error('Out of the stub!!!')

  }
}

export function putQueryGraphNodeDataProperty(ontologyName, ontologyVersion, graphNodeId, sourceClassIRI, predicateIRI) {
  switch (graphNodeId) {
    case 4: return graph3
    case 7: return graph5
    default: throw Error('Out of the stub!!!')

  }
}

export function newOptionalGraphElementId(graphElementId, queryGraph, classIri = '') {
  if (graphElementId !== 'PizzaBase0' || !queryGraph) {
    throw Error('Out of the stub!!!')
  }
  queryGraph.optionals = [
    {
      id: 0,
      graphIds: [
        'PizzaBase0', 'depth0', 'Food0'
      ]
    }
  ]

  return queryGraph
}

export function removeOptionalGraphElementId(graphElementId, optionalId, queryGraph, classIri = '') {
  if (graphElementId === 'PizzaBase0' || graphElementId === 'depth0' || graphElementId === 'Food0') {
    let optToDelete = queryGraph.optionals.filter(opt => opt.graphIds.includes(graphElementId))

    optToDelete.forEach(opt => {
      queryGraph.optionals.splice(queryGraph.optionals.indexOf(opt), 1)
    })
    

    return queryGraph
  } 

  throw Error('Out of the stub!!!')

  return queryGraph
}