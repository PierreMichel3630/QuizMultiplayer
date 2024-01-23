import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export const GenerateQuestionPage = () => {
  /*const getSpecies = async (url: string) => {
    const test = await fetch(url);
    const res = await test.json();
    const nameEN = res.name;
    const nameFR = res.names.find((el) => el.language.name === "fr");
    const nameES = res.names.find((el) => el.language.name === "es");
    const nameDE = res.names.find((el) => el.language.name === "de");
    const generation = Number(
      res.generation.url.split("/")[res.generation.url.split("/").length - 2]
    );
    return {
      id: res.id,
      fr: nameFR.name,
      es: nameES.name,
      de: nameDE.name,
      en: nameEN,
      generation: generation,
    };
  };

  const getEvolution = async (id: number) => {
    const t = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
    let resultat = [];
    if (t.status !== 404) {
      const evolution = await t.json();
      const specieN0 = await getSpecies(evolution.chain.species.url);
      if (evolution.chain.evolves_to.length > 0) {
        const specieN1 = await getSpecies(
          evolution.chain.evolves_to[0].species.url
        );
        const response = `{"fr-FR" : "${specieN1.fr}", "en-US": "${specieN1.en}", "de-DE": "${specieN1.de}", "es-ES": "${specieN1.es}"}`;

        const questionEvol1 = {
          theme: 1,
          question: `{"fr-FR" : "Quelle est l'évolution de ${specieN0.fr} ?", "en-US": "What is the evolution of ${specieN0.en} ?", "de-DE": "Was ist die Entwicklung von ${specieN0.de}?", "es-ES": "¿Cuál es la evolución de ${specieN0.es}?"}`,
          response: response,
          image: null,
          typeResponse: "POKEMON",
          difficulty: "DIFFICILE",
        };
        resultat = [...resultat, questionEvol1];
        if (evolution.chain.evolves_to[0].evolves_to.length > 0) {
          const specieN2 = await getSpecies(
            evolution.chain.evolves_to[0].evolves_to[0].species.url
          );
          const response2 = `{"fr-FR" : "${specieN2.fr}", "en-US": "${specieN2.en}", "de-DE": "${specieN2.de}", "es-ES": "${specieN2.es}"}`;
          const questionEvol2 = {
            theme: 1,
            question: `{"fr-FR" : "Quelle est l'évolution de ${specieN1.fr} ?", "en-US": "What is the evolution of ${specieN1.en} ?", "de-DE": "Was ist die Entwicklung von ${specieN1.de}?", "es-ES": "¿Cuál es la evolución de ${specieN1.es}?"}`,
            response: response2,
            image: null,
            typeResponse: "POKEMON",
            difficulty: "DIFFICILE",
          };
          resultat = [...resultat, questionEvol2];
        }
      }
    }

    return resultat;
  };

  const getEvolutions = async () => {
    let result: any = [];
    for (let i = 400; i < 550; i++) {
      const question = await getEvolution(i);
      result = [...result, ...question];
    }

    console.log(result);
  };
  const [abilities, setAbilities] = useState<
    Array<{
      id: number;
      es: string;
      en: string;
      fr: string;
      de: string;
    }>
  >([]);
  const [types, setTypes] = useState<
    Array<{ id: number; es: string; en: string; fr: string; de: string }>
  >([]);

  const getTypes = () => {
    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => res.json())
      .then((types: any) => {
        types.results.forEach((type) => {
          fetch(type.url)
            .then((res) => res.json())
            .then((res: any) => {
              const nameEN = res.name;
              const nameFR = res.names.find((el) => el.language.name === "fr");
              const nameES = res.names.find((el) => el.language.name === "es");
              const nameDE = res.names.find((el) => el.language.name === "de");
              if (nameFR && nameES && nameDE) {
                setTypes((prev) => [
                  ...prev,
                  {
                    id: res.id,
                    fr: nameFR.name,
                    es: nameES.name,
                    de: nameDE.name,
                    en: nameEN,
                  },
                ]);
              }
            });
        });
      });
  };

  useEffect(() => {
    getTypes();
  }, []);

  const getMove = async (id: number) => {
    const t = await fetch(`https://pokeapi.co/api/v2/move/${id}`);
    const move = await t.json();
    const idMove = Number(
      move.type.url.split("/")[move.type.url.split("/").length - 2]
    );
    const nameEN = move.names.find((el) => el.language.name === "en");
    const nameFR = move.names.find((el) => el.language.name === "fr");
    const nameES = move.names.find((el) => el.language.name === "es");
    const nameDE = move.names.find((el) => el.language.name === "de");
    const findtype = types.find((t) => t.id === idMove);
    const responseType = `{"fr-FR" : "${findtype!.fr}", "en-US": "${
      findtype!.en
    }", "de-DE": "${findtype!.de}", "es-ES": "${findtype!.es}"}`;
    const questionType = {
      theme: 1,
      question: `{"fr-FR" : "De quel type est l'attaque ${
        nameFR!.name
      } ?", "en-US": "What type is the attack ${
        nameEN!.name
      } ?", "de-DE": "Welcher Typ ist der Angriff ${
        nameDE!.name
      }?", "es-ES": "¿De qué tipo es el ataque ${nameES!.name}?"}`,
      response: responseType,
      image: null,
      typeResponse: "TYPEPOKEMON",
      difficulty: "DIFFICILE",
    };

    return questionType;
  };

  const getAbilities = () => {
    fetch("https://pokeapi.co/api/v2/ability?offset=0&limit=400")
      .then((res) => res.json())
      .then((types: any) => {
        types.results.forEach((type) => {
          fetch(type.url)
            .then((res) => res.json())
            .then((res: any) => {
              const nameEN = res.name;
              const nameFR = res.names.find((el) => el.language.name === "fr");
              const nameES = res.names.find((el) => el.language.name === "es");
              const nameDE = res.names.find((el) => el.language.name === "de");
              if (nameFR && nameES && nameDE) {
                setAbilities((prev) => [
                  ...prev,
                  {
                    id: res.id,
                    fr: nameFR.name,
                    es: nameES.name,
                    de: nameDE.name,
                    en: nameEN,
                  },
                ]);
              }
            });
        });
      });
  };

  const getPokemon = async (id: number) => {
    const t = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await t.json();
    const specie = await getSpecies(pokemon.species.url);
    const questionImage = {
      theme: 1,
      question: `{"fr-FR" : "Qui est ce Pokémon ?", "en-US": "Who's That Pokémon ?", "de-DE": "Wer ist dieses Pokémon ?", "es-ES": "¿Quién es ese Pokémon?"}`,
      response: `{"fr-FR" : "${specie!.fr}", "en-US": "${
        specie!.en
      }", "de-DE": "${specie!.de}", "es-ES": "${specie!.es}"}`,
      image: pokemon.sprites.other["official-artwork"].front_default,
      typeResponse: "POKEMON",
      difficulty: "FACILE",
    };
    const typesPokemon = pokemon.types.map((el) => {
      const id = Number(
        el.type.url.split("/")[el.type.url.split("/").length - 2]
      );
      const findtype = types.find((t) => t.id === id);
      return findtype;
    });
    const responseType = `{"fr-FR" : ${
      typesPokemon.length > 1
        ? `["${typesPokemon[0].fr} / ${typesPokemon[1].fr}", "${typesPokemon[1].fr} / ${typesPokemon[0].fr}"]`
        : `"${typesPokemon[0].fr}"`
    }, "en-US": ${
      typesPokemon.length > 1
        ? `["${typesPokemon[0].en} / ${typesPokemon[1].en}", "${typesPokemon[1].en} / ${typesPokemon[0].en}"]`
        : `"${typesPokemon[0].en}"`
    }, "de-DE": ${
      typesPokemon.length > 1
        ? `["${typesPokemon[0].de} / ${typesPokemon[1].de}", "${typesPokemon[1].de} / ${typesPokemon[0].de}"]`
        : `"${typesPokemon[0].de}"`
    }, "es-ES": ${
      typesPokemon.length > 1
        ? `["${typesPokemon[0].es} / ${typesPokemon[1].es}", "${typesPokemon[1].es} / ${typesPokemon[0].es}"]`
        : `"${typesPokemon[0].es}"`
    }}`;
    const questionType = {
      theme: 1,
      question: `{"fr-FR" : "De quel type est ${
        specie!.fr
      } ?", "en-US": "What type is ${
        specie!.en
      } ?", "de-DE": "Welcher Typ ist ${
        specie!.de
      }?", "es-ES": "¿De qué tipo es ${specie!.es}?"}`,
      response: responseType,
      image: null,
      typeResponse: "TYPEPOKEMON",
      difficulty: "DIFFICILE",
    };
    const questionGeneration = {
      theme: 1,
      question: `{"fr-FR" : "De quelle génération est ${
        specie!.fr
      } ?", "en-US": "What generation is ${
        specie!.en
      } ?", "de-DE": "Zu welcher Generation gehört ${
        specie!.de
      } ?", "es-ES": "¿Qué generación es ${specie!.es}?"}`,
      response: `{"fr-FR" : "${specie!.generation}", "en-US": "${
        specie!.generation
      }", "de-DE": "${specie!.generation}", "es-ES": "${specie!.generation}"}`,
      image: null,
      typeResponse: "GENERATIONPOKEMON",
      difficulty: "FACILE",
    };
    const idabilities = pokemon.abilities.map((a) =>
      Number(a.ability.url.split("/")[a.ability.url.split("/").length - 2])
    );
    const abilitiesPokemon = abilities.filter((t) =>
      idabilities.includes(t.id)
    );
    const questionAbility = {
      theme: 1,
      question: `{"fr-FR" : "Citez un des talents de ${
        specie!.fr
      }", "en-US": "Name one of the abilities of ${
        specie!.en
      }", "de-DE": "Nennen Sie eine der Fähigkeiten von ${
        specie!.de
      }", "es-ES": "Nombra una de las habilidades de ${specie!.es}"}`,
      response: `{"fr-FR" : [${abilitiesPokemon
        .map((el) => `"${el.fr}"`)
        .join(",")}], "en-US": [${abilitiesPokemon
        .map((el) => `"${el.en}"`)
        .join(",")}], "de-DE": [${abilitiesPokemon
        .map((el) => `"${el.de}"`)
        .join(",")}], "es-ES": [${abilitiesPokemon
        .map((el) => `"${el.es}"`)
        .join(",")}]}`,
      image: null,
      typeResponse: "ABILITYPOKEMON",
      difficulty: "IMPOSSIBLE",
    };
    return [questionImage, questionType, questionGeneration, questionAbility];
  };*/

  const getQuestionCountries = async () => {
    const t = await fetch(`https://restcountries.com/v3.1/all`);
    const countries = await t.json();
    const countriesIndependant = countries.filter((el) => el.independent);
    let questions = [];

    countriesIndependant.forEach((country) => {
      const question = {
        theme: 5,
        question: `{"fr-FR" : "À quel pays appartient le drapeau ?", "en-US": "Which country does the flag belong to ?", "de-DE": "Zu welchem Land gehört die Flagge ?", "es-ES": "¿A qué país pertenece la bandera?"}`,
        response: `{"fr-FR" : "${country.translations.fra.common}", "en-US": "${country.name.common}", "de-DE": "${country.translations.deu.common}", "es-ES": "${country.translations.spa.common}"}`,
        image: country.flags.svg,
        typeResponse: "COUNTRY",
        difficulty: "MOYEN",
      };

      questions = [...questions, question];
    });
    console.log(questions);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h1">GenerateQuestionPage</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => getQuestionCountries()}
        >
          Generate
        </Button>
      </Grid>
    </Grid>
  );
};
