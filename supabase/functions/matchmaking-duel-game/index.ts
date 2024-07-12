import { createClient } from "https://esm.sh/@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const body = await req.json();
  const player = body.player;
  const theme = body.theme;

  const bots = [
    "571b2a1c-e2ca-4e95-9d99-80a17b5796a4",
    "006c5385-8e71-41f7-801f-b6ee56f9996c",
    "931b2102-9550-4c8e-a629-fcd858293b18",
    "eed610db-4b85-4e0e-aa11-7497d5159393",
    "9e5543c3-ec9d-4a9c-8f0c-6e634759eb45",
  ];
  const scores = await supabase
    .from("score")
    .select()
    .eq("theme", theme)
    .in("profile", [player, ...bots]);

  const scorePlayer = scores.data.find((el) => el.profile === player);
  const eloPlayer = scorePlayer ? scorePlayer.rank : 1000;

  const matchmakings = await supabase
    .from("matchmaking")
    .select("*, game(*)")
    .eq("theme", theme)
    .neq("player", player)
    .order("created_at");

  let duelgame: any = undefined;
  let matchmaking: any = undefined;
  let opponent: any = undefined;
  if (matchmakings.data.length > 0) {
    let indexPlayer = 0;
    do {
      const diffElo = Math.abs(eloPlayer - matchmakings.data[indexPlayer].elo);
      if (diffElo <= 200) {
        opponent = matchmakings.data[indexPlayer];
        break;
      }
      indexPlayer++;
    } while (indexPlayer < matchmakings.data.length);
    if (opponent) {
      duelgame = opponent.game;
      const channel = supabase.channel(duelgame.uuid);
      let themequestion = body.theme;
      if (theme === 272) {
        const { data } = await supabase
          .from("randomtheme")
          .select("*")
          .is("enabled", true)
          .not("id", "in", `(271,272)`)
          .limit(1)
          .maybeSingle();
        themequestion = data.id;
      }
      const { data } = await supabase
        .from("duelgame")
        .update({
          player2: player,
          status: "START",
          themequestion: themequestion,
        })
        .eq("uuid", duelgame.uuid)
        .select(
          "*,theme!public_duelgame_theme_fkey(*),player1(*,avatar(*),title(*), badge(*)),player2(*,avatar(*),title(*), badge(*))"
        )
        .maybeSingle();
      channel.send({
        type: "broadcast",
        event: "updategame",
        payload: data,
      });
      channel.unsubscribe();
      setTimeout(async () => {
        await supabase.functions.invoke("duel-game", {
          body: { game: duelgame.uuid },
        });
      }, 3000);
    }
  }

  if (!opponent) {
    const game = {
      player1: player,
      player2: null,
      theme: theme,
    };
    const resDuel = await supabase
      .from("duelgame")
      .insert(game)
      .select()
      .maybeSingle();
    duelgame = resDuel.data;

    const resMatchmaking = await supabase
      .from("matchmaking")
      .insert({
        game: duelgame.id,
        player: player,
        theme: theme,
        elo: eloPlayer,
      })
      .select()
      .maybeSingle();
    matchmaking = resMatchmaking.data;
  }

  setTimeout(async () => {
    const { data } = await supabase
      .from("duelgame")
      .select()
      .eq("uuid", duelgame.uuid)
      .maybeSingle();
    if (matchmaking) {
      await supabase.from("matchmaking").delete().eq("id", matchmaking.id);
    }
    if (data.status === "WAIT") {
      const scoresBots = scores.data.filter((el) => el.profile !== player);
      const bot = scoresBots.reduce((prev, curr) =>
        Math.abs(curr.rank - eloPlayer) < Math.abs(prev.rank - eloPlayer)
          ? curr
          : prev
      );
      const channel = supabase.channel(duelgame.uuid);
      let themequestion = body.theme;
      if (theme === 272) {
        const { data } = await supabase
          .from("randomtheme")
          .select("*")
          .is("enabled", true)
          .not("id", "in", `(271,272)`)
          .limit(1)
          .maybeSingle();
        themequestion = data.id;
      }
      const { data } = await supabase
        .from("duelgame")
        .update({
          player2: bot.profile,
          status: "START",
          themequestion: themequestion,
        })
        .eq("uuid", duelgame.uuid)
        .select(
          "*,theme!public_duelgame_theme_fkey(*),player1(*,avatar(*),title(*), badge(*)),player2(*,avatar(*),title(*), badge(*))"
        )
        .maybeSingle();
      channel.send({
        type: "broadcast",
        event: "updategame",
        payload: data,
      });
      channel.unsubscribe();
      setTimeout(async () => {
        await supabase.functions.invoke("duel-game", {
          body: { game: duelgame.uuid },
        });
      }, 3000);
    }
  }, 5000);

  return new Response(JSON.stringify(duelgame), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
