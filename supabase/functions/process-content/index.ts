
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, action, params } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAIApiKey) {
      throw new Error("API key de OpenAI no configurada")
    }

    let prompt = ""
    let systemMessage = ""

    // Configure the prompt based on the action
    if (action === "generateExam") {
      systemMessage = `Eres un profesor experto que crea exámenes de alta calidad basados en contenido educativo.
      Debes generar un examen con ${params.questionCount} preguntas de dificultad ${params.difficulty}.
      Utiliza los siguientes tipos de preguntas: ${params.questionTypes.join(", ")}.
      Para cada pregunta, proporciona también una explicación detallada de la respuesta correcta.`

      prompt = `Analiza el siguiente contenido educativo y genera un examen completo con ${params.questionCount} preguntas.
      Las preguntas deben estar directamente relacionadas con el contenido proporcionado.
      Devuelve el resultado en formato JSON con la siguiente estructura:
      {
        "title": "Título del examen basado en el contenido",
        "questions": [
          {
            "id": 1,
            "type": "multiple", // o "truefalse", "open", "matching" según corresponda
            "text": "Texto de la pregunta",
            "options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"], // para preguntas de opción múltiple
            "correctAnswer": 0, // índice de la respuesta correcta (para opción múltiple) o true/false (para verdadero/falso)
            "explanation": "Explicación detallada de la respuesta correcta"
          },
          // Para preguntas de tipo "matching"
          {
            "id": 2,
            "type": "matching",
            "text": "Relaciona los siguientes conceptos con sus definiciones:",
            "pairs": [
              {"item": "Concepto 1", "match": "Definición 1"},
              {"item": "Concepto 2", "match": "Definición 2"}
            ],
            "explanation": "Explicación de las relaciones correctas"
          }
          // ... más preguntas
        ]
      }
      
      Aquí está el contenido: ${content}`
    } else if (action === "generateQuestion") {
      systemMessage = "Eres un profesor experto que crea preguntas de examen de alta calidad basadas en contenido educativo."
      
      prompt = `Analiza el siguiente contenido educativo y genera una pregunta de examen de alta calidad.
      ${params.specificTopic ? `La pregunta debe estar relacionada con el siguiente tema específico: ${params.specificTopic}` : ""}
      Proporciona la pregunta, las opciones de respuesta (si aplica), la respuesta correcta y una explicación.
      Elige aleatoriamente entre preguntas de opción múltiple, verdadero/falso, respuesta abierta o relacionar columnas.
      Asegúrate que la pregunta sea clara, precisa y directamente relacionada con el contenido proporcionado.
      
      Aquí está el contenido: ${content}`
    } else {
      // Default behavior: generate summary
      systemMessage = "Eres un asistente especializado en procesar contenido educativo y generar resúmenes estructurados."
      prompt = `Analiza el siguiente contenido y genera un resumen estructurado: ${content}`
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    console.log('OpenAI response:', data)

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Respuesta de OpenAI inválida")
    }

    let result = {}

    if (action === "generateExam") {
      try {
        // Parse the JSON response
        const responseText = data.choices[0].message.content
        // Extract JSON object if it's surrounded by markdown code blocks or other text
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                         responseText.match(/```\s*([\s\S]*?)\s*```/) ||
                         responseText.match(/{[\s\S]*?}/)
        
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText
        const examData = JSON.parse(jsonStr.replace(/^[^{]*/, '').replace(/[^}]*$/, ''))
        
        result = { exam: examData }
      } catch (error) {
        console.error("Error parsing exam JSON:", error, data.choices[0].message.content)
        throw new Error("Error al procesar el examen generado")
      }
    } else if (action === "generateQuestion") {
      result = { question: data.choices[0].message.content }
    } else {
      result = { summary: data.choices[0].message.content }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
