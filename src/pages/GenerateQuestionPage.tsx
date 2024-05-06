import { Button, Grid, Typography } from "@mui/material";

export const GenerateQuestionPage = () => {
  /*
  
  const getSpecies = async (url: string) => {
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
  const [responses, setResponses] = useState<
    Array<{ type: string; value: string }>
  >([]);

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
                const response = {
                  type: "ABILITYPOKEMON",
                  value: `{"fr-FR" :  "${nameFR.name}", "en-US": "${nameEN}", "de-DE": "${nameDE.name}", "es-ES": "${nameES.name}"}`,
                  usvalue: nameEN,
                };
                setResponses((prev) => [...prev, response]);
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
  };
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
const getQuestionCountries = async () => {
  const t = await fetch(`https://restcountries.com/v3.1/all`);
  const countries = await t.json();
  const countriesIndependant = countries.filter((el) => el.independent);
  let questions = [];

  countriesIndependant.forEach((country) => {
    const question = {
      theme: 11,
      question: `{"fr-FR" : "Quelle pays à ${} pour capitale ?", "en-US": "Which country has ${} as its capital? ?", "de-DE": "Welches Land hat ${} als Hauptstadt?", "es-ES": "¿Qué país tiene ${} como capital?"}`,
      response: `{"fr-FR" : "${country.translations.fra.common}", "en-US": "${country.name.common}", "de-DE": "${country.translations.deu.common}", "es-ES": "${country.translations.spa.common}"}`,
      image: country.flags.svg,
      typeResponse: "COUNTRY",
      difficulty: "MOYEN",
    };

    questions = [...questions, question];
  });
  console.log(questions);
};
*/

  /*const getMovies = async () => {
    const t = await fetch(
      `https://api.themoviedb.org/3/discover/movie?language=fr&page=1&sort_by=popularity.desc&vote_count.gte=5500`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjZjYTY3NDEyY2U3MzA4MGE4YWM1YzhjMDQwOTZiNSIsInN1YiI6IjY0YmJkY2M0ZWI3OWMyMDExYzI0ZTEwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0geOpDej0t0qVeEp5qvXPv-UW9ao9Cmfkv2aQYyF_UA",
        },
      }
    );

    const movies = [];
    const page1 = await t.json();
    //page1.total_pages
    for (let p = 36; p <= 40; p++) {
      const pageResult = await fetch(
        `https://api.themoviedb.org/3/discover/movie?language=fr&page=${p}&sort_by=popularity.desc&vote_count.gte=5500`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjZjYTY3NDEyY2U3MzA4MGE4YWM1YzhjMDQwOTZiNSIsInN1YiI6IjY0YmJkY2M0ZWI3OWMyMDExYzI0ZTEwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0geOpDej0t0qVeEp5qvXPv-UW9ao9Cmfkv2aQYyF_UA",
          },
        }
      );
      const jsonResult = await pageResult.json();
      movies.push(...jsonResult.results);
    }

    const questions = movies.map(async (movie) => {
      const tradMovie = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/translations`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjZjYTY3NDEyY2U3MzA4MGE4YWM1YzhjMDQwOTZiNSIsInN1YiI6IjY0YmJkY2M0ZWI3OWMyMDExYzI0ZTEwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0geOpDej0t0qVeEp5qvXPv-UW9ao9Cmfkv2aQYyF_UA",
          },
        }
      );
      const traductions = await tradMovie.json();
      const tradEn = traductions.translations.find(
        (el) => el.iso_639_1 === "en"
      );
      const tradfr = traductions.translations.find(
        (el) => el.iso_639_1 === "fr"
      );
      const tradDe = traductions.translations.find(
        (el) => el.iso_639_1 === "de"
      );
      const tradEs = traductions.translations.find(
        (el) => el.iso_639_1 === "es"
      );
      const difficulty =
        movie.vote_count > 20000
          ? "FACILE"
          : movie.vote_count > 10000
          ? "MOYEN"
          : "DIFFICILE";
      const question = {
        theme: 12,
        question: `{"fr-FR" : "Quel est ce film ?", "en-US": "Which film is that ?", "de-DE": "Welcher Film ist das?", "es-ES": "¿Qué película es esa?"}`,
        response: `{"fr-FR" : "${
          tradfr.data.title !== "" ? tradfr.data.title : movie.original_title
        }", "en-US": "${
          tradEn.data.title !== "" ? tradEn.data.title : movie.original_title
        }", "de-DE": "${
          tradDe.data.title !== "" ? tradDe.data.title : movie.original_title
        }", "es-ES": "${
          tradEs.data.title !== "" ? tradEs.data.title : movie.original_title
        }"}`,
        image: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        typeResponse: "MOVIE",
        difficulty: difficulty,
      };
      return question;
    });
    Promise.all(questions).then((res) => {
      console.log(res);
    });
  };*/
  /*
  const getSeries = async () => {
    const t = await fetch(
      `https://api.themoviedb.org/3/discover/tv?language=fr&page=1&sort_by=popularity.desc&without_genres=10762,10767,10763&vote_count.gte=2000`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjZjYTY3NDEyY2U3MzA4MGE4YWM1YzhjMDQwOTZiNSIsInN1YiI6IjY0YmJkY2M0ZWI3OWMyMDExYzI0ZTEwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0geOpDej0t0qVeEp5qvXPv-UW9ao9Cmfkv2aQYyF_UA",
        },
      }
    );

    const series = [];
    const page1 = await t.json();
    //page1.total_pages
    for (let p = 6; p <= 9; p++) {
      const pageResult = await fetch(
        `https://api.themoviedb.org/3/discover/tv?language=fr&page=${p}&sort_by=popularity.desc&without_genres=10762,10767,10763&vote_count.gte=2000`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjZjYTY3NDEyY2U3MzA4MGE4YWM1YzhjMDQwOTZiNSIsInN1YiI6IjY0YmJkY2M0ZWI3OWMyMDExYzI0ZTEwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0geOpDej0t0qVeEp5qvXPv-UW9ao9Cmfkv2aQYyF_UA",
          },
        }
      );
      const jsonResult = await pageResult.json();
      series.push(...jsonResult.results);
    }

    const questions = series.map(async (serie) => {
      const tradMovie = await fetch(
        `https://api.themoviedb.org/3/tv/${serie.id}/translations`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjZjYTY3NDEyY2U3MzA4MGE4YWM1YzhjMDQwOTZiNSIsInN1YiI6IjY0YmJkY2M0ZWI3OWMyMDExYzI0ZTEwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0geOpDej0t0qVeEp5qvXPv-UW9ao9Cmfkv2aQYyF_UA",
          },
        }
      );
      const traductions = await tradMovie.json();
      const tradEn = traductions.translations.find(
        (el) => el.iso_639_1 === "en"
      );
      const tradfr = traductions.translations.find(
        (el) => el.iso_639_1 === "fr"
      );
      const tradDe = traductions.translations.find(
        (el) => el.iso_639_1 === "de"
      );
      const tradEs = traductions.translations.find(
        (el) => el.iso_639_1 === "es"
      );
      const difficulty =
        serie.vote_count > 4000
          ? "FACILE"
          : serie.vote_count > 3000
          ? "MOYEN"
          : serie.vote_count > 2500
          ? "DIFFICILE"
          : "IMPOSSIBLE";
      const question = {
        theme: 13,
        question: `{"fr-FR" : "Quelle est cette série ?", "en-US": "Which TV show is that ?", "de-DE": "Welcher Fernsehsendung ist das?", "es-ES": "¿Qué programa de televisión es esa?"}`,
        response: `{"fr-FR" : "${
          tradfr && tradfr.data.name !== ""
            ? tradfr.data.name
            : serie.original_name
        }", "en-US": "${
          tradEn && tradEn.data.name !== ""
            ? tradEn.data.name
            : serie.original_name
        }", "de-DE": "${
          tradDe && tradDe.data.name !== ""
            ? tradDe.data.name
            : serie.original_name
        }", "es-ES": "${
          tradEs && tradEs.data.name !== ""
            ? tradEs.data.name
            : serie.original_name
        }"}`,
        image: `https://image.tmdb.org/t/p/w780${serie.backdrop_path}`,
        typeResponse: "SERIE",
        difficulty: difficulty,
      };
      return question;
    });
    Promise.all(questions).then((res) => {
      console.log(res);
    });
  };

  */
  /*
  const getAnime = async () => {
    const ids = [
      1429, 37854, 95479, 209867, 85937, 65930, 31910, 207784, 120089, 88803,
      220542, 46260, 46298, 73223, 13916, 12971, 30984, 35935, 37863, 114410,
      60572, 45790, 63926, 61459, 30981, 30991, 60863, 890, 72517, 70881, 1095,
      105009, 57041, 31724, 94664, 207250, 65942, 62104, 46261, 67075, 42509,
      205050, 45782,
    ];

    const questions = ids.map(async (id) => {
      const serieInfo = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjZjYTY3NDEyY2U3MzA4MGE4YWM1YzhjMDQwOTZiNSIsInN1YiI6IjY0YmJkY2M0ZWI3OWMyMDExYzI0ZTEwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0geOpDej0t0qVeEp5qvXPv-UW9ao9Cmfkv2aQYyF_UA",
        },
      });
      const tradSerie = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/translations`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjZjYTY3NDEyY2U3MzA4MGE4YWM1YzhjMDQwOTZiNSIsInN1YiI6IjY0YmJkY2M0ZWI3OWMyMDExYzI0ZTEwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0geOpDej0t0qVeEp5qvXPv-UW9ao9Cmfkv2aQYyF_UA",
          },
        }
      );

      const serie = await serieInfo.json();
      const traductions = await tradSerie.json();
      const tradEn = traductions.translations.find(
        (el) => el.iso_639_1 === "en"
      );
      const tradfr = traductions.translations.find(
        (el) => el.iso_639_1 === "fr"
      );
      const tradDe = traductions.translations.find(
        (el) => el.iso_639_1 === "de"
      );
      const tradEs = traductions.translations.find(
        (el) => el.iso_639_1 === "es"
      );
      const difficulty =
        serie.vote_count > 5000
          ? "FACILE"
          : serie.vote_count > 1500
          ? "MOYEN"
          : serie.vote_count > 500
          ? "DIFFICILE"
          : "IMPOSSIBLE";
      const question = {
        theme: 15,
        question: `{"fr-FR" : "Quelle est cette animé ?", "en-US": "Which anime is that ?", "de-DE": "Welcher Anime ist das?", "es-ES": "¿Qué anime es ese?"}`,
        response: `{"fr-FR" : "${
          tradfr && tradfr.data.name !== ""
            ? tradfr.data.name
            : serie.original_name
        }", "en-US": "${
          tradEn && tradEn.data.name !== ""
            ? tradEn.data.name
            : serie.original_name
        }", "de-DE": "${
          tradDe && tradDe.data.name !== ""
            ? tradDe.data.name
            : serie.original_name
        }", "es-ES": "${
          tradEs && tradEs.data.name !== ""
            ? tradEs.data.name
            : serie.original_name
        }"}`,
        image: `https://image.tmdb.org/t/p/w780${serie.backdrop_path}`,
        typeResponse: "ANIME",
        difficulty: difficulty,
      };
      return question;
    });
    Promise.all(questions).then((res) => {
      console.log(res);
    });
  };*/

  const getActors = async () => {
    const series = [];
    for (let p = 1; p <= 30; p++) {
      const pageResult = await fetch(
        `https://api.themoviedb.org/3/person/popular?language=fr&page=${p}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjZjYTY3NDEyY2U3MzA4MGE4YWM1YzhjMDQwOTZiNSIsInN1YiI6IjY0YmJkY2M0ZWI3OWMyMDExYzI0ZTEwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0geOpDej0t0qVeEp5qvXPv-UW9ao9Cmfkv2aQYyF_UA",
          },
        }
      );
      const jsonResult = await pageResult.json();
      series.push(...jsonResult.results);
    }

    const questions = series
      .filter((el) => el.popularity >= 35)
      .map(async (serie) => {
        const difficulty =
          serie.popularity > 150
            ? "FACILE"
            : serie.vote_count > 100
            ? "MOYEN"
            : serie.vote_count > 50
            ? "DIFFICILE"
            : "IMPOSSIBLE";
        const isMale = serie.gender !== 1 ? true : false;
        const splitName = serie.name.split(" ");
        const splitNameLastName = [...splitName];
        splitNameLastName.splice(0, 1);
        const firstname = splitName[0];
        const lastname = splitNameLastName.join(" ");
        const question = isMale
          ? {
              theme: 42,
              question: `{"fr-FR" : "Qui est cet acteur ?", "en-US": "Who is this actor ?", "de-DE": "Wer ist dieser Schauspieler ?", "es-ES": "¿Quien es este actor?"}`,
              response: `{"fr-FR" : ["${serie.name}", "${firstname}","${lastname}"], "en-US": ["${serie.name}", "${firstname}","${lastname}"], "de-DE": ["${serie.name}", "${firstname}","${lastname}"], "es-ES": ["${serie.name}", "${firstname}","${lastname}"]}`,
              image: `https://image.tmdb.org/t/p/w780${serie.profile_path}`,
              typeResponse: "ACTOR",
              difficulty: difficulty,
            }
          : {
              theme: 42,
              question: `{"fr-FR" : "Qui est cette actrice ?", "en-US": "Who is this actress ?", "de-DE": "Wer ist diese Schauspielerin ?", "es-ES": "¿Quien es esta actriz?"}`,
              response: `{"fr-FR" : ["${serie.name}", "${firstname}","${lastname}"], "en-US": ["${serie.name}", "${firstname}","${lastname}"], "de-DE": ["${serie.name}", "${firstname}","${lastname}"], "es-ES": ["${serie.name}", "${firstname}","${lastname}"]}`,
              image: `https://image.tmdb.org/t/p/w780${serie.profile_path}`,
              typeResponse: "ACTRESS",
              difficulty: difficulty,
            };
        return question;
      });
    Promise.all(questions).then((res) => {
      console.log(res);
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h1">GenerateQuestionPage</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" fullWidth onClick={() => getActors()}>
          Generate
        </Button>
      </Grid>
    </Grid>
  );
};
