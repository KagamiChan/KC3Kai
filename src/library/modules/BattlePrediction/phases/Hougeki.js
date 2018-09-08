(function () {
  const Hougeki = {};
  const { pipe, map, Side } = KC3BattlePrediction;

  /*--------------------------------------------------------*/
  /* --------------------[ PUBLIC API ]-------------------- */
  /*--------------------------------------------------------*/

  Hougeki.parseHougeki = (battleData) => {
    const { createAttack } = KC3BattlePrediction.battle;
    const { extractFromJson } = KC3BattlePrediction.battle.phases;
    const { parseJson } = KC3BattlePrediction.battle.phases.hougeki;
    const HOUGEKI_PROPS = battleData.api_at_type ? ['api_at_eflag', 'api_at_list', 'api_df_list', 'api_damage', 'api_cl_list', 'api_si_list', 'api_at_type']
      : battleData.api_sp_list ? ['api_at_eflag', 'api_at_list', 'api_df_list', 'api_damage', 'api_cl_list', 'api_si_list', 'api_sp_list']
      : ['api_at_eflag', 'api_at_list', 'api_df_list', 'api_damage'];
    return pipe(
      extractFromJson(HOUGEKI_PROPS),
      map(parseJson),
      map(createAttack)
    )(battleData);
  };

  /*--------------------------------------------------------*/
  /* --------------------[ INTERNALS ]--------------------- */
  /*--------------------------------------------------------*/

  Hougeki.parseJson = (attackJson) => {
    const { parseDamage, parseAttacker, parseDefender, parseInfo } = KC3BattlePrediction.battle.phases.hougeki;

    return {
      damage: parseDamage(attackJson),
      attacker: parseAttacker(attackJson),
      defender: parseDefender(attackJson),
      info: parseInfo(attackJson),
    };
  };

  Hougeki.parseDamage = ({ api_damage }) =>
    api_damage.reduce((result, n) => result + Math.max(0, n), 0);

  Hougeki.parseAttacker = ({ api_at_eflag, api_at_list }) => ({
    side: api_at_eflag === 1 ? Side.ENEMY : Side.PLAYER,
    position: api_at_list,
  });

  Hougeki.parseDefender = ({ api_at_eflag, api_df_list }) => ({
    side: api_at_eflag === 1 ? Side.PLAYER : Side.ENEMY,
    position: api_df_list[0],
  });

  Hougeki.parseInfo = ({ api_damage, api_cl_list, api_si_list, api_at_type, api_sp_list }) => ({
    damage: api_damage,
    acc: api_cl_list,
    equip: api_si_list,
    cutin: api_at_type,
    ncutin: api_sp_list,
  });

  /*--------------------------------------------------------*/
  /* ---------------------[ EXPORTS ]---------------------- */
  /*--------------------------------------------------------*/

  Object.assign(KC3BattlePrediction.battle.phases.hougeki, Hougeki);
}());