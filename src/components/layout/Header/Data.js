export const MENU_ITEMS = [
  {
    label: "С днем рождения",
    href: "/birthday",
    items: [
      {
        name: "В прозе",
        href: "/birthday/in-prose",
        subcategories: [
          { name: "Короткие", href: "/birthday/in-prose/short" },
          { name: "Средние", href: "/birthday/in-prose/medium" },
          { name: "Длинные", href: "/birthday/in-prose/long" },
        ],
      },
      {
        name: "По именам",
        href: "/birthday/by-names",
        subcategories: [
          { name: "Мужские имена", href: "/birthday/by-names/male" },
          { name: "Женские имена", href: "/birthday/by-names/female" },
          { name: "Нейтральные", href: "/birthday/by-names/neutral" },
        ],
      },
      {
        name: "С юбилеем",
        href: "/birthday/jubilee",
        subcategories: [
          { name: "18 лет", href: "/birthday/jubilee/18" },
          { name: "30 лет", href: "/birthday/jubilee/30" },
          { name: "50 лет", href: "/birthday/jubilee/50" },
        ],
      },
      {
        name: "Прикольные",
        href: "/birthday/funny",
        subcategories: [
          { name: "Смешные", href: "/birthday/funny/humorous" },
          { name: "Веселые", href: "/birthday/funny/cheerful" },
          { name: "Забавные", href: "/birthday/funny/amusing" },
        ],
      },
      {
        name: "Короткие",
        href: "/birthday/short",
        subcategories: [
          { name: "На 1 строку", href: "/birthday/short/1line" },
          { name: "На 2 строки", href: "/birthday/short/2lines" },
          { name: "На 3 строки", href: "/birthday/short/3lines" },
        ],
      },
      {
        name: "Коллеге",
        href: "/birthday/colleague",
        subcategories: [
          { name: "Начальнику", href: "/birthday/colleague/boss" },
          { name: "Коллеге", href: "/birthday/colleague/colleague" },
          { name: "Подчиненному", href: "/birthday/colleague/subordinate" },
        ],
      },
    ],
  },
  {
    label: "Знаки внимания",
    href: "/attention",
    items: [
      {
        name: "В стихах",
        href: "/attention/poems",
        subcategories: [
          { name: "Классические", href: "/attention/poems/classic" },
          { name: "Современные", href: "/attention/poems/modern" },
          { name: "Рифмованные", href: "/attention/poems/rhymed" },
        ],
      },
      {
        name: "Музыкальные",
        href: "/attention/musical",
        subcategories: [
          { name: "Поп", href: "/attention/musical/pop" },
          { name: "Рок", href: "/attention/musical/rock" },
          { name: "Классика", href: "/attention/musical/classic" },
        ],
      },
      {
        name: "Официальные",
        href: "/attention/official",
        subcategories: [
          { name: "Формальные", href: "/attention/official/formal" },
          { name: "Деловые", href: "/attention/official/business" },
          { name: "Серьезные", href: "/attention/official/serious" },
        ],
      },
      {
        name: "Длинные",
        href: "/attention/long",
        subcategories: [
          { name: "Очень длинные", href: "/attention/long/very-long" },
          { name: "Средние", href: "/attention/long/medium" },
          { name: "Краткие", href: "/attention/long/short" },
        ],
      },
      {
        name: "Начальнику",
        href: "/attention/boss",
        subcategories: [
          { name: "Директору", href: "/attention/boss/director" },
          {
            name: "Начальнику отдела",
            href: "/attention/boss/department-head",
          },
          { name: "Руководителю", href: "/attention/boss/leader" },
        ],
      },
      {
        name: "Учителю",
        href: "/attention/teacher",
        subcategories: [
          {
            name: "Классному руководителю",
            href: "/attention/teacher/class-teacher",
          },
          {
            name: "Учителю предмета",
            href: "/attention/teacher/subject-teacher",
          },
          {
            name: "Директору школы",
            href: "/attention/teacher/school-director",
          },
        ],
      },
    ],
  },
  {
    label: "Важные события",
    href: "/events",
    items: [
      {
        name: "Женщине",
        href: "/events/woman",
        subcategories: [
          { name: "Жене", href: "/events/woman/wife" },
          { name: "Подруге", href: "/events/woman/friend" },
          { name: "Сестре", href: "/events/woman/sister" },
        ],
      },
      {
        name: "Подруге",
        href: "/events/friend",
        subcategories: [
          { name: "Лучшей подруге", href: "/events/friend/best-friend" },
          { name: "Близкой подруге", href: "/events/friend/close-friend" },
          { name: "Новой подруге", href: "/events/friend/new-friend" },
        ],
      },
      {
        name: "Дочери",
        href: "/events/daughter",
        subcategories: [
          { name: "Маленькой дочке", href: "/events/daughter/little" },
          { name: "Взрослой дочке", href: "/events/daughter/adult" },
          { name: "Невестке", href: "/events/daughter/daughter-in-law" },
        ],
      },
      {
        name: "Сестре",
        href: "/events/sister",
        subcategories: [
          { name: "Младшей сестре", href: "/events/sister/younger" },
          { name: "Старшей сестре", href: "/events/sister/older" },
          { name: "Близняшке", href: "/events/sister/twin" },
        ],
      },
      {
        name: "Маме",
        href: "/events/mom",
        subcategories: [
          { name: "Маме в день рождения", href: "/events/mom/birthday" },
          { name: "Маме на 8 марта", href: "/events/mom/march-8" },
          { name: "Маме на юбилей", href: "/events/mom/jubilee" },
        ],
      },
      {
        name: "Девочке",
        href: "/events/girl",
        subcategories: [
          { name: "Дочке", href: "/events/girl/daughter" },
          { name: "Внучке", href: "/events/girl/granddaughter" },
          { name: "Крестнице", href: "/events/girl/godchild" },
        ],
      },
    ],
  },
  {
    label: "Праздники",
    href: "/holidays",
    items: [
      {
        name: "Мужчине",
        href: "/holidays/man",
        subcategories: [
          { name: "Мужу", href: "/holidays/man/husband" },
          { name: "Другу", href: "/holidays/man/friend" },
          { name: "Брату", href: "/holidays/man/brother" },
        ],
      },
      {
        name: "Другу",
        href: "/holidays/friend",
        subcategories: [
          { name: "Лучшему другу", href: "/holidays/friend/best-friend" },
          { name: "Боевому другу", href: "/holidays/friend/close-friend" },
          {
            name: "Деловому партнеру",
            href: "/holidays/friend/business-partner",
          },
        ],
      },
      {
        name: "Сыну",
        href: "/holidays/son",
        subcategories: [
          { name: "Маленькому сыну", href: "/holidays/son/little" },
          { name: "Взрослому сыну", href: "/holidays/son/adult" },
          { name: "Зятю", href: "/holidays/son/son-in-law" },
        ],
      },
      {
        name: "Брату",
        href: "/holidays/brother",
        subcategories: [
          { name: "Младшему брату", href: "/holidays/brother/younger" },
          { name: "Старшему брату", href: "/holidays/brother/older" },
          { name: "Кузену", href: "/holidays/brother/cousin" },
        ],
      },
      {
        name: "Папе",
        href: "/holidays/dad",
        subcategories: [
          { name: "Папе на день рождения", href: "/holidays/dad/birthday" },
          { name: "Папе на 23 февраля", href: "/holidays/dad/february-23" },
          { name: "Папе на юбилей", href: "/holidays/dad/jubilee" },
        ],
      },
      {
        name: "Мальчику",
        href: "/holidays/boy",
        subcategories: [
          { name: "Сыну", href: "/holidays/boy/son" },
          { name: "Внуку", href: "/holidays/boy/grandson" },
          { name: "Крестнику", href: "/holidays/boy/godson" },
        ],
      },
    ],
  },
  {
    label: "Аудио",
    href: "https://datki.net/audio/",
    items: [],
  },
  {
    label: "Открытки на ДР",
    href: "https://datki.net/pozdravleniya-s-dnem-rozhdeniya/kartinki/",
    items: [],
  },
  {
    label: "Поддержка",
    href: "/support",
    items: [
      {
        name: "Частые вопросы",
        href: "https://datki.net/faq/",
      },
      {
        name: "Помощь проекту",
        href: "https://datki.net/pomosh-proektu/",
      },
      {
        name: "Опрос поситетилей",
        href: "https://datki.net/opros/",
      },
    ],
  },
];
