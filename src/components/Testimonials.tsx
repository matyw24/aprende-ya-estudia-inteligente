
const testimonials = [
  {
    quote: "AprendeYa transformó mi forma de estudiar. Ahora comprendo mejor los conceptos y me siento más seguro en los exámenes.",
    author: "Carlos Mendoza",
    role: "Estudiante de Ingeniería"
  },
  {
    quote: "La función de generación de exámenes me ayudó a identificar mis puntos débiles y mejorar en áreas donde antes tenía dificultades.",
    author: "Ana Martínez",
    role: "Estudiante de Medicina"
  },
  {
    quote: "Como profesor, utilizo AprendeYa para crear evaluaciones personalizadas para mis alumnos. ¡Es una herramienta fantástica!",
    author: "Dr. Javier Rodríguez",
    role: "Profesor Universitario"
  }
];

const Testimonials = () => {
  return (
    <section className="w-full py-12 md:py-24 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Lo Que Dicen Nuestros Usuarios
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Descubre cómo AprendeYa está transformando la manera de estudiar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border relative">
              <svg 
                className="text-primary opacity-20 absolute top-6 left-6 h-12 w-12" 
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16.032-.52.112-1.01.24-.496.128-.94.216-1.33.216-.384 0-.762-.095-1.14-.285-.377-.19-.69-.53-.93-1.023-.24-.53-.36-1.19-.36-1.98v-.13c0-1.5.372-2.78 1.115-3.84.743-1.06 1.725-1.98 2.945-2.76 1.23-.78 2.585-1.41 4.064-1.9 1.48-.49 2.97-.73 4.48-.73h.24c.507 0 .953.137 1.338.413.384.276.648.638.786 1.15.16.45.16.855 0 1.25-.16.33-.44.635-.876.91-.476.31-.56.516-.756.967-.224.53-.347 1.107-.367 1.73-.033.633.128 1.26.48 1.88.354.554.832.97 1.438 1.235.605.265 1.28.347 2.02.245.82-.11 1.67-.415 2.552-.915.902-.52 1.68-1.225 2.33-2.12.65-.93 1.17-2.006 1.54-3.23.02-.1.062-.19.122-.27.06-.08.15-.14.27-.18.122-.04.22-.025.308.04.086.065.143.143.17.236.19.82.282 1.605.282 2.355 0 2.745-.985 4.93-2.95 6.56-1.45 1.196-3.175 1.88-5.165 2.05-.4.033-.78.05-1.14.05-1.02 0-2.07-.19-3.15-.574-1.07-.383-2.044-.858-2.92-1.424-.83-.526-1.494-1.21-1.982-2.05-.49-.84-.734-1.706-.734-2.6z"></path>
              </svg>
              <div className="relative z-10">
                <p className="italic mb-4">{testimonial.quote}</p>
                <div className="font-medium">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
