import type { Badge } from '../types'

export const BADGES: Badge[] = [
  {
    id: 'explorer',
    names: {
      zh: '红色文脉探索者',
      en: 'Red Heritage Explorer',
      fr: 'Explorateur du patrimoine rouge',
      es: 'Explorador del patrimonio rojo',
    },
    kind: 'place',
    detail: {
      zh: '访问 3 处红色场馆并走完至少一条推荐路线。',
      en: 'Visit 3 heritage sites and complete a recommended route.',
      fr: 'Visiter 3 sites et suivre un parcours recommandé.',
      es: 'Visita 3 sitios y completa una ruta recomendada.',
    },
    accent: 'clay',
  },
  {
    id: 'storyteller',
    names: {
      zh: '红色故事讲述人',
      en: 'Storyteller',
      fr: 'Conteur',
      es: 'Narrador',
    },
    kind: 'share',
    detail: {
      zh: '发布被 50 人点赞的优质体验分享。',
      en: 'Publish a quality story that earns 50 likes.',
      fr: 'Publier un récit apprécié par 50 personnes.',
      es: 'Publica una historia que reciba 50 me gusta.',
    },
    accent: 'gold',
    locked: true,
    progress: 68,
  },
  {
    id: 'language-bridge',
    names: {
      zh: '语桥',
      en: 'Language Bridge',
      fr: 'Pont de langues',
      es: 'Puente de idiomas',
    },
    kind: 'language',
    detail: {
      zh: '在社区用非母语提出或解答一个问题。',
      en: 'Ask or answer a community question in a language beyond your own.',
      fr: 'Poser ou répondre dans une langue étrangère.',
      es: 'Pregunta o responde en otro idioma.',
    },
    accent: 'ink',
  },
  {
    id: 'culture-discoverer',
    names: {
      zh: '文脉发现者',
      en: 'Culture Discoverer',
      fr: 'Découvreur culturel',
      es: 'Descubridor cultural',
    },
    kind: 'place',
    detail: {
      zh: '解锁任意场馆的“你可能不知道”文化注释。',
      en: 'Unlock a “you may not know” cultural note at any site.',
      fr: 'Débloquer une note culturelle sur un site.',
      es: 'Desbloquea una nota cultural en cualquier sitio.',
    },
    accent: 'green',
    locked: true,
    progress: 40,
  },
  {
    id: 'global-guide',
    names: {
      zh: '金牌译者',
      en: 'Global Guide',
      fr: 'Guide global',
      es: 'Guía global',
    },
    kind: 'volunteer',
    detail: {
      zh: '加入多语志愿者队伍，解答外国游客 10 个问题。',
      en: 'Join our multilingual volunteer team and answer 10 visitor questions.',
      fr: 'Rejoindre les volontaires et répondre à 10 questions.',
      es: 'Únete al equipo voluntario y responde 10 preguntas.',
    },
    accent: 'clay',
    locked: true,
    progress: 25,
  },
]
