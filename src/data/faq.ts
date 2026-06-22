export interface FaqItem {
  question: string;
  /** Respuesta en texto plano (debe coincidir con lo visible para el schema FAQPage). */
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: '¿Qué servicios ofrece Camilo Ayala?',
    answer:
      'Dirección estratégica de marca, growth y marketing educativo, transformación digital y CRM, experiencia de cliente y UX, adopción de IA y diseño generativo, y conferencias y formación ejecutiva para comités directivos y equipos.',
  },
  {
    question: '¿En qué sectores e instituciones tiene experiencia?',
    answer:
      'Más de 12 años en educación superior, banca central y consultoría internacional, liderando mercadeo, comunicación y experiencia en la Universidad de los Andes, el Banco de la República y la Universidad El Bosque, entre otras organizaciones de referencia.',
  },
  {
    question: '¿Ofrece conferencias y formación ejecutiva?',
    answer:
      'Sí. Dicta keynotes y workshops sobre estrategia, Design Thinking e IA aplicada, y es profesor de posgrado en gerencia comercial, marketing e inteligencia artificial.',
  },
  {
    question: '¿Trabaja con proyectos remotos o fuera de Colombia?',
    answer:
      'Está basado en Bogotá, Colombia, y atiende proyectos en Colombia y Latinoamérica, tanto presenciales como remotos.',
  },
  {
    question: '¿Qué experiencia tiene en inteligencia artificial y transformación digital?',
    answer:
      'Es Magíster en Diseño con investigación publicada sobre diseño generativo e IA, e integra inteligencia artificial, analítica de datos, SEO/SEM y Salesforce en procesos creativos y de negocio con resultados medibles.',
  },
  {
    question: '¿Cómo puedo contactarlo para un proyecto?',
    answer:
      'Escríbele a camiloayalamonje@gmail.com o conéctate por LinkedIn en linkedin.com/in/camiloayalam para conversar tu próximo reto.',
  },
];
